import React from 'react'
import LikeButton from './components/LikeButton'
import StarRating from './components/StarRating'
import { deviceId } from './supabaseClient'

export default function App() {
  // Exemplo: você pode trocar dinamicamente conforme a página/produto
  const itemId = 'ferrero-crocante'

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginTop: 0 }}>CarliZDoces</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <LikeButton itemId={itemId} />
      </div>

      <div style={{ marginTop: 20 }}>
        <StarRating itemId={itemId} label="Avalie este sabor" />
      </div>

      <hr style={{ margin: '22px 0' }} />

      <div style={{ fontSize: 12, color: '#666' }}>
        device_id deste navegador: <code>{deviceId}</code>
      </div>
    </div>
  )
}
