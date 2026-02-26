import React, { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function SplashEnterCircus() {
  const prefersReducedMotion = useReducedMotion()
  const [entering, setEntering] = useState(false)
  const navigate = useNavigate()

  const doorHotspot = useMemo(() => ({ x: 50, y: 58 }), [])

  const handleEnter = () => {
    if (entering) return
    setEntering(true)
  }

  useEffect(() => {
    if (!entering) return undefined

    const fallbackMs = prefersReducedMotion ? 380 : 1450
    const timer = window.setTimeout(() => {
      navigate('/home')
    }, fallbackMs)

    return () => window.clearTimeout(timer)
  }, [entering, navigate, prefersReducedMotion])

  return (
    <div className="sceneRoot">
      <img
        src="/images/circus-outside.png"
        alt="Circo"
        className="splashImg"
        style={{
          transformOrigin: `${doorHotspot.x}% ${doorHotspot.y}%`,
          transform: entering
            ? `translate3d(0, ${prefersReducedMotion ? 6 : 14}px, 0) scale(${prefersReducedMotion ? 1.6 : 2.4})`
            : 'translate3d(0, 0, 0) scale(1)',
          filter: entering
            ? prefersReducedMotion
              ? 'brightness(0.95)'
              : 'brightness(0.9) blur(1.2px)'
            : 'brightness(0.98)',
          transition: `transform ${prefersReducedMotion ? 0.35 : 1.35}s cubic-bezier(0.2, 0.8, 0.2, 1), filter ${prefersReducedMotion ? 0.35 : 1.35}s cubic-bezier(0.2, 0.8, 0.2, 1)`,
        }}
      />

      <div
        className="vignette"
        style={{
          opacity: entering ? 0.75 : 0.35,
          transition: `opacity ${prefersReducedMotion ? 0.2 : 0.55}s ease`,
        }}
      />

      <div
        className="doorPortal"
        style={{
          left: `${doorHotspot.x}%`,
          top: `${doorHotspot.y}%`,
          width: entering ? (prefersReducedMotion ? 420 : 980) : 220,
          height: entering ? (prefersReducedMotion ? 520 : 1300) : 280,
          opacity: entering ? 1 : 0,
          borderRadius: entering ? (prefersReducedMotion ? 22 : 0) : 26,
          transition: `width ${prefersReducedMotion ? 0.35 : 1.1}s cubic-bezier(0.2, 0.8, 0.2, 1), height ${prefersReducedMotion ? 0.35 : 1.1}s cubic-bezier(0.2, 0.8, 0.2, 1), opacity ${prefersReducedMotion ? 0.35 : 1.1}s cubic-bezier(0.2, 0.8, 0.2, 1), border-radius ${prefersReducedMotion ? 0.35 : 1.1}s cubic-bezier(0.2, 0.8, 0.2, 1)`,
        }}
      />

      <div className="splashContent">
        <button
          className="enterBtn"
          onClick={handleEnter}
          disabled={entering}
        >
          {entering ? 'Entrando...' : 'Entrar no circo'}
        </button>
      </div>

      <div
        className="fadeCurtain"
        style={{
          opacity: entering ? 1 : 0,
          transition: `opacity ${prefersReducedMotion ? 0.25 : 0.45}s ease ${prefersReducedMotion ? 0 : 0.95}s`,
        }}
        onTransitionEnd={() => {
          if (entering) navigate('/home')
        }}
      />
    </div>
  )
}
