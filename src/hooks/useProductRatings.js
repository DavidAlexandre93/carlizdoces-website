import { useCallback, useEffect, useMemo, useState } from 'react'
import { deviceId, supabase } from '../supabaseClient'

const clampStars = (value) => {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) return 0
  return Math.min(5, Math.max(0, numberValue))
}

const toStats = (summaryRow) => ({
  average: Number(summaryRow?.avg_stars ?? 0),
  votes: Number(summaryRow?.ratings_count ?? 0),
})

export function useProductRatings(products) {
  const [summaryByProductId, setSummaryByProductId] = useState({})
  const [myRatingsByProductId, setMyRatingsByProductId] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  const productIds = useMemo(() => products.map((product) => product.id), [products])

  const loadRatings = useCallback(async () => {
    if (productIds.length === 0) {
      setSummaryByProductId({})
      setMyRatingsByProductId({})
      setIsLoaded(true)
      return
    }

    const { data: summaryRows, error: summaryError } = await supabase
      .from('ratings_summary')
      .select('item_id, avg_stars, ratings_count')
      .in('item_id', productIds)

    if (summaryError) {
      throw new Error(summaryError.message || 'ratings-summary-load-failed')
    }

    const { data: myRows, error: myRowsError } = await supabase
      .from('ratings_anon')
      .select('item_id, stars')
      .eq('device_id', deviceId)
      .in('item_id', productIds)

    if (myRowsError) {
      throw new Error(myRowsError.message || 'ratings-my-load-failed')
    }

    const nextSummaryByProductId = productIds.reduce((acc, productId) => {
      acc[productId] = { average: 0, votes: 0 }
      return acc
    }, {})

    ;(summaryRows || []).forEach((row) => {
      nextSummaryByProductId[row.item_id] = toStats(row)
    })

    const nextMyRatingsByProductId = productIds.reduce((acc, productId) => {
      acc[productId] = 0
      return acc
    }, {})

    ;(myRows || []).forEach((row) => {
      nextMyRatingsByProductId[row.item_id] = clampStars(row.stars)
    })

    setSummaryByProductId(nextSummaryByProductId)
    setMyRatingsByProductId(nextMyRatingsByProductId)
    setIsLoaded(true)
  }, [productIds])

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      setIsLoaded(false)
      try {
        await loadRatings()
      } catch {
        if (!isMounted) return
        setSummaryByProductId({})
        setMyRatingsByProductId({})
        setIsLoaded(true)
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [loadRatings])

  const ratingsByProductId = useMemo(() => {
    return productIds.reduce((acc, productId) => {
      const stats = summaryByProductId[productId] || { average: 0, votes: 0 }
      const userRating = myRatingsByProductId[productId] || 0

      acc[productId] = {
        average: clampStars(stats.average),
        votes: Math.max(0, Number(stats.votes || 0)),
        userRating,
      }

      return acc
    }, {})
  }, [myRatingsByProductId, productIds, summaryByProductId])

  const submitRating = useCallback(async (productId, starsClicked) => {
    const nextStars = clampStars(starsClicked)

    if (nextStars < 1 || nextStars > 5) {
      return { ok: false, reason: 'invalid-rating' }
    }

    const previousStars = clampStars(myRatingsByProductId[productId] || 0)
    const isRemoving = previousStars === nextStars
    const nextMyStars = isRemoving ? 0 : nextStars

    setMyRatingsByProductId((current) => ({
      ...current,
      [productId]: nextMyStars,
    }))

    try {
      if (isRemoving) {
        const { error } = await supabase
          .from('ratings_anon')
          .delete()
          .eq('item_id', productId)
          .eq('device_id', deviceId)

        if (error) {
          throw new Error(error.message || 'rating-remove-failed')
        }
      } else {
        const { error } = await supabase
          .from('ratings_anon')
          .upsert(
            {
              item_id: productId,
              device_id: deviceId,
              stars: nextStars,
            },
            { onConflict: 'item_id,device_id' },
          )

        if (error) {
          throw new Error(error.message || 'rating-save-failed')
        }
      }

      await loadRatings()

      return {
        ok: true,
        removed: isRemoving,
        isRemote: true,
      }
    } catch {
      await loadRatings()
      return { ok: false, reason: 'request-failed' }
    }
  }, [loadRatings, myRatingsByProductId])

  return {
    ratingsByProductId,
    submitRating,
    isGlobalRatingsActive: isLoaded,
  }
}
