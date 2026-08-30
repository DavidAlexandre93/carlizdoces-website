/* global module, process */
const { getTraceContext, SERVICE_NAME } = require('./observability');

const REDACTED = '[REDACTED]';
const SENSITIVE_KEY = /authorization|cookie|token|secret|password|private.?key|api.?key|email|phone|address|client.?ip|user.?id|message|notes|prompt/i;
const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN = /(?<!\d)(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?(?:9\s*)?\d{4}[-\s]?\d{4}(?!\d)/g;
const BEARER_PATTERN = /Bearer\s+[A-Za-z0-9._~+/=-]+/gi;
const PRIVATE_KEY_PATTERN = /-----BEGIN[\s\S]*?PRIVATE KEY-----[\s\S]*?-----END[\s\S]*?PRIVATE KEY-----/g;
const IPV4_PATTERN = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
const WINDOWS_USER_PATTERN = /[A-Za-z]:\\Users\\[^\\\s]+/g;

function redactString(value) {
  return String(value)
    .replace(PRIVATE_KEY_PATTERN, '[REDACTED_PRIVATE_KEY]')
    .replace(BEARER_PATTERN, 'Bearer [REDACTED_TOKEN]')
    .replace(EMAIL_PATTERN, '[REDACTED_EMAIL]')
    .replace(PHONE_PATTERN, '[REDACTED_PHONE]')
    .replace(IPV4_PATTERN, '[REDACTED_IP]')
    .replace(WINDOWS_USER_PATTERN, 'C:\\Users\\[REDACTED_USER]');
}

function redact(value, depth = 0, seen = new WeakSet()) {
  if (depth > 8) return '[MAX_DEPTH]';
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return redactString(value);
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (typeof value === 'bigint') return value.toString();
  if (typeof value !== 'object') return String(value);
  if (seen.has(value)) return '[CIRCULAR]';
  seen.add(value);

  if (Array.isArray(value)) {
    return value.slice(0, 50).map((item) => redact(item, depth + 1, seen));
  }

  return Object.entries(value).reduce((safe, [key, item]) => {
    safe[key] = SENSITIVE_KEY.test(key) ? REDACTED : redact(item, depth + 1, seen);
    return safe;
  }, {});
}

function normalizeError(error) {
  const source = error instanceof Error ? error : new Error(String(error));
  const stack = redactString(source.stack || '');
  const firstFrame = stack.split('\n').find((line) => /:\d+:\d+/.test(line)) || '';
  const location = firstFrame.match(/(?<file>(?:[A-Za-z]:)?[^()\s]+):(?<line>\d+):(?<column>\d+)/)?.groups;

  return {
    class: source.constructor?.name || 'Error',
    name: source.name || 'Error',
    message: redactString(source.message || 'Unknown error'),
    code: typeof source.code === 'string' ? redactString(source.code) : undefined,
    cause: source.cause ? redact(source.cause) : undefined,
    file: location?.file || null,
    line: location ? Number(location.line) : null,
    column: location ? Number(location.column) : null,
    stack,
  };
}

function logEvent(level, event, fields = {}) {
  const traceContext = getTraceContext();
  const payload = redact({
    timestamp: new Date().toISOString(),
    level,
    event,
    service: SERVICE_NAME,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    ...traceContext,
    ...fields,
  });

  const serialized = JSON.stringify(payload);
  const output = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  output(serialized);
  return payload;
}

function logError(event, error, fields = {}) {
  return logEvent('error', event, { ...fields, error: normalizeError(error) });
}

module.exports = {
  REDACTED,
  logError,
  logEvent,
  normalizeError,
  redact,
  redactString,
};
