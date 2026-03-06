/* global module, require */
const { toggleStoreLikeForUser } = require('../likesStore')
const { allowMethods, applyRateLimit, sendError, withRequestContext } = require('../_lib/http')

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context

  if (!allowMethods(req, res, ['POST'], requestId)) {
    return
  }


  const rateLimitResult = applyRateLimit({
    key: `likes:store:${context.clientIp}`,
    windowMs: 60 * 1000,
    limit: 50,
  })

  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', Math.ceil((rateLimitResult.retryAfterMs || 0) / 1000))
    sendError(res, 429, {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Muitas tentativas de curtida de loja. Tente novamente em instantes.',
      requestId,
    })
    return
  }

  const { userId } = req.body ?? {}
  const result = toggleStoreLikeForUser(userId)

  if (!result.ok) {
    sendError(res, 400, {
      code: 'VALIDATION_ERROR',
      message: 'Campo userId inválido.',
      details: [{ field: 'userId', reason: 'required_string' }],
      requestId,
    })
    return
  }

  res.status(200).json({ data: result, requestId })
})
