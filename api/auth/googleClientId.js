/* global module, process */

const GOOGLE_CLIENT_ID_PLACEHOLDERS = ['SEU_CLIENT_ID', 'YOUR_CLIENT_ID', 'INSIRA_SEU_CLIENT_ID']

const isGoogleClientIdConfigured = (value) => {
  if (typeof value !== 'string') return false

  const normalizedValue = value.trim()
  if (!normalizedValue) return false

  const upperValue = normalizedValue.toUpperCase()
  if (GOOGLE_CLIENT_ID_PLACEHOLDERS.some((placeholder) => upperValue.includes(placeholder))) {
    return false
  }

  return /\.apps\.googleusercontent\.com$/i.test(normalizedValue)
}

const getGoogleClientId = () => {
  if (isGoogleClientIdConfigured(process.env.GOOGLE_CLIENT_ID)) {
    return process.env.GOOGLE_CLIENT_ID.trim()
  }

  if (isGoogleClientIdConfigured(process.env.VITE_GOOGLE_CLIENT_ID)) {
    return process.env.VITE_GOOGLE_CLIENT_ID.trim()
  }

  return ''
}

module.exports = {
  getGoogleClientId,
  isGoogleClientIdConfigured,
}
