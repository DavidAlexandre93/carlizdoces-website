import { useRef } from 'react'
import { motion } from 'motion/react'
import { Box, Container, Typography } from '@mui/material'
import gsap, { useGSAP } from '../../../lib/gsapCompat'
import { TypingEffectText } from '../../../components/ui/TypingEffectText'

const MotionDiv = motion.div

gsap.registerPlugin(useGSAP)

export function AboutSection() {
  const aboutRef = useRef(null)

  useGSAP((context) => {
    gsap.from('.about-clown-image', {
      x: -36,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, context.scope)

    gsap.from('.about-message-bubble', {
      y: 26,
      opacity: 0,
      duration: 0.75,
      ease: 'power2.out',
    }, context.scope)
  }, { scope: aboutRef })

  return (
    <MotionDiv initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.75, ease: 'easeOut' }}>
      <Container ref={aboutRef} maxWidth="lg" className="summary-band section-alt-gray centered animate__animated animate__fadeInUp page-container" style={{ '--animate-duration': '750ms' }}>
        <Box className="about-clown-dialog">
          <Box component="img" src="/images/tela-apresentacao/palhaco.png" alt="Palhaço da Carliz Doces" className="about-clown-image" />
          <Box className="about-message-bubble">
            <TypingEffectText
              component="h2"
              className="about-typing-title"
              phrases={[
                'Doces com alma de espetáculo',
                'Carinho, sabor e alegria em cada detalhe',
              ]}
              typingSpeed={48}
              deletingSpeed={30}
              pauseMs={1900}
            />
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
