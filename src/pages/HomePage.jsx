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
const LIKES_API_BASE_URL = '/api/likes'
const AUTH_USER_STORAGE_KEY = 'carliz-auth-user-id'
const AUTH_PROFILE_STORAGE_KEY = 'carliz-auth-user-profile'
const FAVORITE_PRODUCTS_STORAGE_KEY = 'carliz-favorite-products-liked'


const GOOGLE_AUTH_API_URL = '/api/auth/google'
const GOOGLE_CLIENT_ID_API_URL = '/api/auth/google-client-id'
const GOOGLE_CLIENT_ID_PLACEHOLDERS = ['SEU_CLIENT_ID', 'YOUR_CLIENT_ID', 'INSIRA_SEU_CLIENT_ID']

const normalizeGoogleClientId = (clientId) => {
  const normalized = String(clientId ?? '').trim()
  if (!normalized) return ''

  const upperValue = normalized.toUpperCase()
  const containsPlaceholder = GOOGLE_CLIENT_ID_PLACEHOLDERS.some((placeholder) => upperValue.includes(placeholder))
  if (containsPlaceholder) return ''

  return /\.apps\.googleusercontent\.com$/i.test(normalized) ? normalized : ''
}

const isEasterMenuProduct = (product) => product.image?.includes('/images/cardapio-de-pascoa/')
const isCandyOrderProduct = (product) => product.image?.includes('/images/pedidos-de-doces/')

const getStoredAuthenticatedProfile = () => {
  try {
    const rawProfile = window.localStorage.getItem(AUTH_PROFILE_STORAGE_KEY)
    if (!rawProfile) return null

    const parsed = JSON.parse(rawProfile)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

const getAuthenticatedUserId = () => {
  try {
    const storedUserId = window.localStorage.getItem(AUTH_USER_STORAGE_KEY)
    if (storedUserId && storedUserId.trim()) {
      return storedUserId.trim()
    }
  } catch {
    return ''
  }

  return ''
}

const fetchLikesSummary = async (userId) => {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : ''
  const response = await fetch(`${LIKES_API_BASE_URL}/summary${query}`)

  if (!response.ok) {
    throw new Error('likes-summary-failed')
  }

  return response.json()
}

const registerStoreLike = async (userId) => {
  const response = await fetch(`${LIKES_API_BASE_URL}/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })

  if (!response.ok) {
    throw new Error('store-like-failed')
  }

  return response.json()
}

const registerProductLike = async (productId, userId) => {
  const response = await fetch(`${LIKES_API_BASE_URL}/product/${encodeURIComponent(productId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })

  if (!response.ok) {
    throw new Error('product-like-failed')
  }

  return response.json()
}

export function HomePage() {
  const wrapperRef = useRef(null)
  const [introStage, setIntroStage] = useState('message')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [menuProductStep, setMenuProductStep] = useState(0)
  const [orderProductStep, setOrderProductStep] = useState(0)
  const [maxMenuShowcasePrice, setMaxMenuShowcasePrice] = useState(() => Math.max(...seasonalProducts.filter((item) => isEasterMenuProduct(item)).map((item) => item.price), 0))
  const [maxOrderShowcasePrice, setMaxOrderShowcasePrice] = useState(() => Math.max(...seasonalProducts.filter((item) => isCandyOrderProduct(item)).map((item) => item.price), 0))
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
  const [authenticatedUserId, setAuthenticatedUserId] = useState('')
  const [authenticatedUser, setAuthenticatedUser] = useState(null)
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false)
  const [googleClientId, setGoogleClientId] = useState(() => normalizeGoogleClientId(import.meta.env.VITE_GOOGLE_CLIENT_ID))
  const validSeasonalProductIds = useMemo(() => new Set(seasonalProducts.map((product) => product.id)), [])

  const easterMenuProducts = useMemo(() => seasonalProducts.filter((item) => isEasterMenuProduct(item)), [])
  const candyOrderProducts = useMemo(() => seasonalProducts.filter((item) => isCandyOrderProduct(item)), [])

  const { addItem, removeItem, selectedItems, totalItems, totalPrice } = useCart(seasonalProducts)
  const {
    ratingsByProductId: easterRatingsByProductId,
    submitRating: submitEasterRating,
    isGlobalRatingsActive: isEasterGlobalRatingsActive,
  } = useProductRatings(easterMenuProducts, { scopeKey: 'cardapio-de-pascoa' })
  const {
    ratingsByProductId: candyRatingsByProductId,
    submitRating: submitCandyRating,
    isGlobalRatingsActive: isCandyGlobalRatingsActive,
  } = useProductRatings(candyOrderProducts, { scopeKey: 'pedidos-de-doces' })

  const menuShowcaseProducts = useMemo(
    () => easterMenuProducts.filter((item) => item.price <= maxMenuShowcasePrice),
    [easterMenuProducts, maxMenuShowcasePrice],
  )
  const orderShowcaseProducts = useMemo(
    () => candyOrderProducts.filter((item) => item.price <= maxOrderShowcasePrice),
    [candyOrderProducts, maxOrderShowcasePrice],
  )
  const selectedMenuShowcaseProduct = menuShowcaseProducts[menuProductStep] ?? menuShowcaseProducts[0] ?? null
  const selectedOrderShowcaseProduct = orderShowcaseProducts[orderProductStep] ?? orderShowcaseProducts[0] ?? null

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
    if (!authenticatedUserId) {
      setSnackbar({ open: true, message: 'Faça login com Google para registrar corações.', severity: 'info' })
      handleGoogleLogin()
      return
    }

    if (favoriteProductIds.includes(item.id)) {
      setSnackbar({ open: true, message: `Você já curtiu ${item.name}.`, severity: 'info' })
      return
    }

    setFavoriteProductIds((currentFavorites) => [...currentFavorites, item.id])
    setFavoriteCounts((currentCounts) => ({
      ...currentCounts,
      [item.id]: (currentCounts[item.id] ?? 0) + 1,
    }))

    try {
      const result = await registerProductLike(item.id, authenticatedUserId)
      setFavoriteCounts((currentCounts) => ({
        ...currentCounts,
        [item.id]: Number(result.likes ?? currentCounts[item.id] ?? 0),
      }))
      setSnackbar({ open: true, message: `${item.name} recebeu +1 coração!`, severity: 'success' })
    } catch {
      setFavoriteProductIds((currentFavorites) => currentFavorites.filter((productId) => productId !== item.id))
      setFavoriteCounts((currentCounts) => ({
        ...currentCounts,
        [item.id]: Math.max(0, (currentCounts[item.id] ?? 1) - 1),
      }))
      setSnackbar({ open: true, message: 'Não foi possível registrar seu coração agora.', severity: 'error' })
    }
  }

  const handleRateProduct = async (item, rating, sectionType) => {
    const submitRating = sectionType === 'pedidos-de-doces' ? submitCandyRating : submitEasterRating
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

  const handleGoogleCredentialResponse = async (response) => {
    const credential = typeof response?.credential === 'string' ? response.credential : ''

    if (!credential) {
      setSnackbar({ open: true, message: 'Não foi possível concluir o login Google.', severity: 'error' })
      setIsGoogleLoginLoading(false)
      return
    }

    let profile = null

    try {
      const authResponse = await fetch(GOOGLE_AUTH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credential }),
      })

      if (!authResponse.ok) {
        throw new Error('google-auth-failed')
      }

      const authData = await authResponse.json()
      profile = authData?.user ?? null
    } catch {
      profile = null
    }

    if (!profile?.id) {
      setSnackbar({ open: true, message: 'Não foi possível validar seu login Google.', severity: 'error' })
      setIsGoogleLoginLoading(false)
      return
    }

    profile = {
      id: String(profile.id),
      name: String(profile.name ?? 'Usuário Google'),
      email: String(profile.email ?? ''),
      picture: String(profile.picture ?? ''),
    }

    setAuthenticatedUserId(profile.id)
    setAuthenticatedUser(profile)
    setIsGoogleLoginLoading(false)

    try {
      window.localStorage.setItem(AUTH_USER_STORAGE_KEY, profile.id)
      window.localStorage.setItem(AUTH_PROFILE_STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // Ignora erro de armazenamento local para não bloquear o fluxo principal.
    }

    fetchLikesSummary(profile.id)
      .then((summary) => {
        setTotalLikes(Number(summary?.store?.likes ?? 0))
        setHasLikedStore(Boolean(summary?.store?.likedByCurrentUser))

        const likedByCurrentUserById = summary?.products?.likedByCurrentUserById ?? {}
        const likesById = summary?.products?.likesById ?? {}

        setFavoriteCounts(() => seasonalProducts.reduce((counts, product) => ({
          ...counts,
          [product.id]: Number(likesById[product.id] ?? 0),
        }), {}))
        setFavoriteProductIds(() => seasonalProducts.filter((product) => likedByCurrentUserById[product.id]).map((product) => product.id))
      })
      .catch(() => {
        setSnackbar({ open: true, message: 'Login feito, mas não foi possível sincronizar os corações.', severity: 'warning' })
      })

    setSnackbar({ open: true, message: `Login realizado com Google. Bem-vindo(a), ${profile.name}!`, severity: 'success' })
  }

  const handleGoogleLogin = () => {
    if (!window.google?.accounts?.id) {
      setSnackbar({ open: true, message: 'Login Google indisponível no momento.', severity: 'warning' })
      return
    }

    if (!googleClientId) {
      setSnackbar({ open: true, message: 'Defina um Google Client ID válido em VITE_GOOGLE_CLIENT_ID (ou GOOGLE_CLIENT_ID no servidor) para ativar o login Google.', severity: 'warning' })
      return
    }

    setIsGoogleLoginLoading(true)

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    })

    window.google.accounts.id.prompt((notification) => {
      const wasNotDisplayed = notification.isNotDisplayed && notification.isNotDisplayed()
      const wasSkipped = notification.isSkippedMoment && notification.isSkippedMoment()
      const wasDismissed = notification.isDismissedMoment && notification.isDismissedMoment()

      if (wasNotDisplayed || wasSkipped || wasDismissed) {
        setSnackbar({ open: true, message: 'Não foi possível abrir o login Google agora. Tente novamente.', severity: 'warning' })
        setIsGoogleLoginLoading(false)
      }
    })

    window.setTimeout(() => {
      setIsGoogleLoginLoading(false)
    }, 4500)
  }


  useEffect(() => {
    if (googleClientId) return

    fetch(GOOGLE_CLIENT_ID_API_URL)
      .then(async (response) => {
        if (!response.ok) {
          return
        }

        const data = await response.json()
        const configuredClientId = normalizeGoogleClientId(data?.clientId)
        if (configuredClientId) {
          setGoogleClientId(configuredClientId)
        }
      })
      .catch(() => {
        // Ignora falha silenciosamente para manter experiência sem bloqueio.
      })
  }, [googleClientId])

  useEffect(() => {
    const imageUrls = Array.from(new Set(seasonalProducts.map((product) => product.image).filter(Boolean)))

    imageUrls.forEach((url) => {
      const image = new window.Image()
      image.src = url
    })
  }, [])

  useEffect(() => {
    try {
      const storedFavoriteProductIds = window.localStorage.getItem(FAVORITE_PRODUCTS_STORAGE_KEY)
      if (!storedFavoriteProductIds) return

      const parsedFavoriteProductIds = JSON.parse(storedFavoriteProductIds)
      if (!Array.isArray(parsedFavoriteProductIds)) return

      const sanitizedFavoriteProductIds = parsedFavoriteProductIds.filter((productId) => validSeasonalProductIds.has(productId))
      setFavoriteProductIds(sanitizedFavoriteProductIds)
    } catch {
      setFavoriteProductIds([])
    }
  }, [validSeasonalProductIds])

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

    const currentUserId = getAuthenticatedUserId()
    const currentUserProfile = getStoredAuthenticatedProfile()

    if (isMounted) {
      setAuthenticatedUserId(currentUserId)
      setAuthenticatedUser(currentUserProfile)
    }

    fetchLikesSummary(currentUserId)
      .then((summary) => {
        if (!isMounted) return

        setTotalLikes(Number(summary?.store?.likes ?? 0))
        setHasLikedStore(Boolean(summary?.store?.likedByCurrentUser))

        const likedByCurrentUserById = summary?.products?.likedByCurrentUserById ?? {}
        const likesById = summary?.products?.likesById ?? {}

        setFavoriteCounts(() => seasonalProducts.reduce((counts, product) => ({
          ...counts,
          [product.id]: Number(likesById[product.id] ?? 0),
        }), {}))

        setFavoriteProductIds(() => seasonalProducts.filter((product) => likedByCurrentUserById[product.id]).map((product) => product.id))
      })
      .catch(() => {
        if (!isMounted) return
        setSnackbar({ open: true, message: 'Não foi possível carregar os corações globais.', severity: 'warning' })
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITE_PRODUCTS_STORAGE_KEY, JSON.stringify(favoriteProductIds))
    } catch {
      // Ignora erro de armazenamento local para não bloquear o fluxo principal.
    }
  }, [favoriteProductIds])

  const handleToggleLike = async () => {
    if (hasLikedStore) {
      setSnackbar({
        open: true,
        message: 'Você já deixou seu coração. Obrigado pelo carinho! 💛',
        severity: 'info',
      })
      return
    }

    if (!authenticatedUserId) {
      setSnackbar({
        open: true,
        message: 'Faça login com Google para registrar seu coração.',
        severity: 'info',
      })
      handleGoogleLogin()
      return
    }

    setHasLikedStore(true)
    setShowLikeCelebration(true)
    setTotalLikes((currentLikes) => currentLikes + 1)

    try {
      const result = await registerStoreLike(authenticatedUserId)
      setTotalLikes(Number(result.likes ?? totalLikes + 1))
      setSnackbar({
        open: true,
        message: '🎉 Obrigado pelo carinho! +1 coração registrado para todos verem! 🍫✨',
        severity: 'success',
      })
    } catch {
      setHasLikedStore(false)
      setShowLikeCelebration(false)
      setTotalLikes((currentLikes) => Math.max(0, currentLikes - 1))
      setSnackbar({
        open: true,
        message: 'Não foi possível registrar seu coração agora.',
        severity: 'error',
      })
    }
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
        authenticatedUser={authenticatedUser}
        isGoogleLoginLoading={isGoogleLoginLoading}
        onGoogleLogin={handleGoogleLogin}
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
            seasonalProducts={easterMenuProducts}
            visibleShowcaseProducts={menuShowcaseProducts}
            selectedShowcaseProduct={selectedMenuShowcaseProduct}
            activeProductStep={menuProductStep}
            setActiveProductStep={setMenuProductStep}
            maxShowcasePrice={maxMenuShowcasePrice}
            setMaxShowcasePrice={setMaxMenuShowcasePrice}
            addItem={addItem}
            removeItem={removeItem}
            onShareProduct={handleShareProduct}
            favoriteCounts={favoriteCounts}
            favoriteProductIds={favoriteProductIds}
            onFavoriteProduct={handleFavoriteProduct}
            productRatings={easterRatingsByProductId}
            onRateProduct={(item, rating) => handleRateProduct(item, rating, 'cardapio-de-pascoa')}
            isGlobalRatingsActive={isEasterGlobalRatingsActive}
          />
        </MotionDiv>

        <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.18 }}>
          <SectionDivider label="Pedidos de Doces" />
        </MotionDiv>

        <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.19 }}>
          <ShowcaseSection
            BRL={BRL}
            seasonalProducts={candyOrderProducts}
            visibleShowcaseProducts={orderShowcaseProducts}
            selectedShowcaseProduct={selectedOrderShowcaseProduct}
            activeProductStep={orderProductStep}
            setActiveProductStep={setOrderProductStep}
            maxShowcasePrice={maxOrderShowcasePrice}
            setMaxShowcasePrice={setMaxOrderShowcasePrice}
            addItem={addItem}
            removeItem={removeItem}
            onShareProduct={handleShareProduct}
            favoriteCounts={favoriteCounts}
            favoriteProductIds={favoriteProductIds}
            onFavoriteProduct={handleFavoriteProduct}
            productRatings={candyRatingsByProductId}
            onRateProduct={(item, rating) => handleRateProduct(item, rating, 'pedidos-de-doces')}
            isGlobalRatingsActive={isCandyGlobalRatingsActive}
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
        disabled={hasLikedStore}
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
