/* global module */
const globalStore = globalThis.__carlizRatingsStore ?? {
  data: {},
  votesByUser: {},
}

globalThis.__carlizRatingsStore = globalStore

const ensureProductStats = (productId) => {
  if (!globalStore.data[productId]) {
    globalStore.data[productId] = { votes: 0, total: 0 }
  }

  return globalStore.data[productId]
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(globalStore.data)
    return
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { productId, rating } = req.body ?? {}

  if (!productId || typeof productId !== 'string') {
    res.status(400).json({ error: 'productId inválido' })
    return
  }

  const numericRating = Number(rating)
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    res.status(400).json({ error: 'rating deve estar entre 1 e 5' })
    return
  }

  const forwarded = req.headers['x-forwarded-for']
  const requesterIp = Array.isArray(forwarded)
    ? forwarded[0]
    : String(forwarded || req.socket?.remoteAddress || 'anon').split(',')[0].trim()

  const voteKey = `${requesterIp}:${productId}`
  const previousVote = Number(globalStore.votesByUser[voteKey] ?? 0)
  const stats = ensureProductStats(productId)

  if (previousVote > 0) {
    stats.total -= previousVote
  } else {
    stats.votes += 1
  }

  stats.total += numericRating
  globalStore.votesByUser[voteKey] = numericRating

  res.status(200).json({ votes: stats.votes, total: stats.total })
}
