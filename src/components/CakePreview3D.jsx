import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float, RoundedBox, Text } from '@react-three/drei'
import SprinklesPhysics from './SprinklesPhysics'
import FlowersInstanced from './FlowersInstanced'
import GanacheDrip from './GanacheDrip'

export default function CakePreview3D({
  structure,
  mainHex,
  accentHex,
  ingredientes,
  restrictionOk,
  pulseKey,
  birthdayName = 'Carla Geovanna',
  quality = 'high',
}) {
  const dpr = quality === 'high' ? [1, 2] : [1, 1.25]

  const decoIds = useMemo(
    () => (ingredientes?.decoracao || []).map((item) => item?.id).filter(Boolean),
    [ingredientes],
  )

  const hasFlowers = decoIds.includes('deco_flores')
  const hasTopper = decoIds.includes('deco_topper') || decoIds.includes('deco_escrita')
  const hasGanache = (ingredientes?.cobertura?.id || '').includes('ganache')

  const sprinkleCount = useMemo(() => {
    const decoCount = ingredientes?.decoracao?.length || 0
    return Math.min(260, 90 + decoCount * 35)
  }, [ingredientes])

  return (
    <div style={{ borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', background: '#fff', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Preview 3D</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          {restrictionOk ? <span style={{ color: '#15803d' }}>✅ Restrição OK</span> : <span style={{ color: '#b91c1c' }}>⚠️ Restrição violada</span>}
        </div>
      </div>

      <div style={{ marginTop: 12, height: 320, width: '100%', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden', background: '#f7f7f7' }}>
        <Canvas
          dpr={dpr}
          shadows
          camera={{ position: [2.6, 2, 2.6], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[4, 6, 3]}
            intensity={1.25}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-3, 2, -2]} intensity={0.35} />

          <Environment preset="studio" />

          <group position={[0, -0.95, 0]}>
            <ContactShadows opacity={0.35} scale={8} blur={2.4} far={3} />
          </group>

          <OrbitControls
            enablePan={false}
            minDistance={2.2}
            maxDistance={4.8}
            minPolarAngle={0.55}
            maxPolarAngle={1.35}
          />

          <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.18}>
            <CakeModel
              structure={structure}
              mainHex={mainHex}
              accentHex={accentHex}
              pulseKey={pulseKey}
              birthdayName={birthdayName}
              showTopper={hasTopper}
            />

            <GanacheDrip
              enabled={hasGanache}
              radius={structure === 'quadrado' ? 0.86 : 0.95}
              color="#3b2418"
              dripCount={18}
              triggerKey={pulseKey}
            />

            <FlowersInstanced
              enabled={hasFlowers}
              count={26}
              radius={0.72}
              color={accentHex}
              triggerKey={pulseKey}
            />
          </Float>

          <SprinklesPhysics
            count={sprinkleCount}
            radius={structure === '2andares' ? 0.78 : 0.95}
            emitHeight={1.35}
            colors={[accentHex, mainHex, '#ffffff', '#2b2b2b', '#f2c1cd']}
            triggerKey={pulseKey}
          />
        </Canvas>
      </div>

      <div style={{ marginTop: 12, borderRadius: 12, background: 'rgba(0,0,0,0.05)', padding: 12, fontSize: 14 }}>
        <div style={{ fontWeight: 600 }}>Ingredientes</div>
        <div style={{ marginTop: 4, opacity: 0.8, lineHeight: 1.5, wordBreak: 'break-word' }}>
          • Massa: {ingredientes?.massa?.icon} {ingredientes?.massa?.label || '—'}
          <br />
          • Recheio: {ingredientes?.recheio?.icon} {ingredientes?.recheio?.label || '—'}
          <br />
          • Cobertura: {ingredientes?.cobertura?.icon} {ingredientes?.cobertura?.label || '—'}
          <br />
          • Decoração:{' '}
          {ingredientes?.decoracao?.length
            ? ingredientes.decoracao.map((item) => `${item.icon} ${item.label}`).join(', ')
            : '—'}
        </div>
      </div>
    </div>
  )
}

function CakeModel({ structure, mainHex, accentHex, pulseKey, birthdayName, showTopper }) {
  const groupRef = useRef()
  const pulseRef = useRef({ t: 0 })

  const mainMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(mainHex),
      roughness: 0.35,
      metalness: 0,
      clearcoat: 0.75,
      clearcoatRoughness: 0.2,
    }),
    [mainHex],
  )

  const accentMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(accentHex),
      roughness: 0.28,
      metalness: 0,
      clearcoat: 0.85,
      clearcoatRoughness: 0.18,
    }),
    [accentHex],
  )

  useEffect(() => {
    pulseRef.current.t = 1
  }, [pulseKey])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    if (pulseRef.current.t > 0) {
      pulseRef.current.t = Math.max(0, pulseRef.current.t - delta * 2.2)
      const k = pulseRef.current.t
      const scale = 1 + 0.06 * Math.sin((1 - k) * Math.PI) * k
      groupRef.current.scale.setScalar(scale)
      groupRef.current.rotation.y += 0.02 * k
    } else {
      groupRef.current.scale.setScalar(1)
    }
  })

  const isTwo = structure === '2andares'
  const isSquare = structure === 'quadrado'

  const plateMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: new THREE.Color('#ffffff'), roughness: 0.6, metalness: 0.05 }),
    [],
  )

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      <mesh receiveShadow position={[0, -0.65, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.08, 48]} />
        <primitive object={plateMat} attach="material" />
      </mesh>

      {isSquare ? (
        <RoundedBox args={[1.7, 0.9, 1.7]} radius={0.25} smoothness={8} position={[0, -0.05, 0]} castShadow receiveShadow>
          <primitive object={mainMat} attach="material" />
        </RoundedBox>
      ) : (
        <RoundedBox args={[1.9, 0.9, 1.9]} radius={0.32} smoothness={10} position={[0, -0.05, 0]} castShadow receiveShadow>
          <primitive object={mainMat} attach="material" />
        </RoundedBox>
      )}

      {isTwo ? (
        <RoundedBox args={[1.2, 0.7, 1.2]} radius={0.28} smoothness={10} position={[0, 0.65, 0]} castShadow receiveShadow>
          <primitive object={accentMat} attach="material" />
        </RoundedBox>
      ) : null}

      {showTopper ? <Topper birthdayName={birthdayName} accentHex={accentHex} /> : null}

      <mesh castShadow position={[0, 0.25, 0]}>
        <torusGeometry args={[0.9, 0.05, 14, 70]} />
        <meshStandardMaterial color={accentHex} roughness={0.35} />
      </mesh>
    </group>
  )
}

function Topper({ birthdayName, accentHex }) {
  const poleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 }), [])

  return (
    <group position={[0, 1.3, 0]}>
      <mesh castShadow position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 16]} />
        <primitive object={poleMat} attach="material" />
      </mesh>

      <mesh castShadow position={[0, 0.25, 0]}>
        <boxGeometry args={[1, 0.32, 0.06]} />
        <meshPhysicalMaterial color={accentHex} roughness={0.25} clearcoat={0.8} clearcoatRoughness={0.15} />
      </mesh>

      <Text
        position={[0, 0.25, 0.04]}
        fontSize={0.12}
        color="#2b2b2b"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.95}
      >
        {birthdayName}
      </Text>
    </group>
  )
}
