import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Box, Container, Snackbar } from '@mui/material'
import { BRL, announcementChannels, instagramPosts, instagramProfileLink, manualTestimonials, metrics, navItems, paymentMethods, seasonalProducts, topShowcaseSlides, updates, whatsappNumber } from '../data/siteData'
import { useCart } from '../hooks/useCart'
import { useWhatsAppOrderLink } from '../hooks/useWhatsAppOrderLink'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { FloatingActions } from '../components/layout/FloatingActions'
import { SectionDivider } from '../components/ui/SectionDivider'
import { HeroSection } from '../features/home/sections/HeroSection'
import { AboutSection } from '../features/home/sections/AboutSection'
import { ShowcaseSection } from '../features/home/sections/ShowcaseSection'
import { OrderSection } from '../features/home/sections/OrderSection'
import { LocationSection } from '../features/home/sections/LocationSection'

const ContactSection = lazy(() => import('../components/sections/ContactSection'))
const TestimonialsSection = lazy(() => import('../components/sections/TestimonialsSection'))
const InstagramSection = lazy(() => import('../components/sections/InstagramSection'))
const UpdatesSection = lazy(() => import('../components/sections/UpdatesSection'))

export function HomePage() {
  const wrapperRef = useRef(null)
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
  const [communityTestimonials] = useState(manualTestimonials)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [favoriteProductIds, setFavoriteProductIds] = useState([])
  const [favoriteCounts, setFavoriteCounts] = useState({})
  const [totalLikes, setTotalLikes] = useState(0)
  const [hasLikedStore, setHasLikedStore] = useState(false)
  const [showLikeCelebration, setShowLikeCelebration] = useState(false)

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

  const handleFavoriteProduct = (item) => {
    setFavoriteProductIds((currentFavorites) => {
      const alreadyFavorite = currentFavorites.includes(item.id)
      if (alreadyFavorite) {
        setSnackbar({ open: true, message: `${item.name} removido dos seus favoritos.`, severity: 'info' })
        return currentFavorites.filter((id) => id !== item.id)
      }

      setFavoriteCounts((currentCounts) => ({
        ...currentCounts,
        [item.id]: (currentCounts[item.id] ?? 0) + 1,
      }))
      setSnackbar({ open: true, message: `${item.name} adicionado aos favoritos!`, severity: 'success' })
      return [...currentFavorites, item.id]
    })
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
    try {
      const savedLikes = Number(window.localStorage.getItem('carliz-store-likes') ?? '0')
      const normalizedLikes = Number.isFinite(savedLikes) ? Math.max(0, Math.floor(savedLikes)) : 0
      setTotalLikes(normalizedLikes)
      setHasLikedStore(window.localStorage.getItem('carliz-store-liked') === 'true')
    } catch {
      setTotalLikes(0)
      setHasLikedStore(false)
    }
  }, [])

  const handleToggleLike = () => {
    setHasLikedStore((currentLiked) => {
      const nextLiked = !currentLiked

      setTotalLikes((currentLikes) => {
        const nextLikes = nextLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)

        try {
          window.localStorage.setItem('carliz-store-likes', String(nextLikes))
          window.localStorage.setItem('carliz-store-liked', String(nextLiked))
        } catch {
          // Ignora erro de armazenamento local para não bloquear o fluxo principal.
        }

        return nextLikes
      })

      setShowLikeCelebration(nextLiked)
      setSnackbar({
        open: true,
        message: nextLiked ? '🎉 Obrigado pelo carinho! Você adoçou nosso dia! 🍫✨' : '💛 Curtida removida. Quando quiser, é só favoritar de novo!',
        severity: nextLiked ? 'success' : 'info',
      })

      return nextLiked
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

    let ticking = false

    const updateScrollMotion = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0

      wrapperElement.style.setProperty('--scroll-y', `${scrollTop.toFixed(1)}px`)
      wrapperElement.style.setProperty('--scroll-progress', progress.toFixed(4))
      wrapperElement.style.setProperty('--scroll-wave', Math.sin(progress * Math.PI * 2).toFixed(4))
      wrapperElement.classList.toggle('is-scrolled', scrollTop > 32)

      ticking = false
    }

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(updateScrollMotion)
    }

    updateScrollMotion()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  useEffect(() => {
    const revealableSelectors = [
      '.hero',
      '.content-block',
      '.summary-band',
      '.photo-band article',
      '.photo-highlight',
      '.order-item',
      '.order-summary',
      '.testimonials-grid > *',
      '.instagram-card',
      '.contact-panel',
      '.footer-inner',
    ]

    const revealableElements = revealableSelectors
      .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .filter((element, index, self) => self.indexOf(element) === index)

    revealableElements.forEach((element) => {
      element.classList.add('motion-reveal')
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    revealableElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <Box id="top" ref={wrapperRef} className={`site-wrapper${isDarkMode ? ' dark-mode' : ''}`}>
      <Header
        navItems={navItems}
        isDarkMode={isDarkMode}
        onToggleDarkMode={setIsDarkMode}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <main>
        <HeroSection topShowcaseSlides={topShowcaseSlides} />
        <AboutSection />
        <SectionDivider label="Cardápio de Páscoa" />

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
        />

        <Container maxWidth="lg" className="page-container">
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

          <LocationSection
            orderPreferences={orderPreferences}
            setOrderPreferences={setOrderPreferences}
            setDeliveryMethod={setDeliveryMethod}
          />
        </Container>

        <Suspense fallback={<Container><Alert severity="info">Carregando seção...</Alert></Container>}>
          <TestimonialsSection testimonials={communityTestimonials} />
          <UpdatesSection updates={updates} announcementChannels={announcementChannels} />
          <ContactSection
            contactForm={contactForm}
            onChange={(field, value) => setContactForm((current) => ({ ...current, [field]: value }))}
            onSubmit={handleContactSubmit}
            contactTipOpen={contactTipOpen}
            onToggleTip={() => setContactTipOpen((open) => !open)}
          />
          <InstagramSection instagramPosts={instagramPosts} instagramProfileLink={instagramProfileLink} />
        </Suspense>
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
