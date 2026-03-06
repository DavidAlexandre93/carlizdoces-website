/* global module */
const { allowMethods, sendError, withRequestContext } = require('./_lib/http')

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

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId, clientIp } = context

  if (!allowMethods(req, res, ['GET', 'POST'], requestId)) {
    return
  }

  if (req.method === 'GET') {
    res.status(200).json({ data: globalStore.data, requestId })
    return
  }

  const { productId, rating } = req.body ?? {}

  if (!productId || typeof productId !== 'string') {
    sendError(res, 400, {
      code: 'VALIDATION_ERROR',
      message: 'Campo productId inválido.',
      details: [{ field: 'productId', reason: 'required_string' }],
      requestId,
    })
    return
  }

  const numericRating = Number(rating)
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    sendError(res, 400, {
      code: 'VALIDATION_ERROR',
      message: 'Campo rating deve estar entre 1 e 5.',
      details: [{ field: 'rating', reason: 'range_1_5' }],
      requestId,
    })
    return
  }

  const voteKey = `${clientIp}:${productId}`
  const previousVote = Number(globalStore.votesByUser[voteKey] ?? 0)
  const stats = ensureProductStats(productId)

  if (previousVote > 0) {
    stats.total -= previousVote
  } else {
    stats.votes += 1
  }

  stats.total += numericRating
  globalStore.votesByUser[voteKey] = numericRating

  res.status(200).json({ data: { votes: stats.votes, total: stats.total }, requestId })
})
