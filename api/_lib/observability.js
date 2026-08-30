/* global module, process */
const { SpanStatusCode, trace } = require('@opentelemetry/api');

const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || 'carlizdoces-website-api';

function initializeTelemetry() {
  if (globalThis.__carlizTelemetryInitialized !== undefined) {
    return globalThis.__carlizTelemetryInitialized;
  }

  const hasExporter = Boolean(process.env.OTEL_EXPORTER_OTLP_ENDPOINT);
  globalThis.__carlizTelemetryInitialized = false;

  if (!hasExporter || process.env.OTEL_SDK_DISABLED === 'true') {
    return false;
  }

  try {
    const { NodeSDK } = require('@opentelemetry/sdk-node');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
    const sdk = new NodeSDK({ traceExporter: new OTLPTraceExporter() });
    const startResult = sdk.start();
    if (startResult && typeof startResult.catch === 'function') {
      startResult.catch(() => undefined);
    }
    globalThis.__carlizTelemetrySdk = sdk;
    globalThis.__carlizTelemetryInitialized = true;
    return true;
  } catch {
    return false;
  }
}

initializeTelemetry();

const tracer = trace.getTracer(SERVICE_NAME);

function getTraceContext() {
  const spanContext = trace.getActiveSpan()?.spanContext();
  return {
    traceId: spanContext?.traceId || null,
    spanId: spanContext?.spanId || null,
  };
}

async function withSpan(name, attributes, operation) {
  return tracer.startActiveSpan(name, { attributes }, async (span) => {
    try {
      const result = await operation(span);
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.recordException(error instanceof Error ? error : new Error(String(error)));
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
}

module.exports = {
  SERVICE_NAME,
  getTraceContext,
  initializeTelemetry,
  withSpan,
};
