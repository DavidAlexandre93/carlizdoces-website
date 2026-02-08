import { useEffect, useState } from 'react'
import { HomePage } from '../../pages/HomePage'

export function AppRouter() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    if (window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/')
      setPathname('/')
    }

    const handleNavigation = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handleNavigation)
    return () => window.removeEventListener('popstate', handleNavigation)
  }, [])

  if (pathname !== '/') {
    return null
  }

  return <HomePage />
}
