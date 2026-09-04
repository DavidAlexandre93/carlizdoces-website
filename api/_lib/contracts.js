/* global module */
const { z } = require('zod');

const ErrorCode = Object.freeze({
  CIRCUIT_OPEN: 'UPSTREAM_CIRCUIT_OPEN',
  CONFLICT: 'IDEMPOTENCY_CONFLICT',
  CONTENT_BLOCKED: 'CONTENT_BLOCKED',
  INTERNAL: 'INTERNAL_ERROR',
  INVALID_IDEMPOTENCY_KEY: 'INVALID_IDEMPOTENCY_KEY',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  NOT_CONFIGURED: 'SERVICE_NOT_CONFIGURED',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UPSTREAM: 'UPSTREAM_ERROR',
  UPSTREAM_TIMEOUT: 'UPSTREAM_TIMEOUT',
  UPSTREAM_UNAVAILABLE: 'UPSTREAM_UNAVAILABLE',
  VALIDATION: 'VALIDATION_ERROR',
});

const EventType = Object.freeze({
  BIRTHDAY: 'birthday',
  WEDDING: 'wedding',
  CORPORATE: 'corporate',
  BABY_SHOWER: 'baby_shower',
  CELEBRATION: 'celebration',
  OTHER: 'other',
});

const BudgetTier = Object.freeze({
  ECONOMICAL: 'economical',
  BALANCED: 'balanced',
  PREMIUM: 'premium',
});

const Preference = Object.freeze({
  TRADITIONAL: 'traditional',
  PREMIUM: 'premium',
  CHOCOLATE: 'chocolate',
  FRUITY: 'fruity',
  NO_NUTS: 'no_nuts',
  LACTOSE_FREE: 'lactose_free',
});

const ErrorCodeSchema = z.enum(Object.values(ErrorCode));
const ValidationDetailSchema = z
  .object({
    field: z.string().min(1).max(120),
    reason: z.string().min(1).max(120),
  })
  .strict();

const ApiErrorSchema = z
  .object({
    code: ErrorCodeSchema,
    message: z.string().min(1).max(500),
    details: z.array(ValidationDetailSchema).max(30).nullable().optional(),
  })
  .strict();

const ContactRequestSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z
      .union([z.email().max(180), z.literal('')])
      .optional()
      .default(''),
    message: z.string().trim().min(5).max(3000),
  })
  .strict();

const RatingRequestSchema = z
  .object({
    productId: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9-]+$/),
    rating: z.coerce.number().int().min(1).max(5),
  })
  .strict();

const LikeRequestSchema = z
  .object({
    userId: z
      .string()
      .trim()
      .min(8)
      .max(128)
      .regex(/^[a-zA-Z0-9:_-]+$/),
  })
  .strict();

const AiBriefSchema = z
  .object({
    eventType: z.enum(Object.values(EventType)),
    guests: z.coerce.number().int().min(5).max(5000),
    budget: z.enum(Object.values(BudgetTier)).default(BudgetTier.BALANCED),
    preferences: z
      .array(z.enum(Object.values(Preference)))
      .max(6)
      .default([]),
    notes: z.string().trim().max(240).optional().default(''),
  })
  .strict();

const RecommendationItemSchema = z
  .object({
    productId: z.string().min(1).max(120),
    name: z.string().min(1).max(160),
    quantity: z.number().int().min(1).max(50000),
    reason: z.string().min(1).max(280),
  })
  .strict();

const AiRecommendationSchema = z
  .object({
    source: z.enum(['ai', 'fallback']),
    headline: z.string().min(1).max(160),
    summary: z.string().min(1).max(700),
    estimatedSweets: z.number().int().min(1).max(50000),
    items: z.array(RecommendationItemSchema).min(1).max(6),
    tips: z.array(z.string().min(1).max(240)).min(1).max(5),
    whatsappMessage: z.string().min(1).max(1400),
  })
  .strict();

function toValidationDetails(error) {
  return error.issues.slice(0, 30).map((issue) => ({
    field: issue.path.join('.') || 'body',
    reason: issue.code,
  }));
}

function validateDto(schema, input) {
  const result = schema.safeParse(input);
  if (result.success) {
    return { ok: true, data: result.data };
  }

  return { ok: false, details: toValidationDetails(result.error) };
}

function createSuccessDto(requestId, data, meta) {
  const dto = { ok: true, requestId, data };
  if (meta !== undefined) dto.meta = meta;
  return dto;
}

function createErrorDto(requestId, error) {
  const safeError = ApiErrorSchema.parse({
    code: error.code,
    message: error.message,
    details: error.details ?? null,
  });
  return { ok: false, requestId, error: safeError };
}

module.exports = {
  AiBriefSchema,
  AiRecommendationSchema,
  BudgetTier,
  ContactRequestSchema,
  ErrorCode,
  EventType,
  LikeRequestSchema,
  Preference,
  RatingRequestSchema,
  createErrorDto,
  createSuccessDto,
  toValidationDetails,
  validateDto,
};
