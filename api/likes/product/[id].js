/* global module, require */
const { toggleProductLikeForUser } = require('../../likesStore')

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const productId = req.query?.id
  if (!productId || typeof productId !== 'string') {
    res.status(400).json({ error: 'id do produto inválido' })
    return
  }

  const { userId } = req.body ?? {}
  const result = toggleProductLikeForUser(productId, userId)

  if (!result.ok) {
    res.status(400).json({ error: result.error })
    return
  }

  res.status(200).json(result)
}
