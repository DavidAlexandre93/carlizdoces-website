import { useMemo, useState } from 'react'
import FavoriteIcon from './mui-icons/Favorite'
import FavoriteBorderIcon from './mui-icons/FavoriteBorder'
import ShareIcon from './mui-icons/Share'
import PersonIcon from './mui-icons/Person'
import {
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Container,
  Drawer,
  Divider,
  Icon,
  IconButton,
  ImageList,
  ImageListItem,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  MenuItem,
  MobileStepper,
  Switch,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { Carousel, CarouselSlide } from 'material-ui-carousel'
import './App.css'

const navItems = [
  { label: 'Quem somos', sectionId: 'quem-somos' },
  { label: 'Instagram', sectionId: 'instagram' },
  { label: 'Depoimentos', sectionId: 'depoimentos' },
  { label: 'Onde estamos', sectionId: 'onde-estamos' },
  { label: 'Realizar pedido', sectionId: 'realizar-pedido' },
  { label: 'Ovos de páscoa', sectionId: 'ovos-de-pascoa' },
  { label: 'Contato', sectionId: 'contato' },
]

const manualTestimonials = [
  {
    id: 'manual-1',
    author: 'Carla M.',
    channel: 'Instagram',
    message: 'Pedi para o aniversário do meu filho e os brigadeiros fizeram o maior sucesso na festa toda.',
  },
  {
    id: 'manual-2',
    author: 'Juliana F.',
    channel: 'WhatsApp',
    message: 'Atendimento rápido, doces lindos e muito saborosos. Já virei cliente fiel da Carliz Doces.',
  },
]

// Edite apenas este array para atualizar produtos conforme o estoque.
const seasonalProducts = [
  {
    id: 'brigadeiro',
    name: 'Brigadeiro Gourmet',
    flavor: 'Brigadeiro belga',
    weight: '350g',
    price: 59,
    image: '/images/brigadeiro.svg',
  },
  {
    id: 'ninho-nutella',
    name: 'Ninho com Nutella',
    flavor: 'Leite ninho com creme de Nutella',
    weight: '400g',
    price: 68.5,
    image: '/images/ninho-nutella.svg',
  },
  {
    id: 'prestigio',
    name: 'Prestígio Cremoso',
    flavor: 'Coco cremoso com chocolate',
    weight: '350g',
    price: 62,
    image: '/images/prestigio.svg',
  },
  {
    id: 'ferrero',
    name: 'Ferrero Crocante',
    flavor: 'Chocolate com avelã crocante',
    weight: '450g',
    price: 72,
    image: '/images/ferrero.svg',
  },
  {
    id: 'trufado-maracuja',
    name: 'Trufado de Maracujá',
    flavor: 'Ganache trufada de maracujá',
    weight: '380g',
    price: 64,
    image: '/images/trufado-maracuja.svg',
  },
  {
    id: 'ninho-uva',
    name: 'Ninho com Uva',
    flavor: 'Leite ninho com uvas frescas',
    weight: '400g',
    price: 66,
    image: '/images/ninho-uva.svg',
  },
]

const metrics = [
  ['Pedidos por dia', '120+'],
  ['Sabores disponíveis', '30'],
  ['Eventos atendidos', '450'],
]

const instagramProfileLink = 'https://www.instagram.com/_carlizdoces/'

const instagramPosts = [
  { id: 'insta-1', imageUrl: '/images/ninho.svg', alt: 'Doces artesanais da Carliz Doces' },
  { id: 'insta-2', imageUrl: '/images/ferrero.svg', alt: 'Ovo de colher da Carliz Doces' },
  { id: 'insta-3', imageUrl: '/images/brigadeiro.svg', alt: 'Brigadeiros da Carliz Doces' },
]

const brandLogo = {
  src: '/images/banner-carliz.svg',
  alt: 'Logo da Carliz Doces',
}

const topShowcaseSlides = [
  {
    id: 'matilda',
    imageUrl: '/images/matilda.svg',
    alt: 'Bolo da Matilda especial da Carliz Doces',
    title: 'Bolo da Matilda',
    description: 'Destaque da semana para os apaixonados por chocolate.',
    tag: 'Mais pedido',
  },
  {
    id: 'ferrero',
    imageUrl: '/images/ferrero.svg',
    alt: 'Campanha de sorteio com ovo Ferrero Rocher',
    title: 'Sorteio Ferrero Rocher',
    description: 'Promoção especial para quem encomenda ovos de colher.',
    tag: 'Promoção',
  },
  {
    id: 'brigadeiro',
    imageUrl: '/images/brigadeiro.svg',
    alt: 'Brigadeiros artesanais da Carliz Doces',
    title: 'Brigadeiros artesanais',
    description: 'Sabores para festas e lembranças com a cara da Carliz.',
    tag: 'Clássico da casa',
  },
]

const featuredProductIds = new Set(['brigadeiro', 'ferrero'])


const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function App() {
  const [cart, setCart] = useState({})
  const [customizations, setCustomizations] = useState({})
  const [orderTipAnchor, setOrderTipAnchor] = useState(null)
  const [contactTipAnchor, setContactTipAnchor] = useState(null)
  const [activeProductStep, setActiveProductStep] = useState(0)
  const [selectedContactTab, setSelectedContactTab] = useState('whatsapp')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [communityTestimonials, setCommunityTestimonials] = useState([
    {
      id: 'community-1',
      author: 'Cliente da loja',
      message: 'Os ovos de colher chegaram perfeitos e com muito recheio. Recomendo demais!',
    },
  ])
  const [testimonialForm, setTestimonialForm] = useState({
    author: '',
    message: '',
  })
  const [googleAccount, setGoogleAccount] = useState(null)
  const [likesByProduct, setLikesByProduct] = useState(() =>
    Object.fromEntries(seasonalProducts.map((item, index) => [item.id, 100 + index * 7])),
  )
  const [likedProducts, setLikedProducts] = useState({})
  const [showOrderAlert, setShowOrderAlert] = useState(false)
  const [isWhatsAppConfirmationEnabled, setIsWhatsAppConfirmationEnabled] = useState(true)
  const [showManualTestimonials, setShowManualTestimonials] = useState(true)

  const isOrderTipOpen = Boolean(orderTipAnchor)
  const isContactTipOpen = Boolean(contactTipAnchor)

  const addItem = (itemId) => {
    setCart((current) => ({ ...current, [itemId]: (current[itemId] ?? 0) + 1 }))
  }

  const removeItem = (itemId) => {
    setCart((current) => {
      const qty = current[itemId] ?? 0
      if (qty <= 1) {
        const next = { ...current }
        delete next[itemId]
        return next
      }
      return { ...current, [itemId]: qty - 1 }
    })
  }

  const selectedItems = useMemo(
    () =>
      seasonalProducts
        .filter((item) => cart[item.id])
        .map((item) => ({ ...item, quantity: cart[item.id], subtotal: cart[item.id] * item.price })),
    [cart],
  )

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.subtotal, 0)
  const selectedShowcaseProduct = seasonalProducts[activeProductStep] ?? seasonalProducts[0] ?? null

  const updateCustomization = (itemId, field, value) => {
    setCustomizations((current) => ({
      ...current,
      [itemId]: { ...current[itemId], [field]: value },
    }))
  }

  const whatsappLink = useMemo(() => {
    const orderList =
      selectedItems.length > 0
        ? selectedItems
            .map((item) => {
              const details = customizations[item.id] ?? {}
              const selectedFlavor = details.flavor?.trim() || item.flavor
              const selectedPayment = details.paymentMethod?.trim() || 'não informado'
              return [
                `🍬 ${item.name}`,
                `• Quantidade: ${item.quantity}`,
                `• Sabor escolhido: ${selectedFlavor}`,
                `• Preço unitário: ${BRL.format(item.price)}`,
                `• Subtotal: ${BRL.format(item.subtotal)}`,
                `• Forma de pagamento: ${selectedPayment}`,
              ].join('\n')
            })
            .join('\n\n')
        : '- Ainda estou escolhendo os doces.'

    const message = encodeURIComponent(
      `Olá, Carliz Doces! ✨\n\nGostaria de realizar um pedido de outros doces. Seguem os detalhes:\n\n${orderList}\n\n📦 Total de itens: ${totalItems}\n💰 Valor total estimado: ${BRL.format(totalPrice)}\n\nFico no aguardo para confirmar disponibilidade, produção e entrega. Muito obrigado(a)!`,
    )

    return `https://wa.me/5511992175496?text=${message}`
  }, [customizations, selectedItems, totalItems, totalPrice])

  const handleOrderTipToggle = (event) => {
    setOrderTipAnchor((current) => (current ? null : event.currentTarget))
  }

  const handleContactTipToggle = (event) => {
    setContactTipAnchor((current) => (current ? null : event.currentTarget))
  }

  const handleShareProduct = async (item) => {
    const shareData = {
      title: 'Carliz Doces',
      text: `${item.name} por ${BRL.format(item.price)}.`,
      url: window.location.href,
    }

    if (navigator.share) {
      await navigator.share(shareData)
      return
    }

    await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
  }

  const handleLikeProduct = (itemId) => {
    setLikesByProduct((current) => ({
      ...current,
      [itemId]: (current[itemId] ?? 0) + 1,
    }))
    setLikedProducts((current) => ({ ...current, [itemId]: true }))
  }

  const chatActions = [
    {
      name: 'WhatsApp',
      icon: <Icon fontSize="small">chat</Icon>,
      onClick: () => window.open('https://wa.me/5511992175496', '_blank', 'noopener,noreferrer'),
    },
    {
      name: 'Instagram',
      icon: <Icon fontSize="small">photo_camera</Icon>,
      onClick: () => window.open(instagramProfileLink, '_blank', 'noopener,noreferrer'),
    },
  ]

  const handleNextProduct = () => {
    setActiveProductStep((current) => Math.min(current + 1, seasonalProducts.length - 1))
  }

  const handleBackProduct = () => {
    setActiveProductStep((current) => Math.max(current - 1, 0))
  }

  const handleTestimonialChange = (field, value) => {
    setTestimonialForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleTestimonialSubmit = (event) => {
    event.preventDefault()

    if (!googleAccount) {
      return
    }

    if (!testimonialForm.message.trim()) {
      return
    }

    setCommunityTestimonials((current) => [
      {
        id: `community-${Date.now()}`,
        author: testimonialForm.author.trim() || 'Cliente da Carliz Doces',
        message: testimonialForm.message.trim(),
      },
      ...current,
    ])

    setTestimonialForm({ author: '', message: '' })
  }

  const handleGoogleLogin = () => {
    const informedEmail = window.prompt('Digite o e-mail da sua conta Google para continuar:')

    if (!informedEmail) {
      return
    }

    const normalizedEmail = informedEmail.trim().toLowerCase()

    if (!normalizedEmail.endsWith('@gmail.com')) {
      window.alert('Use uma conta Google válida (@gmail.com) para enviar seu depoimento.')
      return
    }

    const defaultName = normalizedEmail.split('@')[0]?.replace(/[._-]+/g, ' ') || 'Cliente Google'
    const formattedName = defaultName
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')

    setGoogleAccount({
      email: normalizedEmail,
      name: formattedName,
    })

    setTestimonialForm((current) => ({
      ...current,
      author: current.author.trim() ? current.author : formattedName,
    }))
  }

  const handleGoogleLogout = () => {
    setGoogleAccount(null)
    setTestimonialForm((current) => ({
      ...current,
      author: '',
    }))
  }
  const renderSectionDivider = (label) => (
    <Container maxWidth="lg" className="page-container section-divider-wrap" aria-hidden="true">
      <Divider className="section-divider" textAlign="center">
        <Typography component="span" variant="overline" className="section-divider-label">
          {label}
        </Typography>
      </Divider>
    </Container>
  )


  return (
    <Box id="top" className={`site-wrapper${isDarkMode ? ' dark-mode' : ''}`}>
      <AppBar position="sticky" color="transparent" elevation={0} className="topbar">
        <Container maxWidth="xl" className="page-container">
          <Toolbar disableGutters className="topbar-inner">
            <Tooltip title="Voltar para o topo da página" arrow>
              <Link href="#top" underline="none" color="inherit" className="topbar-brand">
                <Box component="img" src="/images/banner-carliz.svg" alt="Logo da Carliz Doces" className="brand-logo" />
                <Badge color="secondary" badgeContent="Top" sx={{ '& .MuiBadge-badge': { right: -24 } }}>
                  <Typography component="span" className="brand-name">
                    Carliz Doces
                  </Typography>
                </Badge>
              </Link>
            </Tooltip>

            <Box component="nav" className="topbar-nav">
              {navItems.map((item) => (
                <Link
                  key={item.sectionId}
                  href={`#${item.sectionId}`}
                  underline="hover"
                  color="inherit"
                  sx={{ fontWeight: 600 }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>

            <Box className="topbar-actions">
              <Tooltip title={isDarkMode ? 'Modo escuro ativado' : 'Modo claro ativado'} arrow>
                <Switch
                  checked={isDarkMode}
                  onChange={(_event, checked) => setIsDarkMode(checked)}
                  color="secondary"
                  inputProps={{ 'aria-label': isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro' }}
                />
              </Tooltip>

              <Tooltip title="Usuário logado" arrow>
                <Avatar aria-label="Usuário logado" sx={{ width: 36, height: 36, bgcolor: '#ad1457' }}>
                  <PersonIcon sx={{ fontSize: 20 }} />
                </Avatar>
              </Tooltip>

              <IconButton
                color="inherit"
                aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
                onClick={() => setIsDarkMode((current) => !current)}
                className="theme-toggle-button"
              >
                <Icon>{isDarkMode ? 'light_mode' : 'dark_mode'}</Icon>
              </IconButton>

              <IconButton
                color="inherit"
                aria-label="Abrir menu"
                edge="end"
                onClick={() => setIsMobileMenuOpen(true)}
                className="topbar-menu-button"
              >
                <Icon>menu</Icon>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <Box className="mobile-nav" role="presentation" onClick={() => setIsMobileMenuOpen(false)}>
          <Box className="mobile-nav-header">
            <Box component="img" src="/images/banner-carliz.svg" alt="Logo da Carliz Doces" className="mobile-brand-logo" />
            <Typography variant="h6" color="primary" fontWeight={700}>
              Carliz Doces
            </Typography>
          </Box>
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
          <Carousel
            autoPlay
            interval={4000}
            navButtonsAlwaysVisible
            indicators={topShowcaseSlides.length > 1}
            className="top-carousel"
          >
            {topShowcaseSlides.map((slide) => (
              <CarouselSlide key={slide.id}>
                <article className="top-carousel-slide">
                  <img src={slide.imageUrl} alt={slide.alt} />
                  <div>
                    <Typography component="p" variant="overline">Destaque no topo</Typography>
                    <Chip
                      label={slide.tag}
                      color="secondary"
                      size="small"
                      sx={{ mb: 1, fontWeight: 700 }}
                    />
                    <Typography component="h1" variant="h3">{slide.title}</Typography>
                    <Typography component="span" variant="body1">{slide.description}</Typography>
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
              Somos a Carliz doces realizamos doces a pronta entrega para festas, casamentos, aniversários e
              ovos de páscoa.
            </Typography>
          </Paper>
        </Container>
      </section>

      {renderSectionDivider('Cardápio de Páscoa')}

      <section id="ovos-de-pascoa" className="photo-band">
        <Container maxWidth="xl" className="page-container">
          <header className="photo-band-head">
            <Typography component="h2" variant="h4">Ovos de Páscoa</Typography>
            <Typography component="p" variant="body1">Passe as imagens com os botões para navegar pelos sabores e apresentações disponíveis.</Typography>
          </header>

          {selectedShowcaseProduct ? (
            <Paper component="aside" elevation={3} className="photo-highlight" aria-live="polite">
              <img src={selectedShowcaseProduct.image} alt={selectedShowcaseProduct.name} />
              <div>
                <Typography component="p" variant="overline" className="highlight-tag">Catálogo de temporada</Typography>
                <Badge
                  color="primary"
                  badgeContent={featuredProductIds.has(selectedShowcaseProduct.id) ? 'Mais pedido' : 'Novidade'}
                  sx={{ '& .MuiBadge-badge': { right: -56, top: 12 } }}
                >
                  <Typography component="h3" variant="h5">{selectedShowcaseProduct.name}</Typography>
                </Badge>
                <Chip
                  label="Edição limitada"
                  color="warning"
                  size="small"
                  sx={{ mb: 1.2, fontWeight: 700 }}
                />
                <Typography component="h3" variant="h5">{selectedShowcaseProduct.name}</Typography>
                <Typography component="p" variant="body1">
                  {selectedShowcaseProduct.weight} de pura cremosidade com sabor {selectedShowcaseProduct.flavor}.
                  Deslize pelo catálogo para comparar sabores antes de pedir.
                </Typography>
                <Typography component="strong" variant="h6">{BRL.format(selectedShowcaseProduct.price)}</Typography>
                <div className="product-social-actions" aria-label={`Interações de ${selectedShowcaseProduct.name}`}>
                  <button
                    type="button"
                    className="social-action social-action-like"
                    onClick={() => handleLikeProduct(selectedShowcaseProduct.id)}
                    aria-label={`Curtir ${selectedShowcaseProduct.name}`}
                    title="Curtir"
                  >
                    {likedProducts[selectedShowcaseProduct.id] ? (
                      <FavoriteIcon fontSize="small" aria-hidden="true" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" aria-hidden="true" />
                    )}
                    {likesByProduct[selectedShowcaseProduct.id] ?? 0}
                  </button>
                  <button
                    type="button"
                    className="social-action"
                    onClick={() => handleShareProduct(selectedShowcaseProduct)}
                    aria-label={`Compartilhar ${selectedShowcaseProduct.name}`}
                    title="Compartilhar doce"
                  >
                    <ShareIcon fontSize="small" aria-hidden="true" />
                    Compartilhar
                  </button>
                </div>
                <Tooltip title="Adiciona esse sabor ao seu carrinho" arrow>
                  <Button variant="contained" onClick={() => addItem(selectedShowcaseProduct.id)}>
                    Adicionar ao pedido
                  </Button>
                </Tooltip>
              </div>
            </Paper>
          ) : null}

          <MobileStepper
            variant="dots"
            steps={seasonalProducts.length}
            position="static"
            activeStep={activeProductStep}
            className="showcase-stepper"
            nextButton={
              <Button size="small" onClick={handleNextProduct} disabled={activeProductStep === seasonalProducts.length - 1}>
                Próximo <Icon fontSize="small">navigate_next</Icon>
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBackProduct} disabled={activeProductStep === 0}>
                <Icon fontSize="small">navigate_before</Icon> Anterior
              </Button>
            }
          />

          <Tabs
            value={selectedShowcaseProduct?.id ?? false}
            onChange={(_event, newValue) => {
              const nextIndex = seasonalProducts.findIndex((item) => item.id === newValue)
              if (nextIndex >= 0) {
                setActiveProductStep(nextIndex)
              }
            }}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Seleção rápida de sabores"
            className="section-tabs"
            sx={{ mt: 2, maxWidth: 900, mx: 'auto' }}
          >
            {seasonalProducts.map((item) => (
              <Tab
                key={item.id}
                value={item.id}
                label={item.name}
                sx={{ textTransform: 'none', fontWeight: 700 }}
              />
            ))}
          </Tabs>
        </Container>
      </section>

      {renderSectionDivider('Monte seu pedido')}

      <section id="realizar-pedido" className="order-section">
        <Container maxWidth="xl" className="page-container">
          <Typography component="h2" variant="h4">Realizar pedido</Typography>
          <Typography component="p" variant="body1">Use os produtos acima como base e ajuste nomes/imagens no estoque para atualizar automaticamente.</Typography>
          <Button variant="outlined" color="secondary" onClick={handleOrderTipToggle}>
            Dica rápida para o pedido
          </Button>
          <Popper open={isOrderTipOpen} anchorEl={orderTipAnchor} placement="bottom-start" sx={{ zIndex: 10 }}>
            <ClickAwayListener onClickAway={() => setOrderTipAnchor(null)}>
              <Paper sx={{ p: 2, maxWidth: 300, mt: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Monte seu carrinho mais rápido
                </Typography>
                <Typography variant="body2">
                  Comece pelos sabores favoritos, ajuste quantidades e confira o total antes de enviar para o WhatsApp.
                </Typography>
              </Paper>
            </ClickAwayListener>
          </Popper>

          <Box sx={{ mt: 2, mb: 3 }}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<Icon aria-hidden="true">expand_more</Icon>}
                aria-controls="pedido-passo-a-passo-content"
                id="pedido-passo-a-passo-header"
              >
                <Typography sx={{ fontWeight: 700 }}>Passo a passo do pedido</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Escolha os produtos, ajuste sabores e formas de pagamento, revise o resumo do carrinho e finalize no
                  WhatsApp para confirmar disponibilidade e entrega.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<Icon aria-hidden="true">expand_more</Icon>} aria-controls="pedido-pagamento-content" id="pedido-pagamento-header">
                <Typography sx={{ fontWeight: 700 }}>Formas de pagamento aceitas</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Aceitamos Pix, dinheiro, cartão de débito e cartão de crédito. Você pode escolher a opção para cada
                  doce no formulário de personalização.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box className="order-grid">
            <ImageList
              className="order-list-masonry"
              variant="masonry"
              cols={2}
              gap={16}
              sx={{ columnCount: { xs: 1, sm: 2 } }}
            >
              {seasonalProducts.map((item) => (
                <ImageListItem key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="order-item-content">
                    <Typography component="h3" variant="h6">{item.name}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 0.4 }}>
                      <Chip label={item.weight} size="small" variant="outlined" color="primary" />
                      <Chip label={item.flavor} size="small" variant="outlined" />
                    </Box>
                    <Typography component="span" variant="subtitle1">{BRL.format(item.price)}</Typography>
                    <div className="product-social-actions" aria-label={`Interações de ${item.name}`}>
                      <Tooltip title="Curta para salvar esse sabor entre seus favoritos" arrow>
                        <button
                          type="button"
                          className="social-action social-action-like"
                          onClick={() => handleLikeProduct(item.id)}
                          aria-label={`Curtir ${item.name}`}
                          title="Curtir"
                        >
                          {likedProducts[item.id] ? (
                            <FavoriteIcon fontSize="small" aria-hidden="true" />
                          ) : (
                            <FavoriteBorderIcon fontSize="small" aria-hidden="true" />
                          )}
                          {likesByProduct[item.id] ?? 0}
                        </button>
                      </Tooltip>
                      <Tooltip title="Compartilhe esse doce com alguém" arrow>
                        <button
                          type="button"
                          className="social-action"
                          onClick={() => handleShareProduct(item)}
                          aria-label={`Compartilhar ${item.name}`}
                          title="Compartilhar doce"
                        >
                          <ShareIcon fontSize="small" aria-hidden="true" />
                          Compartilhar
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="qty-controls">
                    <Tooltip title="Diminuir quantidade" arrow>
                      <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remover ${item.name}`}>
                        <Icon fontSize="inherit" aria-hidden="true">remove</Icon>
                      </button>
                    </Tooltip>
                    <Typography component="strong" variant="body1">{cart[item.id] ?? 0}</Typography>
                    <Tooltip title="Aumentar quantidade" arrow>
                      <button type="button" onClick={() => addItem(item.id)} aria-label={`Adicionar ${item.name}`}>
                        <Icon fontSize="inherit" aria-hidden="true">add</Icon>
                      </button>
                    </Tooltip>
                  </div>
                </ImageListItem>
              ))}
            </ImageList>

            <Paper component="aside" elevation={3} className="order-summary">
              <Badge color="secondary" badgeContent={`${totalItems} item(ns)`}>
                <Typography component="h3" variant="h5">Resumo do pedido</Typography>
              </Badge>
              <Typography component="p" variant="body1">
                <Typography component="strong" variant="h6">{totalItems}</Typography> item(ns) no carrinho
              </Typography>
              <div className="order-timeline" aria-label="Etapas do pedido">
                <Box component="ol" sx={{ m: 0, py: 1.25, pr: 1.25, pl: 1.75, listStyle: 'none' }}>
                  {[
                    { label: 'Escolha os sabores', active: totalItems > 0 },
                    { label: 'Revise o resumo', active: selectedItems.length > 0 },
                    { label: 'Finalize no WhatsApp', active: true, success: true },
                  ].map((step, index, array) => (
                    <Box key={step.label} component="li" className="timeline-step">
                      <span
                        className={`timeline-dot${step.active ? ' is-active' : ''}${step.success ? ' is-success' : ''}`}
                        aria-hidden="true"
                      />
                      {index < array.length - 1 ? <span className="timeline-connector" aria-hidden="true" /> : null}
                      <Typography component="span" variant="body2">
                        {step.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </div>
              <ul>
                {selectedItems.length === 0 ? (
                  <li>Seu carrinho está vazio.</li>
                ) : (
                  selectedItems.map((item) => (
                    <li key={item.id}>
                      {item.name} ({item.weight}) x{item.quantity} — {BRL.format(item.subtotal)}
                    </li>
                  ))
                )}
              </ul>

              {selectedItems.length ? (
                <div className="customization-panel">
                  <Typography component="h4" variant="h6">Detalhes por doce</Typography>
                  <Typography component="p" variant="body2">Informe os dados de cada item para enviar um pedido completo no WhatsApp.</Typography>

                  {selectedItems.map((item) => (
                    <div key={item.id} className="order-detail-card">
                      <Typography component="strong" variant="subtitle1">{item.name}</Typography>
                      <Typography component="span" variant="body2">Quantidade: {item.quantity}</Typography>
                      <Typography component="span" variant="body2">
                        Preço: {BRL.format(item.price)} (subtotal {BRL.format(item.subtotal)})
                      </Typography>
                      <div className="customization-fields">
                        <TextField
                          label="Qual sabor?"
                          placeholder="Ex.: Brigadeiro belga"
                          size="small"
                          fullWidth
                          value={customizations[item.id]?.flavor ?? item.flavor}
                          onChange={(event) => updateCustomization(item.id, 'flavor', event.target.value)}
                        />
                        <TextField
                          select
                          label="Forma de pagamento"
                          size="small"
                          fullWidth
                          value={customizations[item.id]?.paymentMethod ?? ''}
                          onChange={(event) =>
                            updateCustomization(item.id, 'paymentMethod', event.target.value)
                          }
                        >
                          <MenuItem value="">Selecione uma opção</MenuItem>
                          <MenuItem value="Pix">Pix</MenuItem>
                          <MenuItem value="Dinheiro">Dinheiro</MenuItem>
                          <MenuItem value="Cartão de débito">Cartão de débito</MenuItem>
                          <MenuItem value="Cartão de crédito">Cartão de crédito</MenuItem>
                        </TextField>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <Typography component="p" variant="h6" className="summary-total">Total: {BRL.format(totalPrice)}</Typography>
              <Box className="order-switch-line">
                <Typography component="span" variant="body2">Receber confirmação automática no WhatsApp</Typography>
                <Switch
                  checked={isWhatsAppConfirmationEnabled}
                  onChange={(_event, checked) => setIsWhatsAppConfirmationEnabled(checked)}
                  color="secondary"
                  inputProps={{ 'aria-label': 'Ativar confirmação automática no WhatsApp' }}
                />
              </Box>
              {showOrderAlert ? (
                <Alert severity="success" sx={{ mb: 1.5 }} onClose={() => setShowOrderAlert(false)}>
                  {isWhatsAppConfirmationEnabled
                    ? 'Pedido enviado! Você será atendido(a) pelo WhatsApp para confirmar os detalhes.'
                    : 'Pedido enviado! Sua confirmação automática está desativada no momento.'}
                </Alert>
              ) : null}
              <Link
                className="finish-order"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                underline="none"
                onClick={() => setShowOrderAlert(true)}
              >
                Finalizar pedido no WhatsApp
              </Link>
            </Paper>
          </Box>
        </Container>
      </section>

      {renderSectionDivider('Depoimentos de clientes')}

      <section id="onde-estamos" className="content-block centered">
        <Container maxWidth="md" className="page-container">
          <div className="section-icon">🧁</div>
          <Typography component="h2" variant="h4">ONDE ESTAMOS</Typography>
          <Typography component="p" variant="body1">Visite nossa loja para retirada e encomendas presenciais.</Typography>
          <Typography component="p" variant="body1">Atendemos retirada e entregas locais com agendamento.</Typography>
          <Typography component="p" variant="body1">Segunda a Sábado • 09h às 19h | Domingo • 10h às 15h</Typography>
          <Typography component="p" variant="body1">Próximo à Praça Central e estação de metrô.</Typography>
          <Box sx={{ mt: 2, textAlign: 'left' }}>
            <Accordion>
              <AccordionSummary expandIcon={<Icon aria-hidden="true">expand_more</Icon>} aria-controls="retirada-content" id="retirada-header">
                <Typography sx={{ fontWeight: 700 }}>Retirada e entrega</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Faça sua encomenda com antecedência para retirada na loja ou solicite entrega local com agendamento,
                  sujeita à disponibilidade da rota.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<Icon aria-hidden="true">expand_more</Icon>} aria-controls="eventos-content" id="eventos-header">
                <Typography sx={{ fontWeight: 700 }}>Atendimento para eventos</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Atendemos festas, casamentos e aniversários com volumes maiores. Entre em contato para montar um
                  cardápio personalizado para o seu evento.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Container>
      </section>

      <section id="depoimentos" className="testimonials-section">
        <Container maxWidth="lg" className="page-container">
          <header className="testimonials-header">
            <Typography component="h2" variant="h4">Depoimentos</Typography>
            <Typography component="p" variant="body1">
              Espaço para clientes contarem a experiência com os doces da Carliz e para registrar feedbacks
              recebidos em outros canais.
            </Typography>
          </header>

          <Box className="testimonials-grid">
            <Paper component="form" onSubmit={handleTestimonialSubmit} elevation={0} className="testimonial-form-card">
              <Typography component="h3" variant="h5">Deixe sua opinião</Typography>
              <Typography component="p" variant="body2">Seu comentário ajuda outras pessoas e também melhora nossos próximos pedidos.</Typography>
              <Box className="testimonial-google-access">
                {googleAccount ? (
                  <>
                    <Alert severity="success">
                      Conectado com Google: <strong>{googleAccount.email}</strong>
                    </Alert>
                    <Button type="button" variant="outlined" onClick={handleGoogleLogout}>
                      Sair da conta Google
                    </Button>
                  </>
                ) : (
                  <>
                    <Alert severity="info">
                      Para publicar um depoimento é necessário entrar com uma conta Google.
                    </Alert>
                    <Button type="button" variant="contained" onClick={handleGoogleLogin}>
                      Entrar com Google
                    </Button>
                  </>
                )}
              </Box>
              <TextField
                label="Seu nome"
                placeholder="Ex.: Maria"
                value={testimonialForm.author}
                onChange={(event) => handleTestimonialChange('author', event.target.value)}
                fullWidth
                size="small"
                disabled={!googleAccount}
              />
              <TextField
                label="Seu depoimento"
                placeholder="Conte como foi sua experiência com nossos doces"
                value={testimonialForm.message}
                onChange={(event) => handleTestimonialChange('message', event.target.value)}
                multiline
                minRows={4}
                fullWidth
                required
                disabled={!googleAccount}
              />
              <Button type="submit" variant="contained" disabled={!googleAccount}>
                Enviar depoimento
              </Button>
            </Paper>

            <Paper elevation={0} className="testimonials-list-card">
              <Badge color="primary" badgeContent={`${communityTestimonials.length} opiniões`}>
                <Typography component="h3" variant="h5">Clientes que já opinaram aqui</Typography>
              </Badge>
              <ul>
                {communityTestimonials.map((testimonial) => (
                  <li key={testimonial.id}>
                    <Typography component="strong" variant="subtitle1">{testimonial.author}</Typography>
                    <Typography component="p" variant="body2">{testimonial.message}</Typography>
                  </li>
                ))}
              </ul>
            </Paper>
          </Box>

          <Paper elevation={0} className="manual-feedback-card">
            <Box className="manual-feedback-head">
              <Typography component="h3" variant="h5">Feedbacks recebidos por outros meios</Typography>
              <Switch
                checked={showManualTestimonials}
                onChange={(_event, checked) => setShowManualTestimonials(checked)}
                color="secondary"
                inputProps={{ 'aria-label': 'Mostrar feedbacks recebidos por outros meios' }}
              />
            </Box>
            {showManualTestimonials ? (
              <ul>
                {manualTestimonials.map((testimonial) => (
                  <li key={testimonial.id}>
                    <Typography component="strong" variant="subtitle1">{testimonial.author}</Typography>
                    <Typography component="span" variant="caption">{testimonial.channel}</Typography>
                    <Typography component="p" variant="body2">{testimonial.message}</Typography>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography component="p" variant="body2">
                Feedbacks externos ocultos. Ative o switch para visualizar novamente.
              </Typography>
            )}
          </Paper>
        </Container>
      </section>

      {renderSectionDivider('Fale com a Carliz')}

      <section id="contato" className="contact-hero">
        <Paper
          className="contact-panel"
          elevation={6}
          sx={{
            width: 'min(100%, 760px)',
            p: { xs: 2.5, md: 4 },
            borderRadius: 4,
            background: 'rgba(59, 23, 43, 0.55)',
            backdropFilter: 'blur(2px)',
            border: '1px solid rgba(255, 255, 255, 0.24)',
            color: 'inherit',
          }}
        >
          <Typography component="h2" variant="h4">Contato</Typography>
          <Chip
            label="Resposta média em até 20 minutos"
            color="success"
            size="small"
            sx={{ mt: 1, mb: 1.2, fontWeight: 600 }}
          />
          <Typography component="p" variant="body1">Fale com a nossa equipe para encomendas especiais e eventos.</Typography>
          <Tabs
            value={selectedContactTab}
            onChange={(_event, newValue) => setSelectedContactTab(newValue)}
            aria-label="Canais de atendimento"
            className="contact-tabs"
            sx={{ mb: 1.5 }}
          >
            <Tab value="whatsapp" label="WhatsApp" sx={{ textTransform: 'none', fontWeight: 700 }} />
            <Tab value="telefone" label="Telefone" sx={{ textTransform: 'none', fontWeight: 700 }} />
            <Tab value="email" label="E-mail" sx={{ textTransform: 'none', fontWeight: 700 }} />
          </Tabs>

          {selectedContactTab === 'whatsapp' ? (
            <Typography component="p" variant="body1">
              WhatsApp:{' '}
              <Tooltip title="Clique para abrir a conversa no WhatsApp" arrow>
                <Link href="https://wa.me/5511992175496" target="_blank" rel="noreferrer" underline="hover">
                  +55 11 99217-5496
                </Link>
              </Tooltip>
            </Typography>
          ) : null}
          {selectedContactTab === 'telefone' ? (
            <Typography component="p" variant="body1">
              Telefone:{' '}
              <Link href="tel:+5511992175496" underline="hover">
                +55 11 99217-5496
              </Link>
            </Typography>
          ) : null}
          {selectedContactTab === 'email' ? (
            <Typography component="p" variant="body1">
              Email:{' '}
              <Link href="mailto:voce@email.com" underline="hover">
                voce@email.com
              </Link>
            </Typography>
          ) : null}
          <Button variant="contained" size="small" onClick={handleContactTipToggle} sx={{ mt: 1 }}>
            Horários de atendimento
          </Button>
          <Popper open={isContactTipOpen} anchorEl={contactTipAnchor} placement="top-start" sx={{ zIndex: 10 }}>
            <ClickAwayListener onClickAway={() => setContactTipAnchor(null)}>
              <Paper sx={{ p: 2, maxWidth: 280, mb: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Atendimento no WhatsApp
                </Typography>
                <Typography variant="body2">
                  Resposta média em até 20 minutos durante o horário comercial.
                </Typography>
              </Paper>
            </ClickAwayListener>
          </Popper>
        </Paper>
      </section>

      {renderSectionDivider('Acompanhe no Instagram')}

      <section id="instagram" className="instagram-section">
        <Container maxWidth="xl" className="page-container">
          <header className="instagram-header">
            <Typography component="h2" variant="h4">Instagram</Typography>
            <Typography component="p" variant="body1">Confira nosso perfil @_carlizdoces e acompanhe as novidades.</Typography>
          </header>

          <Box className="instagram-grid">
            {instagramPosts.map((post) => (
              <Paper key={post.id} component="article" elevation={3} className="instagram-card">
                <Link
                  href={instagramProfileLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Abrir Instagram da Carliz Doces"
                  underline="none"
                >
                  <img src={post.imageUrl} alt={post.alt} loading="lazy" />
                </Link>
              </Paper>
            ))}
          </Box>
        </Container>
      </section>

      <footer className="footer">
        <Container maxWidth="lg" className="page-container footer-inner">
          <div className="brand">
            <img className="brand-logo" src={brandLogo.src} alt={brandLogo.alt} />
          </div>
          <Typography component="small" variant="body2">©2024 Carliz Doces</Typography>
          <ul>
            {navItems.map((item) => (
              <li key={item.sectionId}>
                <Link href={`#${item.sectionId}`} underline="hover" color="inherit">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="metrics">
            {metrics.map(([label, value]) => (
              <Typography key={label} component="span" variant="body2">
                {label}: {value}
              </Typography>
            ))}
          </div>
        </Container>
      </footer>

      <Box sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: (theme) => theme.zIndex.tooltip }}>
        <SpeedDial ariaLabel="Chat para tirar dúvidas" icon={<SpeedDialIcon />} sx={{ position: 'static' }}>
          {chatActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      </Box>
    </Box>
  )
}
