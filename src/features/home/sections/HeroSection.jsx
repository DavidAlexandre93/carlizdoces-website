import { Button, Chip, Container, Stack, Typography } from '@mui/material'
import { Carousel, CarouselSlide } from 'material-ui-carousel'

export function HeroSection({ topShowcaseSlides }) {
  return (
    <Container maxWidth="xl" className="hero section-alt-pink animate__animated animate__fadeIn page-container hero-inner" style={{ '--animate-duration': '900ms' }}>
      <Carousel autoPlay interval={5000} indicators navButtonsAlwaysVisible className="top-carousel">
        {topShowcaseSlides.map((slide) => (
          <CarouselSlide key={slide.id}>
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
          </CarouselSlide>
        ))}
      </Carousel>
    </Container>
  )
}
