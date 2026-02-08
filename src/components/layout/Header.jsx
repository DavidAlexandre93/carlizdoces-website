import { useEffect, useRef, useState } from 'react'
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
  const [logoMotion, setLogoMotion] = useState({ x: 0, y: 0, isFollowing: false })
  const logoOriginRef = useRef({ left: 0, top: 0, width: 0, height: 0 })
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

  useEffect(() => {
    if (!logoMotion.isFollowing) {
      return undefined
    }

    const handlePointerMove = (event) => {
      const { left, top, width, height } = logoOriginRef.current
      const moveX = event.clientX - (left + (width / 2))
      const moveY = event.clientY - (top + (height / 2))

      setLogoMotion((prevState) => ({
        ...prevState,
        x: moveX,
        y: moveY,
      }))
    }

    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [logoMotion.isFollowing])

  const handleLogoClick = (event) => {
    event.preventDefault()

    if (!logoRef.current) {
      return
    }

    if (logoMotion.isFollowing) {
      setLogoMotion({ x: 0, y: 0, isFollowing: false })
      return
    }

    const logoRect = logoRef.current.getBoundingClientRect()
    logoOriginRef.current = {
      left: logoRect.left,
      top: logoRect.top,
      width: logoRect.width,
      height: logoRect.height,
    }

    setLogoMotion({ x: 0, y: 0, isFollowing: true })
  }

  return (
    <>
      <AppBar component="header" position="sticky" color="transparent" elevation={0} className="topbar" ref={appBarRef}>
        <Container maxWidth="xl" className="page-container">
          <Toolbar disableGutters className="topbar-inner">
            <Link href="#top" underline="none" color="inherit" className="topbar-brand" onClick={handleLogoClick}>
              <Box
                component="img"
                src="/images/logo/logo-carlizdoces.jpg"
                alt="Logo da Carliz Doces"
                className={`brand-logo ${logoMotion.isFollowing ? 'is-following' : ''}`}
                ref={logoRef}
                style={{
                  '--logo-follow-x': `${logoMotion.x}px`,
                  '--logo-follow-y': `${logoMotion.y}px`,
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
