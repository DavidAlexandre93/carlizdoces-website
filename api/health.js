/* global module, process */
const { allowMethods, sendSuccess, withRequestContext } = require('./_lib/http');

const STARTED_AT = globalThis.__carlizStartedAt ?? Date.now();
globalThis.__carlizStartedAt = STARTED_AT;

function dependencySnapshot() {
  return {
    openai: { configured: Boolean(process.env.OPENAI_API_KEY) },
    resend: { configured: Boolean(process.env.RESEND_API_KEY) },
    supabase: {
      configured: Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY),
    },
    otlp: { configured: Boolean(process.env.OTEL_EXPORTER_OTLP_ENDPOINT) },
  };
}

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId } = context;
  if (!allowMethods(req, res, ['GET'], requestId)) return;

  const deep = String(req.query?.deep || '').toLowerCase() === 'true';
  const dependencies = dependencySnapshot();
  const required = String(process.env.REQUIRED_DEPENDENCIES || '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
  const missing = required.filter((name) => !dependencies[name]?.configured);
  const ready = missing.length === 0;

  sendSuccess(
    res,
    ready ? 200 : 503,
    {
      status: ready ? 'ready' : 'degraded',
      service: 'carlizdoces-website-api',
      version: process.env.APP_VERSION || process.env.npm_package_version || '0.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - STARTED_AT) / 1000),
      ...(deep ? { dependencies, missingRequiredDependencies: missing } : {}),
    },
    requestId
  );
});
