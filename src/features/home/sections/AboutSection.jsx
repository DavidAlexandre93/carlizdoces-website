import { useRef } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { motion } from 'motion/react'
import gsap, { useGSAP } from '../../../lib/gsapCompat'
import { TypingEffectText } from '../../../components/ui/TypingEffectText'

const MotionBox = motion(Box)

export function AboutSection() {
  const aboutRef = useRef(null)

  useGSAP((context) => {
    gsap.from('.about-clown-image', { x: -38, opacity: 0, duration: 0.8, ease: 'power2.out' }, context.scope)
    gsap.from('.about-message-bubble', { y: 28, opacity: 0, duration: 0.78, ease: 'power3.out' }, context.scope)
    gsap.to('.about-shine', { y: -10, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.15 }, context.scope)
  }, { scope: aboutRef })

  return (
    <Container ref={aboutRef} maxWidth="lg" className="summary-band section-alt-gray centered page-container">
      <Box className="about-clown-dialog" sx={{ position: 'relative' }}>
        <MotionBox
          component="img"
          src="/images/tela-apresentacao/palhaco.png"
          alt="Palhaço da Carliz Doces"
          className="about-clown-image"
          loading="lazy"
          width="480"
          height="480"
          whileHover={{ rotate: [-1, 1, -1], scale: 1.03 }}
          transition={{ duration: 0.7 }}
        />

        <Box className="about-message-bubble">
          <TypingEffectText
            component="h2"
            className="about-typing-title"
            phrases={['Doces com alma de espetáculo', 'Realismo, brilho e sabor em cada detalhe']}
            typingSpeed={46}
            deletingSpeed={29}
            pauseMs={2000}
          />
          <Typography component="p" variant="body1" className="about-message-inline">
            “Siiim, siiim, respeitável púúúúblico! 🎪🤡✨ Nóóós somos a Carliz Doces e fazemos docinhos prontinhos para entrega,
            para deixar sua festa um show: festas, casamentos, aniversários e até ovos de Páscoa… ô coisa boooa! 🍬🍫🥚🎉”
          </Typography>
        </Box>

        <MotionBox className="about-shine" sx={{ position: 'absolute', right: { xs: 12, sm: 28 }, top: -12, fontSize: '1.5rem' }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.4, repeat: Infinity }}>
          ✨
        </MotionBox>
        <MotionBox className="about-shine" sx={{ position: 'absolute', left: { xs: 4, sm: 16 }, bottom: -6, fontSize: '1.3rem' }} animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 2.7, repeat: Infinity, delay: 0.2 }}>
          ⭐
        </MotionBox>
      </Box>
    </Container>
  )
}
