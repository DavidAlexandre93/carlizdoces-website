import { Box, Button, Container, Link, Paper, Typography } from '@mui/material'

export default function InstagramSection({ instagramPosts, instagramProfileLink }) {
  return (
    <section id="instagram" className="instagram-section section-alt-pink animate__animated animate__fadeInUp" style={{ '--animate-duration': '700ms' }}>
      <Container maxWidth="xl" className="page-container">
        <header className="instagram-header">
          <Typography component="h2" variant="h4">Instagram</Typography>
          <Typography component="p" variant="body1">Confira nosso perfil @_carlizdoces e acompanhe as novidades.</Typography>
          <Button variant="contained" color="secondary" href={instagramProfileLink} target="_blank" rel="noreferrer" sx={{ mt: 1 }}>
            Seguir no Instagram
          </Button>
        </header>

        <Box className="instagram-grid">
          {instagramPosts.map((post) => (
            <Paper key={post.id} component="article" elevation={3} className="instagram-card">
              <Link href={instagramProfileLink} target="_blank" rel="noreferrer" aria-label="Abrir Instagram da Carliz Doces" underline="none">
                <img src={post.imageUrl} alt={post.alt} loading="lazy" />
              </Link>
            </Paper>
          ))}
        </Box>
      </Container>
    </section>
  )
}
