/* global module, process */
const OpenAI = require('openai').default;
const { ErrorCode } = require('./contracts');
const { AppError } = require('./http');
const { catalog, normalizeAiRecommendation } = require('./aiRecommendation');
const { withSpan } = require('./observability');

const RECOMMENDATION_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['headline', 'summary', 'estimatedSweets', 'items', 'tips', 'whatsappMessage'],
  properties: {
    headline: { type: 'string', maxLength: 160 },
    summary: { type: 'string', maxLength: 700 },
    estimatedSweets: { type: 'integer', minimum: 1, maximum: 50000 },
    items: {
      type: 'array',
      minItems: 1,
      maxItems: 6,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['productId', 'name', 'quantity', 'reason'],
        properties: {
          productId: { type: 'string' },
          name: { type: 'string' },
          quantity: { type: 'integer', minimum: 1, maximum: 50000 },
          reason: { type: 'string', maxLength: 280 },
        },
      },
    },
    tips: { type: 'array', minItems: 1, maxItems: 5, items: { type: 'string', maxLength: 240 } },
    whatsappMessage: { type: 'string', maxLength: 1400 },
  },
};

function createClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: Math.min(20_000, Math.max(3000, Number(process.env.OPENAI_TIMEOUT_MS) || 12_000)),
    maxRetries: 1,
  });
}

async function createOpenAIRecommendation(brief, options = {}) {
  const client = options.client || createClient();
  const moderationInput = [brief.eventType, brief.budget, ...brief.preferences, brief.notes].join(
    ' '
  );
  const moderation = await withSpan(
    'openai.moderation',
    { 'gen_ai.operation.name': 'moderation' },
    () => client.moderations.create({ model: 'omni-moderation-latest', input: moderationInput })
  );
  if (moderation.results?.[0]?.flagged) {
    throw new AppError({
      code: ErrorCode.CONTENT_BLOCKED,
      message: 'Não foi possível processar esse texto. Revise a observação e tente novamente.',
      statusCode: 422,
    });
  }

  const safeCatalog = catalog.map(({ id, name, tier, tags }) => ({ id, name, tier, tags }));
  const response = await withSpan(
    'openai.responses.create',
    {
      'gen_ai.operation.name': 'responses',
      'gen_ai.request.model': process.env.OPENAI_MODEL || 'gpt-5',
    },
    () =>
      client.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-5',
        store: false,
        prompt_cache_key: 'carliz-concierge-v1',
        instructions:
          'Você é o concierge da Carliz Doces. Responda em português do Brasil, use somente ids do catálogo fornecido, não invente alergênicos nem prometa disponibilidade ou preço. Quantidades são estimativas e restrições devem ser confirmadas com a equipe.',
        input: JSON.stringify({ brief, catalog: safeCatalog }),
        text: {
          format: {
            type: 'json_schema',
            name: 'carliz_sweets_recommendation',
            strict: true,
            schema: RECOMMENDATION_JSON_SCHEMA,
          },
        },
      })
  );

  const parsed = JSON.parse(response.output_text || '{}');
  return normalizeAiRecommendation(brief, parsed);
}

module.exports = {
  RECOMMENDATION_JSON_SCHEMA,
  createOpenAIRecommendation,
};
