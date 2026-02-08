import { Container, Paper, Typography } from '@mui/material'

export function AboutSection() {
  return (
    <section id="quem-somos" className="summary-band section-alt-gray centered animate__animated animate__fadeInUp" style={{ '--animate-duration': '750ms' }}>
      <Container maxWidth="lg" className="page-container">
        <Paper elevation={4} sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5.5 }, borderRadius: 4 }}>
          <Typography component="h2" variant="h4">QUEM SOMOS</Typography>
          <Typography component="p" variant="body1">
            Somos a Carliz doces e realizamos doces a pronta entrega para festas, casamentos, aniversários e ovos de páscoa.
          </Typography>
        </Paper>
      </Container>
    </section>
  )
}
