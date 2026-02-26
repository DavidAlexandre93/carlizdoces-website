import { useCallback, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export default function GanacheDrip({
  enabled,
  radius = 0.95,
  color = '#3b2418',
  dripCount = 18,
  triggerKey,
}) {
  const dropsRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const drops = useRef([])

  const dropGeom = useMemo(() => new THREE.CapsuleGeometry(0.03, 0.12, 6, 10), [])
  const mat = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.25,
      metalness: 0,
      clearcoat: 0.65,
      clearcoatRoughness: 0.15,
    }),
    [color],
  )

  const ringGeom = useMemo(() => {
    const path = new THREE.Curve()
    path.getPoint = (t) => {
      const a = t * Math.PI * 2
      return new THREE.Vector3(Math.cos(a) * radius, 0.42, Math.sin(a) * radius)
    }
    return new THREE.TubeGeometry(path, 120, 0.035, 10, true)
  }, [radius])

  const resetDrops = useCallback(() => {
    drops.current = new Array(dripCount).fill(0).map(() => ({
      a: Math.random() * Math.PI * 2,
      len: 0.12 + Math.random() * 0.18,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.7,
    }))
  }, [dripCount])

  useEffect(() => {
    if (!enabled) return
    resetDrops()
  }, [enabled, resetDrops])

  useEffect(() => {
    if (!enabled) return
    resetDrops()
  }, [enabled, triggerKey, resetDrops])

  useFrame((state) => {
    if (!enabled || !dropsRef.current) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < dripCount; i += 1) {
      const d = drops.current[i]
      const wob = 0.02 * Math.sin(t * d.speed + d.phase)

      const x = Math.cos(d.a) * radius
      const z = Math.sin(d.a) * radius
      const y = 0.4 - (d.len + wob)

      dummy.position.set(x, y, z)
      dummy.rotation.set(0, -d.a, 0)
      dummy.scale.set(1, 1 + 0.9 * Math.max(0, wob), 1)
      dummy.updateMatrix()
      dropsRef.current.setMatrixAt(i, dummy.matrix)
    }

    dropsRef.current.instanceMatrix.needsUpdate = true
  })

  if (!enabled) return null

  return (
    <group>
      <mesh geometry={ringGeom} material={mat} castShadow receiveShadow />
      <instancedMesh ref={dropsRef} args={[dropGeom, mat, dripCount]} castShadow receiveShadow />
    </group>
  )
}
