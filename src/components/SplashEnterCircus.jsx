import React, { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SeoHead } from './seo/SeoHead';
import { DEFAULT_OG_IMAGE, absoluteUrl } from '../lib/seo';

export default function SplashEnterCircus() {
  const prefersReducedMotion = useReducedMotion();
  const [entering, setEntering] = useState(false);
  const navigate = useNavigate();

  const doorHotspot = useMemo(() => ({ x: 50, y: 72 }), []);
  const portalSize = useMemo(
    () => ({
      idleWidth: 'clamp(160px, 34vw, 220px)',
      idleHeight: 'clamp(200px, 42vh, 280px)',
      enterWidth: prefersReducedMotion ? 'clamp(280px, 72vw, 420px)' : 'clamp(420px, 140vw, 980px)',
      enterHeight: prefersReducedMotion
        ? 'clamp(360px, 85vh, 520px)'
        : 'clamp(560px, 175vh, 1300px)',
    }),
    [prefersReducedMotion]
  );

  const handleEnter = () => {
    if (entering) return;
    setEntering(true);
  };

  useEffect(() => {
    if (!entering) return undefined;

    const fallbackMs = prefersReducedMotion ? 380 : 1450;
    const timer = window.setTimeout(() => {
      navigate('/home');
    }, fallbackMs);

    return () => window.clearTimeout(timer);
  }, [entering, navigate, prefersReducedMotion]);

  return (
    <>
      <SeoHead
        title="Entrada | Carliz Doces"
        description="Entre na experiência da Carliz Doces e descubra nosso catálogo artesanal."
        canonical={absoluteUrl('/entrada')}
        image={DEFAULT_OG_IMAGE}
      />
      <div className="sceneRoot">
        <img
          src="/images/circus-outside.png"
          alt="Circo"
          className="splashImg"
          width="1920"
          height="1080"
          loading="eager"
          fetchPriority="high"
          style={{
            transformOrigin: `${doorHotspot.x}% ${doorHotspot.y}%`,
            transform: entering
              ? `translate3d(0, ${prefersReducedMotion ? -8 : -20}px, 0) scale(${prefersReducedMotion ? 1.6 : 2.4})`
              : 'translate3d(0, 0, 0) scale(1)',
            filter: entering
              ? prefersReducedMotion
                ? 'brightness(0.95)'
                : 'brightness(0.9) blur(1.2px)'
              : 'brightness(0.98)',
            transition: `transform ${prefersReducedMotion ? 0.35 : 1.35}s cubic-bezier(0.2, 0.8, 0.2, 1), filter ${prefersReducedMotion ? 0.35 : 1.35}s cubic-bezier(0.2, 0.8, 0.2, 1)`,
          }}
        />

        <div
          className="vignette"
          style={{
            opacity: entering ? 0.75 : 0.35,
            transition: `opacity ${prefersReducedMotion ? 0.2 : 0.55}s ease`,
          }}
        />

        <div
          className="doorPortal"
          style={{
            left: `${doorHotspot.x}%`,
            top: `${doorHotspot.y}%`,
            width: entering ? portalSize.enterWidth : portalSize.idleWidth,
            height: entering ? portalSize.enterHeight : portalSize.idleHeight,
            opacity: entering ? 1 : 0,
            borderRadius: entering ? (prefersReducedMotion ? 22 : 0) : 26,
            transition: `width ${prefersReducedMotion ? 0.35 : 1.1}s cubic-bezier(0.2, 0.8, 0.2, 1), height ${prefersReducedMotion ? 0.35 : 1.1}s cubic-bezier(0.2, 0.8, 0.2, 1), opacity ${prefersReducedMotion ? 0.35 : 1.1}s cubic-bezier(0.2, 0.8, 0.2, 1), border-radius ${prefersReducedMotion ? 0.35 : 1.1}s cubic-bezier(0.2, 0.8, 0.2, 1)`,
          }}
        />

        <div className="splashContent">
          <button className="enterBtn" onClick={handleEnter} disabled={entering}>
            {entering ? 'Entrando...' : 'Entrar no circo'}
          </button>
        </div>

        <div
          className="fadeCurtain"
          style={{
            opacity: entering ? 1 : 0,
            transition: `opacity ${prefersReducedMotion ? 0.25 : 0.45}s ease ${prefersReducedMotion ? 0 : 0.95}s`,
          }}
          onTransitionEnd={() => {
            if (entering) navigate('/home');
          }}
        />
      </div>
    </>
  );
}
