import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'motion/react'
import { Alert, Box, Container, Link, Paper, Typography } from '@mui/material'
import gsap, { useGSAP } from '../../lib/gsapCompat'

const MotionDiv = motion.div

const DISQUS_SHORTNAME = import.meta.env.VITE_DISQUS_SHORTNAME || 'zeroreprovacao'

export default function TestimonialsSection({ testimonials }) {
  const sectionRef = useRef(null)
  const disqusConfig = useMemo(() => {
    const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#depoimentos` : 'https://carlizdoces.com/#depoimentos'

    return {
      url: pageUrl,
      identifier: 'carliz-clientes-depoimentos',
      title: 'Comentários da comunidade - Carliz Doces',
      language: 'pt_BR',
    }
  }, [])

  useGSAP((context) => {
    gsap.from('.testimonial-alert', { x: -18, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, context.scope)
    gsap.from('.testimonials-disqus', { y: 18, opacity: 0, duration: 0.7, delay: 0.15, ease: 'power3.out' }, context.scope)
  }, { scope: sectionRef, dependencies: [testimonials.length] })

  useEffect(() => {
    if (!DISQUS_SHORTNAME) return undefined

    window.disqus_config = function disqusThreadConfig() {
      this.page.url = disqusConfig.url
      this.page.identifier = disqusConfig.identifier
      this.page.title = disqusConfig.title
      this.language = disqusConfig.language
    }

    const script = document.createElement('script')
    script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`
    script.setAttribute('data-timestamp', `${Date.now()}`)
    script.async = true
    document.body.appendChild(script)

    const countScript = document.createElement('script')
    countScript.src = `https://${DISQUS_SHORTNAME}.disqus.com/count.js`
    countScript.id = 'dsq-count-scr'
    countScript.async = true
    document.body.appendChild(countScript)

    return () => {
      const disqusScript = document.querySelector(`script[src="https://${DISQUS_SHORTNAME}.disqus.com/embed.js"]`)
      const disqusCountScript = document.querySelector(`script[src="https://${DISQUS_SHORTNAME}.disqus.com/count.js"]`)
      disqusScript?.remove()
      disqusCountScript?.remove()
    }
  }, [disqusConfig])

  return (
    <MotionDiv ref={sectionRef} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
      <Container maxWidth="lg" className="testimonials-section section-alt-gray">
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, maxWidth: 1080, mx: 'auto' }}>
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {testimonials.map((item) => (
            <MotionDiv key={item.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }}>
              <Alert severity="success" variant="outlined" className="testimonial-alert">
                <strong>{item.author}</strong> ({item.channel}): {item.message}
              </Alert>
            </MotionDiv>
          ))}
        </Box>

        <Box sx={{ mt: 3 }} className="testimonials-disqus">
          <Typography component="h3" variant="h6" sx={{ mb: 1 }}>
            Comentários da comunidade
          </Typography>

          <Typography variant="body2" sx={{ mb: 1.5 }}>
            <a href={`${disqusConfig.url}#disqus_thread`}>Comentários</a>
          </Typography>

          {DISQUS_SHORTNAME ? (
            <>
              <Box id="disqus_thread" sx={{ minHeight: 140 }} />
              <Typography variant="caption" sx={{ display: 'block', mt: 1.5 }}>
                Comentários fornecidos por{' '}
                <Link href="https://disqus.com" target="_blank" rel="noreferrer">
                  Disqus
                </Link>
                .
              </Typography>
            </>
          ) : (
            <Alert severity="info" variant="outlined" sx={{ mt: 1 }}>
              Para habilitar comentários via Disqus, configure a variável{' '}
              <strong>VITE_DISQUS_SHORTNAME</strong> no ambiente de execução.
            </Alert>
          )}
        </Box>
      </Paper>
      </Container>
    </MotionDiv>
  )
}
