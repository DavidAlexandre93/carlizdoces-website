import { useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { Box, Button, Chip, Container, Stack, Typography, useTheme } from '@mui/material'

export function HeroSection({ topShowcaseSlides }) {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = topShowcaseSlides.length

  useEffect(() => {
    if (maxSteps <= 1) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps)
    }, 7000)

    return () => window.clearInterval(timer)
  }, [maxSteps])

  return (
    <Container maxWidth="xl" className="hero section-alt-pink animate__animated animate__fadeIn page-container hero-inner" style={{ '--animate-duration': '900ms' }}>
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
  )
}
