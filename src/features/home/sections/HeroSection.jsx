import { useEffect, useState } from 'react';
import { Box, Button, Container, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { motion } from 'motion/react';
import SwipeableViews from 'react-swipeable-views';

const MotionImg = motion.img;

export function HeroSection({ topShowcaseSlides }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = topShowcaseSlides.length;

  useEffect(() => {
    if (maxSteps <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % maxSteps);
    }, 6800);

    return () => window.clearInterval(timer);
  }, [maxSteps]);

  const goToStep = (direction) => {
    setActiveStep((current) => (current + direction + maxSteps) % maxSteps);
  };

  return (
    <Container maxWidth="xl" className="hero section-alt-pink page-container hero-inner">
      <Box className="top-carousel" sx={{ position: 'relative', overflow: 'hidden' }}>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={setActiveStep}
          enableMouseEvents
        >
          {topShowcaseSlides.map((slide, index) => (
            <Box
              key={slide.id}
              className={`mui-carousel-stage${index === activeStep ? ' is-active' : ''}`}
            >
              <article className="top-carousel-slide">
                <MotionImg
                  src={slide.imageUrl}
                  alt={slide.alt}
                  className={`hero-media-image${index === activeStep ? ' is-active' : ''}`}
                  initial={{ scale: 1.02, filter: 'saturate(0.9)' }}
                  animate={{
                    scale: index === activeStep ? 1.02 : 1,
                    filter: index === activeStep ? 'saturate(1)' : 'saturate(0.9)',
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                <Box className="hero-slide-glass-card">
                  <span className="hero-slide-shimmer" aria-hidden="true" />
                  <Typography component="p">{slide.tag || 'Feito à mão'}</Typography>
                  <Typography component={index === 0 ? 'h1' : 'h2'} className="hero-lamp-title">
                    {slide.title}
                  </Typography>
                  <Typography component="span">
                    Doces artesanais para transformar sua comemoração em uma lembrança deliciosa.
                  </Typography>
                  <Stack className="hero-quick-actions" direction="row">
                    <Button
                      component="a"
                      href="#doce-concierge"
                      variant="contained"
                      color="secondary"
                    >
                      Pedir ajuda da IA
                    </Button>
                    <Button component="a" href="#ovos-de-pascoa" variant="outlined" color="inherit">
                      Explorar cardápio
                    </Button>
                  </Stack>
                </Box>
              </article>
            </Box>
          ))}
        </SwipeableViews>
        {maxSteps > 1 && (
          <>
            <IconButton
              className="hero-carousel-arrow hero-carousel-arrow-prev"
              onClick={() => goToStep(-1)}
              aria-label="Destaque anterior"
            >
              ‹
            </IconButton>
            <IconButton
              className="hero-carousel-arrow hero-carousel-arrow-next"
              onClick={() => goToStep(1)}
              aria-label="Próximo destaque"
            >
              ›
            </IconButton>
            <Box className="hero-carousel-dots" aria-label="Escolher destaque">
              {topShowcaseSlides.map((slide, index) => (
                <button
                  type="button"
                  key={slide.id}
                  className={index === activeStep ? 'is-active' : ''}
                  onClick={() => setActiveStep(index)}
                  aria-label={`Mostrar destaque ${index + 1}`}
                  aria-current={index === activeStep ? 'true' : undefined}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}
