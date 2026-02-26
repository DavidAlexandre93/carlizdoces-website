import { useEffect, useState } from 'react'
import { Box, Container, useTheme } from '@mui/material'
import { motion } from 'motion/react'
import SwipeableViews from 'react-swipeable-views'

const MotionImg = motion.img

export function HeroSection({ topShowcaseSlides }) {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = topShowcaseSlides.length

  useEffect(() => {
    if (maxSteps <= 1) return undefined
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % maxSteps)
    }, 6800)

    return () => window.clearInterval(timer)
  }, [maxSteps])

  return (
    <Container maxWidth="xl" className="hero section-alt-pink page-container hero-inner">
      <Box className="top-carousel" sx={{ position: 'relative', overflow: 'hidden' }}>
        <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={activeStep} onChangeIndex={setActiveStep} enableMouseEvents>
          {topShowcaseSlides.map((slide, index) => (
            <Box key={slide.id} className={`mui-carousel-stage${index === activeStep ? ' is-active' : ''}`}>
              <article className="top-carousel-slide">
                <MotionImg
                  src={slide.imageUrl}
                  alt={slide.alt}
                  className={`hero-media-image${index === activeStep ? ' is-active' : ''}`}
                  initial={{ scale: 1.02, filter: 'saturate(0.9)' }}
                  animate={{ scale: index === activeStep ? 1.02 : 1, filter: index === activeStep ? 'saturate(1)' : 'saturate(0.9)' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </article>
            </Box>
          ))}
        </SwipeableViews>
      </Box>
    </Container>
  )
}
