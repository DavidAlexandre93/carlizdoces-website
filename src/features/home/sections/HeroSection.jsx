import { useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import { Box, Button, Chip, Container, IconButton, MobileStepper, Stack, Typography, useTheme } from '@mui/material'

export function HeroSection({ topShowcaseSlides }) {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const maxSteps = topShowcaseSlides.length

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, maxSteps - 1))
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0))
  }

  return (
    <Container maxWidth="xl" className="hero section-alt-pink animate__animated animate__fadeIn page-container hero-inner" style={{ '--animate-duration': '900ms' }}>
      <Box className="top-carousel">
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={setActiveStep}
          enableMouseEvents
        >
          {topShowcaseSlides.map((slide) => (
            <Box key={slide.id} className="mui-carousel-stage is-active">
              <article className="top-carousel-slide">
                <img src={slide.imageUrl} alt={slide.alt} />
                <div>
                  <Chip label={slide.tag} color="secondary" size="small" />
                  <Typography component="h1" className="hero-lamp-title">{slide.title}</Typography>
                  <Typography component="span">{slide.description}</Typography>
                  <Stack direction="row" spacing={1.5} className="hero-quick-actions">
                    <Button variant="contained" color="secondary" component="a" href="#realizar-pedido">
                      Fazer pedido
                    </Button>
                    <Button variant="contained" color="inherit" component="a" href="#ovos-de-pascoa">
                      Ver catálogo
                    </Button>
                  </Stack>
                </div>
              </article>
            </Box>
          ))}
        </SwipeableViews>

        <MobileStepper
          steps={maxSteps}
          position="static"
          className="mui-swipe-stepper"
          activeStep={activeStep}
          nextButton={
            <IconButton size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1} aria-label="Próximo banner">
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
          }
          backButton={
            <IconButton size="small" onClick={handleBack} disabled={activeStep === 0} aria-label="Banner anterior">
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
          }
        />
      </Box>
    </Container>
  )
}
