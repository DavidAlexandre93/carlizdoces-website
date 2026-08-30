/* global module, process */
const { AiBriefSchema, ErrorCode } = require('../_lib/contracts');
const { createFallbackRecommendation } = require('../_lib/aiRecommendation');
const {
  AppError,
  allowMethods,
  enforceRateLimit,
  sendError,
  sendSuccess,
  validateBody,
  withRequestContext,
} = require('../_lib/http');
const { executeIdempotent, getIdempotencyKey } = require('../_lib/idempotency');
const { logEvent, redactString } = require('../_lib/logger');
const { createOpenAIRecommendation } = require('../_lib/openaiRecommendation');

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context;
  if (!allowMethods(req, res, ['POST'], requestId)) return;
  if (!enforceRateLimit(req, res, context, { scope: 'ai-recommend', limit: 10 })) return;

  const parsed = validateBody(res, requestId, AiBriefSchema, req.body);
  if (!parsed) return;
  const brief = { ...parsed, notes: redactString(parsed.notes) };
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
    scope: 'ai-recommend',
    key: idempotency.key,
    payload: brief,
    operation: async () => {
      const fallback = createFallbackRecommendation(brief);
      if (!process.env.OPENAI_API_KEY) return fallback;
      try {
        return await createOpenAIRecommendation(brief);
      } catch (error) {
        if (error instanceof AppError && error.code === ErrorCode.CONTENT_BLOCKED) throw error;
        logEvent('warn', 'ai.fallback', {
          requestId,
          reason: error?.code || error?.name || 'provider_failure',
        });
        return fallback;
      }
    },
  });

  if (result.state === 'conflict') {
    sendError(res, 409, {
      code: ErrorCode.CONFLICT,
      message: 'Esta chave de repetição já foi usada com outro briefing.',
      requestId,
    });
    return;
  }
  sendSuccess(res, 200, result.value, requestId, { idempotency: result.state });
});
