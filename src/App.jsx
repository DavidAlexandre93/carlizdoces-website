import { useMemo, useState } from 'react'
import './App.css'

const navItems = [
  { label: 'Quem somos', sectionId: 'quem-somos' },
  { label: 'Onde estamos', sectionId: 'onde-estamos' },
  { label: 'Realizar pedido', sectionId: 'realizar-pedido' },
  { label: 'Ovos de páscoa', sectionId: 'ovos-de-pascoa' },
  { label: 'Contato', sectionId: 'contato' },
]

const productHighlights = [
  {
    name: 'Ovo Brigadeiro Gourmet',
    price: 'R$ 59,00',
    image: '/images/brigadeiro.svg',
  },
  {
    name: 'Ovo Ninho com Nutella',
    price: 'R$ 68,50',
    image: '/images/ninho-nutella.svg',
  },
  {
    name: 'Ovo Prestígio Cremoso',
    price: 'R$ 62,00',
    image: '/images/prestigio.svg',
  },
]

const orderOptions = [
  { id: 'brigadeiro', name: 'Brigadeiro Gourmet', price: 59, image: '/images/brigadeiro.svg' },
  { id: 'ninho-nutella', name: 'Ninho com Nutella', price: 68.5, image: '/images/ninho-nutella.svg' },
  { id: 'prestigio', name: 'Prestígio Cremoso', price: 62, image: '/images/prestigio.svg' },
  { id: 'ferrero', name: 'Ferrero Crocante', price: 72, image: '/images/ferrero.svg' },
  { id: 'trufado-maracuja', name: 'Trufado de Maracujá', price: 64, image: '/images/trufado-maracuja.svg' },
  { id: 'ninho-uva', name: 'Ninho com Uva', price: 66, image: '/images/ninho-uva.svg' },
]

const metrics = [
  ['Pedidos por dia', '120+'],
  ['Sabores disponíveis', '30'],
  ['Eventos atendidos', '450'],
]

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export default function App() {
  const [cart, setCart] = useState({})

  const addItem = (itemId) => {
    setCart((current) => ({ ...current, [itemId]: (current[itemId] ?? 0) + 1 }))
  }

  const removeItem = (itemId) => {
    setCart((current) => {
      const qty = current[itemId] ?? 0
      if (qty <= 1) {
        const next = { ...current }
        delete next[itemId]
        return next
      }
      return { ...current, [itemId]: qty - 1 }
    })
  }

  const selectedItems = useMemo(
    () =>
      orderOptions
        .filter((item) => cart[item.id])
        .map((item) => ({ ...item, quantity: cart[item.id], subtotal: cart[item.id] * item.price })),
    [cart],
  )

  const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.subtotal, 0)

  const whatsappLink = useMemo(() => {
    const orderList =
      selectedItems.length > 0
        ? selectedItems
            .map((item) => `- ${item.name} x${item.quantity} (${BRL.format(item.subtotal)})`)
            .join('\n')
        : '- Ainda estou escolhendo os doces.'

    const message = encodeURIComponent(
      `Olá! Tenho interesse em comprar doces da Carliz Doces.\n\nMeu pedido:\n${orderList}\n\nTotal de itens: ${totalItems}\nTotal estimado: ${BRL.format(totalPrice)}`,
    )

    return `https://wa.me/5511992175496?text=${message}`
  }, [selectedItems, totalItems, totalPrice])

  return (
    <div className="site-wrapper">
      <header className="topbar">
        <div className="brand">🧁</div>
        <nav>
          {navItems.map((item) => (
            <a key={item.sectionId} href={`#${item.sectionId}`}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero">
        <img src="/images/banner-carliz.svg" alt="Cupcakes artesanais" />
        <h1>Carliz Doces</h1>
      </section>

      <section id="quem-somos" className="summary-band centered">
        <h2>QUEM SOMOS</h2>
        <p>
          Somos a Carliz doces realizamos doces a pronta entrega para festas, casamentos, aniversários e
          ovos de páscoa.
        </p>
      </section>

      <section id="ovos-de-pascoa" className="photo-band">
        {productHighlights.map((item) => (
          <article key={item.name}>
            <img src={item.image} alt={item.name} />
            <div>
              <strong>{item.name}</strong>
              <span>{item.price}</span>
            </div>
          </article>
        ))}
      </section>

      <section id="realizar-pedido" className="order-section">
        <h2>Realizar pedido</h2>
        <p>Escolha os doces disponíveis, monte seu carrinho e finalize direto no WhatsApp.</p>

        <div className="order-grid">
          <div className="order-list">
            {orderOptions.map((item) => (
              <article key={item.id}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <span>{BRL.format(item.price)}</span>
                </div>
                <div className="qty-controls">
                  <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remover ${item.name}`}>
                    -
                  </button>
                  <strong>{cart[item.id] ?? 0}</strong>
                  <button type="button" onClick={() => addItem(item.id)} aria-label={`Adicionar ${item.name}`}>
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="order-summary">
            <h3>Resumo do pedido</h3>
            <p>
              <strong>{totalItems}</strong> item(ns) no carrinho
            </p>
            <ul>
              {selectedItems.length === 0 ? (
                <li>Seu carrinho está vazio.</li>
              ) : (
                selectedItems.map((item) => (
                  <li key={item.id}>
                    {item.name} x{item.quantity} — {BRL.format(item.subtotal)}
                  </li>
                ))
              )}
            </ul>
            <p className="summary-total">Total: {BRL.format(totalPrice)}</p>
            <a className="finish-order" href={whatsappLink} target="_blank" rel="noreferrer">
              Finalizar pedido
            </a>
          </aside>
        </div>
      </section>

      <section id="onde-estamos" className="content-block centered">
        <div className="section-icon">🧁</div>
        <h2>ONDE ESTAMOS</h2>
        <p>Visite nossa loja para retirada e encomendas presenciais.</p>
        <p>Atendemos retirada e entregas locais com agendamento.</p>
        <p>Segunda a Sábado • 09h às 19h | Domingo • 10h às 15h</p>
        <p>Próximo à Praça Central e estação de metrô.</p>
      </section>

      <section id="contato" className="contact-hero">
        <div>
          <h2>Contato</h2>
          <p>Fale com a nossa equipe para encomendas especiais e eventos.</p>
          <p>Email: voce@email.com</p>
          <p>Telefone: +55 11 99217-5496</p>
        </div>
      </section>

      <footer className="footer">
        <div className="brand">🧁</div>
        <small>©2024 Carliz Doces</small>
        <ul>
          {navItems.map((item) => (
            <li key={item.sectionId}>
              <a href={`#${item.sectionId}`}>{item.label}</a>
            </li>
          ))}
        </ul>
        <div className="metrics">
          {metrics.map(([label, value]) => (
            <span key={label}>
              {label}: {value}
            </span>
          ))}
        </div>
      </footer>
    </div>
  )
}
