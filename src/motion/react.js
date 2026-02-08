import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'

function toCssValue(value) {
  return typeof value === 'number' ? `${value}px` : value
}

function buildStyleFromState(baseStyle = {}, animationState = {}) {
  const nextStyle = { ...baseStyle }

  if (animationState.opacity !== undefined) {
    nextStyle.opacity = animationState.opacity
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

function createMotionComponent(tagName) {
  return forwardRef(function MotionComponent({ children, initial, whileInView, viewport, transition, style, ...rest }, forwardedRef) {
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
      const activeState = inView || hasRevealedRef.current ? whileInView : initial
      const animationStyle = buildStyleFromState(style, activeState)
      const duration = transition?.duration ?? 0.45
      const easing = transition?.ease ?? 'ease'
      const delay = transition?.delay ?? 0

      return {
        ...animationStyle,
        transition: `opacity ${duration}s ${easing} ${delay}s, transform ${duration}s ${easing} ${delay}s`,
        willChange: 'opacity, transform',
      }
    }, [inView, initial, whileInView, style, transition])

    return React.createElement(tagName, {
      ...rest,
      ref: (node) => {
        localRef.current = node
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else if (forwardedRef && typeof forwardedRef === 'object') forwardedRef.current = node
      },
      style: mergedStyle,
    }, children)
  })
}

export const motion = new Proxy({}, { get: (_target, tagName) => createMotionComponent(tagName) })
