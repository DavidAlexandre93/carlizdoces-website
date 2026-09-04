/* global module */
const { ErrorCode } = require('./_lib/contracts');
const {
  allowMethods,
  getMetricsSnapshot,
  isMetricsAuthorized,
  sendError,
  sendSuccess,
  withRequestContext,
} = require('./_lib/http');

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context;
  if (!allowMethods(req, res, ['GET'], requestId)) return;
  if (!isMetricsAuthorized(req)) {
    sendError(res, 401, {
      code: ErrorCode.UNAUTHORIZED,
      message: 'Acesso não autorizado.',
      requestId,
    });
    return;
  }

  sendSuccess(
    res,
    200,
    { timestamp: new Date().toISOString(), metrics: getMetricsSnapshot() },
    requestId
  );
});
