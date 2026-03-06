/* global module */

const DEFAULT_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
}

const RATE_LIMIT_STORE = globalThis.__carlizRateLimitStore ?? new Map()
globalThis.__carlizRateLimitStore = RATE_LIMIT_STORE

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

function withRequestContext(handler) {
  return async function withRequestContextHandler(req, res) {
    setDefaultHeaders(res)
    const requestId = getRequestId(req)
    res.setHeader('X-Request-Id', requestId)

    try {
      await handler(req, res, { requestId, clientIp: getClientIp(req) })
    } catch (error) {
      sendError(res, 500, {
        code: 'INTERNAL_ERROR',
        message: 'Erro interno ao processar a requisição.',
        details: process.env.NODE_ENV === 'production' ? null : String(error?.message || error),
        requestId,
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

module.exports = {
  allowMethods,
  applyRateLimit,
  getClientIp,
  sendError,
  withRequestContext,
}
