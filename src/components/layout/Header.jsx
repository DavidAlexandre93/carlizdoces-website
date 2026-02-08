import { useState } from 'react'
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
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'

export function Header({ navItems, isDarkMode, onToggleDarkMode, isMobileMenuOpen, onOpenMobileMenu, onCloseMobileMenu }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

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

  return (
    <>
      <AppBar component="header" position="sticky" color="transparent" elevation={0} className="topbar">
        <Container maxWidth="xl" className="page-container">
          <Toolbar disableGutters className="topbar-inner">
            <Link href="#top" underline="none" color="inherit" className="topbar-brand">
              <Box component="img" src="/images/banner-carliz.svg" alt="Logo da Carliz Doces" className="brand-logo" />
              <Typography component="span" className="brand-name">Carliz Doces</Typography>
            </Link>

            <Box component="nav" className="topbar-nav">
              {navItems.map((item) => (
                <Link key={item.sectionId} href={`#${item.sectionId}`} underline="hover" color="inherit" sx={{ fontWeight: 600 }}>
                  {item.label}
                </Link>
              ))}
            </Box>

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

              <Tooltip title="Usuário logado" arrow>
                <Avatar aria-label="Usuário logado" sx={{ width: 36, height: 36, bgcolor: '#ad1457' }}>
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
