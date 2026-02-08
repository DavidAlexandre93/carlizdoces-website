import { Box, Button, Chip, Container, Paper, Stack, Typography } from '@mui/material'

const typeStyles = {
  microinteracoes: { label: 'Motion', color: 'secondary' },
  scroll: { label: 'GSAP', color: 'success' },
  ilustracoes: { label: 'Lottie', color: 'info' },
  reveal: { label: 'AOS / animate.css', color: 'warning' },
}

export default function UpdatesSection({ updates, announcementChannels }) {
  return (
    <section id="novidades" className="updates-section section-alt-pink animate__animated animate__fadeInUp" style={{ '--animate-duration': '700ms' }}>
      <Container maxWidth="xl" className="page-container">
        <Box className="updates-grid">
          {updates.map((item) => {
            const type = typeStyles[item.type] ?? typeStyles.reveal

            return (
              <Paper key={item.id} component="article" elevation={3} className="updates-card">
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 1.5, mb: 1 }}>
                  <Chip label={type.label} color={type.color} size="small" />
                  <Typography component="span" variant="caption" className="updates-date">{item.dateLabel}</Typography>
                </Stack>

                <Typography component="h3" variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                <Typography component="p" variant="body2" className="updates-description">{item.description}</Typography>

                <Typography component="p" variant="subtitle2" className="updates-status">{item.status}</Typography>
              </Paper>
            )
          })}
        </Box>

        <Paper elevation={0} className="updates-cta">
          <Typography component="h3" variant="h6">Receba as divulgações em primeira mão</Typography>
          <Typography component="p" variant="body2">
            Salve os canais abaixo para não perder nenhum aviso de campanha, regulamento de sorteio ou publicação de ganhadores.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 2, flexWrap: 'wrap' }}>
            {announcementChannels.map((channel) => (
              <Button
                key={channel.id}
                variant={channel.variant}
                color="secondary"
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noreferrer' : undefined}
              >
                {channel.label}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Container>
    </section>
  )
}
