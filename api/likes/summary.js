/* global module */
const { ErrorCode } = require('../_lib/contracts');
const {
  allowMethods,
  enforceRateLimit,
  hashClientIdentity,
  sendError,
  sendSuccess,
  withRequestContext,
} = require('../_lib/http');
const { getLikesSummary } = require('../_lib/likesStore');

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context;
  if (!allowMethods(req, res, ['GET'], requestId)) return;
  if (!enforceRateLimit(req, res, context, { scope: 'likes-summary', limit: 120 })) return;

  const userId = typeof req.query?.userId === 'string' ? req.query.userId.trim() : '';
  if (userId && (!/^[A-Za-z0-9:_-]+$/.test(userId) || userId.length < 8 || userId.length > 128)) {
    sendError(res, 400, {
      code: ErrorCode.VALIDATION,
      message: 'O identificador do dispositivo é inválido.',
      details: [{ field: 'userId', reason: 'invalid_format' }],
      requestId,
    });
    return;
  }

  const summary = getLikesSummary(userId ? hashClientIdentity(userId) : '');
  sendSuccess(res, 200, { ...summary, storage: 'memory-best-effort' }, requestId);
});
