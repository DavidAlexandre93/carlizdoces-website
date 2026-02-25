import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Chip, Container, Stack, useTheme } from '@mui/material'
import { motion } from 'motion/react'
import SwipeableViews from 'react-swipeable-views'
import gsap, { useGSAP } from '../../../lib/gsapCompat'
import { TypingEffectText } from '../../../components/ui/TypingEffectText'

const MotionImg = motion.img
const MotionSpan = motion.span

export function HeroSection({ topShowcaseSlides }) {
  const heroRef = useRef(null)
  const heroCardRef = useRef(null)
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = topShowcaseSlides.length
  const progressWidth = useMemo(() => `${((activeStep + 1) / Math.max(maxSteps, 1)) * 100}%`, [activeStep, maxSteps])

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

    gsap.to('.hero-quick-actions .MuiButton-root', {
      y: -4,
      duration: 1.6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      stagger: 0.2,
    }, context.scope)
  }, { scope: heroRef, dependencies: [activeStep] })

  useEffect(() => {
    const wrapper = heroRef.current
    const card = heroCardRef.current
    if (!wrapper || !card) return undefined

    const handlePointerMove = (event) => {
      const rect = wrapper.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height

      wrapper.style.setProperty('--hero-pointer-x', String(px.toFixed(3)))
      wrapper.style.setProperty('--hero-pointer-y', String(py.toFixed(3)))

      gsap.to('.hero-media-image.is-active', {
        x: (px - 0.5) * 14,
        y: (py - 0.5) * 10,
        duration: 0.35,
        ease: 'power2.out',
      }, wrapper)

      gsap.to(card, {
        x: (px - 0.5) * -8,
        y: (py - 0.5) * -6,
        duration: 0.35,
        ease: 'power2.out',
      }, wrapper)
    }

    const resetCard = () => {
      gsap.to('.hero-media-image.is-active', { x: 0, y: 0, duration: 0.4, ease: 'power2.out' }, wrapper)
      gsap.to(card, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' }, wrapper)
    }

    wrapper.addEventListener('pointermove', handlePointerMove)
    wrapper.addEventListener('pointerleave', resetCard)

    return () => {
      wrapper.removeEventListener('pointermove', handlePointerMove)
      wrapper.removeEventListener('pointerleave', resetCard)
    }
  }, [activeStep])

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
                <div
                  ref={(node) => {
                    if (index === activeStep) {
                      heroCardRef.current = node
                    }
                  }}
                  className="hero-slide-content hero-slide-glass-card"
                >
                  <Box className="hero-slide-shimmer" />
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

        <Box className="hero-progress-track" aria-hidden="true">
          <MotionSpan
            className="hero-progress-value"
            animate={{ width: progressWidth }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        </Box>
      </Box>
    </Container>
  )
}
