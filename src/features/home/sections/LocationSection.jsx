import { Box, Container, Paper, Typography } from '@mui/material'

export function LocationSection() {
  return (
    <Container id="onde-estamos" maxWidth="lg" className="content-block section-alt-pink centered animate__animated animate__fadeInUp" style={{ '--animate-duration': '700ms' }}>
      <Paper sx={{ p: 3, borderRadius: 3, maxWidth: 1080, mx: 'auto' }}>
        <Box
          component="iframe"
          title="Localização da Carliz Doces"
          src="https://www.google.com/maps?q=Estr.%20Louis%20Pasteur%2C%20Embu%20das%20Artes%2C%20S%C3%A3o%20Paulo%2C%2006835-700&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sx={{
            width: '100%',
            height: { xs: 260, sm: 340 },
            border: 0,
            borderRadius: 2,
          }}
          allowFullScreen
        />

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: 'center',
            opacity: 0.7,
          }}
        >
          Atendimento em São Paulo-capital e região metropolitana.
        </Typography>
      </Paper>
    </Container>
  )
}
