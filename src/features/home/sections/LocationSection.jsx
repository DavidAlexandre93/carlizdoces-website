import { Box, Button, Paper, Typography } from '@mui/material'

export function LocationSection({ orderPreferences, setOrderPreferences, setDeliveryMethod }) {
  return (
    <section id="onde-estamos" className="content-block section-alt-pink centered animate__animated animate__fadeInUp" style={{ '--animate-duration': '700ms' }}>
      <Paper sx={{ p: 3, borderRadius: 3, maxWidth: 1080, mx: 'auto' }}>
        <Typography sx={{ mt: 1 }}>Atendimento em São Paulo - capital e região metropolitana.</Typography>
        <Typography>Entrega local: {orderPreferences.needsDelivery ? 'Sim' : 'Retirada'}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button sx={{ mt: 1 }} onClick={() => setOrderPreferences((c) => ({ ...c, needsDelivery: !c.needsDelivery }))}>Alternar entrega</Button>
          <Button sx={{ mt: 1 }} onClick={() => setDeliveryMethod((m) => (m === 'Retirada na loja' ? 'Entrega por motoboy' : 'Retirada na loja'))}>Alterar recebimento</Button>
        </Box>
      </Paper>
    </section>
  )
}
