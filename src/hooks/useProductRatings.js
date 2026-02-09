import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'carliz-product-ratings'
const STORAGE_STATS_KEY = 'carliz-product-ratings-stats'

const normalizeStats = (stats) => {
  const votes = Number(stats?.votes ?? stats?.count ?? 0)
  const total = Number(stats?.total ?? stats?.sum ?? 0)

  return {
    votes: Number.isFinite(votes) ? Math.max(0, Math.floor(votes)) : 0,
    total: Number.isFinite(total) ? Math.max(0, total) : 0,
  }
}

const addStats = (baseStats, extraStats) => ({
  votes: baseStats.votes + extraStats.votes,
  total: baseStats.total + extraStats.total,
})

const readStoredRatings = () => {
  if (typeof window === 'undefined') return {}

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const readStoredRatingStats = () => {
  if (typeof window === 'undefined') return {}

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_STATS_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeStoredRatings = (value) => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Ignora erro de persistência local para não travar o fluxo principal.
  }
}

const writeStoredRatingStats = (value) => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(value))
  } catch {
    // Ignora erro de persistência local para não travar o fluxo principal.
  }
}

async function fetchRemoteRatings(baseUrl) {
  const response = await fetch(baseUrl, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error('Falha ao carregar avaliações globais.')
  }

  const payload = await response.json()
  return payload && typeof payload === 'object' ? payload : {}
}

async function saveRemoteRating(baseUrl, productId, nextValue) {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, rating: nextValue }),
  })

  if (!response.ok) {
    throw new Error('Falha ao salvar avaliação global.')
  }

  const payload = await response.json()
  return payload && typeof payload === 'object' ? payload : null
}

export function useProductRatings(products) {
  const ratingsApiUrl = import.meta.env.VITE_RATINGS_API_URL || '/api/ratings'
  const [userRatings, setUserRatings] = useState(() => readStoredRatings())
  const [localRatingStats, setLocalRatingStats] = useState(() => readStoredRatingStats())
  const [remoteRatings, setRemoteRatings] = useState({})
  const [isRemoteEnabled, setIsRemoteEnabled] = useState(false)

  const baselineStatsByProductId = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.id] = {
        votes: 0,
        total: 0,
      }

      return acc
    }, {})
  }, [products])

  useEffect(() => {
    if (!ratingsApiUrl) {
      setRemoteRatings({})
      setIsRemoteEnabled(false)
      return
    }

    let isMounted = true

    fetchRemoteRatings(ratingsApiUrl)
      .then((payload) => {
        if (!isMounted) return
        setRemoteRatings(payload)
        setIsRemoteEnabled(true)
      })
      .catch(() => {
        if (!isMounted) return
        setRemoteRatings({})
        setIsRemoteEnabled(false)
      })

    return () => {
      isMounted = false
    }
  }, [ratingsApiUrl])

  const ratingsByProductId = useMemo(() => {
    return products.reduce((acc, product) => {
      const baseline = {
        votes: 0,
        total: 0,
      }

      const baselineStats = normalizeStats(baselineStatsByProductId[product.id] ?? baseline)
      const remote = normalizeStats(remoteRatings[product.id])
      const localStats = normalizeStats(localRatingStats[product.id])
      const localUserRating = Number(userRatings[product.id] ?? 0)
      const merged = remote.votes > 0
        ? addStats(baselineStats, remote)
        : (localStats.votes > 0 ? localStats : baselineStats)

      acc[product.id] = {
        average: merged.votes > 0 ? merged.total / merged.votes : 0,
        votes: merged.votes,
        userRating: Number.isFinite(localUserRating) ? localUserRating : 0,
      }

      return acc
    }, {})
  }, [baselineStatsByProductId, localRatingStats, products, remoteRatings, userRatings])

  const submitRating = useCallback(async (productId, nextValue) => {
    const normalizedValue = Number(nextValue)

    if (!Number.isFinite(normalizedValue) || normalizedValue < 1 || normalizedValue > 5) {
      return { ok: false, reason: 'invalid-rating' }
    }

    const previousValue = Number(userRatings[productId] ?? 0)
    if (previousValue === normalizedValue) {
      return { ok: true, unchanged: true, isRemote: isRemoteEnabled }
    }

    const nextLocalRatings = {
      ...userRatings,
      [productId]: normalizedValue,
    }

    setUserRatings(nextLocalRatings)
    writeStoredRatings(nextLocalRatings)

    const baselineStats = normalizeStats(baselineStatsByProductId[productId])
    const currentStats = normalizeStats(localRatingStats[productId] ?? baselineStats)
    const nextStats = {
      votes: previousValue > 0 ? currentStats.votes : currentStats.votes + 1,
      total: currentStats.total + normalizedValue - previousValue,
    }

    const nextLocalStats = {
      ...localRatingStats,
      [productId]: nextStats,
    }

    setLocalRatingStats(nextLocalStats)
    writeStoredRatingStats(nextLocalStats)

    if (!ratingsApiUrl) {
      return { ok: true, isRemote: false }
    }

    try {
      const payload = await saveRemoteRating(ratingsApiUrl, productId, normalizedValue)
      if (payload) {
        setRemoteRatings((current) => ({
          ...current,
          [productId]: payload,
        }))
      }
      return { ok: true, isRemote: true }
    } catch {
      return { ok: true, isRemote: false, fallback: true }
    }
  }, [baselineStatsByProductId, isRemoteEnabled, localRatingStats, ratingsApiUrl, userRatings])

  return {
    ratingsByProductId,
    submitRating,
    isGlobalRatingsActive: isRemoteEnabled,
  }
}
