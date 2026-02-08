import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'carliz-product-ratings'

const normalizeStats = (stats) => {
  const votes = Number(stats?.votes ?? stats?.count ?? 0)
  const total = Number(stats?.total ?? stats?.sum ?? 0)

  return {
    votes: Number.isFinite(votes) ? Math.max(0, Math.floor(votes)) : 0,
    total: Number.isFinite(total) ? Math.max(0, total) : 0,
  }
}

const readStoredRatings = () => {
  if (typeof window === 'undefined') return {}

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
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
  const [remoteRatings, setRemoteRatings] = useState({})
  const [isRemoteEnabled, setIsRemoteEnabled] = useState(false)

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
        votes: Number(product.reviewCount ?? 0),
        total: Number(product.rating ?? 0) * Number(product.reviewCount ?? 0),
      }

      const remote = normalizeStats(remoteRatings[product.id])
      const localUserRating = Number(userRatings[product.id] ?? 0)
      const merged = remote.votes > 0 ? remote : baseline

      acc[product.id] = {
        average: merged.votes > 0 ? merged.total / merged.votes : Number(product.rating ?? 0),
        votes: merged.votes,
        userRating: Number.isFinite(localUserRating) ? localUserRating : 0,
      }

      return acc
    }, {})
  }, [products, remoteRatings, userRatings])

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
  }, [isRemoteEnabled, ratingsApiUrl, userRatings])

  return {
    ratingsByProductId,
    submitRating,
    isGlobalRatingsActive: isRemoteEnabled,
  }
}
