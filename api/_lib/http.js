/* global module */

const DEFAULT_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}

const RATE_LIMIT_STORE = globalThis.__carlizRateLimitStore ?? new Map()
globalThis.__carlizRateLimitStore = RATE_LIMIT_STORE

const METRICS_STORE = globalThis.__carlizMetricsStore ?? {
  requestsByRoute: {},
  dependenciesByName: {},
}
globalThis.__carlizMetricsStore = METRICS_STORE

const CIRCUIT_STORE = globalThis.__carlizCircuitStore ?? {}
globalThis.__carlizCircuitStore = CIRCUIT_STORE

const nowMs = () => Number(process.hrtime.bigint() / BigInt(1e6))

function setDefaultHeaders(res) {
  Object.entries(DEFAULT_HEADERS).forEach(([header, value]) => {
    res.setHeader(header, value)
  })
}

function getRequestId(req) {
  const headerValue = req.headers['x-request-id']

  if (Array.isArray(headerValue) && headerValue.length > 0) {
    return String(headerValue[0]).slice(0, 120)
  }

  if (typeof headerValue === 'string' && headerValue.trim()) {
    return headerValue.trim().slice(0, 120)
  }

  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID()
  }

  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0] || '').split(',')[0].trim()
  }

  return String(forwarded || req.socket?.remoteAddress || 'anon').split(',')[0].trim()
}

function sendError(res, statusCode, payload) {
  const { code, message, details = null, requestId } = payload
  res.status(statusCode).json({ code, message, details, requestId })
}

function toRouteKey(req) {
  const url = typeof req.url === 'string' ? req.url.split('?')[0] : '/unknown'
  return `${req.method || 'UNKNOWN'} ${url}`
}

function percentile(sortedNumbers, targetPercentile) {
  if (sortedNumbers.length === 0) return 0
  const index = Math.min(sortedNumbers.length - 1, Math.floor(sortedNumbers.length * targetPercentile))
  return sortedNumbers[index]
}

function recordRouteMetric(routeKey, elapsedMs, statusCode) {
  if (!METRICS_STORE.requestsByRoute[routeKey]) {
    METRICS_STORE.requestsByRoute[routeKey] = {
      total: 0,
      errors: 0,
      latencyMsWindow: [],
      lastStatusCode: 0,
      lastSeenAt: null,
    }
  }

  const routeMetric = METRICS_STORE.requestsByRoute[routeKey]
  routeMetric.total += 1
  if (statusCode >= 500) {
    routeMetric.errors += 1
  }
  routeMetric.lastStatusCode = statusCode
  routeMetric.lastSeenAt = new Date().toISOString()
  routeMetric.latencyMsWindow.push(elapsedMs)

  if (routeMetric.latencyMsWindow.length > 500) {
    routeMetric.latencyMsWindow.shift()
  }
}

function getMetricsSnapshot() {
  const routes = Object.entries(METRICS_STORE.requestsByRoute).reduce((acc, [route, metric]) => {
    const sorted = [...metric.latencyMsWindow].sort((a, b) => a - b)
    acc[route] = {
      total: metric.total,
      errors: metric.errors,
      errorRate: metric.total > 0 ? Number((metric.errors / metric.total).toFixed(4)) : 0,
      p50Ms: percentile(sorted, 0.5),
      p95Ms: percentile(sorted, 0.95),
      p99Ms: percentile(sorted, 0.99),
      lastStatusCode: metric.lastStatusCode,
      lastSeenAt: metric.lastSeenAt,
    }
    return acc
  }, {})

  return {
    routes,
    dependencies: METRICS_STORE.dependenciesByName,
    sampledWindowSize: 500,
  }
}

function logEvent(payload) {
  try {
    console.log(JSON.stringify(payload))
  } catch {
    console.log(payload)
  }
}

function recordDependencyMetric(name, elapsedMs, ok) {
  if (!METRICS_STORE.dependenciesByName[name]) {
    METRICS_STORE.dependenciesByName[name] = {
      calls: 0,
      failures: 0,
      lastLatencyMs: 0,
      lastFailureAt: null,
      latencyMsWindow: [],
    }
  }

  const metric = METRICS_STORE.dependenciesByName[name]
  metric.calls += 1
  metric.lastLatencyMs = elapsedMs
  metric.latencyMsWindow.push(elapsedMs)

  if (!ok) {
    metric.failures += 1
    metric.lastFailureAt = new Date().toISOString()
  }

  if (metric.latencyMsWindow.length > 500) {
    metric.latencyMsWindow.shift()
  }
}

function withRequestContext(handler) {
  return async function withRequestContextHandler(req, res) {
    setDefaultHeaders(res)
    const requestId = getRequestId(req)
    res.setHeader('X-Request-Id', requestId)

    const requestStart = nowMs()
    const routeKey = toRouteKey(req)

    try {
      await handler(req, res, { requestId, clientIp: getClientIp(req), routeKey })
    } catch (error) {
      sendError(res, 500, {
        code: 'INTERNAL_ERROR',
        message: 'Erro interno ao processar a requisição.',
        details: process.env.NODE_ENV === 'production' ? null : String(error?.message || error),
        requestId,
      })
    } finally {
      const statusCode = Number(res.statusCode || 500)
      const elapsedMs = Math.max(0, nowMs() - requestStart)
      recordRouteMetric(routeKey, elapsedMs, statusCode)
      logEvent({
        level: statusCode >= 500 ? 'error' : 'info',
        type: 'request_completed',
        requestId,
        route: routeKey,
        statusCode,
        latencyMs: elapsedMs,
      })
    }
  }
}

function allowMethods(req, res, methods, requestId) {
  if (methods.includes(req.method)) {
    return true
  }

  res.setHeader('Allow', methods)
  sendError(res, 405, {
    code: 'METHOD_NOT_ALLOWED',
    message: `Método ${req.method} não permitido.`,
    requestId,
  })
  return false
}

function applyRateLimit({ key, windowMs, limit }) {
  const now = Date.now()
  const current = RATE_LIMIT_STORE.get(key)

  if (!current || current.expiresAt <= now) {
    RATE_LIMIT_STORE.set(key, { count: 1, expiresAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: current.expiresAt - now }
  }

  current.count += 1
  RATE_LIMIT_STORE.set(key, current)
  return { allowed: true, remaining: Math.max(0, limit - current.count) }
}

function jitterDelayMs(baseMs) {
  const randomFactor = 0.8 + Math.random() * 0.4
  return Math.round(baseMs * randomFactor)
}

async function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs)
  })
}

function getCircuitState(name) {
  if (!CIRCUIT_STORE[name]) {
    CIRCUIT_STORE[name] = {
      consecutiveFailures: 0,
      openUntil: 0,
    }
  }

  return CIRCUIT_STORE[name]
}

function isTransientStatus(status) {
  return status === 408 || status === 425 || status === 429 || status >= 500
}

async function fetchWithResilience(url, options, resilienceOptions = {}) {
  const {
    requestId = 'unknown-request',
    dependencyName = 'external_api',
    timeoutMs = 8000,
    retries = 2,
    baseDelayMs = 200,
    circuitFailureThreshold = 5,
    circuitOpenMs = 15000,
  } = resilienceOptions

  const circuit = getCircuitState(dependencyName)

  if (circuit.openUntil > Date.now()) {
    const error = new Error(`Circuito aberto para ${dependencyName}`)
    error.code = 'CIRCUIT_OPEN'
    throw error
  }

  let lastError = null

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const attemptStart = nowMs()
    const abortController = new AbortController()
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs)

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortController.signal,
      })

      const elapsedMs = Math.max(0, nowMs() - attemptStart)
      const ok = response.ok
      recordDependencyMetric(dependencyName, elapsedMs, ok)

      if (!ok && isTransientStatus(response.status) && attempt < retries) {
        const delayMs = jitterDelayMs(baseDelayMs * 2 ** attempt)
        await wait(delayMs)
        continue
      }

      if (ok) {
        circuit.consecutiveFailures = 0
      } else {
        circuit.consecutiveFailures += 1
      }

      if (circuit.consecutiveFailures >= circuitFailureThreshold) {
        circuit.openUntil = Date.now() + circuitOpenMs
      }

      return response
    } catch (error) {
      lastError = error
      const elapsedMs = Math.max(0, nowMs() - attemptStart)
      const isAbortError = error?.name === 'AbortError'
      recordDependencyMetric(dependencyName, elapsedMs, false)
      circuit.consecutiveFailures += 1

      logEvent({
        level: 'warn',
        type: 'dependency_error',
        requestId,
        dependencyName,
        attempt,
        elapsedMs,
        message: String(error?.message || error),
      })

      if (circuit.consecutiveFailures >= circuitFailureThreshold) {
        circuit.openUntil = Date.now() + circuitOpenMs
      }

      if (isAbortError || attempt < retries) {
        const delayMs = jitterDelayMs(baseDelayMs * 2 ** attempt)
        await wait(delayMs)
        continue
      }

      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  throw lastError || new Error('Falha inesperada em fetchWithResilience')
}

module.exports = {
  allowMethods,
  applyRateLimit,
  fetchWithResilience,
  getClientIp,
  getMetricsSnapshot,
  sendError,
  withRequestContext,
}
