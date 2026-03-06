const test = require('node:test')
const assert = require('node:assert/strict')

const {
  applyRateLimit,
  fetchWithResilience,
  getMetricsSnapshot,
  withRequestContext,
} = require('../api/_lib/http')

function createMockRes() {
  const headers = {}
  return {
    statusCode: 200,
    body: null,
    setHeader(name, value) {
      headers[name] = value
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    },
    get headers() {
      return headers
    },
  }
}

test('applyRateLimit blocks after threshold', () => {
  const key = `test-rate-limit-${Date.now()}`
  const first = applyRateLimit({ key, windowMs: 60_000, limit: 2 })
  const second = applyRateLimit({ key, windowMs: 60_000, limit: 2 })
  const third = applyRateLimit({ key, windowMs: 60_000, limit: 2 })

  assert.equal(first.allowed, true)
  assert.equal(second.allowed, true)
  assert.equal(third.allowed, false)
  assert.ok(third.retryAfterMs > 0)
})

test('withRequestContext records latency metrics by route', async () => {
  const req = { method: 'GET', url: '/api/health', headers: {}, socket: { remoteAddress: '127.0.0.1' } }
  const res = createMockRes()

  const wrapped = withRequestContext(async (incomingReq, outgoingRes) => {
    assert.equal(incomingReq.method, 'GET')
    outgoingRes.status(200).json({ ok: true })
  })

  await wrapped(req, res)

  const snapshot = getMetricsSnapshot()
  assert.ok(snapshot.routes['GET /api/health'])
  assert.ok(snapshot.routes['GET /api/health'].total >= 1)
  assert.ok(snapshot.routes['GET /api/health'].p95Ms >= 0)
})

test('fetchWithResilience retries transient failure and succeeds', async () => {
  const originalFetch = global.fetch
  let attempts = 0

  global.fetch = async () => {
    attempts += 1
    if (attempts < 2) {
      return { ok: false, status: 503 }
    }

    return { ok: true, status: 200 }
  }

  const response = await fetchWithResilience('https://example.com', {}, {
    dependencyName: `resilience-test-${Date.now()}`,
    retries: 2,
    baseDelayMs: 1,
    timeoutMs: 100,
  })

  assert.equal(response.ok, true)
  assert.equal(attempts, 2)

  global.fetch = originalFetch
})
