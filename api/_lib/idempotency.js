/* global module */
const { createHash } = require('node:crypto');

const STORE = globalThis.__carlizIdempotencyStore ?? new Map();
globalThis.__carlizIdempotencyStore = STORE;

const KEY_PATTERN = /^[A-Za-z0-9:_-]{8,128}$/;

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== 'object') return value;
  return Object.keys(value)
    .sort()
    .reduce((result, key) => {
      result[key] = stableValue(value[key]);
      return result;
    }, {});
}

function fingerprint(payload) {
  return createHash('sha256')
    .update(JSON.stringify(stableValue(payload)))
    .digest('hex');
}

function getIdempotencyKey(req) {
  const raw = req.headers?.['idempotency-key'];
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === undefined || value === null || value === '') return { ok: true, key: null };
  const key = String(value).trim();
  return KEY_PATTERN.test(key) ? { ok: true, key } : { ok: false, key: null };
}

function cleanup(now = Date.now()) {
  if (STORE.size < 500) return;
  for (const [key, entry] of STORE.entries()) {
    if (entry.expiresAt <= now) STORE.delete(key);
  }
}

async function executeIdempotent({ scope, key, payload, ttlMs = 15 * 60 * 1000, operation }) {
  if (!key) {
    return { state: 'fresh', value: await operation() };
  }

  const now = Date.now();
  cleanup(now);
  const storeKey = `${scope}:${key}`;
  const payloadFingerprint = fingerprint(payload);
  const existing = STORE.get(storeKey);

  if (existing && existing.expiresAt > now) {
    if (existing.fingerprint !== payloadFingerprint) return { state: 'conflict' };
    return { state: 'replay', value: await existing.promise };
  }

  const promise = Promise.resolve().then(operation);
  STORE.set(storeKey, { fingerprint: payloadFingerprint, expiresAt: now + ttlMs, promise });

  try {
    return { state: 'fresh', value: await promise };
  } catch (error) {
    STORE.delete(storeKey);
    throw error;
  }
}

function resetIdempotencyStore() {
  STORE.clear();
}

module.exports = {
  executeIdempotent,
  fingerprint,
  getIdempotencyKey,
  resetIdempotencyStore,
};
