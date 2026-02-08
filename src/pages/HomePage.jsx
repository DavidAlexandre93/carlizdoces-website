import { lazy, Suspense, useMemo, useState } from 'react'
import { Alert, Box, Container, Snackbar } from '@mui/material'
import { BRL, instagramPosts, instagramProfileLink, manualTestimonials, metrics, navItems, paymentMethods, seasonalProducts, topShowcaseSlides, whatsappNumber } from '../data/siteData'
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

export function HomePage() {
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

  return (
    <Box id="top" className={`site-wrapper${isDarkMode ? ' dark-mode' : ''}`}>
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
      </main>

      <Footer navItems={navItems} metrics={metrics} />
      <FloatingActions totalItems={totalItems} />

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
