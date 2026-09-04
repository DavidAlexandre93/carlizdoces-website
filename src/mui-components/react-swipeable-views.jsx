import { useMemo, useRef } from 'react';

export default function SwipeableViews({
  axis = 'x',
  children,
  index = 0,
  onChangeIndex,
  enableMouseEvents = false,
}) {
  const slides = useMemo(
    () => (Array.isArray(children) ? children : [children]).filter(Boolean),
    [children]
  );
  const startPosition = useRef(null);
  const swipeThreshold = 48;

  const getClientX = (event) => {
    if ('touches' in event) {
      return event.touches[0]?.clientX ?? null;
    }

    return event.clientX ?? null;
  };

  const getChangedClientX = (event) => {
    if ('changedTouches' in event) {
      return event.changedTouches[0]?.clientX ?? null;
    }

    return event.clientX ?? null;
  };

  const handleStart = (event) => {
    startPosition.current = getClientX(event);
  };

  const handleEnd = (event) => {
    const startX = startPosition.current;
    const endX = getChangedClientX(event);
    startPosition.current = null;

    if (startX == null || endX == null) {
      return;
    }

    const distance = endX - startX;
    if (Math.abs(distance) < swipeThreshold) {
      return;
    }

    const isReverseAxis = axis === 'x-reverse';
    const isSwipeToRight = distance > 0;
    const nextIndex = isReverseAxis
      ? isSwipeToRight
        ? index + 1
        : index - 1
      : isSwipeToRight
        ? index - 1
        : index + 1;

    const clampedIndex = Math.max(0, Math.min(nextIndex, slides.length - 1));

    if (clampedIndex !== index && onChangeIndex) {
      onChangeIndex(clampedIndex);
    }
  };

  const handleKeyDown = (event) => {
    if (!onChangeIndex || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) {
      return;
    }

    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = axis === 'x-reverse' ? index - direction : index + direction;
    onChangeIndex(Math.max(0, Math.min(nextIndex, slides.length - 1)));
  };

  /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
  return (
    // The gesture viewport is a focusable region with equivalent keyboard controls.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="swipeable-views-root"
      role="region"
      aria-label="Conteúdo deslizável"
      tabIndex={0}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onMouseDown={enableMouseEvents ? handleStart : undefined}
      onMouseUp={enableMouseEvents ? handleEnd : undefined}
      onKeyDown={handleKeyDown}
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
  );
  /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
}
