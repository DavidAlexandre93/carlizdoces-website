import FavoriteBorderIcon from '../../../mui-icons/FavoriteBorder'
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
  MobileStepper,
  Paper,
  Rating,
  Select,
  Slider,
  Typography,
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
}) {
  return (
    <section id="ovos-de-pascoa" className="photo-band">
      <Container maxWidth="xl" className="page-container">
        <header className="photo-band-head">
          <Typography component="h2" variant="h4">Ovos de Páscoa</Typography>
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
            <img src={selectedShowcaseProduct.image} alt={selectedShowcaseProduct.name} style={{ width: '100%', maxHeight: 380, objectFit: 'contain' }} />
            <Typography variant="h5">{selectedShowcaseProduct.name}</Typography>
            <Typography variant="body2">{selectedShowcaseProduct.flavor} • {selectedShowcaseProduct.weight}</Typography>
            <Rating precision={0.1} value={selectedShowcaseProduct.rating} readOnly sx={{ mt: 1 }} />
            <Typography color="secondary" fontWeight={700}>{BRL.format(selectedShowcaseProduct.price)}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={() => addItem(selectedShowcaseProduct.id)}>Adicionar</Button>
              <Button variant="outlined" onClick={() => removeItem(selectedShowcaseProduct.id)}>Remover</Button>
              <IconButton color="secondary" onClick={() => onShareProduct(selectedShowcaseProduct)}>
                <ShareIcon />
              </IconButton>
              <IconButton color="secondary">
                <Badge color="secondary" badgeContent={0}>
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>
            </Box>
          </Paper>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>Nenhum produto para o filtro atual.</Alert>
        )}

        <MobileStepper
          variant="dots"
          steps={Math.max(visibleShowcaseProducts.length, 1)}
          position="static"
          activeStep={Math.min(activeProductStep, Math.max(visibleShowcaseProducts.length - 1, 0))}
          nextButton={<Button size="small" onClick={() => setActiveProductStep((step) => Math.min(step + 1, visibleShowcaseProducts.length - 1))}>Próximo</Button>}
          backButton={<Button size="small" onClick={() => setActiveProductStep((step) => Math.max(step - 1, 0))}>Anterior</Button>}
        />
      </Container>
    </section>
  )
}
