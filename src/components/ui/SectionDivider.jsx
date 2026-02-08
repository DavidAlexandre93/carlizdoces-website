import { Container, Divider, Typography } from '@mui/material'

export function SectionDivider({ label }) {
  return (
    <Container maxWidth="lg" className="page-container section-divider-wrap" aria-hidden="true">
      <Divider className="section-divider" textAlign="center">
        <Typography component="span" variant="overline" className="section-divider-label">{label}</Typography>
      </Divider>
    </Container>
  )
}
