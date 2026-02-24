import { useRef } from 'react'
import { Box, Container, Typography } from '@mui/material'
import gsap from '../../../lib/gsapCompat'
import { useGSAP } from '../../../lib/gsapCompat'

gsap.registerPlugin(useGSAP)

export function AboutSection() {
  const aboutRef = useRef(null)

  useGSAP((context) => {
    gsap.from('.about-clown-image', {
      x: -36,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-clown-dialog',
        start: 'top 82%',
      },
    }, context.scope)

    gsap.from('.about-message-bubble', {
      y: 26,
      opacity: 0,
      duration: 0.75,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-clown-dialog',
        start: 'top 78%',
      },
    }, context.scope)
  }, { scope: aboutRef })

  return (
    <Container ref={aboutRef} maxWidth="lg" className="summary-band section-alt-gray centered animate__animated animate__fadeInUp page-container" style={{ '--animate-duration': '750ms' }}>
      <Box className="about-clown-dialog">
        <Box component="img" src="/images/tela-apresentacao/palhaco.png" alt="Palhaço da Carliz Doces" className="about-clown-image" />
        <Box className="about-message-bubble">
          <Typography component="p" variant="body1" className="about-message-inline">
            “Siiim, siiim, respeitável púúúúblico! 🎪🤡✨
            Nóóós somos a Carliz Doces e fazemos docinhos prontinhos para entrega, para deixar sua festa um show: festas, casamentos, aniversários e até ovos de Páscoa… ô coisa boooa! 🍬🍫🥚🎉”
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}
