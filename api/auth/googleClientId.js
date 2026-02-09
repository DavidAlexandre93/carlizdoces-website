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

module.exports = {
  getGoogleClientId,
}
