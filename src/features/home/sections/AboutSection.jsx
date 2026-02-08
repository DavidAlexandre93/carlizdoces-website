import { Box, Container, Typography } from '@mui/material'

export function AboutSection() {
  return (
    <Container id="quem-somos" maxWidth="lg" className="summary-band section-alt-gray centered animate__animated animate__fadeInUp page-container" style={{ '--animate-duration': '750ms' }}>
      <Box className="about-clown-dialog">
        <Box component="img" src="/images/tela-apresentacao/palhaco.png" alt="Palhaço da Carliz Doces" className="about-clown-image" />
        <Box className="about-message-bubble">
          <Typography component="p" variant="body1" className="about-message-inline">
            “Somos a Carliz doces e realizamos doces a pronta entrega para festas, casamentos, aniversários e ovos de páscoa.”
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}
