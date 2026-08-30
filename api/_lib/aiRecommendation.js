/* global module */
const catalog = require('../../src/data/aiCatalog.json');
const { AiRecommendationSchema, BudgetTier } = require('./contracts');

const SWEETS_PER_GUEST = Object.freeze({
  birthday: 5,
  wedding: 6,
  corporate: 4,
  baby_shower: 5,
  celebration: 5,
  other: 4,
});

const EVENT_LABEL = Object.freeze({
  birthday: 'aniversário',
  wedding: 'casamento',
  corporate: 'evento corporativo',
  baby_shower: 'chá de bebê',
  celebration: 'celebração',
  other: 'evento',
});

function scoreProduct(product, brief) {
  let score = 0;
  if (product.tier === brief.budget) score += 4;
  if (brief.budget === BudgetTier.BALANCED && product.tier !== BudgetTier.PREMIUM) score += 2;
  for (const preference of brief.preferences) {
    if (product.tags.includes(preference)) score += 3;
  }
  if (brief.preferences.includes('no_nuts') && product.tags.includes('nuts')) score -= 100;
  return score;
}

function selectedCatalog(brief) {
  return [...catalog]
    .map((product, index) => ({ product, index, score: scoreProduct(product, brief) }))
    .filter(({ score }) => score > -100)
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, brief.budget === BudgetTier.PREMIUM ? 4 : 3)
    .map(({ product }) => product);
}

function distributeQuantity(total, products) {
  const base = Math.floor(total / products.length / 5) * 5;
  let remaining = total - base * products.length;
  return products.map((product) => {
    const increment = Math.min(remaining, 5);
    remaining -= increment;
    return { product, quantity: base + increment };
  });
}

function buildWhatsAppMessage(brief, recommendation) {
  const items = recommendation.items.map((item) => `• ${item.quantity} × ${item.name}`).join('\n');
  return [
    'Olá! Usei o Doce Concierge da Carliz Doces e gostaria de confirmar esta sugestão:',
    '',
    `Evento: ${EVENT_LABEL[brief.eventType]}`,
    `Convidados: ${brief.guests}`,
    `Estimativa: ${recommendation.estimatedSweets} doces`,
    '',
    items,
    '',
    'Podem confirmar disponibilidade, valores e possíveis restrições alimentares?',
  ].join('\n');
}

function createFallbackRecommendation(brief) {
  const estimatedSweets = brief.guests * (SWEETS_PER_GUEST[brief.eventType] || 4);
  const products = selectedCatalog(brief);
  const items = distributeQuantity(estimatedSweets, products).map(({ product, quantity }) => ({
    productId: product.id,
    name: product.name,
    quantity,
    reason: product.tags.includes('premium')
      ? 'Acrescenta acabamento especial e variedade à mesa.'
      : 'É um sabor querido que equilibra variedade e familiaridade.',
  }));
  const recommendation = {
    source: 'fallback',
    headline: `Uma seleção doce para seu ${EVENT_LABEL[brief.eventType]}`,
    summary: `Calculamos cerca de ${estimatedSweets} doces para ${brief.guests} convidados, combinando sabores conhecidos com um toque especial da Carliz Doces.`,
    estimatedSweets,
    items,
    tips: [
      'Confirme a quantidade final considerando duração do evento e outras sobremesas.',
      'Restrições alimentares devem ser confirmadas diretamente com a equipe antes do pedido.',
    ],
    whatsappMessage: '',
  };
  recommendation.whatsappMessage = buildWhatsAppMessage(brief, recommendation);
  return AiRecommendationSchema.parse(recommendation);
}

function normalizeAiRecommendation(brief, candidate) {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const normalized = {
    ...candidate,
    source: 'ai',
    items: (candidate.items || [])
      .filter((item) => byId.has(item.productId))
      .map((item) => ({
        ...item,
        name: byId.get(item.productId).name,
        quantity: Math.max(1, Math.round(Number(item.quantity) || 0)),
      })),
  };
  normalized.whatsappMessage = buildWhatsAppMessage(brief, normalized);
  return AiRecommendationSchema.parse(normalized);
}

module.exports = {
  buildWhatsAppMessage,
  catalog,
  createFallbackRecommendation,
  normalizeAiRecommendation,
  scoreProduct,
};
