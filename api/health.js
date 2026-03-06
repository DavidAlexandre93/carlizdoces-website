/* global module */
const { allowMethods, withRequestContext } = require('./_lib/http')

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context

  if (!allowMethods(req, res, ['GET'], requestId)) {
    return
  }

  res.status(200).json({
    status: 'ok',
    service: 'carlizdoces-website-api',
    timestamp: new Date().toISOString(),
    requestId,
  })
})
