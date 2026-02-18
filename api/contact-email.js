/* global module, process */

const RESEND_API_URL = 'https://api.resend.com/emails'
const DEFAULT_TO_EMAIL = 'carlizdoces@gmail.com'
const DEFAULT_FROM_EMAIL = 'Carliz Doces <onboarding@resend.dev>'

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for']

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0] || '').split(',')[0].trim()
  }

  return String(forwarded || req.socket?.remoteAddress || 'anon').split(',')[0].trim()
}

const sanitizeText = (value, maxLength = 1200) => String(value || '').trim().slice(0, maxLength)

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const name = sanitizeText(req.body?.name, 120)
  const email = sanitizeText(req.body?.email, 180)
  const message = sanitizeText(req.body?.message, 3000)

  if (!name || !message) {
    res.status(400).json({ error: 'name and message are required' })
    return
  }

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    res.status(500).json({ error: 'email service is not configured' })
    return
  }

  const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL
  const requesterIp = getClientIp(req)

  const subject = `Contato pelo site - ${name}`
  const text = [
    'Novo contato enviado pelo site da Carliz Doces.',
    '',
    `Nome: ${name}`,
    email ? `Email: ${email}` : 'Email: não informado',
    `IP: ${requesterIp}`,
    '',
    'Mensagem:',
    message,
  ].join('\n')

  try {
    const response = await fetch(RESEND_API_URL, {
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
    })

    if (!response.ok) {
      const responseText = await response.text()
      res.status(502).json({ error: 'failed to send email', details: responseText.slice(0, 300) })
      return
    }

    res.status(200).json({ ok: true })
  } catch {
    res.status(502).json({ error: 'failed to reach email service' })
  }
}
