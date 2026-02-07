import { Box, Container, Link, Stack, Typography, styled } from '@mui/material'

const menuItems = [
  { id: 'quem-somos', label: 'Quem Somos' },
  { id: 'onde-estamos', label: 'Onde Estamos' },
  { id: 'contato', label: 'Contato' },
]

const aboutImages = [
  {
    src: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=1200&q=80',
    alt: 'Vitrine de confeitaria',
  },
  {
    src: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Cupcakes em fundo rosado',
  },
  {
    src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    alt: 'Balcão com cupcakes sortidos',
  },
]

const Page = styled(Container)(({ theme }) => ({
  maxWidth: '1500px',
  padding: '20px 26px 0',
  color: '#121212',
  [theme.breakpoints.down('md')]: { padding: '12px 16px 0' },
}))

const BannerImage = styled('img')({ width: '100%', objectFit: 'cover', display: 'block' })

function CupcakeIcon() {
  return (
    <Box component="svg" viewBox="0 0 64 64" aria-hidden="true" sx={{ width: 88, height: 88, fill: 'none', stroke: '#000', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
      <path d="M20 30c-6 0-11-4-11-10 0-5 4-9 9-10 2-6 7-9 14-9s12 3 14 9c5 1 9 5 9 10 0 6-5 10-11 10H20z" />
      <path d="M22 30h20l-2 24H24l-2-24z" />
      <path d="M29 10c0-3 2-6 5-6s5 3 5 6c0 2-1 4-3 5l-2 2-2-2c-2-1-3-3-3-5z" />
      <line x1="30" y1="31" x2="30" y2="53" />
      <line x1="36" y1="31" x2="36" y2="53" />
      <line x1="24" y1="31" x2="24" y2="53" />
    </Box>
  )
}

export default function App() {
  return (
    <Box sx={{ background: '#e9e9e9', minHeight: '100vh', py: 1 }}>
      <Page disableGutters>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pb: 3 }}>
          <Link href="#inicio" aria-label="Ir para o início" color="inherit"><CupcakeIcon /></Link>
          <Stack direction="row" spacing={{ xs: 2, md: 5 }}>
            {menuItems.map((item) => (
              <Link key={item.id} href={`#${item.id}`} underline="none" color="#1a1a1a" sx={{ fontSize: { xs: '1rem', md: '1.6rem' }, fontWeight: 600 }}>
                {item.label}
              </Link>
            ))}
          </Stack>
        </Stack>

        <Box id="inicio" sx={{ position: 'relative', minHeight: { xs: 320, md: 540 }, overflow: 'hidden' }}>
          <BannerImage src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=2000&q=80" alt="Cupcakes decorados com corações" sx={{ height: '100%' }} />
          <Typography variant="h1" sx={{ position: 'absolute', left: '50%', top: '56%', transform: 'translate(-50%,-50%)', color: '#fff', fontSize: { xs: '2.2rem', md: '5rem' } }}>
            The Best Cupcake
          </Typography>
        </Box>

        <Stack id="quem-somos" alignItems="center" sx={{ py: { xs: 7, md: 14 }, textAlign: 'center' }}>
          <CupcakeIcon />
          <Typography sx={{ my: 1, fontSize: { xs: '2rem', md: '4rem' }, fontWeight: 700 }}>QUEM SOMOS</Typography>
          <Typography sx={{ maxWidth: 930, fontSize: { xs: '1.1rem', md: '2rem' }, lineHeight: 1.45 }}>
            Na Carliz Doces, somos apaixonados por criar doces artesanais que trazem alegria para o seu dia. Usamos ingredientes frescos e de alta qualidade para oferecer sabores clássicos e combinações especiais. Nossa missão é proporcionar momentos doces e inesquecíveis, com um atendimento acolhedor em cada pedido.
          </Typography>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, mt: 2, gap: { xs: 1.5, md: 0 } }}>
          {aboutImages.map((image) => (
            <BannerImage key={image.src} src={image.src} alt={image.alt} loading="lazy" sx={{ height: { xs: 230, md: 360 } }} />
          ))}
        </Box>

        <Box id="onde-estamos" sx={{ mt: 3 }}>
          <BannerImage src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=2000&q=80" alt="Cupcakes em exposição" loading="lazy" sx={{ height: { xs: 200, md: 320 } }} />
          <Stack alignItems="center" sx={{ py: { xs: 7, md: 12 }, textAlign: 'center' }}>
            <CupcakeIcon />
            <Typography sx={{ my: 1, fontSize: { xs: '2rem', md: '4rem' }, fontWeight: 700 }}>ONDE ESTAMOS</Typography>
            <Typography sx={{ fontSize: { xs: '1.3rem', md: '2.5rem' } }}>Rua Elvira Harkot Ramina, Mossunguê, 484</Typography>
            <Typography sx={{ fontSize: { xs: '1.3rem', md: '2.5rem' } }}>Curitiba</Typography>
          </Stack>
        </Box>

        <Box id="contato" sx={{ position: 'relative', minHeight: 520 }}>
          <BannerImage src="https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=2000&q=80" alt="Cupcake rosa em fundo minimalista" loading="lazy" sx={{ position: 'absolute', inset: 0, height: '100%' }} />
          <Stack sx={{ position: 'relative', color: '#fff', zIndex: 1, maxWidth: 620, ml: 'auto', p: { xs: 3, md: '128px 120px 40px 20px' } }}>
            <Typography sx={{ fontSize: { xs: '2rem', md: '4.5rem' }, mb: 2, fontWeight: 700 }}>Contato</Typography>
            <Typography sx={{ fontSize: { xs: '1.15rem', md: '2.4rem' }, mb: 1.5 }}>Telefone: (41) 9-9999-9999</Typography>
            <Typography sx={{ fontSize: { xs: '1.15rem', md: '2.4rem' }, mb: 1.5 }}>Email: contato@carlizdoces.com</Typography>
            <Typography sx={{ fontSize: { xs: '1.15rem', md: '2.4rem' } }}>Horário de atendimento:<br />seg a sex - 9h até 18h</Typography>
          </Stack>
        </Box>

        <Box component="footer" sx={{ background: '#dfbbcc', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 2.5, p: '30px 44px' }}>
          <Box>
            <CupcakeIcon />
            <Typography sx={{ mt: 1 }}>©2024 Carliz Doces</Typography>
          </Box>
          <Stack direction="row" spacing={{ xs: 2, md: 5 }}>
            {menuItems.map((item) => (
              <Link key={item.id} href={`#${item.id}`} underline="none" sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '1rem', md: '1.4rem' } }}>
                {item.label}
              </Link>
            ))}
          </Stack>
        </Box>
      </Page>
    </Box>
  )
}
