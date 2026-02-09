import { useMemo, useRef } from 'react'

export default function SwipeableViews({ axis = 'x', children, index = 0, onChangeIndex, enableMouseEvents = false }) {
  const slides = useMemo(() => (Array.isArray(children) ? children : [children]).filter(Boolean), [children])
  const startPosition = useRef(null)
  const swipeThreshold = 48

  const getClientX = (event) => {
    if ('touches' in event) {
      return event.touches[0]?.clientX ?? null
    }

    return event.clientX ?? null
  }

  const getChangedClientX = (event) => {
    if ('changedTouches' in event) {
      return event.changedTouches[0]?.clientX ?? null
    }

    return event.clientX ?? null
  }

  const handleStart = (event) => {
    startPosition.current = getClientX(event)
  }

  const handleEnd = (event) => {
    const startX = startPosition.current
    const endX = getChangedClientX(event)
    startPosition.current = null

    if (startX == null || endX == null) {
      return
    }

    const distance = endX - startX
    if (Math.abs(distance) < swipeThreshold) {
      return
    }

    const isReverseAxis = axis === 'x-reverse'
    const isSwipeToRight = distance > 0
    const nextIndex = isReverseAxis
      ? (isSwipeToRight ? index + 1 : index - 1)
      : (isSwipeToRight ? index - 1 : index + 1)

    const clampedIndex = Math.max(0, Math.min(nextIndex, slides.length - 1))

    if (clampedIndex !== index && onChangeIndex) {
      onChangeIndex(clampedIndex)
    }
  }

  return (
    <div
      className="swipeable-views-root"
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={enableMouseEvents ? handleStart : undefined}
      onMouseUp={enableMouseEvents ? handleEnd : undefined}
    >
      <div
        className="swipeable-views-track"
        style={{ transform: `translateX(-${Math.max(index, 0) * 100}%)` }}
      >
        {slides.map((slide, slideIndex) => (
          <div key={`swipeable-slide-${slideIndex}`} className="swipeable-views-slide">
            {slide}
          </div>
        ))}
      </div>
    </div>
  )
}
