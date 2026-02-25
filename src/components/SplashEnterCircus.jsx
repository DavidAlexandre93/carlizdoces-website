import React, { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Motion = motion

export default function SplashEnterCircus() {
  const prefersReducedMotion = useReducedMotion()
  const [entering, setEntering] = useState(false)
  const navigate = useNavigate()

  const doorHotspot = useMemo(() => ({ x: 50, y: 58 }), [])

  const handleEnter = () => {
    if (entering) return
    setEntering(true)
  }

  return (
    <div className="sceneRoot">
      <Motion.img
        src="/images/circus-outside.png"
        alt="Circo"
        className="splashImg"
        style={{
          transformOrigin: `${doorHotspot.x}% ${doorHotspot.y}%`,
        }}
        animate={
          entering
            ? {
                scale: prefersReducedMotion ? 1.6 : 2.4,
                filter: prefersReducedMotion
                  ? 'brightness(0.95)'
                  : 'brightness(0.9) blur(1.2px)',
              }
            : { scale: 1, filter: 'brightness(0.98)' }
        }
        transition={{ duration: prefersReducedMotion ? 0.35 : 1.35, ease: [0.2, 0.8, 0.2, 1] }}
      />

      <Motion.div
        className="vignette"
        animate={entering ? { opacity: 0.75 } : { opacity: 0.35 }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.55 }}
      />

      <Motion.div
        className="doorPortal"
        style={{ left: `${doorHotspot.x}%`, top: `${doorHotspot.y}%` }}
        initial={false}
        animate={
          entering
            ? {
                width: prefersReducedMotion ? 420 : 980,
                height: prefersReducedMotion ? 520 : 1300,
                opacity: 1,
                borderRadius: prefersReducedMotion ? 22 : 0,
              }
            : { width: 220, height: 280, opacity: 0, borderRadius: 26 }
        }
        transition={{ duration: prefersReducedMotion ? 0.35 : 1.1, ease: [0.2, 0.8, 0.2, 1] }}
      />

      <div className="splashContent">
        <div className="brandBadge">
          <div className="brandTitle">Carliz Doces</div>
          <div className="brandSubtitle">Bem-vindo ao Circo 🍭🎪</div>
        </div>

        <Motion.button
          className="enterBtn"
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleEnter}
          disabled={entering}
        >
          {entering ? 'Entrando...' : 'Entrar no circo'}
        </Motion.button>
      </div>

      <Motion.div
        className="fadeCurtain"
        initial={false}
        animate={entering ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.25 : 0.45, delay: prefersReducedMotion ? 0 : 0.95 }}
        onAnimationComplete={() => {
          if (entering) navigate('/home')
        }}
      />
    </div>
  )
}
