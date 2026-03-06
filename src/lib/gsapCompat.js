import { useLayoutEffect } from 'react'

const easeMap = {
  'power1.out': 'cubic-bezier(0.16, 1, 0.3, 1)',
  'power2.out': 'cubic-bezier(0.22, 1, 0.36, 1)',
  'power3.out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'power4.out': 'cubic-bezier(0.19, 1, 0.22, 1)',
  'sine.inOut': 'ease-in-out',
  none: 'linear',
}

function resolveEase(ease) {
  if (!ease) return 'ease-out'
  return easeMap[ease] || ease
}

function queryTargets(target, scope) {
  if (typeof target === 'string') {
    return Array.from((scope || document).querySelectorAll(target))
  }

  if (typeof Element !== 'undefined' && target instanceof Element) return [target]
  if (Array.isArray(target)) return target
  return []
}

function buildTransform(vars = {}) {
  const x = vars.x || 0
  const y = vars.y || 0
  const yPercent = vars.yPercent || 0
  const scale = vars.scale || 1
  return `translate(${x}px, calc(${y}px + ${yPercent}%)) scale(${scale})`
}

function animate(target, vars, scope, fromVars) {
  const elements = queryTargets(target, scope)
  const durationMs = (vars.duration || 0.6) * 1000
  const delayMs = (vars.delay || 0) * 1000
  const easing = resolveEase(vars.ease)

  elements.forEach((element, index) => {
    const staggerDelay = typeof vars.stagger === 'number' ? vars.stagger * index * 1000 : 0
    const keyframes = []

    if (fromVars) {
      keyframes.push({
        opacity: fromVars.opacity ?? 1,
        transform: buildTransform(fromVars),
      })
    }

    keyframes.push({
      opacity: vars.opacity ?? 1,
      transform: buildTransform(vars),
    })

    try {
      element.animate(keyframes, {
        duration: durationMs,
        delay: delayMs + staggerDelay,
        easing,
        fill: 'forwards',
        iterations: vars.repeat === -1 ? Infinity : (vars.repeat || 0) + 1,
        direction: vars.yoyo ? 'alternate' : 'normal',
      })
    } catch {
      element.animate(keyframes, {
        duration: durationMs,
        delay: delayMs + staggerDelay,
        easing: 'ease-out',
        fill: 'forwards',
      })
    }
  })
}

const gsap = {
  registerPlugin: () => {},
  to(target, vars = {}, scope) {
    animate(target, vars, scope)
  },
  from(target, vars = {}, scope) {
    animate(target, { ...vars, x: 0, y: 0, yPercent: 0, opacity: 1, scale: 1 }, scope, vars)
  },
  timeline({ defaults = {} } = {}) {
    return {
      from(target, vars, scope) {
        gsap.from(target, { ...defaults, ...vars }, scope)
        return this
      },
    }
  },
}

export function useGSAP(callback, { scope, dependencies = [] } = {}) {
  useLayoutEffect(() => {
    callback({ scope: scope?.current || scope || document })
  }, [callback, scope, ...dependencies])
}

export default gsap
