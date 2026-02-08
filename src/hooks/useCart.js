import { useMemo, useState } from 'react'

export function useCart(products) {
  const [cart, setCart] = useState({})

  const addItem = (itemId) => {
    setCart((current) => ({ ...current, [itemId]: (current[itemId] ?? 0) + 1 }))
  }

  const removeItem = (itemId) => {
    setCart((current) => {
      const quantity = current[itemId] ?? 0
      if (quantity <= 1) {
        const next = { ...current }
        delete next[itemId]
        return next
      }
      return { ...current, [itemId]: quantity - 1 }
    })
  }

  const setItemQuantity = (itemId, quantity) => {
    setCart((current) => ({ ...current, [itemId]: Math.max(1, Math.round(quantity)) }))
  }

  const selectedItems = useMemo(
    () => products.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id], subtotal: item.price * cart[item.id] })),
    [cart, products],
  )

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.subtotal, 0)

  return { cart, addItem, removeItem, setItemQuantity, selectedItems, totalItems, totalPrice }
}
