import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import SplashEnterCircus from './components/SplashEnterCircus'
import HomeInsideCircus from './components/HomeInsideCircus'

const MotionDiv = motion.div

export default function App() {
  const [stage, setStage] = useState('splash')

  return (
    <div className="appRoot">
      <AnimatePresence mode="wait">
        {stage === 'splash' ? (
          <MotionDiv
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            style={{ height: '100%' }}
          >
            <SplashEnterCircus onEntered={() => setStage('home')} />
          </MotionDiv>
        ) : (
          <MotionDiv
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{ height: '100%' }}
          >
            <HomeInsideCircus />
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  )
}
