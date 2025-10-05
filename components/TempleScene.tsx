'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { Temple } from './Temple'
import { FuluSystem } from './FuluSystem'
import { JiTong } from './JiTong'
import { CameraControls } from './CameraControls'
import { TempleImageDisplay } from './TempleImageDisplay'
import OracleManager from './OracleManager'

export default function TempleScene() {
  const [isOracleActive, setIsOracleActive] = useState(false)
  const [oracleImages, setOracleImages] = useState<{ deity?: string, temple?: string }>({})
  const [showImages, setShowImages] = useState(false)

  const handleOracleStart = () => {
    setIsOracleActive(true)
    setShowImages(true)
  }

  const handleOracleComplete = () => {
    setIsOracleActive(false)
    // 延遲隱藏圖片，讓用戶有時間欣賞
    setTimeout(() => {
      setShowImages(false)
      setOracleImages({})
    }, 15000) // 15秒後隱藏
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 2, 15], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/* 環境光 */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.0}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* 額外光源 */}
          <pointLight position={[0, 8, 0]} intensity={0.5} color={0xFFD700} />
          
          {/* 相機控制 */}
          <CameraControls />
          
          {/* 廟宇場景 */}
          <Temple />
          
          {/* 扶鸞系統 */}
          <FuluSystem />
          
          {/* 乩童 */}
          <JiTong onOracleStart={handleOracleStart} />
          
          {/* 生成的圖片顯示 */}
          {oracleImages.deity && (
            <TempleImageDisplay
              imageUrl={oracleImages.deity}
              type="deity"
              position={[-8, 3, 2]}
              isVisible={showImages}
            />
          )}
          
          {oracleImages.temple && (
            <TempleImageDisplay
              imageUrl={oracleImages.temple}
              type="temple"
              position={[8, 2, 2]}
              isVisible={showImages}
            />
          )}
        </Suspense>
      </Canvas>
      
      {/* HTML 神諭管理器 - 在 Three.js 場景外部 */}
      <OracleManager 
        isActive={isOracleActive}
        onOracleComplete={handleOracleComplete}
        onImagesGenerated={setOracleImages}
      />
    </div>
  )
}
