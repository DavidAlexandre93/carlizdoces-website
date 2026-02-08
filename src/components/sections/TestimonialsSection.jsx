import { useEffect, useMemo } from 'react'
import { Alert, Box, Container, Link, Paper, Typography } from '@mui/material'

const DISQUS_SHORTNAME = import.meta.env.VITE_DISQUS_SHORTNAME || 'zeroreprovacao'

export default function TestimonialsSection({ testimonials }) {
  const disqusConfig = useMemo(() => {
    const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#depoimentos` : 'https://carlizdoces.com/#depoimentos'

    return {
      url: pageUrl,
      identifier: 'carliz-clientes-depoimentos',
      title: 'Comentários da comunidade - Carliz Doces',
      language: 'pt_BR',
    }
  }, [])

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
    <Container id="depoimentos" maxWidth="lg" className="testimonials-section section-alt-gray animate__animated animate__fadeInUp" style={{ '--animate-duration': '700ms' }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, maxWidth: 1080, mx: 'auto' }}>
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {testimonials.map((item) => (
            <Alert key={item.id} severity="success" variant="outlined">
              <strong>{item.author}</strong> ({item.channel}): {item.message}
            </Alert>
          ))}
        </Box>

        <Box sx={{ mt: 3 }}>
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
  )
}
