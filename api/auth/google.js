/* global module, process */

const GOOGLE_TOKENINFO_URL = 'https://oauth2.googleapis.com/tokeninfo'

const getGoogleClientId = () => {
  if (typeof process.env.GOOGLE_CLIENT_ID === 'string' && process.env.GOOGLE_CLIENT_ID.trim()) {
    return process.env.GOOGLE_CLIENT_ID.trim()
  }

  if (typeof process.env.VITE_GOOGLE_CLIENT_ID === 'string' && process.env.VITE_GOOGLE_CLIENT_ID.trim()) {
    return process.env.VITE_GOOGLE_CLIENT_ID.trim()
  }

  return ''
}

const verifyGoogleIdToken = async (idToken, audience) => {
  const response = await fetch(`${GOOGLE_TOKENINFO_URL}?id_token=${encodeURIComponent(idToken)}`)

  if (!response.ok) {
    return null
  }

  const payload = await response.json()

  if (!payload?.sub || payload.aud !== audience) {
    return null
  }

  return payload
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const clientId = getGoogleClientId()
  if (!clientId) {
    res.status(500).json({ error: 'Google client id is not configured' })
    return
  }

  const idToken = typeof req.body?.idToken === 'string' ? req.body.idToken : ''
  if (!idToken) {
    res.status(400).json({ error: 'Missing idToken' })
    return
  }

  try {
    const payload = await verifyGoogleIdToken(idToken, clientId)

    if (!payload) {
      res.status(401).json({ error: 'Invalid Google token' })
      return
    }

    res.status(200).json({
      ok: true,
      user: {
        id: String(payload.sub),
        email: String(payload.email ?? ''),
        name: String(payload.name ?? 'Usuário Google'),
        picture: String(payload.picture ?? ''),
      },
    })
  } catch {
    res.status(500).json({ error: 'Google authentication failed' })
  }
}
