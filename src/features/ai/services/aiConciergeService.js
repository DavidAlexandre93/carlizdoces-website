export class ApiClientError extends Error {
  constructor(message, { code = 'REQUEST_FAILED', requestId = '', status = 0 } = {}) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.requestId = requestId;
    this.status = status;
  }
}

function createIdempotencyKey() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `ai_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    throw new ApiClientError('O serviço respondeu em um formato inesperado.', {
      status: response.status,
    });
  }
}

export async function requestAiRecommendation(brief, { signal } = {}) {
  const response = await fetch('/api/ai/recommend', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Idempotency-Key': createIdempotencyKey(),
    },
    body: JSON.stringify(brief),
    signal,
  });
  const payload = await readJson(response);

  if (!response.ok || payload?.ok !== true) {
    throw new ApiClientError(
      payload?.error?.message || 'Não foi possível criar a sugestão agora.',
      {
        code: payload?.error?.code,
        requestId: payload?.requestId,
        status: response.status,
      }
    );
  }

  return payload.data;
}

export async function requestServiceHealth({ signal } = {}) {
  const response = await fetch('/api/health', {
    headers: { Accept: 'application/json' },
    signal,
  });
  const payload = await readJson(response);
  if (!response.ok || payload?.ok !== true) {
    throw new ApiClientError('O serviço está temporariamente indisponível.', {
      requestId: payload?.requestId,
      status: response.status,
    });
  }
  return payload.data;
}
