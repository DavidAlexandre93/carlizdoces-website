import { Box, Container, Paper, Typography } from '@mui/material'

export function AboutSection() {
  return (
    <Container id="quem-somos" maxWidth="lg" className="summary-band section-alt-gray centered animate__animated animate__fadeInUp page-container" style={{ '--animate-duration': '750ms' }}>
      <Paper elevation={4} sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5.5 }, borderRadius: 4 }}>
        <Box className="about-clown-dialogue">
          <img src="/images/tela-apresentacao/palhaco.png" alt="Palhaços da Carliz Doces" className="about-clown-image" />
          <Typography component="p" variant="body1" className="about-clown-message">
            “Somos a Carliz doces e realizamos doces a pronta entrega para festas, casamentos, aniversários e ovos de páscoa.”
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}
