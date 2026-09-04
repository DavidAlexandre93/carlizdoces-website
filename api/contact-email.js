/* global module, process */
const { ContactRequestSchema, ErrorCode } = require('./_lib/contracts');
const {
  AppError,
  allowMethods,
  enforceRateLimit,
  fetchWithResilience,
  sendError,
  sendSuccess,
  validateBody,
  withRequestContext,
} = require('./_lib/http');
const { executeIdempotent, getIdempotencyKey } = require('./_lib/idempotency');

const RESEND_API_URL = 'https://api.resend.com/emails';
const DEFAULT_TO_EMAIL = 'carlizdoces@gmail.com';
const DEFAULT_FROM_EMAIL = 'Carliz Doces <onboarding@resend.dev>';

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context;
  if (!allowMethods(req, res, ['POST'], requestId)) return;
  if (!enforceRateLimit(req, res, context, { scope: 'contact', limit: 5 })) return;

  const input = validateBody(res, requestId, ContactRequestSchema, req.body);
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
    scope: 'contact-email',
    key: idempotency.key,
    payload: input,
    operation: async () => {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        throw new AppError({
          code: ErrorCode.NOT_CONFIGURED,
          message:
            'O envio direto está temporariamente indisponível. Use o WhatsApp para falar conosco.',
          statusCode: 503,
        });
      }

      const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;
      const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL;
      const text = [
        'Novo contato enviado pelo site da Carliz Doces.',
        '',
        `Nome: ${input.name}`,
        input.email ? `Email: ${input.email}` : 'Email: não informado',
        '',
        'Mensagem:',
        input.message,
      ].join('\n');

      const response = await fetchWithResilience(
        RESEND_API_URL,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from,
            to: [to],
            subject: `Contato pelo site - ${input.name}`,
            text,
            reply_to: input.email || undefined,
          }),
        },
        { requestId, dependencyName: 'resend', timeoutMs: 8000, retries: 2 }
      );

      if (!response.ok) {
        throw new AppError({
          code: ErrorCode.UPSTREAM,
          message:
            'O envio direto está temporariamente indisponível. Use o WhatsApp para falar conosco.',
          statusCode: 502,
        });
      }
      return { accepted: true };
    },
  });

  if (result.state === 'conflict') {
    sendError(res, 409, {
      code: ErrorCode.CONFLICT,
      message: 'Esta chave de repetição já foi usada com outro conteúdo.',
      requestId,
    });
    return;
  }

  sendSuccess(res, 202, result.value, requestId, { idempotency: result.state });
});
