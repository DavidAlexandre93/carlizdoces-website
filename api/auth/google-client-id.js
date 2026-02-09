/* global module, process */

const getGoogleClientId = () => {
  if (typeof process.env.GOOGLE_CLIENT_ID === 'string' && process.env.GOOGLE_CLIENT_ID.trim()) {
    return process.env.GOOGLE_CLIENT_ID.trim()
  }

  if (typeof process.env.VITE_GOOGLE_CLIENT_ID === 'string' && process.env.VITE_GOOGLE_CLIENT_ID.trim()) {
    return process.env.VITE_GOOGLE_CLIENT_ID.trim()
  }

  return ''
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const clientId = getGoogleClientId()
  if (!clientId) {
    res.status(404).json({ error: 'Google client id is not configured' })
    return
  }

  res.status(200).json({ clientId })
}
