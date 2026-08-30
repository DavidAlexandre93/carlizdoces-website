/* global module */
const { ErrorCode, RatingRequestSchema } = require('./_lib/contracts');
const {
  allowMethods,
  enforceRateLimit,
  sendError,
  sendSuccess,
  validateBody,
  withRequestContext,
} = require('./_lib/http');
const { executeIdempotent, getIdempotencyKey } = require('./_lib/idempotency');

const globalStore = globalThis.__carlizRatingsStore ?? { data: {}, votesByUser: {} };
globalThis.__carlizRatingsStore = globalStore;

function ensureProductStats(productId) {
  if (!globalStore.data[productId]) globalStore.data[productId] = { votes: 0, total: 0 };
  return globalStore.data[productId];
}

function upsertRating(productId, rating, clientFingerprint) {
  const voteKey = `${clientFingerprint}:${productId}`;
  const previousVote = Number(globalStore.votesByUser[voteKey] ?? 0);
  const stats = ensureProductStats(productId);
  if (previousVote > 0) stats.total -= previousVote;
  else stats.votes += 1;
  stats.total += rating;
  globalStore.votesByUser[voteKey] = rating;
  return { votes: stats.votes, total: stats.total, average: Number((stats.total / stats.votes).toFixed(2)) };
}

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId, clientFingerprint } = context;
  if (!allowMethods(req, res, ['GET', 'POST'], requestId)) return;
  if (!enforceRateLimit(req, res, context, { scope: 'ratings', limit: req.method === 'GET' ? 120 : 40 })) return;

  if (req.method === 'GET') {
    sendSuccess(res, 200, { ratingsByProductId: globalStore.data, storage: 'memory-best-effort' }, requestId);
    return;
  }

  const input = validateBody(res, requestId, RatingRequestSchema, req.body);
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

  const result = await executeIdempotent({
    scope: 'ratings',
    key: idempotency.key,
    payload: { ...input, clientFingerprint },
    operation: async () => upsertRating(input.productId, input.rating, clientFingerprint),
  });

  if (result.state === 'conflict') {
    sendError(res, 409, {
      code: ErrorCode.CONFLICT,
      message: 'Esta chave de repetição já foi usada com outro voto.',
      requestId,
    });
    return;
  }
  sendSuccess(res, 200, result.value, requestId, {
    idempotency: result.state,
    storage: 'memory-best-effort',
  });
});

module.exports.upsertRating = upsertRating;
