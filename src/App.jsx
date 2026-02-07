import './App.css'

const ENABLE_EASTER_2026 = true

const orderHighlights = [
  'Faça seu pedido até 25/03/2026 e concorra ao sorteio de um delicioso ovo de colher! 😍',
  '🎥 Sorteio ao vivo no Instagram: 03/04/2026',
  '🍀 Boa sorte!',
  '🚚 Entrega (com taxa) ou retirada no ponto de referência mais próximo.',
  '❄️ Conservar na geladeira. Retire alguns minutinhos antes de consumir para aproveitar toda a cremosidade!',
  '🥄 Ovos de colher: 250g podendo chegar a 400g',
  '🍬 Ovos trufados: 150g — embalados nas cores verde ou rosa, com laço feito à mão 💝',
  '🧁 Produção artesanal, sem conservantes.',
  '⏳ Validade: consumir em até 5 dias, mantendo refrigerado.',
  '📸 Marque a gente: @carlizdoces',
  'Queremos ver sua experiência! Deus abençoe! 🙌',
]

const eggFlavors = [
  { name: 'Ninho com uva', weight: '250g', price: 'R$ 75,00', image: '/images/ninho-uva.svg' },
  { name: 'Ninho com Nutella', weight: '250g', price: 'R$ 89,00', image: '/images/ninho-nutella.svg' },
  { name: 'Ninho', weight: '250g', price: 'R$ 69,00', image: '/images/ninho.svg' },
  { name: 'Brigadeiro', weight: '250g', price: 'R$ 69,00', image: '/images/brigadeiro.svg' },
  { name: 'Ferrero Rocher', weight: '250g', price: 'R$ 95,00', image: '/images/ferrero.svg' },
  { name: 'Prestígio', weight: '250g', price: 'R$ 69,00', image: '/images/prestigio.svg' },
  { name: 'Matilda', weight: '250g', price: 'R$ 67,00', image: '/images/matilda.svg' },
  { name: 'M&Ms', weight: '250g', price: 'R$ 69,00', image: '/images/mms.svg' },
  { name: 'Guloseimas', weight: '250g', price: 'R$ 79,00', image: '/images/guloseimas.svg' },
  { name: 'Trufado ninho com Nutella', weight: '150g', price: 'R$ 37,00', image: '/images/trufado-nutella.svg' },
  { name: 'Trufado brigadeiro', weight: '150g', price: 'R$ 34,00', image: '/images/trufado-brigadeiro.svg' },
  { name: 'Trufado mousse de maracujá', weight: '150g', price: 'R$ 30,00', image: '/images/trufado-maracuja.svg' },
  { name: 'Petisqueira 4 sabores (limitado)', weight: 'especial', price: 'R$ 39,99', image: '/images/petisqueira.svg' },
]

const shellOptions = ['Chocolate meio amargo', 'Chocolate ao leite', 'Chocolate blend']
const choiceOptions = ['Colher 250g', 'Trufado 150g embrulhado']
const packageOptions = ['Embalagem ROSA', 'Embalagem VERDE']
const paymentOptions = ['Débito', 'Crédito', 'PIX']

const menuItems = [
  { id: 'quem-somos', label: 'Quem Somos' },
  { id: 'onde-estamos', label: 'Onde estamos' },
  { id: 'contato', label: 'Contato' },
  { id: 'pedidos', label: 'Pedidos' },
  ...(ENABLE_EASTER_2026 ? [{ id: 'ovos-2026', label: 'Ovos de Páscoa 2026' }] : []),
]

function App() {
  return (
    <main className="page">
      <header className="hero">
        <img
          className="hero__banner"
          src="/images/banner-carliz.svg"
          alt="Banner da Carliz Doces"
        />
        <h1>Carliz Doces</h1>
        <p>Doces artesanais feitos com carinho para deixar seus momentos ainda mais especiais.</p>
      </header>

      <nav className="top-menu" aria-label="Menu principal">
        {menuItems.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.label}
          </a>
        ))}
      </nav>

      <section className="card" id="quem-somos">
        <h2>Quem Somos</h2>
        <p>
          A Carliz Doces trabalha com produção artesanal, sem conservantes, priorizando sabor,
          frescor e apresentação em cada detalhe.
        </p>
        <p>
          Nosso objetivo é transformar cada pedido em uma experiência especial, seja para presentear,
          celebrar ou simplesmente adoçar o dia.
        </p>
      </section>

      <section className="card" id="onde-estamos">
        <h2>Onde estamos</h2>
        <p>
          Atendemos por encomenda com retirada em ponto de referência e também com entrega (mediante
          taxa) para facilitar seu pedido.
        </p>
        <p>
          Entre em contato para confirmar a região atendida e combinar o melhor formato de entrega.
        </p>
      </section>

      <section className="card" id="contato">
        <h2>Contato</h2>
        <ul>
          <li>Instagram: @carlizdoces</li>
          <li>Pedidos e informações por mensagem direta.</li>
          <li>Marque a gente nas fotos para compartilharmos sua experiência! 📸</li>
        </ul>
      </section>

      <section className="card choices" id="pedidos">
        <h2>Pedidos</h2>
        <div>
          <h3>Casca de preferência</h3>
          <ul>{shellOptions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Sua escolha é de</h3>
          <ul>{choiceOptions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Para ovo embrulhado 150g</h3>
          <ul>{packageOptions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Forma de pagamento</h3>
          <ul>{paymentOptions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>

      {ENABLE_EASTER_2026 && (
        <section className="card" id="ovos-2026">
          <h2>Ovos de Páscoa 2026</h2>
          <p className="replace-tip">
            Dica: para desabilitar este bloco fora de época, altere a constante{' '}
            <code>ENABLE_EASTER_2026</code> para <code>false</code> no arquivo <code>src/App.jsx</code>.
          </p>

          <h3>Informações importantes</h3>
          <ul>
            {orderHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Sabores disponíveis</h3>
          <div className="products-grid">
            {eggFlavors.map((item) => (
              <article className="product" key={item.name}>
                <img src={item.image} alt={`Ovo de páscoa sabor ${item.name}`} loading="lazy" />
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.weight}</p>
                  <strong>{item.price}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default App
