import { Alert, Box, Button, Paper, Typography } from '@mui/material'

export default function TestimonialsSection({ testimonials, onAddSample }) {
  return (
    <section id="depoimentos" className="testimonials-section">
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, maxWidth: 1080, mx: 'auto' }}>
        <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
          Depoimentos
        </Typography>
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          {testimonials.map((item) => (
            <Alert key={item.id} severity="success" variant="outlined">
              <strong>{item.author}</strong> ({item.channel}): {item.message}
            </Alert>
          ))}
        </Box>
        <Button sx={{ mt: 2 }} onClick={onAddSample} variant="contained" color="secondary">
          Adicionar depoimento exemplo
        </Button>
      </Paper>
    </section>
  )
}
