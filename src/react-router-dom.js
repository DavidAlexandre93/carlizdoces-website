import React, { Children, createContext, useContext, useEffect, useMemo, useState } from 'react'

const RouterContext = createContext({
  pathname: '/',
  navigate: () => {},
})

export function BrowserRouter({ children }) {
  const [pathname, setPathname] = useState(() => window.location.pathname || '/')

  useEffect(() => {
    const onLocationChange = () => setPathname(window.location.pathname || '/')

    window.addEventListener('popstate', onLocationChange)
    window.addEventListener('pushstate', onLocationChange)
    window.addEventListener('replacestate', onLocationChange)

    return () => {
      window.removeEventListener('popstate', onLocationChange)
      window.removeEventListener('pushstate', onLocationChange)
      window.removeEventListener('replacestate', onLocationChange)
    }
  }, [])

  const navigate = (to, options = {}) => {
    if (!to) return

    if (options.replace) {
      window.history.replaceState({}, '', to)
      window.dispatchEvent(new Event('replacestate'))
    } else {
      window.history.pushState({}, '', to)
      window.dispatchEvent(new Event('pushstate'))
    }

    setPathname(window.location.pathname || '/')
  }

  const value = useMemo(() => ({ pathname, navigate }), [pathname])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function Routes({ children }) {
  const { pathname } = useContext(RouterContext)
  const routeElements = Children.toArray(children)
  const match = routeElements.find((child) => child?.props?.path === pathname)

  return match?.props?.element ?? null
}

export function Route() {
  return null
}

export function useNavigate() {
  return useContext(RouterContext).navigate
}
