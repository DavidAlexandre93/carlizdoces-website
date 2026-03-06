/* global module */
const { allowMethods, getMetricsSnapshot, withRequestContext } = require('./_lib/http')

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context

  if (!allowMethods(req, res, ['GET'], requestId)) {
    return
  }

  res.status(200).json({
    requestId,
    timestamp: new Date().toISOString(),
    data: getMetricsSnapshot(),
  })
})
