import { useEffect, useRef, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { Box, Button, Chip, Container, Stack, Typography, useTheme } from '@mui/material'
import gsap from '../../../lib/gsapCompat'
import { useGSAP } from '../../../lib/gsapCompat'

gsap.registerPlugin(useGSAP)
import { motion } from 'motion/react'
import SwipeableViews from 'react-swipeable-views'
import { Box, Button, Chip, Container, Stack, useTheme } from '@mui/material'
import gsap, { useGSAP } from '../../../lib/gsapCompat'
import { TypingEffectText } from '../../../components/ui/TypingEffectText'

const MotionDiv = motion.div

gsap.registerPlugin(useGSAP)

export function HeroSection({ topShowcaseSlides }) {
  const heroRef = useRef(null)
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = topShowcaseSlides.length

  useGSAP((context) => {
    const introTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

    introTimeline
      .from('.hero-lamp-title', { y: 22, opacity: 0, duration: 0.7 }, context.scope)
      .from('.hero-quick-actions > *', { y: 14, opacity: 0, duration: 0.5, stagger: 0.1 }, context.scope)

    gsap.to('.mui-carousel-stage.is-active img', {
      scale: 1.04,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, context.scope)
  }, { scope: heroRef, dependencies: [activeStep] })

  useEffect(() => {
    if (maxSteps <= 1) return undefined

    const timer = window.setInterval(() => {
      setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps)
    }, 7000)

    return () => window.clearInterval(timer)
  }, [maxSteps])

  return (
    <Container ref={heroRef} maxWidth="xl" className="hero section-alt-pink animate__animated animate__fadeIn page-container hero-inner" style={{ '--animate-duration': '900ms' }}>
      <Box className="top-carousel">
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={setActiveStep}
          enableMouseEvents
        >
          {topShowcaseSlides.map((slide, index) => (
            <Box key={slide.id} className={`mui-carousel-stage${index === activeStep ? ' is-active' : ''}`}>
              <article className="top-carousel-slide">
                <img src={slide.imageUrl} alt={slide.alt} />
                <div>
                  <Chip label={slide.tag} color="secondary" size="small" />
                  <Typography component="h1" className="hero-lamp-title">{slide.title}</Typography>
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
    <MotionDiv initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
      <Container ref={heroRef} maxWidth="xl" className="hero section-alt-pink animate__animated animate__fadeIn page-container hero-inner" style={{ '--animate-duration': '900ms' }}>
        <Box className="top-carousel">
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={setActiveStep}
            enableMouseEvents
          >
            {topShowcaseSlides.map((slide, index) => (
              <Box key={slide.id} className={`mui-carousel-stage${index === activeStep ? ' is-active' : ''}`}>
                <article className="top-carousel-slide">
                  <img src={slide.imageUrl} alt={slide.alt} />
                  <div>
                    <Chip label={slide.tag} color="secondary" size="small" />
                    <TypingEffectText
                      component="h1"
                      className="hero-lamp-title"
                      phrases={index === activeStep
                        ? [slide.title, 'Doces artesanais para momentos inesquecíveis', 'Faça sua encomenda com carinho 🍬']
                        : [slide.title]}
                      typingSpeed={46}
                      deletingSpeed={28}
                      pauseMs={2200}
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
    </MotionDiv>
  )
}
