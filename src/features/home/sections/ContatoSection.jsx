import { useRef } from 'react'
import { Box, Button, Chip, Container, Paper, TextField, Typography } from '@mui/material'
import { motion } from 'motion/react'
import gsap, { useGSAP } from '../../../lib/gsapCompat'

const MotionDiv = motion.div

export default function ContatoSection({
  contactForm,
  onChange,
  onSubmit,
  onEmailSubmit,
  isSendingContactEmail,
  contactTipOpen,
  onToggleTip,
}) {
  const sectionRef = useRef(null)
  const isSubmitDisabled = !contactForm.name.trim() || !contactForm.message.trim()

  useGSAP((context) => {
    gsap.from('.contact-chip', { x: -18, opacity: 0, duration: 0.55, ease: 'power2.out' }, context.scope)
    gsap.from('.contact-input', { y: 18, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out' }, context.scope)
    gsap.to('.contact-form-paper', { y: -6, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' }, context.scope)
  }, { scope: sectionRef, dependencies: [contactTipOpen] })

  return (
    <MotionDiv ref={sectionRef} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
      <Container maxWidth="lg" className="contact-hero section-alt-gray">
      <Paper
        component="form"
        onSubmit={onSubmit}
        className="contact-form-paper"
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
            className="contact-chip"
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
            className="contact-input"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Email"
            placeholder="voce@exemplo.com"
            type="email"
            variant="outlined"
            value={contactForm.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="contact-input"
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
            className="contact-input"
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
    </MotionDiv>
  )
}
