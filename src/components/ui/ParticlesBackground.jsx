import { useEffect, useRef } from 'react'

const MOBILE_BREAKPOINT = 768

function createParticle(width, height) {
  const speed = 0.18 + Math.random() * 0.4
  const direction = Math.random() * Math.PI * 2

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(direction) * speed,
    vy: Math.sin(direction) * speed,
    radius: 0.6 + Math.random() * 1.7,
  }
}

export function ParticlesBackground({ darkMode = false }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const mediaReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mediaMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)

    let animationFrame
    let particles = []
    let context = canvas.getContext('2d')

    if (!context) return undefined

    const setupCanvas = () => {
      if (mediaReducedMotion.matches || mediaMobile.matches) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        return false
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 1.8)
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context = canvas.getContext('2d')

      if (!context) return false

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const total = Math.min(Math.floor((width * height) / 22000), 54)
      particles = Array.from({ length: total }, () => createParticle(width, height))

      return true
    }

    const draw = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      context.clearRect(0, 0, width, height)

      const strokeColor = darkMode ? '255, 203, 229' : '173, 20, 87'
      const fillColor = darkMode ? '255, 226, 241' : '181, 66, 117'

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i]
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x <= 0 || particle.x >= width) particle.vx *= -1
        if (particle.y <= 0 || particle.y >= height) particle.vy *= -1

        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${fillColor}, 0.38)`
        context.fill()

        for (let j = i + 1; j < particles.length; j += 1) {
          const neighbor = particles[j]
          const dx = particle.x - neighbor.x
          const dy = particle.y - neighbor.y
          const distance = Math.hypot(dx, dy)

          if (distance < 122) {
            const alpha = 1 - distance / 122
            context.beginPath()
            context.moveTo(particle.x, particle.y)
            context.lineTo(neighbor.x, neighbor.y)
            context.strokeStyle = `rgba(${strokeColor}, ${alpha * 0.16})`
            context.lineWidth = 0.7
            context.stroke()
          }
        }
      }

      animationFrame = window.requestAnimationFrame(draw)
    }

    const update = () => {
      window.cancelAnimationFrame(animationFrame)
      if (setupCanvas()) {
        draw()
      }
    }

    update()
    window.addEventListener('resize', update)
    mediaReducedMotion.addEventListener('change', update)
    mediaMobile.addEventListener('change', update)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', update)
      mediaReducedMotion.removeEventListener('change', update)
      mediaMobile.removeEventListener('change', update)
    }
  }, [darkMode])

  return <canvas ref={canvasRef} className="site-particles-background" aria-hidden="true" />
}
