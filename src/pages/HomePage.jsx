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
import { deviceId, supabase } from '../supabaseClient'

const ContactSection = lazy(() => import('../components/sections/ContactSection'))
const TestimonialsSection = lazy(() => import('../components/sections/TestimonialsSection'))
const InstagramSection = lazy(() => import('../components/sections/InstagramSection'))
const UpdatesSection = lazy(() => import('../components/sections/UpdatesSection'))
const MotionDiv = motion.div
const STORE_LIKES_ITEM_ID = 'store'

const isEasterMenuProduct = (product) => product.image?.includes('/images/cardapio-de-pascoa/')
const isCandyOrderProduct = (product) => product.image?.includes('/images/pedidos-de-doces/')

async function requestLikesSummary(currentDeviceId, productIds) {
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

async function requestProductLikeToggle(productId, currentDeviceId) {
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

async function requestStoreLikeToggle(currentDeviceId) {
  const { data: existingRows, error: existingError } = await supabase
    .from('likes_anon')
    .select('id')
    .eq('item_id', STORE_LIKES_ITEM_ID)
    .eq('device_id', currentDeviceId)
    .limit(1)

  if (existingError) {
    throw new Error(existingError.message || 'store-like-toggle-request-failed')
  }

  const wasLiked = (existingRows?.length || 0) > 0

  if (wasLiked) {
    const { error: deleteError } = await supabase
      .from('likes_anon')
      .delete()
      .eq('item_id', STORE_LIKES_ITEM_ID)
      .eq('device_id', currentDeviceId)

    if (deleteError) {
      throw new Error(deleteError.message || 'store-like-toggle-request-failed')
    }
  } else {
    const { error: insertError } = await supabase
      .from('likes_anon')
      .insert({
        item_id: STORE_LIKES_ITEM_ID,
        device_id: currentDeviceId,
      })

    if (insertError) {
      throw new Error(insertError.message || 'store-like-toggle-request-failed')
    }
  }

  const { count, error: countError } = await supabase
    .from('likes_anon')
    .select('*', { count: 'exact', head: true })
    .eq('item_id', STORE_LIKES_ITEM_ID)

  if (countError) {
    throw new Error(countError.message || 'store-like-toggle-request-failed')
  }

  return {
    likes: Number(count || 0),
    liked: !wasLiked,
  }
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
  const [isSendingContactEmail, setIsSendingContactEmail] = useState(false)
  const [contactTipOpen, setContactTipOpen] = useState(false)
  const [communityTestimonials] = useState(manualTestimonials)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [favoriteProductIds, setFavoriteProductIds] = useState([])
  const [favoriteCounts, setFavoriteCounts] = useState({})
  const [totalLikes, setTotalLikes] = useState(0)
  const [hasLikedStore, setHasLikedStore] = useState(false)
  const [showLikeCelebration, setShowLikeCelebration] = useState(false)
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

    setMenuProductStep((currentStep) => Math.min(currentStep, menuShowcaseProducts.length - 1))
  }, [menuShowcaseProducts])

  useEffect(() => {
    if (orderShowcaseProducts.length === 0) {
      setOrderProductStep(0)
      return
    }

    setOrderProductStep((currentStep) => Math.min(currentStep, orderShowcaseProducts.length - 1))
  }, [orderShowcaseProducts])

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

  const handleContactEmailSubmit = async () => {
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
    const fallbackMailtoLink = `mailto:carlizdoces@gmail.com?subject=${encodeURIComponent(fallbackSubject)}&body=${encodeURIComponent(fallbackBody)}`

    try {
      setIsSendingContactEmail(true)

      const response = await fetch('/api/contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })

      if (!response.ok) {
        window.location.href = fallbackMailtoLink
        setSnackbar({
          open: true,
          message: 'Não foi possível enviar automaticamente. Abrimos seu app de e-mail para concluir o envio.',
          severity: 'warning',
        })
        return
      }

      setContactForm({ name: '', email: '', message: '' })
      setSnackbar({ open: true, message: 'Mensagem enviada com sucesso para a equipe da Carliz Doces!', severity: 'success' })
    } catch {
      window.location.href = fallbackMailtoLink
      setSnackbar({
        open: true,
        message: 'Sem conexão para envio automático. Abrimos seu app de e-mail para concluir o envio.',
        severity: 'warning',
      })
    } finally {
      setIsSendingContactEmail(false)
    }
  }

  useEffect(() => {
    const imageUrls = Array.from(new Set(seasonalProducts.map((product) => product.image).filter(Boolean)))

    imageUrls.forEach((url) => {
      const image = new window.Image()
      image.src = url
    })
  }, [])

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

    const bootstrapLikes = async () => {
      try {
        const summary = await requestLikesSummary(deviceId, seasonalProducts.map((product) => product.id))

        if (!isMounted) return

        const likesById = summary?.products?.likesById ?? {}
        const likedByCurrentUserById = summary?.products?.likedByCurrentUserById ?? {}

        setTotalLikes(Number(summary?.store?.likes ?? 0))
        setHasLikedStore(Boolean(summary?.store?.likedByCurrentUser))

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

  const handleToggleLike = async () => {
    const wasLiked = hasLikedStore

    setHasLikedStore(!wasLiked)
    setShowLikeCelebration(!wasLiked)
    setTotalLikes((currentLikes) => Math.max(0, currentLikes + (wasLiked ? -1 : 1)))

    try {
      const result = await requestStoreLikeToggle(deviceId)

      setHasLikedStore(!wasLiked)
      setShowLikeCelebration(!wasLiked)
      setTotalLikes(Number(result.likes ?? Math.max(0, totalLikes + (wasLiked ? -1 : 1))))
      setSnackbar({
        open: true,
        message: !wasLiked
          ? '🎉 Obrigado pelo carinho! +1 coração registrado para todos verem! 🍫✨'
          : 'Coração removido. Clique novamente quando quiser apoiar de novo. 💛',
        severity: 'success',
      })
    } catch {
      setHasLikedStore(wasLiked)
      setShowLikeCelebration(false)
      setTotalLikes((currentLikes) => Math.max(0, currentLikes + (wasLiked ? 1 : -1)))
      setSnackbar({
        open: true,
        message: 'Não foi possível atualizar seu coração agora.',
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
            removeItem={removeItem}
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
                onEmailSubmit={handleContactEmailSubmit}
                isSendingContactEmail={isSendingContactEmail}
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
        disabled={false}
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
