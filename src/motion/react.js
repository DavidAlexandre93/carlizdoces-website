import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'

function toCssValue(value) {
  return typeof value === 'number' ? `${value}px` : value
}

function buildStyleFromState(baseStyle = {}, animationState = {}) {
  if (!animationState || typeof animationState !== 'object') {
    return { ...baseStyle }
  }

  const nextStyle = { ...baseStyle }

  if (animationState.opacity !== undefined) {
    nextStyle.opacity = animationState.opacity
  }

  if (animationState.filter !== undefined) {
    nextStyle.filter = animationState.filter
  }

  if (animationState.width !== undefined) {
    nextStyle.width = toCssValue(animationState.width)
  }

  if (animationState.height !== undefined) {
    nextStyle.height = toCssValue(animationState.height)
  }

  if (animationState.borderRadius !== undefined) {
    nextStyle.borderRadius = toCssValue(animationState.borderRadius)
  }

  const transforms = []

  if (animationState.x !== undefined || animationState.y !== undefined) {
    transforms.push(`translate3d(${toCssValue(animationState.x ?? 0)}, ${toCssValue(animationState.y ?? 0)}, 0)`)
  }

  if (animationState.scale !== undefined) {
    transforms.push(`scale(${animationState.scale})`)
  }

  if (transforms.length) {
    nextStyle.transform = transforms.join(' ')
  }

  return nextStyle
}

function createMotionComponent(component) {
  return forwardRef(function MotionComponent(
    {
      children,
      initial,
      animate,
      whileInView,
      viewport,
      transition,
      style,
      ...rest
    },
    forwardedRef,
  ) {
    const localRef = useRef(null)
    const [inView, setInView] = useState(false)
    const hasRevealedRef = useRef(false)

    useEffect(() => {
      const element = localRef.current
      if (!element || !whileInView) return undefined

      const once = viewport?.once ?? false
      const amount = viewport?.amount ?? 0.2

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true)
            hasRevealedRef.current = true
            if (once) observer.disconnect()
          } else if (!once) {
            setInView(false)
          }
        },
        { threshold: amount },
      )

      observer.observe(element)

      return () => observer.disconnect()
    }, [viewport, whileInView])

    const mergedStyle = useMemo(() => {
      let activeState = animate
      if (!activeState) {
        activeState = inView || hasRevealedRef.current ? whileInView : initial
      }

      const baseState = initial === false ? {} : initial
      const baseStyle = buildStyleFromState(style, baseState)
      const animationStyle = buildStyleFromState(baseStyle, activeState)
      const duration = transition?.duration ?? 0.45
      const easing = Array.isArray(transition?.ease) ? 'ease' : transition?.ease ?? 'ease'
      const delay = transition?.delay ?? 0

      return {
        ...animationStyle,
        transition: `all ${duration}s ${easing} ${delay}s`,
        willChange: 'opacity, transform, filter',
      }
    }, [animate, inView, initial, style, transition, whileInView])

    const domProps = { ...rest }
    delete domProps.whileTap
    delete domProps.whileHover
    delete domProps.exit

    return React.createElement(
      component,
      {
        ...domProps,
        ref: (node) => {
          localRef.current = node
          if (typeof forwardedRef === 'function') forwardedRef(node)
          else if (forwardedRef && typeof forwardedRef === 'object') forwardedRef.current = node
        },
        style: mergedStyle,
      },
      children,
    )
  })
}

function motionFactory(component) {
  return createMotionComponent(component)
}

export const motion = new Proxy(motionFactory, {
  apply: (_target, _thisArg, [component]) => createMotionComponent(component),
  get: (_target, tagName) => createMotionComponent(tagName),
})

export function AnimatePresence({ children }) {
  return <>{children}</>
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(media.matches)
    const handler = (event) => setReduced(event.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  return reduced
}
