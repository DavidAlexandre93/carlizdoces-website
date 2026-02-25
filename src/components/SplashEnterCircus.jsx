import React, { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const MotionDiv = motion.div
const MotionButton = motion.button

export default function SplashEnterCircus({ onEntered }) {
  const reduceMotion = useReducedMotion()
  const [entering, setEntering] = useState(false)

  const doorHotspot = useMemo(
    () => ({
      x: 50,
      y: 58,
    }),
    [],
  )

  const handleEnter = () => {
    if (entering) return
    setEntering(true)
    window.setTimeout(() => onEntered?.(), reduceMotion ? 250 : 1650)
  }

  return (
    <div className="sceneRoot">
      <MotionDiv
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
            : {
                scale: 1,
                filter: 'brightness(0.98)',
              }
        }
        transition={{
          duration: reduceMotion ? 0.25 : 1.55,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      />

      <MotionDiv
        className="vignette"
        animate={entering ? { opacity: 0.75 } : { opacity: 0.35 }}
        transition={{ duration: reduceMotion ? 0.2 : 0.6 }}
      />

      <MotionDiv
        className="doorPortal"
        style={{
          left: `${doorHotspot.x}%`,
          top: `${doorHotspot.y}%`,
        }}
        initial={false}
        animate={
          entering
            ? {
                width: reduceMotion ? 240 : 920,
                height: reduceMotion ? 300 : 1200,
                opacity: 1,
                borderRadius: reduceMotion ? 22 : 0,
                filter: reduceMotion ? 'none' : 'blur(0px)',
              }
            : {
                width: 220,
                height: 280,
                opacity: 0,
                borderRadius: 26,
                filter: 'blur(0px)',
              }
        }
        transition={{
          duration: reduceMotion ? 0.25 : 1.25,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      />

      <div className="splashContent">
        <MotionDiv
          className="brandBadge"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <div className="brandTitle">Carliz Doces</div>
          <div className="brandSubtitle">Bem-vindo ao Circo 🍭🎪</div>
        </MotionDiv>

        <MotionButton
          className="enterBtn"
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleEnter}
          disabled={entering}
        >
          {entering ? 'Entrando...' : 'Entrar no circo'}
        </MotionButton>

        <MotionDiv
          className="hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          Dica: ajuste o foco do zoom no <code>doorHotspot</code> se necessário.
        </MotionDiv>
      </div>

      <MotionDiv
        className="fadeCurtain"
        initial={false}
        animate={entering ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.25 : 0.5, delay: reduceMotion ? 0 : 1.15 }}
      />
    </div>
  )
}
