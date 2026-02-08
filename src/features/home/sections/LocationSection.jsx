import { Container, Paper, Typography } from '@mui/material'

export function LocationSection({ orderPreferences }) {
  return (
    <Container id="onde-estamos" maxWidth="lg" className="content-block section-alt-pink centered animate__animated animate__fadeInUp" style={{ '--animate-duration': '700ms' }}>
      <Paper sx={{ p: 3, borderRadius: 3, maxWidth: 1080, mx: 'auto' }}>
        <Typography sx={{ mt: 1 }}>Atendimento em São Paulo - capital e região metropolitana.</Typography>
        <Typography>Estr. Louis Pasteur-Embu das Artes-São Paulo, 06835-700</Typography>
        <Typography>Entrega local: {orderPreferences.needsDelivery ? 'Sim' : 'Retirada'}</Typography>
      </Paper>
    </Container>
  )
}
