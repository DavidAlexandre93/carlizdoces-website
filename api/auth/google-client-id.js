/* global module, require */

const { getGoogleClientId } = require('./googleClientId')

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
