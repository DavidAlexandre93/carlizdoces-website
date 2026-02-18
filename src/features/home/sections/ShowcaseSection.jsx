import SwipeableViews from 'react-swipeable-views'
import FavoriteBorderIcon from '../../../mui-icons/FavoriteBorder'
import FavoriteIcon from '../../../mui-icons/Favorite'
import ShareIcon from '../../../mui-icons/Share'
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Rating,
  Select,
  Slider,
  Typography,
  useTheme,
} from '@mui/material'

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
  removeItem,
  onShareProduct,
  favoriteCounts,
  favoriteProductIds,
  onFavoriteProduct,
  productRatings,
  onRateProduct,
  isGlobalRatingsActive,
  disablePrevAtLast = false,
}) {
  const theme = useTheme()
  const ratingStats = selectedShowcaseProduct ? productRatings?.[selectedShowcaseProduct.id] : null
  const totalVisibleProducts = visibleShowcaseProducts.length
  const hasMultipleProducts = totalVisibleProducts > 1
  const isFirstProduct = activeProductStep <= 0
  const isLastProduct = activeProductStep >= totalVisibleProducts - 1
  const isPrevArrowDisabled = !hasMultipleProducts || (disablePrevAtLast && isLastProduct)
  const isNextArrowDisabled = !hasMultipleProducts || (disablePrevAtLast && isFirstProduct)

  const handlePreviousProduct = () => {
    if (isPrevArrowDisabled) return

    if (disablePrevAtLast) {
      setActiveProductStep((step) => Math.min(totalVisibleProducts - 1, step + 1))
      return
    }

    setActiveProductStep((step) => (step <= 0 ? totalVisibleProducts - 1 : step - 1))
  }

  const handleNextProduct = () => {
    if (isNextArrowDisabled) return

    if (disablePrevAtLast) {
      setActiveProductStep((step) => Math.max(0, step - 1))
      return
    }

    setActiveProductStep((step) => (step >= totalVisibleProducts - 1 ? 0 : step + 1))
  }

  return (
    <Container id="ovos-de-pascoa" maxWidth="xl" className="photo-band section-alt-pink animate__animated animate__fadeInUp page-container" style={{ '--animate-duration': '750ms' }}>
      <header className="photo-band-head">
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 300 }, mt: 1.5 }}>
          <InputLabel id="showcase-select-label">Selecionar sabor</InputLabel>
          <Select
            labelId="showcase-select-label"
            value={selectedShowcaseProduct?.id ?? ''}
            label="Selecionar sabor"
            onChange={(event) => {
              const nextIndex = visibleShowcaseProducts.findIndex((item) => item.id === event.target.value)
              if (nextIndex >= 0) {
                setActiveProductStep(nextIndex)
              }
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
          <Box className="showcase-image-stage">
            <SwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeProductStep}
              onChangeIndex={setActiveProductStep}
              enableMouseEvents
            >
              {visibleShowcaseProducts.map((product) => (
                <img
                  key={product.id}
                  className="showcase-image"
                  src={product.image}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                />
              ))}
            </SwipeableViews>

            <>
              <IconButton
                className="showcase-arrow showcase-arrow-prev"
                onClick={handlePreviousProduct}
                disabled={isPrevArrowDisabled}
                aria-label="Produto anterior"
              >
                <span className={`showcase-arrow-icon ${theme.direction === 'rtl' ? 'showcase-arrow-icon-next' : 'showcase-arrow-icon-prev'}`} />
              </IconButton>

              <IconButton
                className="showcase-arrow showcase-arrow-next"
                onClick={handleNextProduct}
                disabled={isNextArrowDisabled}
                aria-label="Próximo produto"
              >
                <span className={`showcase-arrow-icon ${theme.direction === 'rtl' ? 'showcase-arrow-icon-prev' : 'showcase-arrow-icon-next'}`} />
              </IconButton>
            </>

          </Box>
          <Typography variant="h5">{selectedShowcaseProduct.name}</Typography>
          <Typography variant="body2">{selectedShowcaseProduct.flavor} • {selectedShowcaseProduct.weight}</Typography>
          {selectedShowcaseProduct.quantities?.length ? (
            <Typography variant="body2">Quantidades: {selectedShowcaseProduct.quantities.join(' / ')}</Typography>
          ) : null}
          {selectedShowcaseProduct.details ? <Typography variant="body2">{selectedShowcaseProduct.details}</Typography> : null}
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Avalie este sabor
            </Typography>
            <Rating
              precision={1}
              value={ratingStats?.userRating ?? 0}
              onChange={(_event, nextValue) => {
                if (nextValue) {
                  onRateProduct(selectedShowcaseProduct, nextValue)
                }
              }}
            />
            <Typography variant="caption" sx={{ display: 'block' }}>
              Média {isGlobalRatingsActive ? 'global' : 'local'}: {(ratingStats?.average ?? selectedShowcaseProduct.rating).toFixed(1)} ★ ({ratingStats?.votes ?? selectedShowcaseProduct.reviewCount ?? 0} avaliações)
            </Typography>
          </Box>
          <Typography color="secondary" fontWeight={700}>{BRL.format(selectedShowcaseProduct.price)}</Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={() => addItem(selectedShowcaseProduct.id)}>Adicionar</Button>
            <Button variant="outlined" onClick={() => removeItem(selectedShowcaseProduct.id)}>Remover</Button>
            <IconButton color="secondary" onClick={() => onShareProduct(selectedShowcaseProduct)}>
              <ShareIcon />
            </IconButton>
            <IconButton
              className="favorite-heart-button"
              color="inherit"
              onClick={() => onFavoriteProduct(selectedShowcaseProduct)}
              aria-label="Marcar como favorito"
            >
              <Badge color="error" badgeContent={favoriteCounts[selectedShowcaseProduct.id] ?? 0}>
                {favoriteProductIds.includes(selectedShowcaseProduct.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </Badge>
            </IconButton>
          </Box>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>Nenhum produto para o filtro atual.</Alert>
      )}

    </Container>
  )
}
