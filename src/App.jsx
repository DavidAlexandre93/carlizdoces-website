import './App.css'

const menuItems = [
  { id: 'quem-somos', label: 'Quem Somos' },
  { id: 'onde-estamos', label: 'Onde Estamos' },
  { id: 'contato', label: 'Contato' },
]

const aboutImages = [
  {
    src: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=1200&q=80',
    alt: 'Vitrine de confeitaria',
  },
  {
    src: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Cupcakes em fundo rosado',
  },
  {
    src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    alt: 'Balcão com cupcakes sortidos',
  },
]

function CupcakeIcon() {
  return (
    <svg className="cupcake-icon" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M20 30c-6 0-11-4-11-10 0-5 4-9 9-10 2-6 7-9 14-9s12 3 14 9c5 1 9 5 9 10 0 6-5 10-11 10H20z" />
      <path d="M22 30h20l-2 24H24l-2-24z" />
      <path d="M29 10c0-3 2-6 5-6s5 3 5 6c0 2-1 4-3 5l-2 2-2-2c-2-1-3-3-3-5z" />
      <line x1="30" y1="31" x2="30" y2="53" />
      <line x1="36" y1="31" x2="36" y2="53" />
      <line x1="24" y1="31" x2="24" y2="53" />
    </svg>
  )
}

function App() {
  return (
    <main className="page">
      <header className="topbar">
        <a href="#inicio" aria-label="Ir para o início" className="logo-link">
          <CupcakeIcon />
        </a>

        <nav aria-label="Menu principal" className="menu">
          {menuItems.map((item) => (
            <a href={`#${item.id}`} key={item.id}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="inicio" className="hero">
        <img
          src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=2000&q=80"
          alt="Cupcakes decorados com corações"
        />
        <h1>The Best Cupcake</h1>
      </section>

      <section id="quem-somos" className="info-block">
        <CupcakeIcon />
        <h2>QUEM SOMOS</h2>
        <p>
          Na Carliz Doces, somos apaixonados por criar doces artesanais que trazem alegria para o
          seu dia. Usamos ingredientes frescos e de alta qualidade para oferecer sabores clássicos
          e combinações especiais. Nossa missão é proporcionar momentos doces e inesquecíveis, com
          um atendimento acolhedor em cada pedido.
        </p>
      </section>

      <section className="gallery" aria-label="Galeria de cupcakes">
        {aboutImages.map((image) => (
          <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
        ))}
      </section>

      <section id="onde-estamos" className="location-wrap">
        <img
          className="location-wrap__banner"
          src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=2000&q=80"
          alt="Cupcakes em exposição"
          loading="lazy"
        />

        <div className="info-block info-block--small">
          <CupcakeIcon />
          <h2>ONDE ESTAMOS</h2>
          <p>Rua Elvira Harkot Ramina, Mossunguê, 484</p>
          <p>Curitiba</p>
        </div>
      </section>

      <section id="contato" className="contact">
        <img
          src="https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=2000&q=80"
          alt="Cupcake rosa em fundo minimalista"
          loading="lazy"
        />
        <div className="contact__content">
          <h2>Contato</h2>
          <p>Telefone: (41) 9-9999-9999</p>
          <p>Email: contato@carlizdoces.com</p>
          <p>
            Horário de atendimento:
            <br />
            seg a sex - 9h até 18h
          </p>
        </div>
      </section>

      <footer className="footer">
        <div>
          <CupcakeIcon />
          <p>©2024 Carliz Doces</p>
        </div>
        <nav aria-label="Menu rodapé" className="menu menu--footer">
          {menuItems.map((item) => (
            <a href={`#${item.id}`} key={item.id}>
              {item.label}
            </a>
          ))}
        </nav>
      </footer>
    </main>
  )
}

export default App
