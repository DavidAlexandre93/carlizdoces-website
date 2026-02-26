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
            <label className="acao-field">
              Nome do aniversariante
              <input className="acao-input" value={birthdayName} onChange={(event) => setBirthdayName(event.target.value)} />
            </label>

            <label className="acao-field">
              Estrutura
              <select className="acao-select" value={structure} onChange={(event) => { setStructure(event.target.value); setPulseKey((current) => current + 1) }}>
                <option value="redondo">Redondo</option>
                <option value="quadrado">Quadrado</option>
                <option value="2andares">2 andares</option>
              </select>
            </label>

            <label className="acao-field">
              Massa
              <select className="acao-select" value={massaId} onChange={(event) => setMassaId(event.target.value)}>
                {massas.map((item) => <option key={item.id} value={item.id}>{item.icon} {item.label}</option>)}
              </select>
            </label>

            <label className="acao-field">
              Recheio
              <select className="acao-select" value={recheioId} onChange={(event) => setRecheioId(event.target.value)}>
                {recheios.map((item) => <option key={item.id} value={item.id}>{item.icon} {item.label}</option>)}
              </select>
            </label>

            <label className="acao-field">
              Cobertura
              <select className="acao-select" value={coberturaId} onChange={(event) => { setCoberturaId(event.target.value); setPulseKey((current) => current + 1) }}>
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
          .acao-field {
            display: grid;
            gap: 6px;
            font-weight: 600;
            color: #5f2345;
          }
          .acao-input,
          .acao-select {
            width: 100%;
            min-height: 44px;
            border-radius: 12px;
            border: 1px solid rgba(95, 35, 69, 0.2);
            background: linear-gradient(180deg, #fff 0%, #fff8fb 100%);
            color: #2f1022;
            box-shadow: 0 6px 18px rgba(95, 35, 69, 0.08);
            transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
            outline: none;
          }
          .acao-input {
            padding: 0 12px;
            font-size: 0.95rem;
            font-weight: 500;
          }
          .acao-select {
            appearance: none;
            -webkit-appearance: none;
            padding: 0 38px 0 12px;
            font-size: 0.95rem;
            font-weight: 500;
            cursor: pointer;
            background-image: linear-gradient(180deg, #fff 0%, #fff8fb 100%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6.5L8 10.5L12 6.5' stroke='%23a34d7f' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat, no-repeat;
            background-position: 0 0, calc(100% - 12px) 50%;
          }
          .acao-input:hover,
          .acao-select:hover {
            border-color: rgba(163, 77, 127, 0.45);
          }
          .acao-input:focus,
          .acao-select:focus {
            border-color: rgba(163, 77, 127, 0.75);
            box-shadow: 0 0 0 4px rgba(227, 158, 189, 0.22), 0 10px 20px rgba(95, 35, 69, 0.1);
            transform: translateY(-1px);
          }
          @media (max-width: 980px) {
            .acao-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </div>
    </section>
  )
}
