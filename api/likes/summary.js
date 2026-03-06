/* global module, require */
const { getLikesSummary } = require('../likesStore')
const { allowMethods, withRequestContext } = require('../_lib/http')

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context

  if (!allowMethods(req, res, ['GET'], requestId)) {
    return
  }

  const userId = typeof req.query?.userId === 'string' ? req.query.userId : ''
  const summary = getLikesSummary(userId)

  res.status(200).json({ data: summary, requestId })
})
