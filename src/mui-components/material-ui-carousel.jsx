import { useEffect, useMemo, useRef, useState } from 'react'

export function Carousel({
  children,
  autoPlay = false,
  interval = 5000,
  navButtonsAlwaysVisible = false,
  indicators = true,
  className = '',
  swipeThreshold = 40,
}) {
  const slides = useMemo(() => (Array.isArray(children) ? children : [children]).filter(Boolean), [children])
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef(null)

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, interval)

    return () => window.clearInterval(timer)
  }, [autoPlay, interval, slides.length])

  const goPrev = () => setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
  const goNext = () => setActiveIndex((current) => (current + 1) % slides.length)

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const onTouchEnd = (event) => {
    const startX = touchStartX.current
    const endX = event.changedTouches[0]?.clientX

    touchStartX.current = null

    if (startX == null || endX == null) {
      return
    }

    const distance = endX - startX
    if (Math.abs(distance) < swipeThreshold) {
      return
    }

    if (distance > 0) {
      goPrev()
      return
    }

    goNext()
  }

  if (slides.length === 0) {
    return null
  }

  return (
    <div className={`mui-carousel ${className}`.trim()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="mui-carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div
            key={`slide-${index}`}
            className={`mui-carousel-stage ${index === activeIndex ? 'is-active' : ''}`}
            aria-hidden={index !== activeIndex}
          >
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 && navButtonsAlwaysVisible ? (
        <>
          <button type="button" className="mui-carousel-nav mui-carousel-prev" onClick={goPrev} aria-label="Slide anterior">
            ‹
          </button>
          <button type="button" className="mui-carousel-nav mui-carousel-next" onClick={goNext} aria-label="Próximo slide">
            ›
          </button>
        </>
      ) : null}

      {slides.length > 1 && indicators ? (
        <div className="mui-carousel-indicators" aria-label="Indicadores do carrossel">
          {slides.map((_, index) => (
            <button
              key={`indicator-${index}`}
              type="button"
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function CarouselSlide({ children }) {
  return <div className="mui-carousel-slide">{children}</div>
}
