import { Container, Link, Typography } from '@mui/material'

export function Footer({ navItems, metrics }) {
  return (
    <footer className="footer">
      <Container maxWidth="lg" className="page-container footer-inner">
        <div className="brand">
          <img className="brand-logo" src="/images/logo/logo-carlizdoces.jpg" alt="Logo da Carliz Doces" />
        </div>
        <Typography component="small" variant="body2">©{new Date().getFullYear()} Carliz Doces</Typography>
        <ul>
          {navItems.map((item) => (
            <li key={item.sectionId}>
              <Link href={`#${item.sectionId}`} underline="hover" color="inherit">{item.label}</Link>
            </li>
          ))}
        </ul>
        <div className="metrics">
          {metrics.map(([label, value]) => (
            <Typography key={label} component="span" variant="body2">{label}: {value}</Typography>
          ))}
        </div>
      </Container>
    </footer>
  )
}
