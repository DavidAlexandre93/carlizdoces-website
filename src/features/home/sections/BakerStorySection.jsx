import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Box, Container, Stack, Typography } from '@mui/material'
import gsap, { useGSAP } from '../../../lib/gsapCompat'

const MotionDiv = motion.div

const bakingSteps = [
  { label: 'Preparando a massa', detail: 'Mistura dos ingredientes com movimentos suaves.' },
  { label: 'Decorando os doces', detail: 'Confeitos, cobertura e pequenos toques de carinho.' },
  { label: 'Montando o bolo', detail: 'Camadas ganham volume, cremes e frutas vermelhas.' },
  { label: 'Finalização premium', detail: 'Brilho, detalhes e apresentação pronta para encantar.' },
]

function getSectionProgress(element) {
  if (!element) return 0
  const bounds = element.getBoundingClientRect()
  const viewport = window.innerHeight || 1
  const total = Math.max(1, bounds.height - viewport)
  const passed = Math.min(Math.max(0, -bounds.top), total)
  return passed / total
}

export function BakerStorySection() {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const update = () => {
      const nextProgress = getSectionProgress(sectionRef.current)
      setProgress(nextProgress)
      setActiveStep(Math.min(bakingSteps.length - 1, Math.floor(nextProgress * bakingSteps.length)))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useGSAP((context) => {
    gsap.from('.baker-step-card.is-active', { y: 16, opacity: 0, duration: 0.5, ease: 'power2.out' }, context.scope)
  }, { scope: sectionRef, dependencies: [activeStep] })

  return (
    <Container ref={sectionRef} maxWidth="lg" className="baker-story-section page-container">
      <Box className="baker-story-layout">
        <Box className="baker-story-stage-wrap">
          <Box className="baker-story-stage">
            <MotionDiv className="baker-chef" animate={{ y: `${-22 * progress}px` }} transition={{ duration: 0.3 }}>
              👩‍🍳
            </MotionDiv>
            <MotionDiv className="baker-cream-line" animate={{ scaleX: 0.2 + (0.8 * progress) }} transition={{ duration: 0.3 }} />
            <MotionDiv className="baker-cake" animate={{ scale: 0.88 + (0.18 * progress) }} transition={{ duration: 0.3 }}>
              <span role="img" aria-label="bolo">🎂</span>
            </MotionDiv>
          </Box>
        </Box>

        <Stack spacing={2} className="baker-steps-list">
          {bakingSteps.map((step, index) => (
            <Box key={step.label} className={`baker-step-card ${index === activeStep ? 'is-active' : ''}`}>
              <Typography variant="overline">Etapa {index + 1}</Typography>
              <Typography variant="h6">{step.label}</Typography>
              <Typography variant="body2">{step.detail}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Container>
  )
}
