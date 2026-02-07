import { useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Fab,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  InputAdornment,
  LinearProgress,
  Link,
  List,
  ListItem,
  MenuItem,
  Paper,
  Rating,
  Select,
  Slider,
  Snackbar,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'

const navItems = ['Quem somos', 'Onde estamos', 'Realizar Pedido', 'Ovos de páscoa', 'contato']

const products = [
  {
    name: 'Brigadeiro Gourmet',
    price: 'R$ 6,00',
    rating: 5,
    image: '/images/brigadeiro.svg',
  },
  {
    name: 'Ninho com Nutella',
    price: 'R$ 8,50',
    rating: 4,
    image: '/images/ninho-nutella.svg',
  },
  {
    name: 'Prestígio Cremoso',
    price: 'R$ 7,00',
    rating: 5,
    image: '/images/prestigio.svg',
  },
]

const metrics = [
  ['Pedidos por dia', '120+'],
  ['Sabores disponíveis', '30'],
  ['Eventos atendidos', '450'],
]

const HeroCard = styled(Paper)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(5),
  background: 'linear-gradient(135deg, #ffe4ec 0%, #f7c7d9 100%)',
}))

const Section = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: 20,
  border: '1px solid #f2d5df',
}))

const ProductCard = styled(Card)(() => ({
  height: '100%',
  borderRadius: 18,
}))

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const [delivery, setDelivery] = useState('retirada')
  const [sweetness, setSweetness] = useState(60)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)

  const completion = useMemo(() => (delivery === 'retirada' ? 72 : 88), [delivery])

  return (
    <Box sx={{ bgcolor: '#fff8fb', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ top: 0, left: 0, right: 0, borderBottom: '1px solid #f1d8e1' }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={() => setDrawerOpen(true)}>
            ☰
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Carliz Doces
          </Typography>
          <ButtonGroup variant="outlined" size="small">
            <Button>Cardápio</Button>
            <Button>Ofertas</Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6">Navegação</Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item} disablePadding>
                <Button fullWidth sx={{ justifyContent: 'flex-start', p: 1.2 }}>{item}</Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="#">
            Home
          </Link>
          <Typography color="text.primary">Loja</Typography>
        </Breadcrumbs>

        <HeroCard elevation={0}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Badge badgeContent="Novo" color="secondary">
                <Avatar sx={{ bgcolor: '#ad1457' }}>CD</Avatar>
              </Badge>
              <Typography variant="h4" fontWeight={700}>
                Doçura artesanal com componentes MUI + styled
              </Typography>
            </Stack>
            <Typography>
              Esta página demonstra uma vitrine moderna usando vários componentes do Material UI estilizados com
              <strong> styled components</strong>.
            </Typography>
            <Alert severity="success">Pedidos para festas com 15% de desconto até sexta-feira.</Alert>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Sem conservantes" color="primary" />
              <Chip label="Entrega rápida" color="secondary" />
              <Chip label="Produção do dia" />
            </Stack>
          </Stack>
        </HeroCard>

        <Section elevation={0}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)}>
            <Tab label="Destaques" />
            <Tab label="Sabores" />
            <Tab label="Depoimentos" />
          </Tabs>
          <Divider sx={{ my: 2 }} />

          {tab === 0 && (
            <Grid container spacing={2}>
              {products.map((item) => (
                <Grid item xs={12} md={4} key={item.name}>
                  <ProductCard>
                    <CardMedia component="img" height="190" image={item.image} alt={item.name} />
                    <CardContent>
                      <Typography variant="h6">{item.name}</Typography>
                      <Rating value={item.rating} readOnly />
                      <Typography color="text.secondary">{item.price}</Typography>
                    </CardContent>
                    <CardActions>
                      <Tooltip title="Adicionar ao carrinho">
                        <Button variant="contained" fullWidth onClick={() => setSnackOpen(true)}>
                          Comprar
                        </Button>
                      </Tooltip>
                    </CardActions>
                  </ProductCard>
                </Grid>
              ))}
            </Grid>
          )}

          {tab === 1 && (
            <ImageList cols={3} gap={12} sx={{ m: 0 }}>
              {['ninho.svg', 'ferrero.svg', 'trufado-maracuja.svg'].map((img) => (
                <ImageListItem key={img}>
                  <img src={`/images/${img}`} alt={img} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          )}

          {tab === 2 && (
            <Accordion defaultExpanded>
              <AccordionSummary>Por que escolher a Carliz?</AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Atendimento humano, ingredientes de qualidade e personalização para aniversários, casamentos e
                  empresas.
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
        </Section>

        <Section elevation={0}>
          <Typography variant="h5" gutterBottom>
            Monte seu pedido
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Seu nome"
                  placeholder="Ex: Carla"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">👩‍🍳</InputAdornment>,
                  }}
                />
                <FormControl fullWidth>
                  <Select value={delivery} onChange={(e) => setDelivery(e.target.value)}>
                    <MenuItem value="retirada">Retirada na loja</MenuItem>
                    <MenuItem value="entrega">Entrega local</MenuItem>
                  </Select>
                </FormControl>
                <Box>
                  <Typography gutterBottom>Nível de doçura ideal</Typography>
                  <Slider value={sweetness} onChange={(_, v) => setSweetness(v)} valueLabelDisplay="auto" />
                </Box>
                <FormGroup>
                  <FormControlLabel control={<Switch defaultChecked />} label="Embalagem presenteável" />
                  <FormControlLabel control={<Switch />} label="Adicionar mensagem personalizada" />
                </FormGroup>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Métrica</TableCell>
                      <TableCell align="right">Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.map(([label, value]) => (
                      <TableRow key={label}>
                        <TableCell>{label}</TableCell>
                        <TableCell align="right">{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Progresso de disponibilidade hoje
                </Typography>
                <LinearProgress variant="determinate" value={completion} />
              </Box>
            </Grid>
          </Grid>

          <Stepper sx={{ mt: 3 }} activeStep={1} alternativeLabel>
            <Step>
              <StepLabel>Escolha os sabores</StepLabel>
            </Step>
            <Step>
              <StepLabel>Defina personalizações</StepLabel>
            </Step>
            <Step>
              <StepLabel>Finalize o pedido</StepLabel>
            </Step>
          </Stepper>

          <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
            <ToggleButtonGroup exclusive value={delivery} onChange={(_, value) => value && setDelivery(value)}>
              <ToggleButton value="retirada">Retirada</ToggleButton>
              <ToggleButton value="entrega">Entrega</ToggleButton>
            </ToggleButtonGroup>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Revisar pedido
            </Button>
          </Stack>
        </Section>
      </Container>

      <Fab color="secondary" sx={{ position: 'fixed', right: 24, bottom: 24 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑
      </Fab>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Resumo do pedido</DialogTitle>
        <DialogContent>
          <Typography>Entrega: {delivery}</Typography>
          <Typography>Doçura: {sweetness}%</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Fechar</Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        message="Item adicionado ao carrinho!"
      />
    </Box>
  )
}
