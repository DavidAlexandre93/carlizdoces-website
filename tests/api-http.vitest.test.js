import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const { applyRateLimit, getMetricsSnapshot, withRequestContext } = require('../api/_lib/http.js');

function createMockResponse() {
  return {
    statusCode: 200,
    setHeader() {},
    status(code) {
      this.statusCode = code;
      return this;
    },
    json() {
      return this;
    },
  };
}

describe('HTTP platform helpers', () => {
  it('enforces a rate limit window', () => {
    const key = `vitest-rate-limit-${Date.now()}`;
    expect(applyRateLimit({ key, windowMs: 60_000, limit: 1 }).allowed).toBe(true);
    expect(applyRateLimit({ key, windowMs: 60_000, limit: 1 }).allowed).toBe(false);
  });

  it('records request metrics through the context wrapper', async () => {
    const route = `GET /api/vitest-${Date.now()}`;
    const request = { method: 'GET', url: route.replace('GET ', ''), headers: {} };
    const response = createMockResponse();

    await withRequestContext(async (_request, outgoingResponse) => {
      outgoingResponse.status(200).json({ ok: true });
    })(request, response);

    expect(getMetricsSnapshot().routes[route]).toBeDefined();
  });
});
