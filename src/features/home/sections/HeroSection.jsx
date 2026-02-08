import { Button, ButtonGroup, Chip, Container, Typography } from '@mui/material'
import { Carousel, CarouselSlide } from 'material-ui-carousel'

export function HeroSection({ topShowcaseSlides }) {
  return (
    <section className="hero section-alt-pink animate__animated animate__fadeIn" style={{ '--animate-duration': '900ms' }}>
      <Container maxWidth="xl" className="page-container hero-inner">
        <Carousel autoPlay interval={5000} indicators navButtonsAlwaysVisible className="top-carousel">
          {topShowcaseSlides.map((slide) => (
            <CarouselSlide key={slide.id}>
              <article className="top-carousel-slide">
                <img src={slide.imageUrl} alt={slide.alt} />
                <div>
                  <Chip label={slide.tag} color="secondary" size="small" />
                  <Typography component="h1">{slide.title}</Typography>
                  <Typography component="span">{slide.description}</Typography>
                  <ButtonGroup variant="contained" color="secondary" className="hero-quick-actions">
                    <Button component="a" href="#realizar-pedido">Fazer pedido</Button>
                    <Button component="a" href="#ovos-de-pascoa" color="inherit">Ver catálogo</Button>
                  </ButtonGroup>
                </div>
              </article>
            </CarouselSlide>
          ))}
        </Carousel>
      </Container>
    </section>
  )
}
