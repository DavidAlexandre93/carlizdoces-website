export enum ErrorCode {
  CircuitOpen = 'UPSTREAM_CIRCUIT_OPEN',
  Conflict = 'IDEMPOTENCY_CONFLICT',
  ContentBlocked = 'CONTENT_BLOCKED',
  Internal = 'INTERNAL_ERROR',
  InvalidIdempotencyKey = 'INVALID_IDEMPOTENCY_KEY',
  MethodNotAllowed = 'METHOD_NOT_ALLOWED',
  NotConfigured = 'SERVICE_NOT_CONFIGURED',
  NotFound = 'NOT_FOUND',
  RateLimit = 'RATE_LIMIT_EXCEEDED',
  Unauthorized = 'UNAUTHORIZED',
  Upstream = 'UPSTREAM_ERROR',
  UpstreamTimeout = 'UPSTREAM_TIMEOUT',
  UpstreamUnavailable = 'UPSTREAM_UNAVAILABLE',
  Validation = 'VALIDATION_ERROR',
}

export enum EventType {
  Birthday = 'birthday',
  Wedding = 'wedding',
  Corporate = 'corporate',
  BabyShower = 'baby_shower',
  Celebration = 'celebration',
  Other = 'other',
}

export enum BudgetTier {
  Economical = 'economical',
  Balanced = 'balanced',
  Premium = 'premium',
}

export enum Preference {
  Traditional = 'traditional',
  Premium = 'premium',
  Chocolate = 'chocolate',
  Fruity = 'fruity',
  NoNuts = 'no_nuts',
  LactoseFree = 'lactose_free',
}

export interface ValidationDetailDto {
  field: string
  reason: string
}

export interface ApiErrorDto {
  code: ErrorCode
  message: string
  details?: ValidationDetailDto[] | null
}

export interface SuccessEnvelopeDto<TData, TMeta = never> {
  ok: true
  requestId: string
  data: TData
  meta?: TMeta
}

export interface ErrorEnvelopeDto {
  ok: false
  requestId: string
  error: ApiErrorDto
}

export type ApiEnvelopeDto<TData, TMeta = never> =
  | SuccessEnvelopeDto<TData, TMeta>
  | ErrorEnvelopeDto

export interface AiBriefRequestDto {
  eventType: EventType
  guests: number
  budget: BudgetTier
  preferences: Preference[]
  notes?: string
}

export interface RecommendationItemDto {
  productId: string
  name: string
  quantity: number
  reason: string
}

export interface AiRecommendationResponseDto {
  source: 'ai' | 'fallback'
  headline: string
  summary: string
  estimatedSweets: number
  items: RecommendationItemDto[]
  tips: string[]
  whatsappMessage: string
}

export interface HealthResponseDto {
  status: 'ready' | 'degraded'
  service: string
  version: string
  timestamp: string
  uptimeSeconds: number
  dependencies?: Record<string, { configured: boolean }>
  missingRequiredDependencies?: string[]
}
