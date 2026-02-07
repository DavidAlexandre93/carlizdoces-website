import './App.css'

const navItems = [
  { label: 'Quem Somos', sectionId: 'quem-somos' },
  { label: 'Onde estamos', sectionId: 'onde-estamos' },
  { label: 'Realizar Pedido', sectionId: 'realizar-pedido' },
  { label: 'Ovos de páscoa', sectionId: 'ovos-de-pascoa' },
  { label: 'contato', sectionId: 'contato' },
]

const products = [
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

const metrics = [
  ['Pedidos por dia', '120+'],
  ['Sabores disponíveis', '30'],
  ['Eventos atendidos', '450'],
]

export default function App() {
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

      <section className="photo-band">
        {products.map((item) => (
          <article key={item.name}>
            <img src={item.image} alt={item.name} />
            <div>
              <strong>{item.name}</strong>
              <span>{item.price}</span>
            </div>
          </article>
        ))}
      </section>

      <section id="onde-estamos" className="content-block centered">
        <div className="section-icon">🧁</div>
        <h2>ONDE ESTAMOS</h2>
        <p>Rua dos Doces, 145 - Centro, São Paulo - SP.</p>
        <p>Atendemos retirada e entregas locais com agendamento.</p>
        <p>Segunda a Sábado • 09h às 19h | Domingo • 10h às 15h</p>
        <p>Próximo à Praça Central e estação de metrô.</p>
      </section>

      <section id="contato" className="contact-hero">
        <div>
          <h2>Contato</h2>
          <p>Fale com a nossa equipe para encomendas especiais e eventos.</p>
          <p>Email: voce@email.com</p>
          <p>Telefone: (11) 99999-9999</p>
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
