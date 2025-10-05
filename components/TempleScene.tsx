'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { Temple } from './Temple'
import { FuluSystem } from './FuluSystem'
import { JiTong } from './JiTong'
import { CameraControls } from './CameraControls'
import { TempleImageDisplay } from './TempleImageDisplay'
import { SceneBackground } from './SceneBackground'
import OracleManager from './OracleManager'

export default function TempleScene() {
  const [isOracleActive, setIsOracleActive] = useState(false)
  const [oracleImages, setOracleImages] = useState<{ deity?: string, temple?: string }>({})
  const [showImages, setShowImages] = useState(false)

  const handleOracleStart = () => {
    console.log('TempleScene: Oracle started')
    setIsOracleActive(true)
    setShowImages(true)
  }

  const handleOracleComplete = () => {
    setIsOracleActive(false)
    // 不再隱藏圖片，保持背景顯示
    // setTimeout(() => {
    //   setShowImages(false)
    //   setOracleImages({})
    // }, 15000) // 15秒後隱藏
  }

  // 調試信息
  console.log('TempleScene: oracleImages.deity =', oracleImages.deity)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 2, 15], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/* 場景背景 - 使用生成的佛像圖片 */}
          <SceneBackground imageUrl={oracleImages.deity} />
          
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
          
          {/* 生成的圖片顯示 - 只顯示廟宇圖片，佛像作為背景 */}
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
        onImagesGenerated={(images) => {
          console.log('TempleScene: Received images:', images)
          setOracleImages(images)
        }}
      />
    </div>
  )
}
