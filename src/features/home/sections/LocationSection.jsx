import { Box, Container, Paper, Typography } from '@mui/material'

const LOCATION_LINK = 'https://share.google/7x6y8b7zJobYbc5b1'

export function LocationSection() {
  return (
    <Container maxWidth="lg" className="content-block section-alt-pink centered animate__animated animate__fadeInUp" style={{ '--animate-duration': '700ms' }}>
      <Paper sx={{ p: 3, borderRadius: 3, maxWidth: 1080, mx: 'auto' }}>
        <Box
          component="iframe"
          title="Localização da Carliz Doces"
          src={LOCATION_LINK}
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
