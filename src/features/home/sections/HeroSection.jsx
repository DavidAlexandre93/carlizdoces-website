import { useEffect, useRef, useState } from 'react'
import { Box, Button, Chip, Container, Stack, useTheme } from '@mui/material'
import { motion } from 'motion/react'
import SwipeableViews from 'react-swipeable-views'
import gsap, { useGSAP } from '../../../lib/gsapCompat'
import { TypingEffectText } from '../../../components/ui/TypingEffectText'

const MotionBox = motion(Box)
const floatEmojis = ['🍬', '🍭', '🍫', '🧁', '✨', '🍓']

export function HeroSection({ topShowcaseSlides }) {
  const heroRef = useRef(null)
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = topShowcaseSlides.length

  useGSAP((context) => {
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hero-slide-content', { y: 24, opacity: 0, duration: 0.65 }, context.scope)
      .from('.hero-quick-actions > *', { y: 16, opacity: 0, duration: 0.45, stagger: 0.1 }, context.scope)

    gsap.to('.hero-media-image.is-active', {
      scale: 1.06,
      duration: 4.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    }, context.scope)

    gsap.to('.hero-float-item', {
      y: -14,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.12,
    }, context.scope)
  }, { scope: heroRef, dependencies: [activeStep] })

  useEffect(() => {
    if (maxSteps <= 1) return undefined
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % maxSteps)
    }, 6800)

    return () => window.clearInterval(timer)
  }, [maxSteps])

  return (
    <Container ref={heroRef} maxWidth="xl" className="hero section-alt-pink page-container hero-inner">
      <Box className="top-carousel" sx={{ position: 'relative', overflow: 'hidden' }}>
        {floatEmojis.map((emoji, index) => (
          <MotionBox
            key={`${emoji}-${index}`}
            className="hero-float-item"
            sx={{
              position: 'absolute',
              zIndex: 2,
              top: `${8 + ((index * 12) % 76)}%`,
              left: `${3 + ((index * 17) % 90)}%`,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              pointerEvents: 'none',
            }}
            animate={{ opacity: [0.2, 0.95, 0.2], rotate: [-8, 8, -8] }}
            transition={{ duration: 3 + (index * 0.22), repeat: Infinity, ease: 'easeInOut' }}
          >
            {emoji}
          </MotionBox>
        ))}

        <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={activeStep} onChangeIndex={setActiveStep} enableMouseEvents>
          {topShowcaseSlides.map((slide, index) => (
            <Box key={slide.id} className={`mui-carousel-stage${index === activeStep ? ' is-active' : ''}`}>
              <article className="top-carousel-slide">
                <motion.img
                  src={slide.imageUrl}
                  alt={slide.alt}
                  className={`hero-media-image${index === activeStep ? ' is-active' : ''}`}
                  initial={{ scale: 1.02, filter: 'saturate(0.9)' }}
                  animate={{ scale: index === activeStep ? 1.02 : 1, filter: index === activeStep ? 'saturate(1)' : 'saturate(0.9)' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                <div className="hero-slide-content">
                  <Chip label={slide.tag} color="secondary" size="small" />
                  <TypingEffectText
                    component="h1"
                    className="hero-lamp-title"
                    phrases={
                      index === activeStep
                        ? [slide.title, 'Doces artesanais com toque de cinema', 'Pedidos personalizados com visual realista ✨']
                        : [slide.title]
                    }
                    typingSpeed={46}
                    deletingSpeed={30}
                    pauseMs={1800}
                    loop={index === activeStep}
                  />
                  <Stack direction="row" spacing={1.5} className="hero-quick-actions">
                    <Button variant="contained" color="secondary" component="a" href="#realizar-pedido">
                      Fazer pedido
                    </Button>
                    <Button variant="contained" color="inherit" component="a" href="#ovos-de-pascoa" sx={{ color: '#6a1b9a' }}>
                      Ver catálogo
                    </Button>
                  </Stack>
                </div>
              </article>
            </Box>
          ))}
        </SwipeableViews>
      </Box>
    </Container>
  )
}
