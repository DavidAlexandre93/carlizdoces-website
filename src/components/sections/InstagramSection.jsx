import { useRef } from 'react'
import { Box, Button, Container, Link, Paper, Typography } from '@mui/material'
import { motion } from 'motion/react'
import gsap, { useGSAP } from '../../lib/gsapCompat'

const MotionDiv = motion.div

export default function InstagramSection({ instagramPosts, instagramProfileLink }) {
  const sectionRef = useRef(null)

  useGSAP((context) => {
    gsap.from('.instagram-header', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, context.scope)
    gsap.from('.instagram-card', { y: 26, opacity: 0, duration: 0.75, stagger: 0.08, ease: 'power2.out' }, context.scope)
    gsap.to('.instagram-card img', { y: -10, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.12 }, context.scope)
  }, { scope: sectionRef, dependencies: [instagramPosts.length] })

  return (
    <MotionDiv
      ref={sectionRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Container maxWidth="xl" className="instagram-section section-alt-pink page-container">
      <header className="instagram-header">
        <Typography component="p" variant="body1">Confira nosso perfil e acompanhe as novidades.</Typography>
        <Button variant="contained" color="secondary" href={instagramProfileLink} target="_blank" rel="noreferrer" sx={{ mt: 1 }}>
          Seguir no Instagram
        </Button>
      </header>

      <Box className="instagram-grid">
        {instagramPosts.map((post) => (
          <MotionDiv key={post.id} initial={{ opacity: 0, y: 24, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, ease: 'easeOut' }}>
            <Paper component="article" elevation={3} className="instagram-card">
            <Link href={instagramProfileLink} target="_blank" rel="noreferrer" aria-label="Abrir Instagram da Carliz Doces" underline="none">
              <img src={post.imageUrl} alt={post.alt} loading="lazy" />
            </Link>
            </Paper>
          </MotionDiv>
        ))}
      </Box>
      </Container>
    </MotionDiv>
  )
}
