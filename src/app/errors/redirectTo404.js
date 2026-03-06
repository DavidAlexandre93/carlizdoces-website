const NOT_FOUND_PATH = '/404'
const USER_INTERACTION_WINDOW_MS = 15000
let lastUserInteractionAt = 0

export function registerUserInteraction() {
  if (typeof window === 'undefined') {
    return
  }

  lastUserInteractionAt = window.performance?.now?.() ?? Date.now()
}

function hasRecentUserInteraction() {
  if (typeof window === 'undefined') {
    return false
  }

  const now = window.performance?.now?.() ?? Date.now()
  return now - lastUserInteractionAt <= USER_INTERACTION_WINDOW_MS
}

export function redirectTo404() {
  if (typeof window === 'undefined') {
    return
  }

  if (!import.meta.env.PROD) {
    return
  }

  if (window.location.pathname === NOT_FOUND_PATH) {
    return
  }

  if (!hasRecentUserInteraction()) {
    return
  }

  window.location.replace(NOT_FOUND_PATH)
}
