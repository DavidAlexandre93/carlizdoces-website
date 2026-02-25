import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, Stack, Typography } from '@mui/material'
import { motion } from 'motion/react'
import gsap, { useGSAP } from '../lib/gsapCompat'
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
import { deviceId, supabase } from '../supabaseClient'

const ContactSection = lazy(() => import('../components/sections/ContactSection'))
const TestimonialsSection = lazy(() => import('../components/sections/TestimonialsSection'))
const InstagramSection = lazy(() => import('../components/sections/InstagramSection'))
const UpdatesSection = lazy(() => import('../components/sections/UpdatesSection'))
const MotionDiv = motion.div
const STORE_LIKES_ITEM_ID = 'store'
const FEATURED_VIDEO_EMBED_URL = 'https://www.youtube.com/embed/FezN9hhSSxw'
const FEATURED_VIDEO_FALLBACK_URL = 'https://youtube.com/shorts/FezN9hhSSxw?feature=share'
const GOOGLE_REVIEW_URL = 'https://www.google.com/search?client=ms-android-americamovil-br-rvc2&sca_esv=f38932f2222aa1fa&hl=pt-BR&cs=0&sxsrf=ANbL-n6eXaKkpWWQXc0A67jfppfGLihclw:1771820305411&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOTwjoCD7BxipWzOF2nT8iw9KDHG4AhXS8s14-d9nXSzfaMjBE1mGcMJuwFiunILPS4BDq1ElAn6V_IuetbG9SdLVXtbTnp7pbmXy2ttsfoz7hveC0Q%3D%3D&q=Carliz+Doces+Coment%C3%A1rios&sa=X&ved=2ahUKEwidtKP_4O6SAxUxlJUCHX1ABMUQ0bkNegQIHhAH&cshid=1771820443188835&biw=1920&bih=911&dpr=1#lrd=0x94cfad949b66f5ab:0xc198d0c4a896d55a,3'
const isEasterMenuProduct = (product) => product.image?.includes('/images/cardapio-de-pascoa/')
const isCandyOrderProduct = (product) => product.image?.includes('/images/pedidos-de-doces/')

async function requestLikesSummaryFromSupabase(currentDeviceId, productIds) {
  const itemIds = [STORE_LIKES_ITEM_ID, ...productIds]

  const { data: rows, error: rowsError } = await supabase
    .from('likes_anon')
    .select('item_id')
    .in('item_id', itemIds)

  if (rowsError) {
    throw new Error(rowsError.message || 'likes-summary-request-failed')
  }

  const { data: userRows, error: userRowsError } = await supabase
    .from('likes_anon')
    .select('item_id')
    .eq('device_id', currentDeviceId)
    .in('item_id', itemIds)

  if (userRowsError) {
    throw new Error(userRowsError.message || 'likes-summary-request-failed')
  }

  const likesById = productIds.reduce((acc, productId) => ({ ...acc, [productId]: 0 }), {})
  let storeLikes = 0

  ;(rows || []).forEach((row) => {
    if (row.item_id === STORE_LIKES_ITEM_ID) {
      storeLikes += 1
      return
    }

    if (Object.prototype.hasOwnProperty.call(likesById, row.item_id)) {
      likesById[row.item_id] += 1
    }
  })

  const likedByCurrentUserById = productIds.reduce((acc, productId) => ({ ...acc, [productId]: false }), {})
  let storeLikedByCurrentUser = false

  ;(userRows || []).forEach((row) => {
    if (row.item_id === STORE_LIKES_ITEM_ID) {
      storeLikedByCurrentUser = true
      return
    }

    if (Object.prototype.hasOwnProperty.call(likedByCurrentUserById, row.item_id)) {
      likedByCurrentUserById[row.item_id] = true
    }
  })

  return {
    store: {
      likes: storeLikes,
      likedByCurrentUser: storeLikedByCurrentUser,
    },
    products: {
      likesById,
      likedByCurrentUserById,
    },
  }
}

async function requestLikesSummary(currentDeviceId, productIds) {
  return requestLikesSummaryFromSupabase(currentDeviceId, productIds)
}

async function requestProductLikeToggleFromSupabase(productId, currentDeviceId) {
  const { data: existingRows, error: existingError } = await supabase
    .from('likes_anon')
    .select('id')
    .eq('item_id', productId)
    .eq('device_id', currentDeviceId)
    .limit(1)

  if (existingError) {
    throw new Error(existingError.message || 'product-like-toggle-request-failed')
  }

  const wasLiked = (existingRows?.length || 0) > 0

  if (wasLiked) {
    const { error: deleteError } = await supabase
      .from('likes_anon')
      .delete()
      .eq('item_id', productId)
      .eq('device_id', currentDeviceId)

    if (deleteError) {
      throw new Error(deleteError.message || 'product-like-toggle-request-failed')
    }
  } else {
    const { error: insertError } = await supabase
      .from('likes_anon')
      .insert({
        item_id: productId,
        device_id: currentDeviceId,
      })

    if (insertError) {
      throw new Error(insertError.message || 'product-like-toggle-request-failed')
    }
  }

  const { count, error: countError } = await supabase
    .from('likes_anon')
    .select('*', { count: 'exact', head: true })
    .eq('item_id', productId)

  if (countError) {
    throw new Error(countError.message || 'product-like-toggle-request-failed')
  }

  return {
    likes: Number(count || 0),
    liked: !wasLiked,
  }
}

async function requestProductLikeToggle(productId, currentDeviceId) {
  return requestProductLikeToggleFromSupabase(productId, currentDeviceId)
}

export function HomePage({ skipIntroCurtain = false }) {
  const introScopeRef = useRef(null)
  const hasInitializedMenuShowcaseRef = useRef(false)
  const hasInitializedOrderShowcaseRef = useRef(false)
  const [introStage, setIntroStage] = useState(() => (skipIntroCurtain ? 'hidden' : 'message'))
  const [isFeaturedVideoOpen, setIsFeaturedVideoOpen] = useState(false)
  const [isFeaturedVideoLoading, setIsFeaturedVideoLoading] = useState(true)
  const [isFeaturedVideoFallbackVisible, setIsFeaturedVideoFallbackVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [menuProductStep, setMenuProductStep] = useState(0)
  const [orderProductStep, setOrderProductStep] = useState(0)
  const [maxMenuShowcasePrice, setMaxMenuShowcasePrice] = useState(() => Math.max(...seasonalProducts.filter((item) => isEasterMenuProduct(item)).map((item) => item.price), 0))
  const [maxOrderShowcasePrice, setMaxOrderShowcasePrice] = useState(() => Math.max(...seasonalProducts.filter((item) => isCandyOrderProduct(item)).map((item) => item.price), 0))
  const [customizations, setCustomizations] = useState({})
  const [orderPreferences, setOrderPreferences] = useState({ deliveryMethod: '', receiveOffersOnWhatsApp: '' })
  const [orderCustomer, setOrderCustomer] = useState({ name: '', phone: '' })
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [isSendingContactEmail] = useState(false)
  const [isEmailOptionsOpen, setIsEmailOptionsOpen] = useState(false)
  const [emailProviderLinks, setEmailProviderLinks] = useState(null)
  const [emailComposeData, setEmailComposeData] = useState(null)
  const [contactTipOpen, setContactTipOpen] = useState(false)
  const [communityTestimonials] = useState(manualTestimonials)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [favoriteProductIds, setFavoriteProductIds] = useState([])
  const [favoriteCounts, setFavoriteCounts] = useState({})
  const easterMenuProducts = useMemo(() => seasonalProducts.filter((item) => isEasterMenuProduct(item)), [])
  const candyOrderProducts = useMemo(() => seasonalProducts.filter((item) => isCandyOrderProduct(item)), [])

  const { addItem, removeItem, selectedItems, totalItems, totalPrice } = useCart(seasonalProducts)
  const {
    ratingsByProductId: easterRatingsByProductId,
    submitRating: submitEasterRating,
    isGlobalRatingsActive: isEasterGlobalRatingsActive,
  } = useProductRatings(easterMenuProducts)
  const {
    ratingsByProductId: candyRatingsByProductId,
    submitRating: submitCandyRating,
    isGlobalRatingsActive: isCandyGlobalRatingsActive,
  } = useProductRatings(candyOrderProducts)

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

  useEffect(() => {
    if (menuShowcaseProducts.length === 0) {
      setMenuProductStep(0)
      return
    }

    if (!hasInitializedMenuShowcaseRef.current) {
      setMenuProductStep(menuShowcaseProducts.length - 1)
      hasInitializedMenuShowcaseRef.current = true
      return
    }

    setMenuProductStep((currentStep) => Math.min(currentStep, menuShowcaseProducts.length - 1))
  }, [menuShowcaseProducts])

  useEffect(() => {
    if (orderShowcaseProducts.length === 0) {
      setOrderProductStep(0)
      return
    }

    if (!hasInitializedOrderShowcaseRef.current) {
      setOrderProductStep(orderShowcaseProducts.length - 1)
      hasInitializedOrderShowcaseRef.current = true
      return
    }

    setOrderProductStep((currentStep) => Math.min(currentStep, orderShowcaseProducts.length - 1))
  }, [orderShowcaseProducts])

  useEffect(() => {
    if (!isFeaturedVideoOpen) {
      return undefined
    }

    setIsFeaturedVideoLoading(true)
    setIsFeaturedVideoFallbackVisible(false)

    const fallbackTimer = window.setTimeout(() => {
      setIsFeaturedVideoFallbackVisible(true)
    }, 5500)

    return () => {
      window.clearTimeout(fallbackTimer)
    }
  }, [isFeaturedVideoOpen])

  const whatsappLink = useWhatsAppOrderLink({
    selectedItems,
    customizations,
    orderPreferences,
    orderCustomer,
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
    const wasFavorite = favoriteProductIds.includes(item.id)

    setFavoriteProductIds((currentFavorites) => {
      if (wasFavorite) {
        return currentFavorites.filter((productId) => productId !== item.id)
      }

      return [...currentFavorites, item.id]
    })

    setFavoriteCounts((currentCounts) => ({
      ...currentCounts,
      [item.id]: Math.max(0, (currentCounts[item.id] ?? 0) + (wasFavorite ? -1 : 1)),
    }))

    try {
      const result = await requestProductLikeToggle(item.id, deviceId)

      setFavoriteCounts((currentCounts) => ({
        ...currentCounts,
        [item.id]: Number(result.likes ?? currentCounts[item.id] ?? 0),
      }))
      setSnackbar({
        open: true,
        message: !wasFavorite ? `${item.name} recebeu +1 coração!` : `Você removeu seu coração de ${item.name}.`,
        severity: 'success',
      })
    } catch {
      setFavoriteProductIds((currentFavorites) => {
        if (wasFavorite) {
          return [...currentFavorites, item.id]
        }

        return currentFavorites.filter((productId) => productId !== item.id)
      })
      setFavoriteCounts((currentCounts) => ({
        ...currentCounts,
        [item.id]: Math.max(0, (currentCounts[item.id] ?? 0) + (wasFavorite ? 1 : -1)),
      }))
      setSnackbar({ open: true, message: 'Não foi possível atualizar seu coração agora.', severity: 'error' })
    }
  }

  const handleRateProduct = async (item, rating, sectionType) => {
    const submitRating = sectionType === 'pedidos-de-doces' ? submitCandyRating : submitEasterRating
    const result = await submitRating(item.id, rating)

    if (!result.ok) {
      setSnackbar({ open: true, message: 'Não foi possível registrar sua avaliação.', severity: 'error' })
      return
    }

    if (result.removed) {
      setSnackbar({ open: true, message: `Sua avaliação de ${item.name} foi removida.`, severity: 'info' })
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

  const handleContactEmailSubmit = () => {
    const name = contactForm.name.trim()
    const email = contactForm.email.trim()
    const message = contactForm.message.trim()

    if (!name || !message) {
      setSnackbar({ open: true, message: 'Preencha nome e mensagem para enviar no e-mail.', severity: 'warning' })
      return
    }

    const fallbackSubject = `Contato pelo site - ${name}`
    const fallbackBody = [
      'Olá, equipe Carliz Doces!',
      '',
      `Nome: ${name}`,
      email ? `Email: ${email}` : null,
      '',
      'Mensagem:',
      message,
    ]
      .filter(Boolean)
      .join('\n')
    const toEmail = 'carlizdoces@gmail.com'
    const subjectEncoded = encodeURIComponent(fallbackSubject)
    const bodyEncoded = encodeURIComponent(fallbackBody)

    const emailProviderLinks = {
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${subjectEncoded}&body=${bodyEncoded}`,
      outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(toEmail)}&subject=${subjectEncoded}&body=${bodyEncoded}`,
      yahoo: `https://compose.mail.yahoo.com/?to=${encodeURIComponent(toEmail)}&subject=${subjectEncoded}&body=${bodyEncoded}`,
      other: `mailto:${toEmail}?subject=${subjectEncoded}&body=${bodyEncoded}`,
    }

    setEmailProviderLinks(emailProviderLinks)
    setEmailComposeData({ toEmail, subject: fallbackSubject, body: fallbackBody })
    setIsEmailOptionsOpen(true)
  }

  const handleEmailProviderSelect = (provider) => {
    if (!emailProviderLinks?.[provider]) return

    const providerLink = emailProviderLinks[provider]
    const isMobileDevice = /android|iphone|ipad|ipod|mobile/i.test(window.navigator.userAgent || '')

    setIsEmailOptionsOpen(false)

    if (provider === 'other') {
      window.location.href = providerLink
      return
    }

    if (!isMobileDevice) {
      window.open(providerLink, '_blank', 'noopener,noreferrer')
      return
    }

    const toEmail = emailComposeData?.toEmail || 'carlizdoces@gmail.com'
    const subject = emailComposeData?.subject || ''
    const body = emailComposeData?.body || ''

    const appDeepLinks = {
      gmail: `googlegmail://co?to=${encodeURIComponent(toEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      outlook: `ms-outlook://compose?to=${encodeURIComponent(toEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      yahoo: `ymail://mail/compose?to=${encodeURIComponent(toEmail)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    }

    const deepLink = appDeepLinks[provider]

    if (!deepLink) {
      window.open(providerLink, '_blank', 'noopener,noreferrer')
      return
    }

    const fallbackTimer = window.setTimeout(() => {
      window.open(providerLink, '_blank', 'noopener,noreferrer')
    }, 900)

    window.location.href = deepLink

    window.setTimeout(() => {
      window.clearTimeout(fallbackTimer)
    }, 1400)
  }

  useEffect(() => {
    const imageUrls = Array.from(new Set(seasonalProducts.map((product) => product.image).filter(Boolean)))

    imageUrls.forEach((url) => {
      const image = new window.Image()
      image.src = url
    })
  }, [])

  useEffect(() => {
    if (skipIntroCurtain) {
      return undefined
    }

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
  }, [skipIntroCurtain])

  useEffect(() => {
    if (introStage === 'hidden') return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [introStage])

  useEffect(() => {
    if (introStage !== 'hidden') return

    setIsFeaturedVideoOpen(true)
  }, [introStage])

  useGSAP(() => {
    if (!introScopeRef.current || introStage === 'hidden') return

    gsap.from('.intro-logo', {
      y: -34,
      scale: 0.88,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, introScopeRef.current)

    gsap.from('.intro-message', {
      y: 28,
      opacity: 0,
      delay: 0.2,
      duration: 0.75,
      ease: 'power2.out',
    }, introScopeRef.current)

    gsap.from('.intro-clown-card', {
      y: 44,
      scale: 0.82,
      opacity: 0,
      delay: 0.25,
      duration: 0.9,
      stagger: 0.14,
      ease: 'power3.out',
    }, introScopeRef.current)
  }, { scope: introScopeRef, dependencies: [introStage] })

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

    const bootstrapLikes = async () => {
      try {
        const summary = await requestLikesSummary(deviceId, seasonalProducts.map((product) => product.id))

        if (!isMounted) return

        const likesById = summary?.products?.likesById ?? {}
        const likedByCurrentUserById = summary?.products?.likedByCurrentUserById ?? {}


        setFavoriteCounts(() => seasonalProducts.reduce((counts, product) => ({
          ...counts,
          [product.id]: Number(likesById[product.id] ?? 0),
        }), {}))

        setFavoriteProductIds(() => seasonalProducts.filter((product) => Boolean(likedByCurrentUserById[product.id])).map((product) => product.id))
      } catch {
        if (!isMounted) return
        setSnackbar({ open: true, message: 'Não foi possível carregar os corações globais.', severity: 'warning' })
      }
    }

    bootstrapLikes()

    return () => {
      isMounted = false
    }
  }, [])

  const revealAnimation = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.55, ease: 'easeOut' },
  }

  return (
    <Box id="top" className="site-wrapper">

      {introStage !== 'hidden' && (
        <Box ref={introScopeRef} className={`intro-curtain intro-curtain-${introStage}`}>
          <Box className="intro-curtain-panel intro-curtain-left" />
          <Box className="intro-curtain-panel intro-curtain-right" />
          <Box className="intro-center-content">
            <Box component="img" src="/images/logo/logo-carlizdoces.png" alt="Logo da Carliz Doces" className="intro-logo" />
            <Box className="intro-clown-wrap">
              <motion.div
                className="intro-clown-card intro-clown-card-left"
                animate={{ y: [0, -26, 0], rotate: [0, -12, 0, 360] }}
                transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              >
                <Box component="img" src="/images/tela-apresentacao/palhaco.png" alt="Palhaço saltando de alegria" className="intro-clown" />
              </motion.div>
              <motion.div
                className="intro-clown-card intro-clown-card-right"
                animate={{ y: [0, -22, 0], rotate: [0, 12, 0, -360] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 0.2 }}
              >
                <Box component="img" src="/images/tela-apresentacao/palhaco.png" alt="Palhaço fazendo cambalhota" className="intro-clown" />
              </motion.div>
              <Box component="p" className="intro-message">Respeeeitável púúúúblico! 🎪✨
              Com muita alegria, muito brilho e uma pitadinha de travessura, apresentaaamos… Carliz Doces! 🍭🍬🤡</Box>
            </Box>
          </Box>
        </Box>
      )}


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
          <SectionDivider label="Quem somos" sectionId="quem-somos" />
        </MotionDiv>

        <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.08 }}>
          <AboutSection />
        </MotionDiv>

        <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.14 }}>
          <SectionDivider label="Cardápio de Páscoa" sectionId="ovos-de-pascoa" />
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
            onShareProduct={handleShareProduct}
            favoriteCounts={favoriteCounts}
            favoriteProductIds={favoriteProductIds}
            onFavoriteProduct={handleFavoriteProduct}
            productRatings={easterRatingsByProductId}
            onRateProduct={(item, rating) => handleRateProduct(item, rating, 'cardapio-de-pascoa')}
            isGlobalRatingsActive={isEasterGlobalRatingsActive}
            disablePrevAtLast
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
            onShareProduct={handleShareProduct}
            favoriteCounts={favoriteCounts}
            favoriteProductIds={favoriteProductIds}
            onFavoriteProduct={handleFavoriteProduct}
            productRatings={candyRatingsByProductId}
            onRateProduct={(item, rating) => handleRateProduct(item, rating, 'pedidos-de-doces')}
            isGlobalRatingsActive={isCandyGlobalRatingsActive}
            disablePrevAtLast
          />
        </MotionDiv>

          <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.2 }}>
            <SectionDivider label="Realizar pedido" sectionId="realizar-pedido" />
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
              deliveryMethods={['Retirada na loja', 'Entrega']}
              orderPreferences={orderPreferences}
              setOrderPreferences={setOrderPreferences}
              totalPrice={totalPrice}
              totalItems={totalItems}
              whatsappLink={whatsappLink}
              removeItem={removeItem}
            />
          </MotionDiv>

          <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.24 }}>
            <SectionDivider label="Onde estamos" sectionId="onde-estamos" />
          </MotionDiv>

          <MotionDiv {...revealAnimation} transition={{ ...revealAnimation.transition, delay: 0.26 }}>
            <LocationSection />
          </MotionDiv>

        <Suspense fallback={<Container><Alert severity="info">Carregando seção...</Alert></Container>}>
          <Container disableGutters className="section-stack">
            <MotionDiv {...revealAnimation}><SectionDivider label="Depoimentos" sectionId="depoimentos" /></MotionDiv>
            <MotionDiv {...revealAnimation}><TestimonialsSection testimonials={communityTestimonials} /></MotionDiv>
            <MotionDiv {...revealAnimation}><SectionDivider label="Novidades" sectionId="novidades" /></MotionDiv>
            <MotionDiv {...revealAnimation}><UpdatesSection updates={updates} announcementChannels={announcementChannels} /></MotionDiv>
            <MotionDiv {...revealAnimation}><SectionDivider label="Contato" sectionId="contato" /></MotionDiv>
            <MotionDiv {...revealAnimation}>
              <ContactSection
                contactForm={contactForm}
                onChange={(field, value) => setContactForm((current) => ({ ...current, [field]: value }))}
                onSubmit={handleContactSubmit}
                onEmailSubmit={handleContactEmailSubmit}
                isSendingContactEmail={isSendingContactEmail}
                contactTipOpen={contactTipOpen}
                onToggleTip={() => setContactTipOpen((open) => !open)}
              />
            </MotionDiv>
            <MotionDiv {...revealAnimation}><SectionDivider label="Instagram" sectionId="instagram" /></MotionDiv>
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
        onGoToOrderSection={handleGoToOrderSection}
        isFooterVisible={showScrollTop}
      />

      <Dialog
        open={isFeaturedVideoOpen}
        onClose={() => setIsFeaturedVideoOpen(false)}
        maxWidth="md"
        fullWidth
        aria-labelledby="featured-video-title"
        PaperProps={{
          sx: {
            overflow: 'visible',
            borderRadius: 5,
            background: 'linear-gradient(145deg, #fff8fb 0%, #ffeef6 45%, #fff4e8 100%)',
            border: '2px solid rgba(255, 126, 169, 0.45)',
            boxShadow: '0 28px 65px rgba(153, 56, 108, 0.35)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            p: { xs: 2, sm: 3 },
            pb: { xs: 2, sm: 1 },
          }}
        >
          <IconButton
            onClick={() => setIsFeaturedVideoOpen(false)}
            aria-label="Fechar vídeo em destaque"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              color: '#7a294f',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 126, 169, 0.4)',
              boxShadow: '0 8px 16px rgba(122, 41, 79, 0.18)',
              '&:hover': { backgroundColor: '#fff', transform: 'translateY(-1px)' },
            }}
          >
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', lineHeight: 1 }}>
              ✕
            </Box>
          </IconButton>
          <DialogTitle id="featured-video-title" sx={{ p: 0, pr: 5, fontWeight: 800, color: '#8d285a' }}>
            Nosso cantinho doce
          </DialogTitle>
          <Typography variant="body2" sx={{ mt: 1, color: 'rgba(111, 39, 71, 0.8)' }}>
            Assista ao nosso vídeo demonstrativo e veja como preparamos nossos doces com qualidade e segurança.
          </Typography>
          <Button
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noreferrer"
            variant="contained"
            sx={{
              mt: 2,
              alignSelf: 'flex-start',
              borderRadius: 999,
              px: 3,
              py: 1,
              fontWeight: 800,
              textTransform: 'none',
              letterSpacing: 0.2,
              color: '#fff',
              background: 'linear-gradient(90deg, #ff0077 0%, #ff3366 50%, #ff5f4b 100%)',
              boxShadow: '0 10px 20px rgba(255, 0, 119, 0.4)',
              animation: 'googleReviewBlink 1s ease-in-out infinite',
              '@keyframes googleReviewBlink': {
                '0%, 100%': {
                  transform: 'scale(1)',
                  boxShadow: '0 10px 20px rgba(255, 0, 119, 0.35)',
                  filter: 'brightness(1)',
                },
                '50%': {
                  transform: 'scale(1.06)',
                  boxShadow: '0 0 0 6px rgba(255, 0, 119, 0.22), 0 14px 24px rgba(255, 0, 119, 0.5)',
                  filter: 'brightness(1.2)',
                },
              },
              '&:hover': {
                background: 'linear-gradient(90deg, #ff0f81 0%, #ff4170 50%, #ff6d55 100%)',
              },
            }}
          >
            Avalie-nos no Google.
          </Button>
          {isFeaturedVideoFallbackVisible && isFeaturedVideoLoading ? (
            <Alert
              severity="info"
              sx={{ mt: 2, borderRadius: 2 }}
              action={(
                <Button
                  color="inherit"
                  size="small"
                  href={FEATURED_VIDEO_FALLBACK_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir vídeo
                </Button>
              )}
            >
              O vídeo está demorando para carregar no modal. Se preferir, abra em uma nova aba.
            </Alert>
          ) : null}
        </Box>
        <DialogContent sx={{ pt: 1, pb: 3 }}>
          <Box
            sx={{
              overflow: 'hidden',
              borderRadius: 4,
              boxShadow: '0 18px 40px rgba(94, 27, 57, 0.28)',
              border: '1px solid',
              borderColor: 'rgba(255, 126, 169, 0.35)',
              bgcolor: '#000',
            }}
          >
            <Box
              component="iframe"
              src={FEATURED_VIDEO_EMBED_URL}
              title="Vídeo de apresentação Carliz Doces"
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsFeaturedVideoLoading(false)}
              onError={() => {
                setIsFeaturedVideoLoading(true)
                setIsFeaturedVideoFallbackVisible(true)
              }}
              sx={{
                width: '100%',
                aspectRatio: '16 / 9',
                border: 0,
                display: 'block',
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={isEmailOptionsOpen} onClose={() => setIsEmailOptionsOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Escolha onde enviar seu e-mail</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecione seu provedor de e-mail preferido para continuar com a mensagem já preenchida.
          </Typography>
          <Stack spacing={1}>
            <Button variant="contained" onClick={() => handleEmailProviderSelect('gmail')}>Gmail</Button>
            <Button variant="contained" onClick={() => handleEmailProviderSelect('outlook')}>Outlook</Button>
            <Button variant="contained" onClick={() => handleEmailProviderSelect('yahoo')}>Yahoo</Button>
            <Button variant="outlined" onClick={() => handleEmailProviderSelect('other')}>Outros aplicativos</Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEmailOptionsOpen(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

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
