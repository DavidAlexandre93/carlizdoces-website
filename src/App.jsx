import React from 'react'
import { motion } from 'motion/react'
import { AppProviders } from './app/providers/AppProviders'
import { HomePage } from './pages/HomePage'

const MotionDiv = motion.div

export default function App() {
  return (
    <div className="appRoot">
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
    </div>
  )
}
