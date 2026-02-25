import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AppProviders } from './app/providers/AppProviders'
import SplashEnterCircus from './components/SplashEnterCircus'
import { HomePage } from './pages/HomePage'

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
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
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
            <AppProviders>
              <HomePage />
            </AppProviders>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  )
}
