'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Temple } from './Temple'
import { FuluSystem } from './FuluSystem'

export default function TempleScene() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 2, 10], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/* 環境光 */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* 廟宇場景 */}
          <Temple />
          
          {/* 扶鸞系統 */}
          <FuluSystem />
        </Suspense>
      </Canvas>
    </div>
  )
}
