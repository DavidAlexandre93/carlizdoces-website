import React from 'react';
import { motion } from 'motion/react';

const MotionDiv = motion.div;

export default function HomeInsideCircus() {
  return (
    <div className="insideRoot">
      <div className="insideBackdrop" />

      <div className="stringLights">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="bulb" />
        ))}
      </div>

      <MotionDiv
        className="stage"
        initial={{ y: 18, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="stageHeader">
          <div>
            <div className="homeTitle">Carliz Doces</div>
            <div className="homeSub">Doces com alegria, brilho e travessura ✨</div>
          </div>

          <div className="topActions">
            <button className="chip">Cardápio</button>
            <button className="chip">Encomendas</button>
            <button className="chip">Contato</button>
          </div>
        </div>

        <div className="homeGrid">
          <MotionDiv
            className="heroCard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="heroKicker">🎪 Destaque</div>
            <div className="heroHeadline">Bem-vindo ao nosso show de sabores!</div>
            <div className="heroText">
              Escolha seus doces favoritos e receba a magia do circo na sua festa. Brigadeiros,
              cupcakes, bolos e kits temáticos.
            </div>
            <div className="heroButtons">
              <button className="primary">Ver cardápio</button>
              <button className="secondary">Fazer encomenda</button>
            </div>
          </MotionDiv>

          <div className="cardsCol">
            {[
              { title: 'Bolos Temáticos', desc: 'Personalize com o tema do seu evento.' },
              {
                title: 'Docinhos Premium',
                desc: 'Clássicos e especiais com acabamento perfeito.',
              },
              { title: 'Kits Festa', desc: 'Combo pronto pra celebrar sem preocupação.' },
            ].map((c, idx) => (
              <MotionDiv
                key={c.title}
                className="miniCard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + idx * 0.08, duration: 0.45 }}
              >
                <div className="miniTitle">{c.title}</div>
                <div className="miniDesc">{c.desc}</div>
                <button className="linkBtn">Saiba mais →</button>
              </MotionDiv>
            ))}
          </div>
        </div>

        <div className="footerBar">
          <span>📍 Entregas • 🎂 Encomendas • 💬 WhatsApp</span>
          <span className="muted">© {new Date().getFullYear()} CarliZ Doces</span>
        </div>
      </MotionDiv>

      <div className="floor" />
    </div>
  );
}
