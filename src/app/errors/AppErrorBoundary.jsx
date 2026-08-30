import { Component } from 'react'

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, referenceId: '' }
  }

  static getDerivedStateFromError() {
    const referenceId = globalThis.crypto?.randomUUID?.() || `web-${Date.now()}`
    return { hasError: true, referenceId }
  }

  componentDidCatch(error) {
    console.error(
      JSON.stringify({
        level: 'error',
        event: 'frontend.render_failed',
        referenceId: this.state.referenceId,
        errorClass: error?.name || 'Error',
      }),
    )
  }

  handleRetry = () => {
    this.setState({ hasError: false, referenceId: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="service-error-page">
          <section className="service-error-card" aria-labelledby="service-error-title">
            <div className="service-error-mark" aria-hidden="true">🍰</div>
            <p className="service-error-kicker">Pausa para um ajuste na cozinha</p>
            <h1 id="service-error-title">Algo não saiu como esperado.</h1>
            <p>
              Nossa equipe técnica já tem uma referência do ocorrido. Tente novamente em instantes — seus dados sensíveis não aparecem nesta tela.
            </p>
            <div className="service-error-actions">
              <button type="button" onClick={this.handleRetry}>Tentar novamente</button>
              <a href="/home">Voltar para o início</a>
            </div>
            <small>Referência: {this.state.referenceId}</small>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
