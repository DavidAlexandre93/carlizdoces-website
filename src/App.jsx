import { lazy, Suspense, useMemo, useState } from 'react'
import FavoriteIcon from './mui-icons/Favorite'
import FavoriteBorderIcon from './mui-icons/FavoriteBorder'
import ShareIcon from './mui-icons/Share'
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Container,
  Divider,
  Drawer,
  Fab,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  Link,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  MobileStepper,
  Paper,
  Rating,
  Select,
  Slider,
  Snackbar,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { Carousel, CarouselSlide } from 'material-ui-carousel'
import { BRL, instagramPosts, instagramProfileLink, manualTestimonials, metrics, navItems, paymentMethods, seasonalProducts, topShowcaseSlides } from './data/siteData'
import { useCart } from './hooks/useCart'
import { useWhatsAppOrderLink } from './hooks/useWhatsAppOrderLink'
import './App.css'

const ContactSection = lazy(() => import('./components/sections/ContactSection'))
const TestimonialsSection = lazy(() => import('./components/sections/TestimonialsSection'))
const InstagramSection = lazy(() => import('./components/sections/InstagramSection'))

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeProductStep, setActiveProductStep] = useState(0)
  const [maxShowcasePrice, setMaxShowcasePrice] = useState(Math.max(...seasonalProducts.map((item) => item.price)))
  const [customizations, setCustomizations] = useState({})
  const [orderCustomer, setOrderCustomer] = useState({ name: '', phone: '' })
  const [orderPreferences, setOrderPreferences] = useState({ needsDelivery: false, receiveOffers: true })
  const [deliveryMethod, setDeliveryMethod] = useState('Retirada na loja')
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactTipOpen, setContactTipOpen] = useState(false)
  const [communityTestimonials, setCommunityTestimonials] = useState(manualTestimonials)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const { addItem, removeItem, selectedItems, totalItems, totalPrice } = useCart(seasonalProducts)

  const visibleShowcaseProducts = useMemo(
    () => seasonalProducts.filter((item) => item.price <= maxShowcasePrice),
    [maxShowcasePrice],
  )
  const selectedShowcaseProduct = visibleShowcaseProducts[activeProductStep] ?? visibleShowcaseProducts[0] ?? null

  const whatsappLink = useWhatsAppOrderLink({
    selectedItems,
    customizations,
    orderCustomer,
    orderPreferences,
    deliveryMethod,
    totalItems,
    totalPrice,
    BRL,
  })

  const handleShareProduct = async (item) => {
    const shareData = { title: 'Carliz Doces', text: `${item.name} por ${BRL.format(item.price)}.`, url: window.location.href }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      }
      setSnackbar({ open: true, message: 'Produto compartilhado com sucesso!', severity: 'success' })
    } catch {
      setSnackbar({ open: true, message: 'Não foi possível compartilhar agora.', severity: 'error' })
    }
  }

  return (
    <Box id="top" className={`site-wrapper${isDarkMode ? ' dark-mode' : ''}`}>
      <AppBar position="sticky" color="transparent" elevation={0} className="topbar">
        <Container maxWidth="xl" className="page-container">
          <Toolbar disableGutters className="topbar-inner">
            <Link href="#top" underline="none" color="inherit" className="topbar-brand">
              <Box component="img" src="/images/banner-carliz.svg" alt="Logo da Carliz Doces" className="brand-logo" />
              <Typography component="span" className="brand-name">Carliz Doces</Typography>
            </Link>

            <Box component="nav" className="topbar-nav">
              {navItems.map((item) => (
                <Link key={item.sectionId} href={`#${item.sectionId}`} underline="hover" color="inherit" sx={{ fontWeight: 600 }}>
                  {item.label}
                </Link>
              ))}
            </Box>

            <Box className="topbar-actions">
              <Tooltip title={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'} arrow>
                <Switch
                  checked={isDarkMode}
                  onChange={(_event, checked) => setIsDarkMode(checked)}
                  color="secondary"
                  inputProps={{ 'aria-label': isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro' }}
                />
              </Tooltip>

              <Tooltip title="Usuário logado" arrow>
                <Avatar aria-label="Usuário logado" sx={{ width: 36, height: 36, bgcolor: '#ad1457' }}>
                  <Icon sx={{ fontSize: 20 }}>person</Icon>
                </Avatar>
              </Tooltip>

              <IconButton color="inherit" aria-label="Abrir menu" edge="end" onClick={() => setIsMobileMenuOpen(true)} className="topbar-menu-button">
                <Icon>menu</Icon>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <Box className="mobile-nav" role="presentation" onClick={() => setIsMobileMenuOpen(false)}>
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.sectionId} component="a" href={`#${item.sectionId}`}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <section className="hero">
        <Container maxWidth="xl" className="page-container hero-inner">
          <Carousel autoPlay interval={4000} navButtonsAlwaysVisible indicators={topShowcaseSlides.length > 1} className="top-carousel">
            {topShowcaseSlides.map((slide) => (
              <CarouselSlide key={slide.id}>
                <article className="top-carousel-slide">
                  <img src={slide.imageUrl} alt={slide.alt} />
                  <div>
                    <Typography component="p" variant="overline">Destaque no topo</Typography>
                    <Chip label={slide.tag} color="secondary" size="small" sx={{ mb: 1, fontWeight: 700 }} />
                    <Typography component="h1" variant="h3">{slide.title}</Typography>
                    <Typography component="span" variant="body1">{slide.description}</Typography>
                    <ButtonGroup variant="contained" color="secondary" className="hero-quick-actions">
                      <Button component="a" href="#realizar-pedido">Fazer pedido</Button>
                      <Button component="a" href="#ovos-de-pascoa" color="inherit">Ver catálogo</Button>
                    </ButtonGroup>
                  </div>
                </article>
              </CarouselSlide>
            ))}
          </Carousel>
        </Container>
      </section>

      <section id="quem-somos" className="summary-band centered">
        <Container maxWidth="lg" className="page-container">
          <Paper elevation={4} sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5.5 }, borderRadius: 4 }}>
            <Typography component="h2" variant="h4">QUEM SOMOS</Typography>
            <Typography component="p" variant="body1">
              Somos a Carliz doces e realizamos doces a pronta entrega para festas, casamentos, aniversários e ovos de páscoa.
            </Typography>
          </Paper>
        </Container>
      </section>

      <Container maxWidth="lg" className="page-container section-divider-wrap" aria-hidden="true">
        <Divider className="section-divider" textAlign="center">
          <Typography component="span" variant="overline" className="section-divider-label">Cardápio de Páscoa</Typography>
        </Divider>
      </Container>

      <section id="ovos-de-pascoa" className="photo-band">
        <Container maxWidth="xl" className="page-container">
          <header className="photo-band-head">
            <Typography component="h2" variant="h4">Ovos de Páscoa</Typography>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 300 }, mt: 1.5 }}>
              <InputLabel id="showcase-select-label">Selecionar sabor</InputLabel>
              <Select
                labelId="showcase-select-label"
                value={selectedShowcaseProduct?.id ?? ''}
                label="Selecionar sabor"
                onChange={(event) => {
                  const nextIndex = visibleShowcaseProducts.findIndex((item) => item.id === event.target.value)
                  if (nextIndex >= 0) setActiveProductStep(nextIndex)
                }}
              >
                {visibleShowcaseProducts.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2.5, maxWidth: 560 }}>
              <Typography component="p" variant="body2" sx={{ mb: 0.75, fontWeight: 700 }}>
                Filtrar vitrine por preço máximo: {BRL.format(maxShowcasePrice)}
              </Typography>
              <Slider
                value={maxShowcasePrice}
                min={Math.min(...seasonalProducts.map((item) => item.price))}
                max={Math.max(...seasonalProducts.map((item) => item.price))}
                step={0.5}
                marks
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => BRL.format(value)}
                onChange={(_event, value) => setMaxShowcasePrice(Array.isArray(value) ? value[0] : value)}
              />
            </Box>
          </header>

          {selectedShowcaseProduct ? (
            <Paper className="showcase-card" sx={{ p: 2.5 }}>
              <img src={selectedShowcaseProduct.image} alt={selectedShowcaseProduct.name} style={{ width: '100%', maxHeight: 380, objectFit: 'contain' }} />
              <Typography variant="h5">{selectedShowcaseProduct.name}</Typography>
              <Typography variant="body2">{selectedShowcaseProduct.flavor} • {selectedShowcaseProduct.weight}</Typography>
              <Rating precision={0.1} value={selectedShowcaseProduct.rating} readOnly sx={{ mt: 1 }} />
              <Typography color="secondary" fontWeight={700}>{BRL.format(selectedShowcaseProduct.price)}</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={() => addItem(selectedShowcaseProduct.id)}>Adicionar</Button>
                <Button variant="outlined" onClick={() => removeItem(selectedShowcaseProduct.id)}>Remover</Button>
                <IconButton color="secondary" onClick={() => handleShareProduct(selectedShowcaseProduct)}>
                  <ShareIcon />
                </IconButton>
                <IconButton color="secondary">
                  <Badge color="secondary" badgeContent={0}>
                    <FavoriteBorderIcon />
                  </Badge>
                </IconButton>
              </Box>
            </Paper>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>Nenhum produto para o filtro atual.</Alert>
          )}

          <MobileStepper
            variant="dots"
            steps={Math.max(visibleShowcaseProducts.length, 1)}
            position="static"
            activeStep={Math.min(activeProductStep, Math.max(visibleShowcaseProducts.length - 1, 0))}
            nextButton={<Button size="small" onClick={() => setActiveProductStep((step) => Math.min(step + 1, visibleShowcaseProducts.length - 1))}>Próximo</Button>}
            backButton={<Button size="small" onClick={() => setActiveProductStep((step) => Math.max(step - 1, 0))}>Anterior</Button>}
          />
        </Container>
      </section>

      <section id="realizar-pedido" className="order-section">
        <Container maxWidth="lg" className="page-container">
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h4">Realizar pedido</Typography>
            <Box sx={{ mt: 2, display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <input placeholder="Nome" value={orderCustomer.name} onChange={(e) => setOrderCustomer((c) => ({ ...c, name: e.target.value }))} />
              <input placeholder="WhatsApp" value={orderCustomer.phone} onChange={(e) => setOrderCustomer((c) => ({ ...c, phone: e.target.value }))} />
            </Box>
            {selectedItems.map((item) => (
              <Box key={item.id} sx={{ mt: 2, p: 1.5, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography fontWeight={700}>{item.name}</Typography>
                <Typography variant="body2">Qtd: {item.quantity} • Subtotal: {BRL.format(item.subtotal)}</Typography>
                <FormControl size="small" sx={{ mt: 1.2, minWidth: 220 }}>
                  <InputLabel id={`pay-${item.id}`}>Pagamento</InputLabel>
                  <Select
                    labelId={`pay-${item.id}`}
                    value={customizations[item.id]?.paymentMethod ?? ''}
                    label="Pagamento"
                    onChange={(e) => setCustomizations((current) => ({ ...current, [item.id]: { ...current[item.id], paymentMethod: e.target.value } }))}
                  >
                    {paymentMethods.map((method) => (
                      <MenuItem key={method} value={method}>{method}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ))}
            <Typography sx={{ mt: 2 }}><strong>Total:</strong> {BRL.format(totalPrice)} ({totalItems} itens)</Typography>
            <Button sx={{ mt: 2 }} variant="contained" color="secondary" href={whatsappLink} target="_blank" rel="noreferrer">
              Confirmar no WhatsApp
            </Button>
          </Paper>
        </Container>
      </section>

      <section id="onde-estamos" className="content-block centered">
        <Container maxWidth="lg" className="page-container">
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h4">Onde estamos</Typography>
            <Typography sx={{ mt: 1 }}>Atendimento em São Paulo - capital e região metropolitana.</Typography>
            <Typography>Entrega local: {orderPreferences.needsDelivery ? 'Sim' : 'Retirada'}</Typography>
            <Button sx={{ mt: 1 }} onClick={() => setOrderPreferences((c) => ({ ...c, needsDelivery: !c.needsDelivery }))}>Alternar entrega</Button>
            <Button sx={{ mt: 1, ml: 1 }} onClick={() => setDeliveryMethod((m) => (m === 'Retirada na loja' ? 'Entrega por motoboy' : 'Retirada na loja'))}>Alterar recebimento</Button>
          </Paper>
        </Container>
      </section>

      <Suspense fallback={<Container><Alert severity="info">Carregando seção...</Alert></Container>}>
        <TestimonialsSection
          testimonials={communityTestimonials}
          onAddSample={() =>
            setCommunityTestimonials((current) => [
              ...current,
              {
                id: `community-${current.length + 1}`,
                author: 'Cliente',
                channel: 'WhatsApp',
                message: 'Adorei a experiência e a qualidade dos doces!',
              },
            ])
          }
        />
        <ContactSection
          contactForm={contactForm}
          onChange={(field, value) => setContactForm((current) => ({ ...current, [field]: value }))}
          contactTipOpen={contactTipOpen}
          onToggleTip={() => setContactTipOpen((open) => !open)}
        />
        <InstagramSection instagramPosts={instagramPosts} instagramProfileLink={instagramProfileLink} />
      </Suspense>

      <footer className="footer">
        <Container maxWidth="lg" className="page-container footer-inner">
          <div className="brand">
            <img className="brand-logo" src="/images/banner-carliz.svg" alt="Logo da Carliz Doces" />
          </div>
          <Typography component="small" variant="body2">©2024 Carliz Doces</Typography>
          <ul>
            {navItems.map((item) => (
              <li key={item.sectionId}>
                <Link href={`#${item.sectionId}`} underline="hover" color="inherit">{item.label}</Link>
              </li>
            ))}
          </ul>
          <div className="metrics">
            {metrics.map(([label, value]) => (
              <Typography key={label} component="span" variant="body2">{label}: {value}</Typography>
            ))}
          </div>
        </Container>
      </footer>

      <Box sx={{ position: 'fixed', left: { xs: 12, md: 24 }, bottom: { xs: 16, md: 24 }, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
        <Tooltip title="Ir para a seção de pedidos" placement="right" arrow>
          <Fab color="primary" size="small" aria-label="Ir para realizar pedido" href="#realizar-pedido">
            <Badge color="secondary" badgeContent={totalItems} invisible={totalItems === 0}>
              <Icon>shopping_cart</Icon>
            </Badge>
          </Fab>
        </Tooltip>

        <Tooltip title="Curtir a loja" placement="right" arrow>
          <Fab color="secondary" size="small" aria-label="Curtir loja">
            <FavoriteIcon />
          </Fab>
        </Tooltip>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((current) => ({ ...current, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
