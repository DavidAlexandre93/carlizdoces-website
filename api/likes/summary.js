/* global module, require */
const { getLikesSummary } = require('../likesStore')

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const userId = typeof req.query?.userId === 'string' ? req.query.userId : ''
  const summary = getLikesSummary(userId)

  res.status(200).json(summary)
}
