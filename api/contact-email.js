/* global module, process */

const { allowMethods, applyRateLimit, sendError, withRequestContext } = require('./_lib/http')

const RESEND_API_URL = 'https://api.resend.com/emails'
const DEFAULT_TO_EMAIL = 'carlizdoces@gmail.com'
const DEFAULT_FROM_EMAIL = 'Carliz Doces <onboarding@resend.dev>'
const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 1000
const CONTACT_RATE_LIMIT_MAX_REQUESTS = 5

const sanitizeText = (value, maxLength = 1200) => String(value || '').trim().slice(0, maxLength)

const fetchWithTimeout = async (url, options, timeoutMs = 10_000) => {
  const abortController = new AbortController()
  const timeoutId = setTimeout(() => abortController.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...options,
      signal: abortController.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

module.exports = withRequestContext(async function handler(req, res, context) {
  const { requestId, clientIp } = context

  if (!allowMethods(req, res, ['POST'], requestId)) {
    return
  }

  const rateLimitResult = applyRateLimit({
    key: `contact:${clientIp}`,
    windowMs: CONTACT_RATE_LIMIT_WINDOW_MS,
    limit: CONTACT_RATE_LIMIT_MAX_REQUESTS,
  })

  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', Math.ceil((rateLimitResult.retryAfterMs || 0) / 1000))
    sendError(res, 429, {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Muitas tentativas. Tente novamente em instantes.',
      requestId,
    })
    return
  }

  const name = sanitizeText(req.body?.name, 120)
  const email = sanitizeText(req.body?.email, 180)
  const message = sanitizeText(req.body?.message, 3000)

  if (!name || !message) {
    sendError(res, 400, {
      code: 'VALIDATION_ERROR',
      message: 'Os campos name e message são obrigatórios.',
      details: [
        !name ? { field: 'name', reason: 'required' } : null,
        !message ? { field: 'message', reason: 'required' } : null,
      ].filter(Boolean),
      requestId,
    })
    return
  }

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    sendError(res, 500, {
      code: 'SERVICE_NOT_CONFIGURED',
      message: 'Serviço de e-mail não configurado.',
      requestId,
    })
    return
  }

  const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL

  const subject = `Contato pelo site - ${name}`
  const text = [
    'Novo contato enviado pelo site da Carliz Doces.',
    '',
    `Nome: ${name}`,
    email ? `Email: ${email}` : 'Email: não informado',
    '',
    'Mensagem:',
    message,
  ].join('\n')

  try {
    const response = await fetchWithTimeout(
      RESEND_API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text,
          reply_to: email || undefined,
        }),
      },
      10_000,
    )

    if (!response.ok) {
      const responseText = await response.text()
      sendError(res, 502, {
        code: 'UPSTREAM_ERROR',
        message: 'Falha ao enviar e-mail de contato.',
        details: responseText.slice(0, 300),
        requestId,
      })
      return
    }

    res.status(200).json({ ok: true, requestId })
  } catch (error) {
    const isAbortError = error?.name === 'AbortError'
    sendError(res, 502, {
      code: isAbortError ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNAVAILABLE',
      message: isAbortError
        ? 'Serviço de e-mail excedeu o tempo limite.'
        : 'Falha ao alcançar serviço de e-mail.',
      requestId,
    })
  }
})
