import { Link } from 'react-router-dom'
import '../styles/error404.css'

const candyIcons = ['🍬', '🍭', '🧁', '🍫', '🍩']

export function Error404Page() {
  return (
    <main className="error404-page" role="main">
      <div className="error404-glow error404-glow--top" aria-hidden="true" />
      <div className="error404-glow error404-glow--bottom" aria-hidden="true" />
      <div className="error404-sprinkle error404-sprinkle--one" aria-hidden="true" />
      <div className="error404-sprinkle error404-sprinkle--two" aria-hidden="true" />
      <div className="error404-sprinkle error404-sprinkle--three" aria-hidden="true" />

      <section className="error404-card" aria-labelledby="error404-title">
        <p className="error404-label">Carliz Doces</p>

        <div className="error404-candy-row" aria-hidden="true">
          {candyIcons.map((icon) => (
            <span key={icon}>{icon}</span>
          ))}
        </div>

        <p className="error404-code">404</p>
        <h1 id="error404-title">Oops! Essa página se perdeu entre sabores e guloseimas 🍰</h1>
        <p className="error404-message">
          Tente novamente mais tarde.
          <span> Enquanto isso, escolha uma opção abaixo para continuar navegando com tranquilidade.</span>
        </p>

        <div className="error404-actions">
          <Link className="error404-link error404-link--primary" to="/home">
            Ver vitrine de doces
          </Link>
          <Link className="error404-link error404-link--secondary" to="/">
            Voltar para entrada
          </Link>
        </div>
      </section>
    </main>
  )
}
