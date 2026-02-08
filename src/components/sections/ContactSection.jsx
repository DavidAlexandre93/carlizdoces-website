import { Box, Button, Paper, TextField, Typography } from '@mui/material'

export default function ContactSection({ contactForm, onChange, contactTipOpen, onToggleTip }) {
  return (
    <section id="contato" className="contact-hero">
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, maxWidth: 1080, mx: 'auto' }}>
        <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
          Contato
        </Typography>
        <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField label="Nome" value={contactForm.name} onChange={(e) => onChange('name', e.target.value)} />
          <TextField label="Email" value={contactForm.email} onChange={(e) => onChange('email', e.target.value)} />
          <TextField
            label="Mensagem"
            value={contactForm.message}
            onChange={(e) => onChange('message', e.target.value)}
            multiline
            minRows={3}
            sx={{ gridColumn: '1 / -1' }}
          />
        </Box>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={onToggleTip}>
          {contactTipOpen ? 'Ocultar horários' : 'Horários de atendimento'}
        </Button>
        {contactTipOpen ? (
          <Typography sx={{ mt: 1.5 }} variant="body2">
            Atendimento no WhatsApp com resposta média em até 20 minutos no horário comercial.
          </Typography>
        ) : null}
      </Paper>
    </section>
  )
}
