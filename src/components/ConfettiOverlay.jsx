import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default function ConfettiOverlay({ active }) {
  const init = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0">
      <Particles
        init={init}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 0 },
            color: { value: ['#ea9eb0', '#ffffff', '#2b2b2b', '#f2c1cd'] },
            shape: { type: ['square', 'circle'] },
            opacity: { value: 0.9 },
            size: { value: { min: 4, max: 8 } },
            move: {
              enable: true,
              gravity: { enable: true, acceleration: 9.8 },
              speed: { min: 10, max: 22 },
              decay: 0.05,
              direction: 'none',
              outModes: { default: 'destroy' },
            },
          },
          emitters: {
            position: { x: 50, y: 0 },
            rate: { delay: 0.01, quantity: 18 },
            life: { duration: 0.6, count: 1 },
            size: { width: 100, height: 0 },
          },
        }}
      />
    </div>
  );
}
