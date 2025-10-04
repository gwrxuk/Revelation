'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PhoenixBrushProps {
  isActive: boolean
}

export function PhoenixBrush({ isActive }: PhoenixBrushProps) {
  const brushRef = useRef<THREE.Group>(null)
  const featherRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // 創建鳳凰羽毛筆
  const createPhoenixBrush = () => {
    const group = new THREE.Group()

    // 筆桿 - 金色
    const handleGeometry = new THREE.CylinderGeometry(0.05, 0.08, 1.5, 8)
    const handleMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFD700,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    })
    const handle = new THREE.Mesh(handleGeometry, handleMaterial)
    handle.position.y = 0.75
    handle.castShadow = true
    group.add(handle)

    // 鳳凰羽毛 - 漸層色彩
    const featherGroup = new THREE.Group()
    
    // 主要羽毛
    const mainFeatherGeometry = new THREE.ConeGeometry(0.3, 1, 8)
    const mainFeatherMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFF6347,
      transparent: true,
      opacity: 0.8
    })
    const mainFeather = new THREE.Mesh(mainFeatherGeometry, mainFeatherMaterial)
    mainFeather.position.y = 1.8
    mainFeather.rotation.z = Math.PI
    featherGroup.add(mainFeather)

    // 側邊羽毛
    const sideFeatherGeometry = new THREE.ConeGeometry(0.2, 0.8, 6)
    const sideFeatherMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFF4500,
      transparent: true,
      opacity: 0.7
    })
    
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      const sideFeather = new THREE.Mesh(sideFeatherGeometry, sideFeatherMaterial)
      sideFeather.position.set(
        Math.cos(angle) * 0.4,
        1.6,
        Math.sin(angle) * 0.4
      )
      sideFeather.rotation.z = Math.PI + angle * 0.5
      featherGroup.add(sideFeather)
    }

    // 羽毛尖端 - 金色
    const tipGeometry = new THREE.SphereGeometry(0.1, 8, 8)
    const tipMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFD700,
      shininess: 200
    })
    const tip = new THREE.Mesh(tipGeometry, tipMaterial)
    tip.position.y = 2.3
    featherGroup.add(tip)

    group.add(featherGroup)

    return group
  }

  // 創建神聖光暈
  const createGlow = () => {
    const glowGeometry = new THREE.SphereGeometry(1, 16, 16)
    const glowMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFD700,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    })
    return new THREE.Mesh(glowGeometry, glowMaterial)
  }

  // 動畫效果
  useFrame((state) => {
    if (brushRef.current) {
      // 整體旋轉
      brushRef.current.rotation.y = state.clock.elapsedTime * 0.5
      
      // 上下浮動
      brushRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }

    if (featherRef.current && isActive) {
      // 羽毛飄動效果
      featherRef.current.children.forEach((child, index) => {
        if (index > 0) { // 跳過筆桿
          child.rotation.z += 0.02
          child.rotation.x = Math.sin(state.clock.elapsedTime * 3 + index) * 0.1
        }
      })
    }

    if (glowRef.current && isActive && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      // 光暈脈動
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      glowRef.current.scale.setScalar(scale)
      glowRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const brushGeometry = createPhoenixBrush()
  const glowGeometry = createGlow()

  return (
    <group ref={brushRef}>
      <group ref={featherRef}>
        <primitive object={brushGeometry} />
      </group>
      
      {isActive && (
        <primitive object={glowGeometry} ref={glowRef} />
      )}

      {/* 粒子效果 */}
      {isActive && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 2,
              Math.random() * 2,
              (Math.random() - 0.5) * 2
            ]}>
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial 
                color={0xFFD700} 
                transparent 
                opacity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}
