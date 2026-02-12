const GOOGLE_SESSION_STORAGE_KEY = 'carliz-google-session'

const buildRedirectUri = () => `${window.location.origin}${window.location.pathname}`

const normalizeGoogleUser = (userInfo) => {
  if (!userInfo?.email) return null

  return {
    id: String(userInfo.sub ?? userInfo.email),
    name: String(userInfo.name ?? userInfo.email),
    email: String(userInfo.email),
    picture: String(userInfo.picture ?? ''),
  }
}

export const getGoogleOAuthConfig = () => ({
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  scope: 'openid profile email',
})

export const startGoogleLogin = ({ clientId, scope }) => {
  const redirectUri = buildRedirectUri()
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'token')
  authUrl.searchParams.set('scope', scope)
  authUrl.searchParams.set('include_granted_scopes', 'true')
  authUrl.searchParams.set('prompt', 'select_account')

  window.location.assign(authUrl.toString())
}

export const getStoredGoogleSession = () => {
  try {
    const rawSession = window.localStorage.getItem(GOOGLE_SESSION_STORAGE_KEY)
    if (!rawSession) return null

    const parsedSession = JSON.parse(rawSession)
    return parsedSession && typeof parsedSession === 'object' ? parsedSession : null
  } catch {
    return null
  }
}

const persistGoogleSession = (session) => {
  window.localStorage.setItem(GOOGLE_SESSION_STORAGE_KEY, JSON.stringify(session))
}

export const resolveGoogleSessionFromUrlHash = async () => {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return null

  const params = new URLSearchParams(hash)
  const accessToken = params.get('access_token')

  if (!accessToken) return null

  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    return null
  }

  const userInfo = await response.json()
  const session = normalizeGoogleUser(userInfo)
  if (!session) return null

  persistGoogleSession(session)
  window.history.replaceState(null, '', buildRedirectUri())

  return session
}
