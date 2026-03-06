/* global module, require */
const { toggleProductLikeForUser } = require('../../likesStore')
const { allowMethods, sendError, withRequestContext } = require('../../_lib/http')

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context

  if (!allowMethods(req, res, ['POST'], requestId)) {
    return
  }

  const productId = req.query?.id
  if (!productId || typeof productId !== 'string') {
    sendError(res, 400, {
      code: 'VALIDATION_ERROR',
      message: 'Campo id inválido.',
      details: [{ field: 'id', reason: 'required_string' }],
      requestId,
    })
    return
  }

  const { userId } = req.body ?? {}
  const result = toggleProductLikeForUser(productId, userId)

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
