import { useEffect } from 'react'
import { Alert, Box, Link, Paper, Typography } from '@mui/material'

const DISQUS_SHORTNAME = import.meta.env.VITE_DISQUS_SHORTNAME

export default function TestimonialsSection({ testimonials }) {
  useEffect(() => {
    if (!DISQUS_SHORTNAME) return undefined

    window.disqus_config = function disqusConfig() {
      this.page.url = window.location.href
      this.page.identifier = 'carliz-clientes-depoimentos'
      this.page.title = 'Depoimentos de clientes - Carliz Doces'
      this.language = 'pt_BR'
    }

    const script = document.createElement('script')
    script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`
    script.setAttribute('data-timestamp', `${Date.now()}`)
    script.async = true
    document.body.appendChild(script)

    return () => {
      const disqusScript = document.querySelector(`script[src="https://${DISQUS_SHORTNAME}.disqus.com/embed.js"]`)
      disqusScript?.remove()
    }
  }, [])

  return (
    <section id="depoimentos" className="testimonials-section">
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, maxWidth: 1080, mx: 'auto' }}>
        <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
          Depoimentos
        </Typography>
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
    </section>
  )
}
