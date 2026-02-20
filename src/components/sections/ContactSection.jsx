import { Box, Button, Chip, Container, Paper, TextField, Typography } from '@mui/material'

export default function ContactSection({
  contactForm,
  onChange,
  onSubmit,
  onEmailSubmit,
  isSendingContactEmail,
  contactTipOpen,
  onToggleTip,
}) {
  const isSubmitDisabled = !contactForm.name.trim() || !contactForm.message.trim()

  return (
    <Container maxWidth="lg" className="contact-hero section-alt-gray animate__animated animate__fadeInUp" style={{ '--animate-duration': '700ms' }}>
      <Paper
        component="form"
        onSubmit={onSubmit}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 5,
          maxWidth: 860,
          width: '100%',
          mx: 'auto',
          backdropFilter: 'blur(10px)',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.97), rgba(255,240,248,0.93))',
          boxShadow: '0 20px 40px rgba(91, 23, 55, 0.22)',
          border: '1px solid rgba(171, 120, 197, 0.3)',
        }}
      >
        <Box sx={{ mb: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
          <Chip
            label="Atendimento personalizado"
            size="small"
            sx={{
              bgcolor: 'rgba(173, 20, 87, 0.12)',
              color: '#6b1641',
              fontWeight: 600,
            }}
          />
          <Button size="small" variant="outlined" onClick={onToggleTip}>
            {contactTipOpen ? 'Ocultar horários' : 'Horários de atendimento'}
          </Button>
        </Box>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'rgba(58, 23, 41, 0.86)' }}>
          Conte pra gente o que você está planejando. Em um clique, sua mensagem vai pronta para o WhatsApp.
        </Typography>
        <Box sx={{ display: 'grid', gap: 1.75, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField
            required
            label="Nome"
            placeholder="Seu nome"
            variant="outlined"
            value={contactForm.name}
            onChange={(e) => onChange('name', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Email"
            placeholder="voce@email.com"
            type="email"
            variant="outlined"
            value={contactForm.email}
            onChange={(e) => onChange('email', e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            required
            label="Mensagem"
            placeholder="Ex.: Quero um orçamento para aniversário com 40 pessoas..."
            value={contactForm.message}
            onChange={(e) => onChange('message', e.target.value)}
            multiline
            minRows={4}
            sx={{ gridColumn: '1 / -1' }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
        <Box sx={{ mt: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1.25, alignItems: 'center' }}>
          <Button type="submit" variant="contained" disabled={isSubmitDisabled} sx={{ px: 3, py: 1.15, fontWeight: 700 }}>
            Enviar mensagem no WhatsApp
          </Button>
          <Button type="button" variant="contained" color="secondary" disabled={isSubmitDisabled || isSendingContactEmail} onClick={onEmailSubmit} sx={{ px: 3, py: 1.15, fontWeight: 700 }}>
            {isSendingContactEmail ? 'Enviando...' : 'Enviar mensagem no e-mail'}
          </Button>
        </Box>
        {contactTipOpen ? (
          <Typography sx={{ mt: 1.5, color: 'rgba(58, 23, 41, 0.86)' }} variant="body2">
            Atendimento no WhatsApp com resposta média em até 20 minutos no horário comercial.
          </Typography>
        ) : null}
      </Paper>
    </Container>
  )
}
