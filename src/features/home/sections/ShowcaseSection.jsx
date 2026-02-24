import { useEffect, useRef, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Rating,
  Select,
  Slider,
  Typography,
  useTheme,
} from '@mui/material'
import { motion } from 'motion/react'
import gsap, { useGSAP } from '../../../lib/gsapCompat'
import ShareIcon from '../../../mui-icons/Share'
import LikeButton from '../../../components/LikeButton'

const MotionBox = motion(Box)

export function ShowcaseSection({
  BRL,
  seasonalProducts,
  visibleShowcaseProducts,
  selectedShowcaseProduct,
  activeProductStep,
  setActiveProductStep,
  maxShowcasePrice,
  setMaxShowcasePrice,
  addItem,
  onShareProduct,
  favoriteCounts,
  favoriteProductIds,
  onFavoriteProduct,
  productRatings,
  onRateProduct,
  isGlobalRatingsActive,
  disablePrevAtLast = false,
}) {
  const showcaseRef = useRef(null)
  const imageStageRef = useRef(null)
  const [isFlavorSelectOpen, setIsFlavorSelectOpen] = useState(false)
  const theme = useTheme()
  const ratingStats = selectedShowcaseProduct ? productRatings?.[selectedShowcaseProduct.id] : null
  const totalVisibleProducts = visibleShowcaseProducts.length
  const hasMultipleProducts = totalVisibleProducts > 1
  const isFirstProduct = activeProductStep <= 0
  const isLastProduct = activeProductStep >= totalVisibleProducts - 1
  const isPrevArrowDisabled = !hasMultipleProducts || (disablePrevAtLast && isLastProduct)
  const isNextArrowDisabled = !hasMultipleProducts || (disablePrevAtLast && isFirstProduct)

  const traditionalProducts = visibleShowcaseProducts.filter((item) => item.image.includes('/pedidos-de-doces/doces-tradicionais/'))
  const fineProducts = visibleShowcaseProducts.filter((item) => item.image.includes('/pedidos-de-doces/doces-finos/'))
  const otherProducts = visibleShowcaseProducts.filter((item) => !traditionalProducts.includes(item) && !fineProducts.includes(item))

  useGSAP((context) => {
    gsap.from('.showcase-card', { y: 34, opacity: 0, duration: 0.8, ease: 'power3.out' }, context.scope)
    gsap.from('.showcase-product-meta > *', { y: 14, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' }, context.scope)
    gsap.to('.showcase-image.is-active', { scale: 1.05, duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut' }, context.scope)
    gsap.to('.showcase-glow-dot', { y: -8, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.18 }, context.scope)
  }, { scope: showcaseRef, dependencies: [activeProductStep, selectedShowcaseProduct?.id] })

  useEffect(() => {
    const stage = imageStageRef.current
    if (!stage) return undefined

    const handlePointerMove = (event) => {
      const rect = stage.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height

      stage.style.setProperty('--stage-pointer-x', String(px.toFixed(3)))
      stage.style.setProperty('--stage-pointer-y', String(py.toFixed(3)))

      gsap.to('.showcase-image.is-active', {
        x: (px - 0.5) * 10,
        y: (py - 0.5) * 8,
        duration: 0.28,
        ease: 'power2.out',
      }, stage)
    }

    const resetStage = () => {
      gsap.to('.showcase-image.is-active', { x: 0, y: 0, duration: 0.35, ease: 'power2.out' }, stage)
    }

    stage.addEventListener('pointermove', handlePointerMove)
    stage.addEventListener('pointerleave', resetStage)

    return () => {
      stage.removeEventListener('pointermove', handlePointerMove)
      stage.removeEventListener('pointerleave', resetStage)
    }
  }, [activeProductStep])

  const handlePreviousProduct = () => {
    if (isPrevArrowDisabled) return
    if (disablePrevAtLast) return setActiveProductStep((step) => Math.min(totalVisibleProducts - 1, step + 1))
    return setActiveProductStep((step) => (step <= 0 ? totalVisibleProducts - 1 : step - 1))
  }

  const handleNextProduct = () => {
    if (isNextArrowDisabled) return
    if (disablePrevAtLast) return setActiveProductStep((step) => Math.max(0, step - 1))
    return setActiveProductStep((step) => (step >= totalVisibleProducts - 1 ? 0 : step + 1))
  }

  const SelectToggleIcon = ({ className }) => <span className={className} aria-hidden="true">{isFlavorSelectOpen ? '✕' : '▾'}</span>

  return (
    <Container ref={showcaseRef} maxWidth="md" className="photo-band section-alt-pink page-container showcase-section-container">
      <header className="photo-band-head">
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 300 }, mt: 1.5 }}>
          <InputLabel id="showcase-select-label">Selecionar sabor</InputLabel>
          <Select
            labelId="showcase-select-label"
            value={selectedShowcaseProduct?.id ?? ''}
            label="Selecionar sabor"
            open={isFlavorSelectOpen}
            onOpen={() => setIsFlavorSelectOpen(true)}
            onClose={() => setIsFlavorSelectOpen(false)}
            IconComponent={SelectToggleIcon}
            onChange={(event) => {
              const nextIndex = visibleShowcaseProducts.findIndex((item) => item.id === event.target.value)
              if (nextIndex >= 0) setActiveProductStep(nextIndex)
              setIsFlavorSelectOpen(false)
            }}
          >
            {traditionalProducts.length ? <ListSubheader>Doces Tradicionais</ListSubheader> : null}
            {traditionalProducts.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
            {fineProducts.length ? <ListSubheader>Doces Finos</ListSubheader> : null}
            {fineProducts.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
            {otherProducts.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
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
        <Paper className="showcase-card" sx={{ p: { xs: 1.25, sm: 1.5 } }}>
          <Box ref={imageStageRef} className="showcase-image-stage">
            <Box className="showcase-image-light" />
            <Box className="showcase-glow-dot showcase-glow-dot-left">✨</Box>
            <Box className="showcase-glow-dot showcase-glow-dot-right">⭐</Box>
            <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={activeProductStep} onChangeIndex={setActiveProductStep} enableMouseEvents>
              {visibleShowcaseProducts.map((product, index) => (
                <motion.img
                  key={product.id}
                  className={`showcase-image${index === activeProductStep ? ' is-active' : ''}`}
                  src={product.image}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  initial={{ opacity: 0.8, scale: 0.98 }}
                  animate={{ opacity: index === activeProductStep ? 1 : 0.88, scale: index === activeProductStep ? 1 : 0.97 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              ))}
            </SwipeableViews>

            <IconButton className="showcase-arrow showcase-arrow-prev" onClick={handlePreviousProduct} disabled={isPrevArrowDisabled} aria-label="Produto anterior">
              <span className={`showcase-arrow-icon ${theme.direction === 'rtl' ? 'showcase-arrow-icon-next' : 'showcase-arrow-icon-prev'}`} />
            </IconButton>
            <IconButton className="showcase-arrow showcase-arrow-next" onClick={handleNextProduct} disabled={isNextArrowDisabled} aria-label="Próximo produto">
              <span className={`showcase-arrow-icon ${theme.direction === 'rtl' ? 'showcase-arrow-icon-prev' : 'showcase-arrow-icon-next'}`} />
            </IconButton>
          </Box>

          <Box className="showcase-product-meta">
            <Typography variant="h5">{selectedShowcaseProduct.name}</Typography>
            <Typography variant="body2">{selectedShowcaseProduct.flavor} • {selectedShowcaseProduct.weight}</Typography>
            {selectedShowcaseProduct.quantities?.length ? <Typography variant="body2">Quantidades: {selectedShowcaseProduct.quantities.join(' / ')}</Typography> : null}
            {selectedShowcaseProduct.details ? <Typography variant="body2">{selectedShowcaseProduct.details}</Typography> : null}

            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>Avalie este sabor</Typography>
              <Rating precision={1} value={ratingStats?.userRating ?? 0} onChange={(_event, nextValue) => nextValue && onRateProduct(selectedShowcaseProduct, nextValue)} />
              <Typography variant="caption" sx={{ display: 'block' }}>
                Média {isGlobalRatingsActive ? 'global' : 'local'}: {(ratingStats?.average ?? selectedShowcaseProduct.rating).toFixed(1)} ★ ({ratingStats?.votes ?? selectedShowcaseProduct.reviewCount ?? 0} avaliações)
              </Typography>
            </Box>

            <Typography color="secondary" fontWeight={700}>{BRL.format(selectedShowcaseProduct.price)}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={() => addItem(selectedShowcaseProduct.id)}>Adicionar</Button>
              <IconButton color="secondary" onClick={() => onShareProduct(selectedShowcaseProduct)}><ShareIcon /></IconButton>
              <MotionBox
                className="favorite-heart-button"
                sx={{ display: 'inline-flex' }}
                data-favorite-count={favoriteCounts[selectedShowcaseProduct.id] ?? 0}
                data-is-favorite={favoriteProductIds.includes(selectedShowcaseProduct.id)}
                data-has-favorite-handler={typeof onFavoriteProduct === 'function'}
                whileTap={{ scale: 0.9 }}
              >
                <LikeButton itemId={selectedShowcaseProduct.id} />
              </MotionBox>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>Nenhum produto para o filtro atual.</Alert>
      )}
    </Container>
  )
}
