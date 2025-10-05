'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TempleImageDisplayProps {
  imageUrl?: string
  type: 'deity' | 'temple'
  position: [number, number, number]
  isVisible: boolean
}

export function TempleImageDisplay({ imageUrl, type, position, isVisible }: TempleImageDisplayProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  // 手動載入紋理
  useEffect(() => {
    if (!imageUrl) return

    const loader = new THREE.TextureLoader()
    loader.load(
      imageUrl,
      (loadedTexture) => {
        console.log(`${type} texture loaded:`, imageUrl)
        setTexture(loadedTexture)
      },
      undefined,
      (error) => {
        console.error(`Failed to load ${type} texture:`, error)
      }
    )
  }, [imageUrl, type])

  // 動畫效果
  useFrame((state) => {
    if (groupRef.current && isVisible) {
      // 輕微的浮動效果
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      
      // 神像的輕微旋轉
      if (type === 'deity') {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      }
    }
  })

  if (!isVisible || !imageUrl || !texture) return null

  return (
    <group ref={groupRef} position={position}>
      {/* 主要圖片顯示 */}
      <mesh ref={meshRef}>
        <planeGeometry args={type === 'deity' ? [3, 4] : [6, 4]} />
        <meshBasicMaterial 
          map={texture}
          transparent={true}
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 神聖光暈 */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={type === 'deity' ? [3.5, 4.5] : [6.5, 4.5]} />
        <meshBasicMaterial 
          color={0xFFD700}
          transparent={true}
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 裝飾邊框 */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={type === 'deity' ? [3.2, 4.2] : [6.2, 4.2]} />
        <meshBasicMaterial 
          color={0x8B4513}
          transparent={true}
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 粒子效果 */}
      <group>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * (type === 'deity' ? 4 : 7),
              (Math.random() - 0.5) * 5,
              Math.random() * 2
            ]}
          >
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial 
              color={0xFFD700} 
              transparent 
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
