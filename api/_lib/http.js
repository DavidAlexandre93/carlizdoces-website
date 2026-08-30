/* global module, process */
const { createHmac, randomBytes, timingSafeEqual } = require('node:crypto');
const { ErrorCode, createErrorDto, createSuccessDto, validateDto } = require('./contracts');
const { logError, logEvent } = require('./logger');
const { withSpan } = require('./observability');

const DEFAULT_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const RATE_LIMIT_STORE = globalThis.__carlizRateLimitStore ?? new Map();
globalThis.__carlizRateLimitStore = RATE_LIMIT_STORE;

const METRICS_STORE = globalThis.__carlizMetricsStore ?? {
  requestsByRoute: {},
  dependenciesByName: {},
};
globalThis.__carlizMetricsStore = METRICS_STORE;

const CIRCUIT_STORE = globalThis.__carlizCircuitStore ?? {};
globalThis.__carlizCircuitStore = CIRCUIT_STORE;

const PRIVACY_HASH_SALT =
  process.env.PRIVACY_HASH_SALT || globalThis.__carlizPrivacyHashSalt || randomBytes(32).toString('hex');
globalThis.__carlizPrivacyHashSalt = PRIVACY_HASH_SALT;

class AppError extends Error {
  constructor({ code, message, statusCode = 500, details = null, cause }) {
    super(message, cause ? { cause } : undefined);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

const nowMs = () => Number(process.hrtime.bigint() / BigInt(1e6));

function setDefaultHeaders(res) {
  Object.entries(DEFAULT_HEADERS).forEach(([header, value]) => res.setHeader(header, value));
}

function getRequestId(req) {
  const headerValue = req.headers?.['x-request-id'];
  const candidate = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  if (typeof candidate === 'string' && /^[A-Za-z0-9:_-]{8,120}$/.test(candidate.trim())) {
    return candidate.trim();
  }
  return globalThis.crypto?.randomUUID?.() || `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  const candidate = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return String(candidate || req.socket?.remoteAddress || 'anon').split(',')[0].trim();
}

function hashClientIdentity(clientIp) {
  return createHmac('sha256', PRIVACY_HASH_SALT).update(String(clientIp || 'anon')).digest('hex').slice(0, 32);
}

function sendSuccess(res, statusCode, data, requestId, meta) {
  return res.status(statusCode).json(createSuccessDto(requestId, data, meta));
}

function sendError(res, statusCode, payload) {
  const { code, message, details = null, requestId } = payload;
  return res.status(statusCode).json(createErrorDto(requestId, { code, message, details }));
}

function normalizeRoutePath(url = '/unknown') {
  return String(url)
    .split('?')[0]
    .replace(/\/api\/likes\/product\/[^/]+$/i, '/api/likes/product/:id')
    .replace(/\/{2,}/g, '/');
}

function toRouteKey(req) {
  return `${req.method || 'UNKNOWN'} ${normalizeRoutePath(req.url)}`;
}

function percentile(sortedNumbers, targetPercentile) {
  if (sortedNumbers.length === 0) return 0;
  const index = Math.min(sortedNumbers.length - 1, Math.floor(sortedNumbers.length * targetPercentile));
  return sortedNumbers[index];
}

function recordRouteMetric(routeKey, elapsedMs, statusCode) {
  if (!METRICS_STORE.requestsByRoute[routeKey]) {
    METRICS_STORE.requestsByRoute[routeKey] = {
      total: 0,
      errors: 0,
      latencyMsWindow: [],
      lastStatusCode: 0,
      lastSeenAt: null,
    };
  }
  const metric = METRICS_STORE.requestsByRoute[routeKey];
  metric.total += 1;
  if (statusCode >= 500) metric.errors += 1;
  metric.lastStatusCode = statusCode;
  metric.lastSeenAt = new Date().toISOString();
  metric.latencyMsWindow.push(elapsedMs);
  if (metric.latencyMsWindow.length > 500) metric.latencyMsWindow.shift();
}

function recordDependencyMetric(name, elapsedMs, ok) {
  if (!METRICS_STORE.dependenciesByName[name]) {
    METRICS_STORE.dependenciesByName[name] = {
      calls: 0,
      failures: 0,
      lastLatencyMs: 0,
      lastFailureAt: null,
      latencyMsWindow: [],
    };
  }
  const metric = METRICS_STORE.dependenciesByName[name];
  metric.calls += 1;
  metric.lastLatencyMs = elapsedMs;
  metric.latencyMsWindow.push(elapsedMs);
  if (!ok) {
    metric.failures += 1;
    metric.lastFailureAt = new Date().toISOString();
  }
  if (metric.latencyMsWindow.length > 500) metric.latencyMsWindow.shift();
}

function getMetricsSnapshot() {
  const routes = Object.entries(METRICS_STORE.requestsByRoute).reduce((acc, [route, metric]) => {
    const sorted = [...metric.latencyMsWindow].sort((a, b) => a - b);
    acc[route] = {
      total: metric.total,
      errors: metric.errors,
      errorRate: metric.total > 0 ? Number((metric.errors / metric.total).toFixed(4)) : 0,
      p50Ms: percentile(sorted, 0.5),
      p95Ms: percentile(sorted, 0.95),
      p99Ms: percentile(sorted, 0.99),
      lastStatusCode: metric.lastStatusCode,
      lastSeenAt: metric.lastSeenAt,
    };
    return acc;
  }, {});

  const dependencies = Object.entries(METRICS_STORE.dependenciesByName).reduce((acc, [name, metric]) => {
    const sorted = [...metric.latencyMsWindow].sort((a, b) => a - b);
    acc[name] = {
      calls: metric.calls,
      failures: metric.failures,
      errorRate: metric.calls > 0 ? Number((metric.failures / metric.calls).toFixed(4)) : 0,
      p95Ms: percentile(sorted, 0.95),
      lastLatencyMs: metric.lastLatencyMs,
      lastFailureAt: metric.lastFailureAt,
    };
    return acc;
  }, {});

  return { routes, dependencies, sampledWindowSize: 500 };
}

function withRequestContext(handler) {
  return async function withRequestContextHandler(req, res) {
    setDefaultHeaders(res);
    const requestId = getRequestId(req);
    res.setHeader('X-Request-Id', requestId);
    const routeKey = toRouteKey(req);
    const requestStart = nowMs();

    return withSpan(
      'http.server.request',
      {
        'http.request.method': req.method || 'UNKNOWN',
        'http.route': routeKey.split(' ').slice(1).join(' '),
      },
      async (span) => {
        try {
          await handler(req, res, {
            requestId,
            clientFingerprint: hashClientIdentity(getClientIp(req)),
            routeKey,
          });
        } catch (error) {
          const appError = error instanceof AppError ? error : null;
          logError('request.failed', error, { requestId, route: routeKey });
          if (!res.headersSent) {
            sendError(res, appError?.statusCode || 500, {
              code: appError?.code || ErrorCode.INTERNAL,
              message: appError?.message || 'Não foi possível concluir a solicitação. Tente novamente mais tarde.',
              details: appError?.details || null,
              requestId,
            });
          }
        } finally {
          const statusCode = Number(res.statusCode || 500);
          const elapsedMs = Math.max(0, nowMs() - requestStart);
          span.setAttribute('http.response.status_code', statusCode);
          recordRouteMetric(routeKey, elapsedMs, statusCode);
          logEvent(statusCode >= 500 ? 'error' : 'info', 'request.completed', {
            requestId,
            route: routeKey,
            statusCode,
            latencyMs: elapsedMs,
          });
        }
      },
    );
  };
}

function allowMethods(req, res, methods, requestId) {
  if (methods.includes(req.method)) return true;
  res.setHeader('Allow', methods);
  sendError(res, 405, {
    code: ErrorCode.METHOD_NOT_ALLOWED,
    message: 'Método HTTP não permitido para este recurso.',
    requestId,
  });
  return false;
}

function validateBody(res, requestId, schema, body) {
  const result = validateDto(schema, body ?? {});
  if (result.ok) return result.data;
  sendError(res, 400, {
    code: ErrorCode.VALIDATION,
    message: 'Revise os campos informados e tente novamente.',
    details: result.details,
    requestId,
  });
  return null;
}

function applyRateLimit({ key, windowMs, limit }) {
  const now = Date.now();
  const current = RATE_LIMIT_STORE.get(key);
  if (!current || current.expiresAt <= now) {
    RATE_LIMIT_STORE.set(key, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (current.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: current.expiresAt - now };
  }
  current.count += 1;
  return { allowed: true, remaining: Math.max(0, limit - current.count) };
}

function enforceRateLimit(req, res, context, options) {
  const result = applyRateLimit({
    key: `${options.scope}:${context.clientFingerprint}:${req.method}`,
    windowMs: options.windowMs ?? 60_000,
    limit: options.limit,
  });
  res.setHeader('X-RateLimit-Remaining', result.remaining);
  if (result.allowed) return true;
  const retryAfter = Math.max(1, Math.ceil((result.retryAfterMs || 0) / 1000));
  res.setHeader('Retry-After', retryAfter);
  sendError(res, 429, {
    code: ErrorCode.RATE_LIMIT,
    message: 'Muitas solicitações. Aguarde um instante antes de tentar novamente.',
    requestId: context.requestId,
  });
  return false;
}

function jitterDelayMs(baseMs) {
  return Math.round(baseMs * (0.8 + Math.random() * 0.4));
}

const wait = (delayMs) => new Promise((resolve) => setTimeout(resolve, delayMs));

function getCircuitState(name) {
  if (!CIRCUIT_STORE[name]) CIRCUIT_STORE[name] = { consecutiveFailures: 0, openUntil: 0 };
  return CIRCUIT_STORE[name];
}

function isTransientStatus(status) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

async function fetchWithResilience(url, options, resilienceOptions = {}) {
  const {
    requestId = 'unknown-request',
    dependencyName = 'external_api',
    timeoutMs = 8000,
    retries = 2,
    baseDelayMs = 200,
    circuitFailureThreshold = 5,
    circuitOpenMs = 15_000,
  } = resilienceOptions;
  const circuit = getCircuitState(dependencyName);
  if (circuit.openUntil > Date.now()) {
    throw new AppError({
      code: ErrorCode.CIRCUIT_OPEN,
      message: `Circuit open for ${dependencyName}`,
      statusCode: 503,
    });
  }

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const attemptStart = nowMs();
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const response = await withSpan(
        'http.client.request',
        { 'server.address': dependencyName, 'http.request.method': options?.method || 'GET' },
        () => fetch(url, { ...options, signal: abortController.signal }),
      );
      const elapsedMs = Math.max(0, nowMs() - attemptStart);
      recordDependencyMetric(dependencyName, elapsedMs, response.ok);

      if (!response.ok && isTransientStatus(response.status) && attempt < retries) {
        await wait(jitterDelayMs(baseDelayMs * 2 ** attempt));
        continue;
      }

      circuit.consecutiveFailures = response.ok ? 0 : circuit.consecutiveFailures + 1;
      if (circuit.consecutiveFailures >= circuitFailureThreshold) {
        circuit.openUntil = Date.now() + circuitOpenMs;
      }
      return response;
    } catch (error) {
      lastError = error;
      const elapsedMs = Math.max(0, nowMs() - attemptStart);
      recordDependencyMetric(dependencyName, elapsedMs, false);
      circuit.consecutiveFailures += 1;
      logError('dependency.failed', error, { requestId, dependency: dependencyName, attempt, latencyMs: elapsedMs });
      if (circuit.consecutiveFailures >= circuitFailureThreshold) circuit.openUntil = Date.now() + circuitOpenMs;
      if (attempt < retries) {
        await wait(jitterDelayMs(baseDelayMs * 2 ** attempt));
        continue;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
  throw lastError || new Error('Unexpected resilience failure');
}

function constantTimeEquals(left, right) {
  const leftBuffer = Buffer.from(String(left || ''));
  const rightBuffer = Buffer.from(String(right || ''));
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function isMetricsAuthorized(req) {
  if (process.env.NODE_ENV !== 'production') return true;
  const configured = process.env.METRICS_TOKEN;
  if (!configured) return false;
  const candidate = req.headers?.['x-metrics-token'];
  return constantTimeEquals(Array.isArray(candidate) ? candidate[0] : candidate, configured);
}

module.exports = {
  AppError,
  allowMethods,
  applyRateLimit,
  enforceRateLimit,
  fetchWithResilience,
  getClientIp,
  getMetricsSnapshot,
  hashClientIdentity,
  isMetricsAuthorized,
  normalizeRoutePath,
  sendError,
  sendSuccess,
  validateBody,
  withRequestContext,
};
