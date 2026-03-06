/* global module, require */
const { getLikesSummary } = require('../likesStore')
const { allowMethods, applyRateLimit, sendError, withRequestContext } = require('../_lib/http')

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context

  if (!allowMethods(req, res, ['GET'], requestId)) {
    return
  }


  const rateLimitResult = applyRateLimit({
    key: `likes:summary:${context.clientIp}`,
    windowMs: 60 * 1000,
    limit: 120,
  })

  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', Math.ceil((rateLimitResult.retryAfterMs || 0) / 1000))
    sendError(res, 429, {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Muitas requisições para resumo de curtidas. Tente novamente em instantes.',
      requestId,
    })
    return
  }

  const userId = typeof req.query?.userId === 'string' ? req.query.userId : ''
  const summary = getLikesSummary(userId)

  res.status(200).json({ data: summary, requestId })
})
