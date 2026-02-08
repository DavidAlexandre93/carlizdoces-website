import {
  AppBar,
  Avatar,
  Box,
  Container,
  Drawer,
  Icon,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'

export function Header({ navItems, isDarkMode, onToggleDarkMode, isMobileMenuOpen, onOpenMobileMenu, onCloseMobileMenu }) {
  return (
    <>
      <AppBar position="sticky" color="transparent" elevation={0} className="topbar">
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
                <Switch
                  checked={isDarkMode}
                  onChange={(_event, checked) => onToggleDarkMode(checked)}
                  color="secondary"
                  inputProps={{ 'aria-label': isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro' }}
                />
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
    </>
  )
}
