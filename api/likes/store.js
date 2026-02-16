/* global module, require */
const { toggleStoreLikeForUser } = require('../likesStore')

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { userId } = req.body ?? {}
  const result = toggleStoreLikeForUser(userId)

  if (!result.ok) {
    res.status(400).json({ error: result.error })
    return
  }

  res.status(200).json(result)
}
