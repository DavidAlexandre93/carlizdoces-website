import { useMemo, useRef, useState } from 'react'
import { motion } from 'motion/react'

const AnimatePresence = ({ children }) => children
const MotionDiv = motion.div
const MotionSpan = motion.span

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const pct = (number) => `${Math.round(number)}%`

const randomId = () => Math.random().toString(16).slice(2) + Date.now().toString(16)

const pastel = [
  '#ffb3c7',
  '#ffd6a5',
  '#bde0fe',
  '#caffbf',
  '#f1c0ff',
]

function readableRecipe({ sweet, cocoa, vanilla }) {
  const total = sweet + cocoa + vanilla
  const sweetRatio = sweet / total
  const cocoaRatio = cocoa / total
  const vanillaRatio = vanilla / total

  const vibe = sweet >= 70 ? 'bem docinha' : sweet <= 35 ? 'menos doce' : 'equilibrada'
  const chocolate = cocoa >= 60 ? 'bem chocolatuda' : cocoa <= 30 ? 'suave no cacau' : 'com cacau na medida'
  const aroma = vanilla >= 55 ? 'aromatizada' : vanilla <= 25 ? 'discreta na baunilha' : 'com toque de baunilha'

  return {
    title: `Massa ${vibe}, ${chocolate} e ${aroma}`,
    bullets: [
      `Ajuste base: açúcar ~ ${pct(sweetRatio * 100)} do perfil de sabor`,
      `Cacau: ~ ${pct(cocoaRatio * 100)} (mais escuro = mais intenso)`,
      `Baunilha: ~ ${pct(vanillaRatio * 100)} (perfume e maciez)`,
    ],
  }
}

function SliderRow({ label, value, onChange }) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ color: 'rgba(245,243,255,0.75)', fontSize: 12 }}>{label}</span>
        <span style={{ color: 'rgba(245,243,255,0.95)', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
          {pct(value)}
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            height: 10,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 10,
            width: `${value}%`,
            borderRadius: 999,
            background: 'linear-gradient(90deg, rgba(124,58,237,0.95), rgba(168,85,247,0.95))',
          }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          style={{
            position: 'absolute',
            left: 0,
            top: -6,
            width: '100%',
            height: 22,
            opacity: 0,
            cursor: 'pointer',
          }}
          aria-label={label}
        />
      </div>
    </div>
  )
}

function Pill({ children }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(245,243,255,0.85)',
        fontSize: 12,
      }}
    >
      {children}
    </span>
  )
}

function Button({ variant = 'primary', children, ...props }) {
  const base = {
    borderRadius: 14,
    padding: '12px 16px',
    fontSize: 13,
    border: '1px solid transparent',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.95)',
    transition: 'transform 120ms ease, filter 120ms ease',
  }

  const styles = variant === 'primary'
    ? {
      background: 'linear-gradient(135deg, rgba(124,58,237,0.95), rgba(168,85,247,0.95))',
      boxShadow: '0 10px 30px rgba(124,58,237,0.22)',
    }
    : {
      background: 'rgba(17,17,26,0.9)',
      borderColor: 'rgba(255,255,255,0.10)',
    }

  return (
    <button
      {...props}
      style={{ ...base, ...styles, ...props.style }}
      onMouseDown={(event) => (event.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={(event) => (event.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(event) => (event.currentTarget.style.transform = 'scale(1)')}
    >
      {children}
    </button>
  )
}

function formatAgo(timestamp) {
  const diff = Date.now() - timestamp
  const minutes = Math.max(1, Math.round(diff / 60000))
  if (minutes < 60) return `${minutes} min`
  const hours = Math.round(minutes / 60)
  return `${hours} h`
}

export function ConfeitariaEmAcaoSection() {
  const [sweet, setSweet] = useState(62)
  const [cocoa, setCocoa] = useState(45)
  const [vanilla, setVanilla] = useState(28)
  const [mixing, setMixing] = useState(false)

  const [frosting, setFrosting] = useState(pastel[0])
  const [sprinkles, setSprinkles] = useState(() => Array.from({ length: 18 }).map(() => ({
    id: randomId(),
    x: 50 + (Math.random() * 160 - 80),
    y: Math.random() * 60,
    r: (Math.random() * 160) | 0,
    c: pastel[(Math.random() * pastel.length) | 0],
  })))

  const [feed, setFeed] = useState(() => [
    { id: randomId(), user: '@cliente1', t: Date.now() - 6 * 60000, msg: 'Ficou lindo! 😍', color: pastel[0] },
    { id: randomId(), user: '@cliente2', t: Date.now() - 3 * 60000, msg: 'Quero provar isso agora 😋', color: pastel[1] },
    { id: randomId(), user: '@cliente3', t: Date.now() - 1 * 60000, msg: 'Amei o toque de baunilha ✨', color: pastel[2] },
  ])

  const recipe = useMemo(() => readableRecipe({ sweet, cocoa, vanilla }), [sweet, cocoa, vanilla])
  const bowlRef = useRef(null)

  const addSprinkle = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const localX = event.clientX - rect.left
    const localY = event.clientY - rect.top

    const x = clamp(localX - rect.width / 2, -90, 90)
    const y = clamp(localY - 60, -10, 70)

    setSprinkles((current) => [
      ...current.slice(-60),
      { id: randomId(), x, y, r: (Math.random() * 180) | 0, c: pastel[(Math.random() * pastel.length) | 0] },
    ])
  }

  const removeSprinkle = (id) => setSprinkles((current) => current.filter((item) => item.id !== id))

  const beatBatter = async () => {
    if (mixing) return
    setMixing(true)

    const bump = () => {
      setSweet((value) => clamp(value + (Math.random() * 6 - 3), 0, 100))
      setCocoa((value) => clamp(value + (Math.random() * 6 - 3), 0, 100))
      setVanilla((value) => clamp(value + (Math.random() * 6 - 3), 0, 100))
    }

    for (let step = 0; step < 8; step += 1) {
      bump()
      await new Promise((resolve) => {
        setTimeout(resolve, 120)
      })
    }

    setMixing(false)

    const msgPool = [
      'Massa pronta! 🎂',
      'Textura perfeita ✨',
      'Cheirinho incrível 😍',
      'Agora é decorar! 🍰',
      'Ficou fofinha demais 😋',
    ]

    setFeed((current) => [
      {
        id: randomId(),
        user: '@voce',
        t: Date.now(),
        msg: msgPool[(Math.random() * msgPool.length) | 0],
        color: frosting,
      },
      ...current.slice(0, 6),
    ])
  }

  const generateRecipe = () => {
    const preset = [
      { sweet: 72, cocoa: 28, vanilla: 55, frosting: pastel[4] },
      { sweet: 45, cocoa: 70, vanilla: 18, frosting: pastel[2] },
      { sweet: 60, cocoa: 50, vanilla: 35, frosting: pastel[0] },
      { sweet: 35, cocoa: 55, vanilla: 40, frosting: pastel[3] },
    ][(Math.random() * 4) | 0]

    setSweet(preset.sweet)
    setCocoa(preset.cocoa)
    setVanilla(preset.vanilla)
    setFrosting(preset.frosting)

    setFeed((current) => [
      { id: randomId(), user: '@chefBot', t: Date.now(), msg: 'Sugestão do dia: teste essa combinação! 👩‍🍳', color: preset.frosting },
      ...current.slice(0, 6),
    ])
  }

  const wrapper = {
    width: '100%',
    padding: '64px 16px',
    background: 'radial-gradient(1200px 700px at 25% 20%, rgba(124,58,237,0.18), transparent 60%), #0b0b10',
    borderRadius: 32,
  }

  const container = {
    maxWidth: 1180,
    margin: '0 auto',
    padding: 24,
    borderRadius: 28,
    background: 'rgba(17,17,26,0.88)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
    backdropFilter: 'blur(12px)',
  }

  const grid = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 18,
  }

  const panel = {
    borderRadius: 22,
    background: 'rgba(15,15,23,0.9)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: 20,
  }

  const title = {
    color: 'rgba(245,243,255,0.98)',
    fontSize: 40,
    margin: 0,
    letterSpacing: -0.6,
  }

  const subtitle = {
    color: 'rgba(199,196,214,0.9)',
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.6,
  }

  const smallTitle = {
    color: 'rgba(245,243,255,0.98)',
    fontSize: 16,
    margin: 0,
    marginBottom: 12,
    letterSpacing: -0.2,
  }

  return (
    <section style={wrapper} id="confeitaria-em-acao">
      <div style={container}>
        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 18 }} className="confeitaria-em-acao-grid">
            <div style={panel}>
              <h2 style={title}>Confeitaria em ação</h2>
              <p style={subtitle}>Misture, decore e compartilhe em tempo real. Ajuste os sabores, bata a massa e crie seu cupcake do jeitinho que você gosta.</p>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <Pill>⚡ Interativo</Pill>
                <Pill>🍫 Personalizável</Pill>
                <Pill>🧁 Compartilhável</Pill>
              </div>

              <div style={{ ...grid, marginTop: 18 }}>
                <div
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    padding: 18,
                    borderRadius: 22,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <MotionDiv
                    ref={bowlRef}
                    animate={mixing ? { rotate: [0, -4, 4, -3, 3, 0], scale: [1, 1.02, 1] } : { rotate: 0, scale: 1 }}
                    transition={mixing ? { duration: 0.6, repeat: 2, ease: 'easeInOut' } : { duration: 0.25 }}
                    style={{
                      width: 280,
                      height: 280,
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.10)',
                      background: 'radial-gradient(circle at 30% 25%, rgba(124,58,237,0.18), rgba(15,15,23,0.9) 60%)',
                      boxShadow: 'inset 0 0 0 22px rgba(255,255,255,0.03)',
                      position: 'relative',
                    }}
                    aria-label="Tigela de mistura"
                  >
                    {pastel.map((color, index) => (
                      <MotionDiv
                        key={color}
                        animate={mixing ? { y: [0, -6, 0], x: [0, 4, 0] } : { x: 0, y: 0 }}
                        transition={{ duration: 0.35, repeat: mixing ? Number.POSITIVE_INFINITY : 0, ease: 'easeInOut', delay: index * 0.03 }}
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: color,
                          position: 'absolute',
                          left: 90 + index * 28,
                          top: 120 + (index % 2) * 16,
                          boxShadow: '0 10px 22px rgba(0,0,0,0.35)',
                        }}
                      />
                    ))}
                  </MotionDiv>
                </div>

                <div style={{ display: 'grid', gap: 14 }}>
                  <SliderRow label="Doçura" value={sweet} onChange={setSweet} />
                  <SliderRow label="Cacau" value={cocoa} onChange={setCocoa} />
                  <SliderRow label="Baunilha" value={vanilla} onChange={setVanilla} />
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Button onClick={beatBatter}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <MotionSpan
                        animate={mixing ? { rotate: [0, -10, 10, -8, 8, 0] } : { rotate: 0 }}
                        transition={mixing ? { duration: 0.35, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0.2 }}
                      >
                        🥣
                      </MotionSpan>
                      {mixing ? 'Batendo...' : 'Bater massa'}
                    </span>
                  </Button>
                  <Button variant="secondary" onClick={generateRecipe}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>✨ Gerar receita</span>
                  </Button>
                </div>

                <div
                  style={{
                    borderRadius: 18,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: 16,
                    display: 'grid',
                    gap: 10,
                  }}
                >
                  <div style={{ color: 'rgba(245,243,255,0.95)', fontSize: 14, fontWeight: 600 }}>{recipe.title}</div>
                  <ul style={{ margin: 0, paddingLeft: 18, color: 'rgba(199,196,214,0.92)', fontSize: 13, lineHeight: 1.55 }}>
                    {recipe.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 18 }}>
              <div style={panel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <h3 style={smallTitle}>Decore o cupcake</h3>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {pastel.map((color) => (
                      <button
                        key={color}
                        onClick={() => setFrosting(color)}
                        title="Cor do frosting"
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 999,
                          border: frosting === color ? '2px solid rgba(245,243,255,0.85)' : '1px solid rgba(255,255,255,0.10)',
                          background: color,
                          cursor: 'pointer',
                          boxShadow: frosting === color ? '0 8px 20px rgba(0,0,0,0.35)' : 'none',
                        }}
                        aria-label={`Escolher cor ${color}`}
                      />
                    ))}
                  </div>
                </div>

                <div
                  onClick={addSprinkle}
                  style={{
                    marginTop: 14,
                    borderRadius: 18,
                    padding: 18,
                    background: 'rgba(17,17,26,0.9)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'crosshair',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: 250,
                  }}
                  role="button"
                  aria-label="Área para adicionar sprinkles clicando"
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: 26,
                      transform: 'translateX(-50%)',
                      width: 220,
                      height: 110,
                      borderRadius: 22,
                      background: 'linear-gradient(180deg, rgba(42,42,54,0.95), rgba(25,25,35,0.95))',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: 38,
                      transform: 'translateX(-50%)',
                      width: 190,
                      height: 82,
                      borderRadius: 18,
                      background: 'linear-gradient(180deg, rgba(197,139,90,1), rgba(160,105,62,1))',
                    }}
                  />

                  <MotionDiv
                    animate={mixing ? { y: [0, -2, 0] } : { y: 0 }}
                    transition={mixing ? { duration: 0.35, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' } : { duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: 120,
                      transform: 'translateX(-50%)',
                      width: 220,
                      height: 130,
                      borderRadius: 999,
                      border: '18px solid transparent',
                      borderTop: `18px solid ${frosting}`,
                      filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.35))',
                    }}
                  />

                  <AnimatePresence>
                    {sprinkles.map((sprinkle) => (
                      <MotionDiv
                        key={sprinkle.id}
                        initial={{ opacity: 0, scale: 0.7, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ duration: 0.18 }}
                        onClick={(event) => {
                          event.stopPropagation()
                          removeSprinkle(sprinkle.id)
                        }}
                        title="Clique para remover"
                        style={{
                          position: 'absolute',
                          left: '50%',
                          bottom: 155,
                          transform: `translateX(calc(-50% + ${sprinkle.x}px)) translateY(${sprinkle.y}px) rotate(${sprinkle.r}deg)`,
                          width: 12,
                          height: 4,
                          borderRadius: 3,
                          background: sprinkle.c,
                          boxShadow: '0 10px 16px rgba(0,0,0,0.25)',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </AnimatePresence>

                  <div style={{ position: 'absolute', left: 18, top: 14, color: 'rgba(199,196,214,0.9)', fontSize: 12 }}>
                    Clique para adicionar sprinkles • clique em um sprinkle para remover
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, gap: 12, flexWrap: 'wrap' }}>
                  <Pill>
                    🎨 Frosting:
                    <span style={{ fontWeight: 600 }}>{frosting}</span>
                  </Pill>
                  <Pill>
                    🍬 Sprinkles:
                    <span style={{ fontWeight: 600 }}>{sprinkles.length}</span>
                  </Pill>
                </div>
              </div>

              <div style={panel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <h3 style={smallTitle}>Mural ao vivo</h3>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setFeed((current) => [
                        {
                          id: randomId(),
                          user: '@voce',
                          t: Date.now(),
                          msg: 'Acabei de decorar! 🧁✨',
                          color: frosting,
                        },
                        ...current.slice(0, 6),
                      ])
                    }}
                    style={{ padding: '10px 12px', borderRadius: 12 }}
                  >
                    📣 Postar
                  </Button>
                </div>

                <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                  <AnimatePresence initial={false}>
                    {feed.map((item) => (
                      <MotionDiv
                        key={item.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '44px 1fr',
                          gap: 12,
                          alignItems: 'center',
                          padding: 14,
                          borderRadius: 16,
                          background: 'rgba(15,15,23,0.9)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 999,
                            background: item.color,
                            boxShadow: '0 12px 26px rgba(0,0,0,0.35)',
                          }}
                          aria-hidden
                        />
                        <div style={{ display: 'grid', gap: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <div style={{ color: 'rgba(199,196,214,0.95)', fontSize: 12 }}>
                              <span style={{ color: 'rgba(245,243,255,0.95)', fontWeight: 600 }}>{item.user}</span>
                              <span style={{ opacity: 0.9 }}> • {formatAgo(item.t)}</span>
                            </div>
                          </div>
                          <div style={{ color: 'rgba(245,243,255,0.95)', fontSize: 13 }}>“{item.msg}”</div>
                        </div>
                      </MotionDiv>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 980px){
              .confeitaria-em-acao-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  )
}
