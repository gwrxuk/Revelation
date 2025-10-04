'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ChineseTextRendererProps {
  text: string
}

export function ChineseTextRenderer({ text }: ChineseTextRendererProps) {
  const textRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // 分割文字為多行
  const lines = text.split('\n')

  // 動畫效果
  useFrame((state) => {
    if (textRef.current) {
      // 文字浮動效果
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1
      
      // 文字旋轉效果
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }

    if (glowRef.current && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      // 背景光暈脈動
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
      glowRef.current.scale.setScalar(scale)
      glowRef.current.material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1
    }
  })

  return (
    <group ref={textRef}>
      {/* 背景光暈 */}
      <mesh ref={glowRef} position={[0, 0, -0.5]}>
        <planeGeometry args={[8, 4]} />
        <meshBasicMaterial 
          color={0xFFD700} 
          transparent 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 繁體中文文字 - 使用基本文字渲染 */}
      {lines.map((line, index) => (
        <mesh key={index} position={[0, (lines.length - 1 - index) * 0.6, 0]}>
          <planeGeometry args={[4, 0.8]} />
          <meshBasicMaterial 
            color="#FFD700" 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* 書法筆觸效果 */}
      <group>
        {lines.map((line, lineIndex) => (
          line.split('').map((char, charIndex) => (
            <mesh
              key={`${lineIndex}-${charIndex}`}
              position={[
                (charIndex - line.length / 2) * 0.6,
                (lines.length - 1 - lineIndex) * 0.6,
                0.1
              ]}
            >
              <planeGeometry args={[0.5, 0.5]} />
              <meshBasicMaterial 
                color={0xFFD700} 
                transparent 
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))
        ))}
      </group>

      {/* 神聖粒子 */}
      <group>
        {Array.from({ length: 30 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 4,
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
