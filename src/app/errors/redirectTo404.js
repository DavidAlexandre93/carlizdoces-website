const NOT_FOUND_PATH = '/404'

export function redirectTo404() {
  if (typeof window === 'undefined') {
    return
  }

  if (window.location.pathname === NOT_FOUND_PATH) {
    return
  }

  window.location.replace(NOT_FOUND_PATH)
}
