import { Container, Typography } from '@mui/material'

export function AboutSection() {
  return (
    <Container id="quem-somos" maxWidth="lg" className="summary-band section-alt-gray centered animate__animated animate__fadeInUp page-container" style={{ '--animate-duration': '750ms' }}>
      <Typography component="p" variant="body1" className="about-message-inline">
        “Somos a Carliz doces e realizamos doces a pronta entrega para festas, casamentos, aniversários e ovos de páscoa.”
      </Typography>
    </Container>
  )
}
