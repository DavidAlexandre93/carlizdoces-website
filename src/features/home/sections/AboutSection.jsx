import { Box, Container, Typography } from '@mui/material'
import { motion } from 'motion/react'
const MotionDiv = motion.div

export function AboutSection() {
  return (
    <MotionDiv initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.75, ease: 'easeOut' }}>
      <Container maxWidth="lg" className="summary-band section-alt-gray centered page-container">
        <Box className="about-clown-dialog">
          <Box component="img" src="/images/tela-apresentacao/palhaco.png" alt="Palhaço da Carliz Doces" className="about-clown-image" />
          <Box className="about-message-bubble">
            <Typography component="p" variant="body1" className="about-message-inline">
              “Siiim, siiim, respeitável púúúúblico! 🎪🤡✨
              Nóóós somos a Carliz Doces e fazemos docinhos prontinhos para entrega, para deixar sua festa um show: festas, casamentos, aniversários e até ovos de Páscoa… ô coisa boooa! 🍬🍫🥚🎉”
            </Typography>
          </Box>
        </Box>
      </Container>
    </MotionDiv>
  )
}
