import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Box, Container, Snackbar } from '@mui/material'
import { motion } from 'motion/react'
import { BRL, announcementChannels, instagramPosts, instagramProfileLink, manualTestimonials, metrics, navItems, paymentMethods, seasonalProducts, topShowcaseSlides, updates, whatsappNumber } from '../data/siteData'
import { useCart } from '../hooks/useCart'
import { useWhatsAppOrderLink } from '../hooks/useWhatsAppOrderLink'
import { useProductRatings } from '../hooks/useProductRatings'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { FloatingActions } from '../components/layout/FloatingActions'
import { SectionDivider } from '../components/ui/SectionDivider'
import { HeroSection } from '../features/home/sections/HeroSection'
import { AboutSection } from '../features/home/sections/AboutSection'
import { ShowcaseSection } from '../features/home/sections/ShowcaseSection'
import { OrderSection } from '../features/home/sections/OrderSection'
import { LocationSection } from '../features/home/sections/LocationSection'
import { ParticlesBackground } from '../components/ui/ParticlesBackground'

const ContactSection = lazy(() => import('../components/sections/ContactSection'))
const TestimonialsSection = lazy(() => import('../components/sections/TestimonialsSection'))
const InstagramSection = lazy(() => import('../components/sections/InstagramSection'))
const UpdatesSection = lazy(() => import('../components/sections/UpdatesSection'))
const MotionDiv = motion.div
const COUNT_API_BASE_URL = 'https://api.countapi.xyz'
const COUNT_API_NAMESPACE = 'carlizdoces-website'

const getCounterValue = async (key) => {
  try {
    const response = await fetch(`${COUNT_API_BASE_URL}/get/${COUNT_API_NAMESPACE}/${key}`)
    if (!response.ok) {
      return 0
    }

    const data = await response.json()
    const value = Number(data?.value ?? 0)
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
  } catch {
    return 0
  }
}

const incrementCounterValue = async (key, amount = 1) => {
  try {
    const response = await fetch(`${COUNT_API_BASE_URL}/hit/${COUNT_API_NAMESPACE}/${key}?amount=${amount}`)
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const value = Number(data?.value ?? 0)
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
  } catch {
    return null
  }
}

export function HomePage() {
  const wrapperRef = useRef(null)
  const [introStage, setIntroStage] = useState('message')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeProductStep, setActiveProductStep] = useState(0)
  const [maxShowcasePrice, setMaxShowcasePrice] = useState(Math.max(...seasonalProducts.map((item) => item.price)))
  const [customizations, setCustomizations] = useState({})
  const [orderCustomer, setOrderCustomer] = useState({ name: '', phone: '' })
  const [orderPreferences] = useState({ needsDelivery: false, receiveOffers: true })
  const [deliveryMethod] = useState('Retirada na loja')
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactTipOpen, setContactTipOpen] = useState(false)
  const [communityTestimonials] = useState(manualTestimonials)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [favoriteProductIds, setFavoriteProductIds] = useState([])
  const [favoriteCounts, setFavoriteCounts] = useState({})
  const [totalLikes, setTotalLikes] = useState(0)
  const [hasLikedStore, setHasLikedStore] = useState(false)
  const [showLikeCelebration, setShowLikeCelebration] = useState(false)

  const { addItem, removeItem, selectedItems, totalItems, totalPrice } = useCart(seasonalProducts)
  const { ratingsByProductId, submitRating, isGlobalRatingsActive } = useProductRatings(seasonalProducts)

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
    whatsappNumber,
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

  const handleFavoriteProduct = async (item) => {
    const counterKey = `product-${item.id}`

    setFavoriteProductIds((currentFavorites) => (currentFavorites.includes(item.id) ? currentFavorites : [...currentFavorites, item.id]))
    setFavoriteCounts((currentCounts) => ({
      ...currentCounts,
      [item.id]: (currentCounts[item.id] ?? 0) + 1,
    }))

    const updatedValue = await incrementCounterValue(counterKey)
    if (updatedValue !== null) {
      setFavoriteCounts((currentCounts) => ({
        ...currentCounts,
        [item.id]: updatedValue,
      }))
      setSnackbar({ open: true, message: `${item.name} recebeu +1 coração!`, severity: 'success' })
      return
    }

    setSnackbar({ open: true, message: `${item.name} recebeu +1 coração neste dispositivo.`, severity: 'info' })
  }

  const handleRateProduct = async (item, rating) => {
    const result = await submitRating(item.id, rating)

    if (!result.ok) {
      setSnackbar({ open: true, message: 'Não foi possível registrar sua avaliação.', severity: 'error' })
      return
    }

    if (result.unchanged) {
      setSnackbar({ open: true, message: `Você manteve ${rating} estrela(s) para ${item.name}.`, severity: 'info' })
      return
    }

    if (result.isRemote) {
      setSnackbar({ open: true, message: `Avaliação enviada! Obrigado por avaliar ${item.name}.`, severity: 'success' })
      return
    }

    setSnackbar({ open: true, message: `Avaliação salva neste dispositivo para ${item.name}.`, severity: 'info' })
  }

  const handleContactSubmit = (event) => {
    event.preventDefault()

    const name = contactForm.name.trim()
    const email = contactForm.email.trim()
    const message = contactForm.message.trim()

    if (!name || !message) {
      setSnackbar({ open: true, message: 'Preencha nome e mensagem para enviar no WhatsApp.', severity: 'warning' })
      return
    }

    const formattedMessage = [
      'Olá, Carliz Doces! Vim pelo site e gostaria de atendimento. 🍫',
      '',
      `*Nome:* ${name}`,
      email ? `*Email:* ${email}` : null,
      '*Mensagem:*',
      message,
    ]
      .filter(Boolean)
      .join('\n')

    const whatsappContactLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(formattedMessage)}`

    window.open(whatsappContactLink, '_blank', 'noopener,noreferrer')
    setSnackbar({ open: true, message: 'Mensagem preparada! Continue o envio no WhatsApp.', severity: 'success' })
  }

  useEffect(() => {
    const openingTimerId = window.setTimeout(() => {
      setIntroStage('opening')
    }, 2200)

    const finishTimerId = window.setTimeout(() => {
      setIntroStage('hidden')
    }, 4200)

    return () => {
      window.clearTimeout(openingTimerId)
      window.clearTimeout(finishTimerId)
    }
  }, [])

  useEffect(() => {
    if (introStage === 'hidden') return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [introStage])

  useEffect(() => {
    const wrapperElement = wrapperRef.current
    if (!wrapperElement) return undefined

    const handlePointerMove = (event) => {
      const { clientX, clientY } = event
      const normalizedX = clientX / window.innerWidth
      const normalizedY = clientY / window.innerHeight

      wrapperElement.style.setProperty('--pointer-x', normalizedX.toFixed(3))
      wrapperElement.style.setProperty('--pointer-y', normalizedY.toFixed(3))
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])


  useEffect(() => {
    const footerElement = document.querySelector('.footer')
    if (!footerElement) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollTop(entry.isIntersecting)
      },
      { threshold: 0.2 },
    )

    observer.observe(footerElement)

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGoToOrderSection = (event) => {
    event.preventDefault()
    const orderSection = document.getElementById('realizar-pedido')
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    window.history.replaceState(null, '', '#realizar-pedido')
  }

  useEffect(() => {
    let isMounted = true

    const loadGlobalHearts = async () => {
      const [storeLikes, ...productLikes] = await Promise.all([
        getCounterValue('store-likes'),
        ...seasonalProducts.map((product) => getCounterValue(`product-${product.id}`)),
      ])

      if (!isMounted) return

      setTotalLikes(storeLikes)

      setFavoriteCounts(() =>
        seasonalProducts.reduce((counts, product, index) => ({
          ...counts,
          [product.id]: productLikes[index] ?? 0,
        }), {}),
      )

      try {
        setHasLikedStore(window.localStorage.getItem('carliz-store-liked') === 'true')
      } catch {
        setHasLikedStore(false)
      }
    }

    try {
      const savedLiked = window.localStorage.getItem('carliz-store-liked') === 'true'
      setHasLikedStore(savedLiked)
      setTotalLikes((currentLikes) => Math.max(currentLikes, savedLiked ? 1 : 0))
    } catch {
      setHasLikedStore(false)
    }

    loadGlobalHearts()

    return () => {
      isMounted = false
    }
  }, [])

  const handleToggleLike = async () => {
    setHasLikedStore(true)
    setShowLikeCelebration(true)
    setTotalLikes((currentLikes) => currentLikes + 1)

    try {
      window.localStorage.setItem('carliz-store-liked', 'true')
    } catch {
      // Ignora erro de armazenamento local para não bloquear o fluxo principal.
    }

    const updatedValue = await incrementCounterValue('store-likes')
    if (updatedValue !== null) {
      setTotalLikes(updatedValue)
      setSnackbar({
        open: true,
        message: '🎉 Obrigado pelo carinho! +1 coração registrado para todos verem! 🍫✨',
        severity: 'success',
      })
      return
    }

    setSnackbar({
      open: true,
      message: '💛 +1 coração registrado localmente. Sem conexão para sincronizar agora.',
      severity: 'warning',
    })
  }

  useEffect(() => {
    if (!showLikeCelebration) return undefined

    const timeoutId = window.setTimeout(() => {
      setShowLikeCelebration(false)
    }, 1400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [showLikeCelebration])

  useEffect(() => {
    const wrapperElement = wrapperRef.current
    if (!wrapperElement) return undefined

    let animationFrameId = 0
    let targetScrollTop = 0
    let currentScrollTop = 0

    const speed = 0.12

    const updateScrollMotion = () => {
      const distance = targetScrollTop - currentScrollTop
      currentScrollTop += distance * speed

      if (Math.abs(distance) < 0.35) {
        currentScrollTop = targetScrollTop
      }

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? currentScrollTop / scrollHeight : 0

      wrapperElement.style.setProperty('--scroll-y', `${currentScrollTop.toFixed(1)}px`)
      wrapperElement.style.setProperty('--scroll-progress', progress.toFixed(4))
      wrapperElement.style.setProperty('--scroll-wave', Math.sin(progress * Math.PI * 1.2).toFixed(4))
      wrapperElement.classList.toggle('is-scrolled', currentScrollTop > 32)

      if (Math.abs(targetScrollTop - currentScrollTop) >= 0.35) {
        animationFrameId = window.requestAnimationFrame(updateScrollMotion)
      } else {
        animationFrameId = 0
      }
    }

    const handleScroll = () => {
      targetScrollTop = window.scrollY || window.pageYOffset || 0

      if (!animationFrameId) {
        animationFrameId = window.requestAnimationFrame(updateScrollMotion)
      }
    }

    targetScrollTop = window.scrollY || window.pageYOffset || 0
    currentScrollTop = targetScrollTop
    updateScrollMotion()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const revealAnimation = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.55, ease: 'easeOut' },
  }

  return (
    <Box id="top" ref={wrapperRef} className="site-wrapper">
      {introStage !== 'hidden' && (
        <Box className={`intro-curtain intro-curtain-${introStage}`}>
          <Box className="intro-curtain-panel intro-curtain-left" />
          <Box className="intro-curtain-panel intro-curtain-right" />
          <Box className="intro-center-content">
            <Box component="img" src="/images/logo/logo-carlizdoces.jpg" alt="Logo da Carliz Doces" className="intro-logo" />
            <Box className="intro-clown-wrap">
              <Box component="img" src="/images/tela-apresentacao/palhaco.png" alt="Palhaços anunciando o espetáculo" className="intro-clown" />
              <Box component="p" className="intro-message">Respeeeitável púúúúblico! 🎪✨
              Com muita alegria, muito brilho e uma pitadinha de travessura, apresentaaamos… Carliz Doces! 🍭🍬🤡</Box>
            </Box>
          </Box>
        </Box>
      )}

      <ParticlesBackground />

      <Header
        navItems={navItems}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <main>
        <Container maxWidth="lg" className="page-container section-stack">
        <MotionDiv {...revealAnimation}>
          <HeroSection topShowcaseSlides={topShowcaseSlides} />
        </MotionDiv>

        <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.05 }}>
          <SectionDivider label="Quem somos" />
        </MotionDiv>

        <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.08 }}>
          <AboutSection />
        </MotionDiv>

        <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.1 }}>
          <SectionDivider label="Cardápio de Páscoa" />
        </MotionDiv>

        <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.15 }}>
          <ShowcaseSection
            BRL={BRL}
            seasonalProducts={seasonalProducts}
            visibleShowcaseProducts={visibleShowcaseProducts}
            selectedShowcaseProduct={selectedShowcaseProduct}
            activeProductStep={activeProductStep}
            setActiveProductStep={setActiveProductStep}
            maxShowcasePrice={maxShowcasePrice}
            setMaxShowcasePrice={setMaxShowcasePrice}
            addItem={addItem}
            removeItem={removeItem}
            onShareProduct={handleShareProduct}
            favoriteCounts={favoriteCounts}
            favoriteProductIds={favoriteProductIds}
            onFavoriteProduct={handleFavoriteProduct}
            productRatings={ratingsByProductId}
            onRateProduct={handleRateProduct}
            isGlobalRatingsActive={isGlobalRatingsActive}
          />
        </MotionDiv>

        <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.18 }}>
          <SectionDivider label="Pedidos de Doces" />
        </MotionDiv>

        <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.19 }}>
          <ShowcaseSection
            BRL={BRL}
            seasonalProducts={seasonalProducts}
            visibleShowcaseProducts={visibleShowcaseProducts}
            selectedShowcaseProduct={selectedShowcaseProduct}
            activeProductStep={activeProductStep}
            setActiveProductStep={setActiveProductStep}
            maxShowcasePrice={maxShowcasePrice}
            setMaxShowcasePrice={setMaxShowcasePrice}
            addItem={addItem}
            removeItem={removeItem}
            onShareProduct={handleShareProduct}
            favoriteCounts={favoriteCounts}
            favoriteProductIds={favoriteProductIds}
            onFavoriteProduct={handleFavoriteProduct}
            productRatings={ratingsByProductId}
            onRateProduct={handleRateProduct}
            isGlobalRatingsActive={isGlobalRatingsActive}
          />
        </MotionDiv>

          <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.2 }}>
            <SectionDivider label="Realizar pedido" />
          </MotionDiv>

          <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.22 }}>
            <OrderSection
              BRL={BRL}
              orderCustomer={orderCustomer}
              setOrderCustomer={setOrderCustomer}
              selectedItems={selectedItems}
              customizations={customizations}
              setCustomizations={setCustomizations}
              paymentMethods={paymentMethods}
              totalPrice={totalPrice}
              totalItems={totalItems}
              whatsappLink={whatsappLink}
            />
          </MotionDiv>

          <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.24 }}>
            <SectionDivider label="Onde estamos" />
          </MotionDiv>

          <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.26 }}>
            <LocationSection />
          </MotionDiv>

        <Suspense fallback={<Container><Alert severity="info">Carregando seção...</Alert></Container>}>
          <Container disableGutters className="section-stack">
            <MotionDiv {...revealAnimation}><SectionDivider label="Depoimentos" /></MotionDiv>
            <MotionDiv {...revealAnimation}><TestimonialsSection testimonials={communityTestimonials} /></MotionDiv>
            <MotionDiv {...revealAnimation}><SectionDivider label="Novidades" /></MotionDiv>
            <MotionDiv {...revealAnimation}><UpdatesSection updates={updates} announcementChannels={announcementChannels} /></MotionDiv>
            <MotionDiv {...revealAnimation}><SectionDivider label="Contato" /></MotionDiv>
            <MotionDiv {...revealAnimation}>
              <ContactSection
                contactForm={contactForm}
                onChange={(field, value) => setContactForm((current) => ({ ...current, [field]: value }))}
                onSubmit={handleContactSubmit}
                contactTipOpen={contactTipOpen}
                onToggleTip={() => setContactTipOpen((open) => !open)}
              />
            </MotionDiv>
            <MotionDiv {...revealAnimation}><SectionDivider label="Instagram" /></MotionDiv>
            <MotionDiv {...revealAnimation}><InstagramSection instagramPosts={instagramPosts} instagramProfileLink={instagramProfileLink} /></MotionDiv>
          </Container>
        </Suspense>
        </Container>
      </main>

      <Footer navItems={navItems} metrics={metrics} />
      <FloatingActions
        totalItems={totalItems}
        showScrollTop={showScrollTop}
        onScrollTop={handleScrollTop}
        totalLikes={totalLikes}
        hasLiked={hasLikedStore}
        onToggleLike={handleToggleLike}
        showLikeCelebration={showLikeCelebration}
        onGoToOrderSection={handleGoToOrderSection}
        isFooterVisible={showScrollTop}
      />

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
