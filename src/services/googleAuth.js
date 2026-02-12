const getCurrentUrl = () => `${window.location.origin}${window.location.pathname}`

const normalizeSession = (sessionResponse) => {
  if (!sessionResponse?.user?.email) return null

  return {
    id: String(sessionResponse.user.email),
    name: String(sessionResponse.user.name ?? sessionResponse.user.email),
    email: String(sessionResponse.user.email),
    picture: String(sessionResponse.user.image ?? ''),
  }
}

export const startGoogleLogin = () => {
  const callbackUrl = encodeURIComponent(`${window.location.origin}/dashboard`)
  window.location.assign(`/api/auth/signin/google?callbackUrl=${callbackUrl}`)
}

const getCsrfToken = async () => {
  const response = await fetch('/api/auth/csrf')
  if (!response.ok) throw new Error('csrf-token-failed')

  const data = await response.json()
  if (!data?.csrfToken) throw new Error('missing-csrf-token')

  return data.csrfToken
}

export const signOutGoogleSession = async () => {
  const csrfToken = await getCsrfToken()

  const signOutResponse = await fetch('/api/auth/signout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      csrfToken,
      callbackUrl: getCurrentUrl(),
      json: 'true',
    }).toString(),
  })

  if (!signOutResponse.ok) {
    throw new Error('google-signout-failed')
  }
}

export const getStoredGoogleSession = async () => {
  const response = await fetch('/api/auth/session')
  if (!response.ok) return null

  const sessionResponse = await response.json()
  return normalizeSession(sessionResponse)
}

export const resolveGoogleSessionFromUrlHash = async () => getStoredGoogleSession()
