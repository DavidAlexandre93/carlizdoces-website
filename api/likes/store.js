/* global module, require */
const { toggleStoreLikeForUser } = require('../likesStore')
const { allowMethods, sendError, withRequestContext } = require('../_lib/http')

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context

  if (!allowMethods(req, res, ['POST'], requestId)) {
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
