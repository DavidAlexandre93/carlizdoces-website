import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function SprinklesPhysics({
  count = 140,
  radius = 0.95,
  emitHeight = 1.2,
  colors = ['#ea9eb0', '#ffffff', '#2b2b2b'],
  triggerKey,
}) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const velRef = useRef([]);
  const posRef = useRef([]);
  const rotRef = useRef([]);
  const colorArray = useMemo(() => colors.map((color) => new THREE.Color(color)), [colors]);

  const geom = useMemo(() => new THREE.BoxGeometry(0.05, 0.02, 0.12), []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.08 }),
    []
  );

  const randSpawn = (index) => {
    const a = Math.random() * Math.PI * 2;
    const r = radius * (0.15 + Math.random() * 0.9);
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const y = emitHeight + Math.random() * 0.6;

    posRef.current[index] = new THREE.Vector3(x, y, z);
    velRef.current[index] = new THREE.Vector3(
      (Math.random() - 0.5) * 0.25,
      -0.1 - Math.random() * 0.15,
      (Math.random() - 0.5) * 0.25
    );
    rotRef.current[index] = new THREE.Vector3(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    const col = colorArray[Math.floor(Math.random() * colorArray.length)];
    meshRef.current?.setColorAt(index, col);
  };

  useEffect(() => {
    velRef.current = new Array(count);
    posRef.current = new Array(count);
    rotRef.current = new Array(count);

    for (let i = 0; i < count; i += 1) randSpawn(i);

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (!meshRef.current) return;
    const n = Math.min(40, Math.floor(count * 0.25));
    for (let k = 0; k < n; k += 1) {
      const index = Math.floor(Math.random() * count);
      randSpawn(index);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  useFrame((_, dt) => {
    if (!meshRef.current) return;

    const gravity = -1.6;
    const floorY = -0.58;
    const topTierY = 0.95;
    const topTierRadius = radius * 0.62;

    for (let i = 0; i < count; i += 1) {
      const p = posRef.current[i];
      const v = velRef.current[i];
      const r = rotRef.current[i];

      if (!p || !v || !r) {
        randSpawn(i);
        continue;
      }

      v.y += gravity * dt;
      p.x += v.x * dt;
      p.y += v.y * dt;
      p.z += v.z * dt;

      r.x += dt * 1.5;
      r.y += dt * 1.2;
      r.z += dt * 1.1;

      if (p.y < floorY) {
        p.y = floorY;
        v.y *= -0.45;
        v.x *= 0.85;
        v.z *= 0.85;
        if (Math.abs(v.y) < 0.15) v.y = 0;
      }

      const dist = Math.sqrt(p.x * p.x + p.z * p.z);
      const onTop = dist < radius && p.y < 0.42 && p.y > -0.2;
      if (onTop && v.y < 0) {
        p.y = 0.42;
        v.y *= -0.38;
      }

      const onTop2 = dist < topTierRadius && p.y < topTierY && p.y > 0.55;
      if (onTop2 && v.y < 0) {
        p.y = topTierY;
        v.y *= -0.35;
      }

      if (p.y < -2 || Math.abs(p.x) > 4 || Math.abs(p.z) > 4) {
        randSpawn(i);
      }

      dummy.position.copy(p);
      dummy.rotation.set(r.x, r.y, r.z);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={meshRef} args={[geom, mat, count]} castShadow receiveShadow />;
}
