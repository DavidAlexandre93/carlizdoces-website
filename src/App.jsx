import { useState } from 'react'

const navItems = ['Quem somos', 'Onde estamos', 'Realizar Pedido', 'Ovos de páscoa', 'contato']

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#fff8fb', color: '#3a2030' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid #f1d8e1',
          position: 'sticky',
          top: 0,
          background: '#fff8fb',
          zIndex: 20,
        }}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          style={{ border: '1px solid #d4a8bc', background: '#fff', borderRadius: 8, padding: '6px 10px' }}
        >
          ☰
        </button>
        <h1 style={{ margin: 0, fontSize: 22 }}>Carliz Doces</h1>
      </header>

      {menuOpen && (
        <nav
          style={{
            maxWidth: 360,
            margin: '16px 20px',
            background: '#fff',
            border: '1px solid #f2d5df',
            borderRadius: 12,
            padding: 12,
          }}
        >
          <strong style={{ display: 'block', marginBottom: 8 }}>Navegação</strong>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {navItems.map((item) => (
              <li key={item} style={{ padding: '10px 8px', borderRadius: 8 }}>
                {item}
              </li>
            ))}
          </ul>
        </nav>
      )}

      <main style={{ padding: '20px' }}>
        <section
          style={{
            maxWidth: 800,
            borderRadius: 18,
            padding: 24,
            background: 'linear-gradient(135deg, #ffe4ec 0%, #f7c7d9 100%)',
            border: '1px solid #f1d8e1',
          }}
        >
          <h2 style={{ marginTop: 0 }}>Doces artesanais para todas as ocasiões</h2>
          <p style={{ marginBottom: 0 }}>
            O menu lateral já está atualizado com as opções solicitadas e sem dependência de bibliotecas externas.
          </p>
        </section>
      </main>
    </div>
  )
}
