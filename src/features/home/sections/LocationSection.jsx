import { Box, Container, Paper, Typography } from '@mui/material'
import { motion } from 'motion/react'
const MotionDiv = motion.div

const LOCATION_LINK = 'https://www.google.com/maps?q=Carliz+Doces,+São+Paulo&output=embed'

export function LocationSection() {
  return (
    <MotionDiv initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
      <Container maxWidth="lg" className="content-block section-alt-pink centered">
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
    </MotionDiv>
  )
}
