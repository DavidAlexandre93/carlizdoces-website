import './App.css'

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

function App() {
  return (
    <main className="page">
      <header className="hero">
        <img
          className="hero__banner"
          src="/images/banner-carliz.svg"
          alt="Banner da Carliz Doces"
        />
        <h1>Pedidos de Páscoa 2026</h1>
        <p>Cardápio digital com imagens de exemplo para facilitar a escolha.</p>
      </header>

      <section className="card">
        <h2>Informações importantes</h2>
        <ul>
          {orderHighlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Sabores disponíveis</h2>
        <p className="replace-tip">
          Dica: para trocar as imagens, substitua os arquivos na pasta <code>public/images</code> mantendo os mesmos nomes.
        </p>
        <div className="products-grid">
          {eggFlavors.map((item) => (
            <article className="product" key={item.name}>
              <img src={item.image} alt={`Ovo de páscoa sabor ${item.name}`} loading="lazy" />
              <div>
                <h3>{item.name}</h3>
                <p>{item.weight}</p>
                <strong>{item.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card choices">
        <h2>Opções do pedido</h2>
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
    </main>
  )
}

export default App
