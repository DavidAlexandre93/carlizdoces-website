import React, { useMemo, useState } from 'react'
import { motion } from 'motion/react'

const Motion = motion

export default function SplashEnterCircus({ onEntered, reduceMotion = false }) {
  const [entering, setEntering] = useState(false)

  const doorHotspot = useMemo(() => ({ x: 50, y: 58 }), [])

  const handleEnter = () => {
    if (entering) return
    setEntering(true)

    window.setTimeout(() => {
      onEntered?.()
    }, reduceMotion ? 200 : 1550)
  }

  return (
    <div className="sceneRoot">
      <Motion.div
        className="splashBg"
        style={{
          backgroundImage: 'url(/images/circus-outside.png)',
          transformOrigin: `${doorHotspot.x}% ${doorHotspot.y}%`,
        }}
        animate={
          entering
            ? {
                scale: reduceMotion ? 1.06 : 2.25,
                filter: reduceMotion ? 'brightness(0.95)' : 'brightness(0.9) blur(1.5px)',
              }
            : { scale: 1, filter: 'brightness(0.98)' }
        }
        transition={{
          duration: reduceMotion ? 0.2 : 1.45,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      />

      <Motion.div
        className="vignette"
        animate={entering ? { opacity: 0.75 } : { opacity: 0.35 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.55 }}
      />

      <Motion.div
        className="doorPortal"
        style={{ left: `${doorHotspot.x}%`, top: `${doorHotspot.y}%` }}
        initial={false}
        animate={
          entering
            ? {
                width: reduceMotion ? 260 : 940,
                height: reduceMotion ? 320 : 1240,
                opacity: 1,
                borderRadius: reduceMotion ? 22 : 0,
              }
            : {
                width: 220,
                height: 280,
                opacity: 0,
                borderRadius: 26,
              }
        }
        transition={{
          duration: reduceMotion ? 0.2 : 1.2,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      />

      <div className="splashContent">
        <Motion.div
          className="brandBadge"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="brandTitle">Carliz Doces</div>
          <div className="brandSubtitle">Bem-vindo ao Circo 🍭🎪</div>
        </Motion.div>

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
        transition={{
          duration: reduceMotion ? 0.2 : 0.45,
          delay: reduceMotion ? 0 : 1.05,
        }}
      />
    </div>
  )
}
