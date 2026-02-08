import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'

export function OrderSection({ BRL, orderCustomer, setOrderCustomer, selectedItems, customizations, setCustomizations, paymentMethods, totalPrice, totalItems, whatsappLink }) {
  return (
    <section id="realizar-pedido" className="order-section">
      <Paper sx={{ p: 3, borderRadius: 3, maxWidth: 1080, mx: 'auto' }}>
        <Typography variant="h4">Realizar pedido</Typography>
        <Box sx={{ mt: 2, display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField label="Nome" value={orderCustomer.name} onChange={(e) => setOrderCustomer((c) => ({ ...c, name: e.target.value }))} />
          <TextField label="WhatsApp" value={orderCustomer.phone} onChange={(e) => setOrderCustomer((c) => ({ ...c, phone: e.target.value }))} />
        </Box>

        {selectedItems.map((item) => (
          <Box key={item.id} sx={{ mt: 2, p: 1.5, border: '1px solid #eee', borderRadius: 2 }}>
            <Typography fontWeight={700}>{item.name}</Typography>
            <Typography variant="body2">Qtd: {item.quantity} • Subtotal: {BRL.format(item.subtotal)}</Typography>
            <FormControl size="small" sx={{ mt: 1.2, minWidth: 220 }}>
              <InputLabel id={`pay-${item.id}`}>Pagamento</InputLabel>
              <Select
                labelId={`pay-${item.id}`}
                value={customizations[item.id]?.paymentMethod ?? ''}
                label="Pagamento"
                onChange={(e) => setCustomizations((current) => ({ ...current, [item.id]: { ...current[item.id], paymentMethod: e.target.value } }))}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>{method}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}

        <Typography sx={{ mt: 2 }}><strong>Total:</strong> {BRL.format(totalPrice)} ({totalItems} itens)</Typography>
        <Button sx={{ mt: 2 }} variant="contained" color="secondary" href={whatsappLink} target="_blank" rel="noreferrer">
          Confirmar no WhatsApp
        </Button>
      </Paper>
    </section>
  )
}
