/* global module */
const { ErrorCode, LikeRequestSchema } = require('../_lib/contracts');
const {
  allowMethods,
  enforceRateLimit,
  hashClientIdentity,
  sendError,
  sendSuccess,
  validateBody,
  withRequestContext,
} = require('../_lib/http');
const { executeIdempotent, getIdempotencyKey } = require('../_lib/idempotency');
const { toggleStoreLikeForUser } = require('../_lib/likesStore');

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context;
  if (!allowMethods(req, res, ['POST'], requestId)) return;
  if (!enforceRateLimit(req, res, context, { scope: 'likes-store', limit: 50 })) return;
  const input = validateBody(res, requestId, LikeRequestSchema, req.body);
  if (!input) return;

  const idempotency = getIdempotencyKey(req);
  if (!idempotency.ok) {
    sendError(res, 400, {
      code: ErrorCode.INVALID_IDEMPOTENCY_KEY,
      message: 'O identificador de repetição da solicitação é inválido.',
      requestId,
    });
    return;
  }

  const safeUserId = hashClientIdentity(input.userId);
  const result = await executeIdempotent({
    scope: 'likes-store',
    key: idempotency.key,
    payload: { userId: safeUserId },
    operation: async () => toggleStoreLikeForUser(safeUserId),
  });
  if (result.state === 'conflict') {
    sendError(res, 409, {
      code: ErrorCode.CONFLICT,
      message: 'Esta chave de repetição já foi usada com outra curtida.',
      requestId,
    });
    return;
  }
  sendSuccess(res, 200, result.value, requestId, { idempotency: result.state, storage: 'memory-best-effort' });
});
