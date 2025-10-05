'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface SceneBackgroundProps {
  imageUrl?: string
}

export function SceneBackground({ imageUrl }: SceneBackgroundProps) {
  const { scene } = useThree()
  const textureRef = useRef<THREE.Texture | null>(null)

  useEffect(() => {
    console.log('SceneBackground: Setting background with imageUrl:', imageUrl)
    
    if (imageUrl) {
      const loader = new THREE.TextureLoader()
      loader.load(
        imageUrl,
        (texture) => {
          console.log('SceneBackground: Texture loaded successfully')
          // 設置為場景背景
          scene.background = texture
          textureRef.current = texture
        },
        (progress) => {
          console.log('SceneBackground: Loading progress:', progress)
        },
        (error) => {
          console.error('SceneBackground: Failed to load texture:', error)
          // 如果加載失敗，設置為黑色背景
          scene.background = new THREE.Color(0x000000)
        }
      )
    } else {
      console.log('SceneBackground: No imageUrl, setting black background')
      scene.background = new THREE.Color(0x000000)
    }

    // 清理函數
    return () => {
      if (textureRef.current) {
        textureRef.current.dispose()
      }
    }
  }, [imageUrl, scene])

  // 使用 useFrame 來確保背景正確設置
  useFrame(() => {
    if (imageUrl && !scene.background) {
      // 如果還沒有背景，再次嘗試設置
      console.log('SceneBackground: Re-attempting to set background')
    }
  })

  return null // 這個組件不渲染任何可見內容
}
