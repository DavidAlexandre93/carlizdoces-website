import { useEffect, useRef, useState } from 'react'
import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
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
  useMediaQuery,
  useTheme,
} from '@mui/material'

const NOTIFICATION_READ_STORAGE_KEY = 'carlizdoces:notification:pascoa-2026:read'

export function Header({
  navItems,
  isMobileMenuOpen,
  onOpenMobileMenu,
  onCloseMobileMenu,
}) {
  const theme = useTheme()
  const isMobileNavigation = useMediaQuery(theme.breakpoints.down('lg'))
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false)
  const [logoMotion, setLogoMotion] = useState({ x: 0, y: 0, isFollowing: false })
  const logoOriginRef = useRef({ left: 0, top: 0, width: 0, height: 0 })
  const appBarRef = useRef(null)
  const logoRef = useRef(null)

  const notificationMessage = `Pedidos páscoa 2026
Faça seu pedido até 25/03/2026 e concorra ao sorteio de um delicioso ovo de colher! 😍

🎥 Sorteio ao vivo no Instagram: 03/04/2026

🍀 Boa sorte!

🚚 Entrega (com taxa) ou retirada no ponto de referência mais próximo.

🧁 Produção artesanal, sem conservantes.

📸 Marque a gente: @carlizdoces

Queremos ver sua experiência!

Deus abençoe! 🙌`

  useEffect(() => {
    if (!isMobileNavigation && isMobileMenuOpen) {
      onCloseMobileMenu()
    }
  }, [isMobileMenuOpen, isMobileNavigation, onCloseMobileMenu])

  useEffect(() => {
    const notificationReadStatus = window.localStorage.getItem(NOTIFICATION_READ_STORAGE_KEY)

    if (notificationReadStatus === 'true') {
      setHasUnreadNotification(false)
      return
    }

    setHasUnreadNotification(true)
  }, [])

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

  const handleNotificationOpen = () => {
    setIsNotificationOpen(true)

    if (hasUnreadNotification) {
      setHasUnreadNotification(false)
      window.localStorage.setItem(NOTIFICATION_READ_STORAGE_KEY, 'true')
    }
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

            {!isMobileNavigation && (
              <Stack
                component="nav"
                direction="row"
                className="topbar-nav"
                spacing={0}
                useFlexGap
                sx={{
                  flexWrap: 'nowrap',
                  gap: {
                    lg: 0.25,
                    xl: 0.6,
                  },
                }}
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
                      px: {
                        lg: 0.95,
                        xl: 1.2,
                      },
                      py: {
                        lg: 0.45,
                        xl: 0.55,
                      },
                      minWidth: 0,
                      whiteSpace: 'nowrap',
                      fontSize: {
                        lg: '0.78rem',
                        xl: '0.88rem',
                      },
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      textTransform: 'none',
                      borderRadius: 999,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            )}

            <Box className="topbar-actions">

              <Tooltip title="Ver notificações" arrow>
                <Badge
                  color="error"
                  badgeContent="Novo"
                  invisible={!hasUnreadNotification}
                  sx={{
                    '& .MuiBadge-badge': {
                      fontWeight: 700,
                      fontSize: '0.62rem',
                      px: 0.8,
                      minWidth: 0,
                      boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.7), 0 0 10px rgba(244, 67, 54, 0.55)',
                    },
                  }}
                >
                  <IconButton color="inherit" aria-label="Ver notificações" onClick={handleNotificationOpen}>
                    <Icon>notifications</Icon>
                  </IconButton>
                </Badge>
              </Tooltip>

              {isMobileNavigation && (
                <IconButton color="inherit" aria-label="Abrir menu" edge="end" onClick={onOpenMobileMenu} className="topbar-menu-button">
                  <Icon>menu</Icon>
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={isMobileMenuOpen && isMobileNavigation}
        onClose={onCloseMobileMenu}
        PaperProps={{
          className: 'mobile-nav-drawer',
          sx: {
            width: {
              xs: 'min(88vw, 320px)',
              sm: 'min(74vw, 340px)',
            },
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          },
        }}
      >
        <Box className="mobile-nav" role="presentation">
          <Box className="mobile-nav-header">
            <Typography variant="subtitle1" component="h2" className="mobile-nav-title">
              Menu
            </Typography>
            <IconButton
              color="inherit"
              aria-label="Fechar menu"
              onClick={onCloseMobileMenu}
              className="mobile-nav-close"
            >
              <Icon>close</Icon>
            </IconButton>
          </Box>

          <Divider className="mobile-nav-divider" />

          <List className="mobile-nav-list">
            {navItems.map((item) => (
              <ListItemButton key={item.sectionId} component="a" href={`#${item.sectionId}`} onClick={onCloseMobileMenu}>
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
