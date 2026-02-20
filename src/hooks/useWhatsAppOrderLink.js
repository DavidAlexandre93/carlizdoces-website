import { useMemo } from 'react'

export function useWhatsAppOrderLink({ selectedItems, customizations, orderCustomer, totalItems, totalPrice, BRL, whatsappNumber }) {
  return useMemo(() => {
    const customerName = orderCustomer.name.trim() || 'Cliente não informado'
    const customerPhone = orderCustomer.phone.trim() || 'não informado'

    const orderList =
      selectedItems.length > 0
        ? selectedItems
            .map((item) => {
              const details = customizations[item.id] ?? {}
              const selectedFlavor = details.flavor?.trim() || item.flavor
              const selectedPayment = details.paymentMethod?.trim() || 'não informado'
              const selectedDeliveryMethod = details.deliveryMethod?.trim() || 'não informado'
              const selectedOfferPreference = details.receiveOffersOnWhatsApp?.trim() || 'não informado'
              return [
                `🍬 ${item.name}`,
                `• Quantidade: ${item.quantity}`,
                `• Sabor escolhido: ${selectedFlavor}`,
                `• Preço unitário: ${BRL.format(item.price)}`,
                `• Subtotal: ${BRL.format(item.subtotal)}`,
                `• Forma de pagamento: ${selectedPayment}`,
                `• Recebimento: ${selectedDeliveryMethod}`,
                `• Receber ofertas no WhatsApp: ${selectedOfferPreference}`,
              ].join('\n')
            })
            .join('\n\n')
        : '- Ainda estou escolhendo os doces.'

    const message = encodeURIComponent(
      `Olá, Carliz Doces! ✨\n\nGostaria de realizar um pedido de outros doces. Seguem os detalhes:\n\n👤 Nome: ${customerName}\n📱 WhatsApp para retorno: ${customerPhone}\n\n${orderList}\n\n📦 Total de itens: ${totalItems}\n💰 Valor total estimado: ${BRL.format(totalPrice)}\n\nFico no aguardo para confirmar disponibilidade, produção e entrega. Muito obrigado(a)!`,
    )

    return `https://wa.me/${whatsappNumber}?text=${message}`
  }, [BRL, customizations, orderCustomer.name, orderCustomer.phone, selectedItems, totalItems, totalPrice, whatsappNumber])
}
