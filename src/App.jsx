import { useMemo, useState } from 'react'
import {
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'

const navItems = [
  { label: 'Quem somos', sectionId: 'quem-somos' },
  { label: 'Onde estamos', sectionId: 'onde-estamos' },
  { label: 'Realizar Pedido', sectionId: 'realizar-pedido' },
  { label: 'Ovos de páscoa', sectionId: 'ovos-de-pascoa' },
  { label: 'Contato', sectionId: 'contato' },
]

const products = [
  {
    name: 'Ovo Brigadeiro Gourmet',
    price: 'R$ 59,00',
    rating: 5,
    image: '/images/brigadeiro.svg',
  },
  {
    name: 'Ovo Ninho com Nutella',
    price: 'R$ 68,50',
    rating: 4,
    image: '/images/ninho-nutella.svg',
  },
  {
    name: 'Ovo Prestígio Cremoso',
    price: 'R$ 62,00',
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

const Band = styled(Box)(({ theme }) => ({
  paddingBlock: theme.spacing(5),
  borderBottom: '1px solid #f1d8e1',
}))

const Section = styled(Paper)(({ theme }) => ({
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
  const [delivery, setDelivery] = useState('retirada')
  const [sweetness, setSweetness] = useState(60)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)

  const completion = useMemo(() => (delivery === 'retirada' ? 72 : 88), [delivery])

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setDrawerOpen(false)
  }

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
            <Button onClick={() => scrollToSection('ovos-de-pascoa')}>Cardápio</Button>
            <Button onClick={() => scrollToSection('realizar-pedido')}>Pedidos</Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6">Navegação</Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.sectionId} disablePadding>
                <Button
                  fullWidth
                  sx={{ justifyContent: 'flex-start', p: 1.2 }}
                  onClick={() => scrollToSection(item.sectionId)}
                >
                  {item.label}
                </Button>
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
      </Container>

      <Band id="quem-somos" sx={{ backgroundColor: '#fff8fb' }}>
        <Container maxWidth="lg">
          <HeroCard elevation={0}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Badge badgeContent="Novo" color="secondary">
                  <Avatar sx={{ bgcolor: '#ad1457' }}>CD</Avatar>
                </Badge>
                <Typography variant="h4" fontWeight={700}>
                  Quem somos
                </Typography>
              </Stack>
              <Typography>
                A Carliz Doces é uma confeitaria artesanal focada em experiências doces para festas, eventos
                corporativos e datas especiais.
              </Typography>
              <Alert severity="success">Pedidos para festas com 15% de desconto até sexta-feira.</Alert>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label="Sem conservantes" color="primary" />
                <Chip label="Entrega rápida" color="secondary" />
                <Chip label="Produção do dia" />
              </Stack>
            </Stack>
          </HeroCard>
        </Container>
      </Band>

      <Band id="onde-estamos" sx={{ backgroundColor: '#fff3f7' }}>
        <Container maxWidth="lg">
          <Section elevation={0}>
            <Typography variant="h5" gutterBottom>
              Onde estamos
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Rua dos Doces, 145 - Centro, São Paulo - SP. Atendemos retirada e entregas locais com agendamento.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                  <Typography fontWeight={600}>Horário de atendimento</Typography>
                  <Typography>Segunda a Sábado • 09h às 19h</Typography>
                  <Typography>Domingo • 10h às 15h</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                  <Typography fontWeight={600}>Referência</Typography>
                  <Typography>Próximo à Praça Central e estação de metrô.</Typography>
                  <Button sx={{ mt: 1 }} variant="outlined">
                    Ver rota
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Section>
        </Container>
      </Band>

      <Band id="realizar-pedido" sx={{ backgroundColor: '#fff8fb' }}>
        <Container maxWidth="lg">
          <Section elevation={0}>
            <Typography variant="h5" gutterBottom>
              Realizar Pedido
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
      </Band>

      <Band id="ovos-de-pascoa" sx={{ backgroundColor: '#fff3f7' }}>
        <Container maxWidth="lg">
          <Section elevation={0}>
            <Typography variant="h5" gutterBottom>
              Ovos de páscoa
            </Typography>
            <Divider sx={{ mb: 2 }} />
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
          </Section>
        </Container>
      </Band>

      <Band id="contato" sx={{ backgroundColor: '#fff8fb' }}>
        <Container maxWidth="lg">
          <Section elevation={0}>
            <Typography variant="h5" gutterBottom>
              Contato
            </Typography>
            <Typography sx={{ mb: 2 }} color="text.secondary">
              Fale com a nossa equipe para encomendas especiais e eventos.
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField fullWidth label="E-mail" placeholder="voce@email.com" />
              <TextField fullWidth label="Telefone" placeholder="(11) 99999-9999" />
              <Button variant="contained">Enviar</Button>
            </Stack>
          </Section>
        </Container>
      </Band>

      <Fab
        color="secondary"
        sx={{ position: 'fixed', right: 24, bottom: 24 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
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
