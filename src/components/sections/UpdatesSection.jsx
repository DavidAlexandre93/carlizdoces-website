import { Box, Button, Chip, Container, Paper, Stack, Typography } from '@mui/material'

const typeStyles = {
  promocao: { label: 'Promoção', color: 'secondary' },
  lancamento: { label: 'Lançamento', color: 'success' },
  comunicado: { label: 'Comunicado', color: 'info' },
  sorteio: { label: 'Sorteio', color: 'error' },
  geral: { label: 'Aviso', color: 'warning' },
}

export default function UpdatesSection({ updates, announcementChannels }) {
  return (
    <Container id="novidades" maxWidth="xl" className="updates-section section-alt-pink animate__animated animate__fadeInUp page-container" style={{ '--animate-duration': '700ms' }}>
      <Box className="updates-grid">
        {updates.map((item) => {
          const type = typeStyles[item.type] ?? typeStyles.geral

          return (
            <Paper key={item.id} component="article" elevation={3} className="updates-card">
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ gap: 1.5, mb: 1 }}>
                <Chip label={type.label} color={type.color} size="small" />
                <Typography component="span" variant="caption" className="updates-date">{item.dateLabel}</Typography>
              </Stack>

              <Typography component="h3" variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>

              {item.imageUrl ? (
                <Box className="updates-media">
                  <img src={item.imageUrl} alt={item.imageAlt || item.title} loading="lazy" />
                  {item.mediaDescription ? (
                    <Typography component="p" variant="caption" className="updates-media-text">
                      {item.mediaDescription}
                    </Typography>
                  ) : null}
                </Box>
              ) : null}

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
  )
}
