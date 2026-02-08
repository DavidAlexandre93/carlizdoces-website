import { useRef, useState } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  Icon,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Modal,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'

export function Header({ navItems, isDarkMode, onToggleDarkMode, isMobileMenuOpen, onOpenMobileMenu, onCloseMobileMenu }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [logoMotion, setLogoMotion] = useState({ x: 0, y: 0, rotation: 0, isMoving: false })
  const appBarRef = useRef(null)
  const logoRef = useRef(null)

  const notificationMessage = `Pedidos páscoa 2026
Faça seu pedido até 25/03/2026 e concorra ao sorteio de um delicioso ovo de colher! 😍

🎥 Sorteio ao vivo no Instagram: 03/04/2026

🍀 Boa sorte!


🚚 Entrega (com taxa) ou retirada no ponto de referência mais próximo.

❄️ Conservar na geladeira. Retire alguns minutinhos antes de consumir para aproveitar toda a cremosidade!


🥄 Ovos de colher: 250g podendo chegar a 400g

🍬 Ovos trufados: 150g – embalados nas cores verde ou rosa, com laço feito à mão 💝


🧁 Produção artesanal, sem conservantes.

⏳ Validade: consumir em até 5 dias, mantendo refrigerado.


📸 Marque a gente: @carlizdoces

Queremos ver sua experiência!

Deus abençoe! 🙌`

  const handleLogoClick = () => {
    if (!logoRef.current) {
      return
    }

    const logoRect = logoRef.current.getBoundingClientRect()
    const appBarRect = appBarRef.current?.getBoundingClientRect()
    const visualViewport = window.visualViewport
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const topInset = Math.max(0, visualViewport?.offsetTop ?? 0)
    const bottomInset = Math.max(0, viewportHeight - ((visualViewport?.height ?? viewportHeight) + (visualViewport?.offsetTop ?? 0)))
    const pageContainer = logoRef.current.closest('.page-container')
    const pageContainerStyles = pageContainer ? window.getComputedStyle(pageContainer) : null
    const paddingLeft = parseFloat(pageContainerStyles?.paddingLeft ?? '0') || 0
    const paddingRight = parseFloat(pageContainerStyles?.paddingRight ?? '0') || 0
    const headerHeight = appBarRect?.height ?? 0
    const footerHeight = 0

    const xMin = paddingLeft
    const xMax = Math.max(xMin, viewportWidth - paddingRight - logoRect.width)
    const yMin = topInset + headerHeight
    const yMax = Math.max(yMin, viewportHeight - bottomInset - footerHeight - logoRect.height)

    const targetX = xMin + Math.random() * Math.max(0, xMax - xMin)
    const targetY = yMin + Math.random() * Math.max(0, yMax - yMin)
    const rotation = (Math.random() * 22) - 11

    setLogoMotion({
      x: targetX - logoRect.left,
      y: targetY - logoRect.top,
      rotation,
      isMoving: true,
    })
  }

  return (
    <>
      <AppBar component="header" position="sticky" color="transparent" elevation={0} className="topbar" ref={appBarRef}>
        <Container maxWidth="xl" className="page-container">
          <Toolbar disableGutters className="topbar-inner">
            <Link href="#top" underline="none" color="inherit" className="topbar-brand" onClick={handleLogoClick}>
              <Box
                component="img"
                src="/images/banner-carliz.svg"
                alt="Logo da Carliz Doces"
                className={`brand-logo ${logoMotion.isMoving ? 'is-moving' : ''}`}
                ref={logoRef}
                style={{
                  '--logo-move-x': `${logoMotion.x}px`,
                  '--logo-move-y': `${logoMotion.y}px`,
                  '--logo-rotate': `${logoMotion.rotation}deg`,
                }}
              />
              <Typography component="span" className="brand-name" aria-label="Carliz Doces">
                <span className="brand-word">
                  Carl
                  <span className="brand-candy brand-candy-lollipop" role="img" aria-label="Pirulito">🍭</span>
                  z
                </span>
                <span className="brand-word brand-word-doces">
                  D
                  <span className="brand-candy brand-candy-donut" role="img" aria-label="Rosquinha">🍩</span>
                  ces
                </span>
              </Typography>
            </Link>

            <Stack
              component="nav"
              direction="row"
              className="topbar-nav"
              spacing={1.25}
              useFlexGap
              sx={{ flexWrap: 'nowrap' }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.sectionId}
                  component={Link}
                  href={`#${item.sectionId}`}
                  color="inherit"
                  variant="text"
                  disableElevation
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    minWidth: 'max-content',
                    whiteSpace: 'nowrap',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 999,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Box className="topbar-actions">
              <Tooltip title={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'} arrow>
                <IconButton
                  color="inherit"
                  aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
                  onClick={() => onToggleDarkMode(!isDarkMode)}
                  className="theme-toggle-button"
                >
                  <Icon>{isDarkMode ? 'light_mode' : 'dark_mode'}</Icon>
                </IconButton>
              </Tooltip>

              <Tooltip title="Ver notificações" arrow>
                <IconButton color="inherit" aria-label="Ver notificações" onClick={() => setIsNotificationOpen(true)}>
                  <Icon>notifications</Icon>
                </IconButton>
              </Tooltip>

              <Tooltip title="Bem vindo" arrow>
                <Avatar aria-label="Bem vindo" sx={{ width: 36, height: 36, bgcolor: '#ad1457' }}>
                  <Icon sx={{ fontSize: 20 }}>person</Icon>
                </Avatar>
              </Tooltip>

              <IconButton color="inherit" aria-label="Abrir menu" edge="end" onClick={onOpenMobileMenu} className="topbar-menu-button">
                <Icon>menu</Icon>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={isMobileMenuOpen} onClose={onCloseMobileMenu}>
        <Box className="mobile-nav" role="presentation" onClick={onCloseMobileMenu}>
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.sectionId} component="a" href={`#${item.sectionId}`}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Modal open={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} aria-labelledby="notification-modal-title">
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '92%', sm: 600 },
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Paper elevation={6} sx={{ p: 3, borderRadius: 2 }}>
            <Typography id="notification-modal-title" variant="h6" component="h2" sx={{ mb: 2, fontWeight: 700 }}>
              Notificação
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
              {notificationMessage}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={() => setIsNotificationOpen(false)}>
                Fechar
              </Button>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </>
  )
}
