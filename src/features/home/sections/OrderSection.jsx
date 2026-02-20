import { Box, Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'

export function OrderSection({
  BRL,
  orderCustomer,
  setOrderCustomer,
  selectedItems,
  customizations,
  setCustomizations,
  paymentMethods,
  deliveryMethods,
  orderPreferences,
  setOrderPreferences,
  totalPrice,
  totalItems,
  whatsappLink,
  removeItem,
}) {
  const canShowConfirmButton = orderCustomer.name.trim() && orderCustomer.phone.trim() && totalItems > 0

  return (
    <Container maxWidth="lg" className="order-section section-alt-gray animate__animated animate__fadeInUp" style={{ '--animate-duration': '700ms' }}>
      <Paper sx={{ p: 3, borderRadius: 3, maxWidth: 1080, mx: 'auto' }}>
        <Box sx={{ mt: 2, display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <TextField label="Nome" value={orderCustomer.name} onChange={(e) => setOrderCustomer((c) => ({ ...c, name: e.target.value }))} />
          <TextField label="WhatsApp" value={orderCustomer.phone} onChange={(e) => setOrderCustomer((c) => ({ ...c, phone: e.target.value }))} />
        </Box>

        {selectedItems.map((item) => (
          <Box key={item.id} sx={{ mt: 2, p: 1.5, border: '1px solid #eee', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
              <Box>
                <Typography fontWeight={700}>{item.name}</Typography>
                <Typography variant="body2">Qtd: {item.quantity} • Subtotal: {BRL.format(item.subtotal)}</Typography>
              </Box>
              <Button size="small" variant="outlined" color="secondary" onClick={() => removeItem(item.id)}>Remover</Button>
            </Box>
            <Box sx={{ mt: 1.2, display: 'grid', gap: 1.2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' } }}>
              <FormControl size="small" sx={{ minWidth: 220 }}>
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
          </Box>
        ))}

        {selectedItems.length > 0 ? (
          <Box sx={{ mt: 2, display: 'grid', gap: 1.2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="delivery-order">Recebimento</InputLabel>
              <Select
                labelId="delivery-order"
                value={orderPreferences.deliveryMethod}
                label="Recebimento"
                onChange={(e) => setOrderPreferences((current) => ({ ...current, deliveryMethod: e.target.value }))}
              >
                {deliveryMethods.map((method) => (
                  <MenuItem key={method} value={method}>{method}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="offers-order">Deseja receber ofertas no WhatsApp?</InputLabel>
              <Select
                labelId="offers-order"
                value={orderPreferences.receiveOffersOnWhatsApp}
                label="Deseja receber ofertas no WhatsApp?"
                onChange={(e) => setOrderPreferences((current) => ({ ...current, receiveOffersOnWhatsApp: e.target.value }))}
              >
                <MenuItem value="Sim">Sim</MenuItem>
                <MenuItem value="Não">Não</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : null}

        {orderPreferences.deliveryMethod === 'Entrega' ? (
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Será cobrada uma taxa de entrega a definir, conforme a região onde você mora.
          </Typography>
        ) : null}

        <Typography sx={{ mt: 2 }}><strong>Total:</strong> {BRL.format(totalPrice)} ({totalItems} itens)</Typography>
        {canShowConfirmButton ? (
          <Button sx={{ mt: 2 }} variant="contained" color="secondary" href={whatsappLink} target="_blank" rel="noreferrer">
            Confirmar no WhatsApp
          </Button>
        ) : null}
      </Paper>
    </Container>
  )
}
