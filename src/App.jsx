import { useMemo, useState } from 'react'
import ShareIcon from '@mui/icons-material/Share'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  ClickAwayListener,
  Container,
  Drawer,
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
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { Carousel, CarouselSlide } from 'material-ui-carousel'
import './App.css'

const navItems = [
  { label: 'Quem somos', sectionId: 'quem-somos' },
  { label: 'Instagram', sectionId: 'instagram' },
  { label: 'Onde estamos', sectionId: 'onde-estamos' },
  { label: 'Realizar pedido', sectionId: 'realizar-pedido' },
  { label: 'Ovos de páscoa', sectionId: 'ovos-de-pascoa' },
  { label: 'Contato', sectionId: 'contato' },
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
  },
  {
    id: 'ferrero',
    imageUrl: '/images/ferrero.svg',
    alt: 'Campanha de sorteio com ovo Ferrero Rocher',
    title: 'Sorteio Ferrero Rocher',
    description: 'Promoção especial para quem encomenda ovos de colher.',
  },
  {
    id: 'brigadeiro',
    imageUrl: '/images/brigadeiro.svg',
    alt: 'Brigadeiros artesanais da Carliz Doces',
    title: 'Brigadeiros artesanais',
    description: 'Sabores para festas e lembranças com a cara da Carliz.',
  },
]


const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function App() {
  const [cart, setCart] = useState({})
  const [customizations, setCustomizations] = useState({})
  const [orderTipAnchor, setOrderTipAnchor] = useState(null)
  const [contactTipAnchor, setContactTipAnchor] = useState(null)
  const [activeProductStep, setActiveProductStep] = useState(0)
  const [selectedContactTab, setSelectedContactTab] = useState('whatsapp')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const chatActions = [
    {
      name: 'WhatsApp',
      icon: '💬',
      onClick: () => window.open('https://wa.me/5511992175496', '_blank', 'noopener,noreferrer'),
    },
    {
      name: 'Instagram',
      icon: '📸',
      onClick: () => window.open(instagramProfileLink, '_blank', 'noopener,noreferrer'),
    },
  ]

  const handleNextProduct = () => {
    setActiveProductStep((current) => Math.min(current + 1, seasonalProducts.length - 1))
  }

  const handleBackProduct = () => {
    setActiveProductStep((current) => Math.max(current - 1, 0))
  }


  return (
    <Box id="top" className="site-wrapper">
      <AppBar position="sticky" color="transparent" elevation={0} className="topbar">
        <Container maxWidth="xl" className="page-container">
          <Toolbar disableGutters className="topbar-inner">
            <Link href="#top" underline="none" color="inherit" className="topbar-brand">
              <Box component="img" src="/images/banner-carliz.svg" alt="Logo da Carliz Doces" className="brand-logo" />
              <Typography component="span" className="brand-name">
                Carliz Doces
              </Typography>
            </Link>

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

            <IconButton
              color="inherit"
              aria-label="Abrir menu"
              edge="end"
              onClick={() => setIsMobileMenuOpen(true)}
              className="topbar-menu-button"
            >
              <Box component="span" sx={{ fontSize: 26, lineHeight: 1 }}>☰</Box>
            </IconButton>
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
                    <p>Destaque no topo</p>
                    <h1>{slide.title}</h1>
                    <span>{slide.description}</span>
                  </div>
                </article>
              </CarouselSlide>
            ))}
          </Carousel>
        </Container>
      </section>

      <section id="quem-somos" className="summary-band centered">
        <Container maxWidth="lg" className="page-container">
          <h2>QUEM SOMOS</h2>
          <p>
            Somos a Carliz doces realizamos doces a pronta entrega para festas, casamentos, aniversários e
            ovos de páscoa.
          </p>
        </Container>
      </section>

      <section id="ovos-de-pascoa" className="photo-band">
        <Container maxWidth="xl" className="page-container">
          <header className="photo-band-head">
            <h2>Ovos de Páscoa</h2>
            <p>Passe as imagens com os botões para navegar pelos sabores e apresentações disponíveis.</p>
          </header>

          {selectedShowcaseProduct ? (
            <aside className="photo-highlight" aria-live="polite">
              <img src={selectedShowcaseProduct.image} alt={selectedShowcaseProduct.name} />
              <div>
                <p className="highlight-tag">Catálogo de temporada</p>
                <h3>{selectedShowcaseProduct.name}</h3>
                <p>
                  {selectedShowcaseProduct.weight} de pura cremosidade com sabor {selectedShowcaseProduct.flavor}.
                  Deslize pelo catálogo para comparar sabores antes de pedir.
                </p>
                <strong>{BRL.format(selectedShowcaseProduct.price)}</strong>
                <Button variant="contained" onClick={() => addItem(selectedShowcaseProduct.id)}>
                  Adicionar ao pedido
                </Button>
              </div>
            </aside>
          ) : null}

          <MobileStepper
            variant="dots"
            steps={seasonalProducts.length}
            position="static"
            activeStep={activeProductStep}
            className="showcase-stepper"
            nextButton={
              <Button size="small" onClick={handleNextProduct} disabled={activeProductStep === seasonalProducts.length - 1}>
                Próximo →
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBackProduct} disabled={activeProductStep === 0}>
                ← Anterior
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

      <section id="realizar-pedido" className="order-section">
        <Container maxWidth="xl" className="page-container">
          <h2>Realizar pedido</h2>
          <p>Use os produtos acima como base e ajuste nomes/imagens no estoque para atualizar automaticamente.</p>
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
                expandIcon={<span aria-hidden="true">⌄</span>}
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
              <AccordionSummary expandIcon={<span aria-hidden="true">⌄</span>} aria-controls="pedido-pagamento-content" id="pedido-pagamento-header">
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
                    <h3>{item.name}</h3>
                    <small>
                      {item.weight} • {item.flavor}
                    </small>
                    <span>{BRL.format(item.price)}</span>
                    <button
                      type="button"
                      className="share-product"
                      onClick={() => handleShareProduct(item)}
                      aria-label={`Compartilhar ${item.name}`}
                      title="Compartilhar doce"
                    >
                      <ShareIcon fontSize="small" aria-hidden="true" />
                      Compartilhar
                    </button>
                  </div>
                  <div className="qty-controls">
                    <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remover ${item.name}`}>
                      -
                    </button>
                    <strong>{cart[item.id] ?? 0}</strong>
                    <button type="button" onClick={() => addItem(item.id)} aria-label={`Adicionar ${item.name}`}>
                      +
                    </button>
                  </div>
                </ImageListItem>
              ))}
            </ImageList>

            <aside className="order-summary">
              <h3>Resumo do pedido</h3>
              <p>
                <strong>{totalItems}</strong> item(ns) no carrinho
              </p>
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
                  <h4>Detalhes por doce</h4>
                  <p>Informe os dados de cada item para enviar um pedido completo no WhatsApp.</p>

                  {selectedItems.map((item) => (
                    <div key={item.id} className="order-detail-card">
                      <strong>{item.name}</strong>
                      <span>Quantidade: {item.quantity}</span>
                      <span>
                        Preço: {BRL.format(item.price)} (subtotal {BRL.format(item.subtotal)})
                      </span>
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

              <p className="summary-total">Total: {BRL.format(totalPrice)}</p>
              <Link
                className="finish-order"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                underline="none"
              >
                Finalizar pedido no WhatsApp
              </Link>
            </aside>
          </Box>
        </Container>
      </section>

      <section id="onde-estamos" className="content-block centered">
        <Container maxWidth="md" className="page-container">
          <div className="section-icon">🧁</div>
          <h2>ONDE ESTAMOS</h2>
          <p>Visite nossa loja para retirada e encomendas presenciais.</p>
          <p>Atendemos retirada e entregas locais com agendamento.</p>
          <p>Segunda a Sábado • 09h às 19h | Domingo • 10h às 15h</p>
          <p>Próximo à Praça Central e estação de metrô.</p>
          <Box sx={{ mt: 2, textAlign: 'left' }}>
            <Accordion>
              <AccordionSummary expandIcon={<span aria-hidden="true">⌄</span>} aria-controls="retirada-content" id="retirada-header">
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
              <AccordionSummary expandIcon={<span aria-hidden="true">⌄</span>} aria-controls="eventos-content" id="eventos-header">
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

      <section id="contato" className="contact-hero">
        <Box>
          <h2>Contato</h2>
          <p>Fale com a nossa equipe para encomendas especiais e eventos.</p>
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
            <p>
              WhatsApp:{' '}
              <Link href="https://wa.me/5511992175496" target="_blank" rel="noreferrer" underline="hover">
                +55 11 99217-5496
              </Link>
            </p>
          ) : null}
          {selectedContactTab === 'telefone' ? (
            <p>
              Telefone:{' '}
              <Link href="tel:+5511992175496" underline="hover">
                +55 11 99217-5496
              </Link>
            </p>
          ) : null}
          {selectedContactTab === 'email' ? (
            <p>
              Email:{' '}
              <Link href="mailto:voce@email.com" underline="hover">
                voce@email.com
              </Link>
            </p>
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
        </Box>
      </section>

      <section id="instagram" className="instagram-section">
        <Container maxWidth="xl" className="page-container">
          <header className="instagram-header">
            <h2>Instagram</h2>
            <p>Confira nosso perfil @_carlizdoces e acompanhe as novidades.</p>
          </header>

          <Box className="instagram-grid">
            {instagramPosts.map((post) => (
              <article key={post.id} className="instagram-card">
                <Link
                  href={instagramProfileLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Abrir Instagram da Carliz Doces"
                  underline="none"
                >
                  <img src={post.imageUrl} alt={post.alt} loading="lazy" />
                </Link>
              </article>
            ))}
          </Box>
        </Container>
      </section>

      <footer className="footer">
        <Container maxWidth="lg" className="page-container footer-inner">
          <div className="brand">
            <img className="brand-logo" src={brandLogo.src} alt={brandLogo.alt} />
          </div>
          <small>©2024 Carliz Doces</small>
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
              <span key={label}>
                {label}: {value}
              </span>
            ))}
          </div>
        </Container>
      </footer>

      <Box sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: (theme) => theme.zIndex.tooltip }}>
        <SpeedDial ariaLabel="Chat para tirar dúvidas" icon={<SpeedDialIcon />} sx={{ position: 'static' }}>
          {chatActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={<span aria-hidden="true">{action.icon}</span>}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      </Box>
    </Box>
  )
}
