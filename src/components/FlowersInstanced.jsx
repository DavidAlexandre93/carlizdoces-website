import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export default function FlowersInstanced({
  enabled,
  count = 28,
  radius = 0.72,
  color = '#ea9eb0',
  triggerKey,
}) {
  const coreRef = useRef()
  const petalRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const posRef = useRef([])

  const coreGeom = useMemo(() => new THREE.SphereGeometry(0.03, 10, 10), [])
  const petalGeom = useMemo(() => new THREE.CircleGeometry(0.035, 12), [])

  const coreMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ffd5a6', roughness: 0.6 }),
    [],
  )
  const petalMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color, roughness: 0.55, side: THREE.DoubleSide }),
    [color],
  )

  const init = () => {
    posRef.current = new Array(count).fill(0).map(() => {
      const a = Math.random() * Math.PI * 2
      const r = radius * (0.35 + Math.random() * 0.65)
      return {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        y: 1.02 + (Math.random() - 0.5) * 0.02,
        rot: Math.random() * Math.PI * 2,
        wob: Math.random() * 2 * Math.PI,
      }
    })
  }

  useEffect(() => {
    if (!enabled) return
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, count])

  useEffect(() => {
    if (!enabled) return
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey])

  useFrame((state) => {
    if (!enabled) return
    const t = state.clock.elapsedTime

    if (coreRef.current) {
      for (let i = 0; i < count; i += 1) {
        const p = posRef.current[i]
        const bob = 0.004 * Math.sin(t * 2 + p.wob)

        dummy.position.set(p.x, p.y + bob, p.z)
        dummy.rotation.set(0, p.rot + 0.2 * Math.sin(t + p.wob), 0)
        dummy.updateMatrix()
        coreRef.current.setMatrixAt(i, dummy.matrix)
      }
      coreRef.current.instanceMatrix.needsUpdate = true
    }

    if (petalRef.current) {
      let idx = 0
      for (let i = 0; i < count; i += 1) {
        const p = posRef.current[i]
        const bob = 0.004 * Math.sin(t * 2 + p.wob)
        for (let k = 0; k < 5; k += 1) {
          const ang = (k / 5) * Math.PI * 2
          const px = p.x + Math.cos(ang) * 0.05
          const pz = p.z + Math.sin(ang) * 0.05

          dummy.position.set(px, p.y + bob, pz)
          dummy.rotation.set(-Math.PI / 2, p.rot + ang, 0)
          dummy.updateMatrix()
          petalRef.current.setMatrixAt(idx, dummy.matrix)
          idx += 1
        }
      }
      petalRef.current.instanceMatrix.needsUpdate = true
    }
  })

  if (!enabled) return null

  return (
    <group>
      <instancedMesh ref={coreRef} args={[coreGeom, coreMat, count]} castShadow receiveShadow />
      <instancedMesh
        ref={petalRef}
        args={[petalGeom, petalMat, count * 5]}
        castShadow
        receiveShadow
      />
    </group>
  )
}
