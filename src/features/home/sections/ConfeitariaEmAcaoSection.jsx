import { useMemo, useState } from 'react'
import CakePreview3D from '../../../components/CakePreview3D'

const massas = [
  { id: 'massa_baunilha', label: 'Baunilha', icon: '🍰' },
  { id: 'massa_chocolate', label: 'Chocolate', icon: '🍫' },
]

const recheios = [
  { id: 'recheio_brigadeiro', label: 'Brigadeiro', icon: '🍮' },
  { id: 'recheio_ninho', label: 'Ninho', icon: '🥛' },
]

const coberturas = [
  { id: 'cob_buttercream', label: 'Buttercream', icon: '🧁' },
  { id: 'cob_ganache', label: 'Ganache', icon: '🍫' },
]

const decoracoes = [
  { id: 'deco_flores', label: 'Flores', icon: '🌸' },
  { id: 'deco_topper', label: 'Topper', icon: '🎉' },
  { id: 'deco_escrita', label: 'Escrita', icon: '✍️' },
]

function findById(list, id) {
  return list.find((item) => item.id === id)
}

export function ConfeitariaEmAcaoSection() {
  const [structure, setStructure] = useState('redondo')
  const [mainHex, setMainHex] = useState('#f7d1dc')
  const [accentHex, setAccentHex] = useState('#ea9eb0')
  const [massaId, setMassaId] = useState('massa_baunilha')
  const [recheioId, setRecheioId] = useState('recheio_brigadeiro')
  const [coberturaId, setCoberturaId] = useState('cob_ganache')
  const [selectedDecos, setSelectedDecos] = useState(['deco_flores', 'deco_topper'])
  const [birthdayName, setBirthdayName] = useState('Parabéns!')
  const [pulseKey, setPulseKey] = useState(0)

  const ingredientes = useMemo(() => ({
    massa: findById(massas, massaId),
    recheio: findById(recheios, recheioId),
    cobertura: findById(coberturas, coberturaId),
    decoracao: selectedDecos.map((id) => findById(decoracoes, id)).filter(Boolean),
  }), [massaId, recheioId, coberturaId, selectedDecos])

  const restrictionOk = Boolean(ingredientes.massa && ingredientes.recheio && ingredientes.cobertura)

  const toggleDeco = (id) => {
    setSelectedDecos((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      return [...current, id]
    })
    setPulseKey((current) => current + 1)
  }

  return (
    <section id="confeitaria-em-acao" style={{ marginTop: 24 }}>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr', background: '#fff', borderRadius: 20, border: '1px solid rgba(0,0,0,0.08)', padding: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 32 }}>Confeitaria em ação</h2>
          <p style={{ margin: '8px 0 0', opacity: 0.75 }}>
            Monte o bolo em tempo real, personalize decoração e veja o resultado no preview 3D.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="acao-grid">
          <div style={{ display: 'grid', gap: 12 }}>
            <label>
              Nome do aniversariante
              <input value={birthdayName} onChange={(event) => setBirthdayName(event.target.value)} style={{ width: '100%', marginTop: 6 }} />
            </label>

            <label>
              Estrutura
              <select value={structure} onChange={(event) => { setStructure(event.target.value); setPulseKey((current) => current + 1) }} style={{ width: '100%', marginTop: 6 }}>
                <option value="redondo">Redondo</option>
                <option value="quadrado">Quadrado</option>
                <option value="2andares">2 andares</option>
              </select>
            </label>

            <label>
              Massa
              <select value={massaId} onChange={(event) => setMassaId(event.target.value)} style={{ width: '100%', marginTop: 6 }}>
                {massas.map((item) => <option key={item.id} value={item.id}>{item.icon} {item.label}</option>)}
              </select>
            </label>

            <label>
              Recheio
              <select value={recheioId} onChange={(event) => setRecheioId(event.target.value)} style={{ width: '100%', marginTop: 6 }}>
                {recheios.map((item) => <option key={item.id} value={item.id}>{item.icon} {item.label}</option>)}
              </select>
            </label>

            <label>
              Cobertura
              <select value={coberturaId} onChange={(event) => { setCoberturaId(event.target.value); setPulseKey((current) => current + 1) }} style={{ width: '100%', marginTop: 6 }}>
                {coberturas.map((item) => <option key={item.id} value={item.id}>{item.icon} {item.label}</option>)}
              </select>
            </label>

            <div>
              <div>Decorações</div>
              <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                {decoracoes.map((item) => (
                  <label key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="checkbox" checked={selectedDecos.includes(item.id)} onChange={() => toggleDeco(item.id)} />
                    {item.icon} {item.label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <label style={{ display: 'grid' }}>
                Cor principal
                <input type="color" value={mainHex} onChange={(event) => setMainHex(event.target.value)} />
              </label>
              <label style={{ display: 'grid' }}>
                Cor destaque
                <input type="color" value={accentHex} onChange={(event) => setAccentHex(event.target.value)} />
              </label>
            </div>
          </div>

          <CakePreview3D
            structure={structure}
            mainHex={mainHex}
            accentHex={accentHex}
            ingredientes={ingredientes}
            restrictionOk={restrictionOk}
            pulseKey={pulseKey}
            birthdayName={birthdayName}
          />
        </div>

        <style>{`
          .acao-grid { grid-template-columns: 1fr 1.2fr; }
          @media (max-width: 980px) {
            .acao-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </div>
    </section>
  )
}
