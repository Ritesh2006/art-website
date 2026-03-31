import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSwarm({ count = 4000 }) {
  const points = useRef();
  
  // Track continuous mouse position
  const mouse = useRef({ x: 0, y: 0 });
  const scrollTracker = useRef(0);

  // Generate random points in a wide volume, plus random colors
  const [positions, colors] = useMemo(() => {
    const pArr = new Float32Array(count * 3);
    const cArr = new Float32Array(count * 3);
    
    const colorChoices = [
      new THREE.Color('#f5b041'), // Vibrant Gold
      new THREE.Color('#5dade2'), // Subtle Blue
      new THREE.Color('#e59866')  // Warm Orange
    ];

    for (let i = 0; i < count; i++) {
        const r = 28 * Math.cbrt(Math.random()); 
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        pArr[i * 3] = r * Math.sin(phi) * Math.cos(theta); // x
        pArr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
        pArr[i * 3 + 2] = r * Math.cos(phi); // z

        const col = colorChoices[Math.floor(Math.random() * colorChoices.length)];
        cArr[i * 3] = col.r;
        cArr[i * 3 + 1] = col.g;
        cArr[i * 3 + 2] = col.b;
    }
    return [pArr, cArr];
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;

    // React to continuous scroll state
    const currentScroll = window.scrollY;
    
    // Make rotation faster and more dynamic
    points.current.rotation.x -= delta / 15;
    points.current.rotation.y -= delta / 10;

    // Scroll parallax effect mapping scroll depth to Y axis and expanding rotation
    points.current.position.y = currentScroll * 0.008;
    points.current.rotation.z = currentScroll * 0.0004;
    
    // Ease camera tracking towards mouse position with stronger reactive feel
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, (state.pointer.x * Math.PI) / 6, 0.08);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, (state.pointer.y * Math.PI) / 6, 0.08);
    state.camera.position.x = mouse.current.x * 5;
    state.camera.position.y = mouse.current.y * 5;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <Points ref={points} positions={positions} colors={colors} frustumCulled={false}>
      <PointMaterial 
        transparent 
        vertexColors={true}
        size={0.08} 
        sizeAttenuation={true} 
        depthWrite={false} 
        opacity={0.85}
      />
    </Points>
  );
}

export default function ThreeBackground() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: -1, pointerEvents: 'none', background: 'var(--canvas)' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <color attach="background" args={['#faf7f0']} />
        {/* Adds atmospheric depth by fading out distant particles */}
        <fog attach="fog" args={['#faf7f0', 8, 25]} />
        <ParticleSwarm count={5000} />
      </Canvas>
    </div>
  );
}
