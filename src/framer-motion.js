import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

export { motion }

export function useReducedMotion() {
  const getPreference = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPreference)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (event) => setPrefersReducedMotion(event.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}
