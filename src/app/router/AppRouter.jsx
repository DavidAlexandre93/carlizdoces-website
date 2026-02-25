import { useEffect, useState } from 'react'
import SplashEnterCircus from '../../components/SplashEnterCircus'
import { HomePage } from '../../pages/HomePage'

export function AppRouter() {
  const [pathname, setPathname] = useState(() => window.location.pathname || '/')

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname || '/')
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (pathname !== '/' && pathname !== '/home') {
      window.history.replaceState({}, '', '/')
      setPathname('/')
    }
  }, [pathname])

  const goToHome = () => {
    window.history.pushState({}, '', '/home')
    setPathname('/home')
  }

  return pathname === '/home' ? <HomePage /> : <SplashEnterCircus onEntered={goToHome} />
}
