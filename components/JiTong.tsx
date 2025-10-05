'use client'

import { useRef, useState, useCallback } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'

interface JiTongProps {
  onOracleStart?: () => void
}

export function JiTong({ onOracleStart }: JiTongProps) {
  const [isActive, setIsActive] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)

  // 處理點擊事件
  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    
    console.log('乩童被點擊！開始扶鸞儀式')
    setIsActive(!isActive)
    
    if (!isActive) {
      // 通知外部組件開始神諭生成
      onOracleStart?.()
    }
  }, [isActive, onOracleStart])

  // 處理滑鼠懸停
  const handlePointerOver = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handlePointerOut = useCallback(() => {
    setIsHovered(false)
  }, [])

  // 動畫效果
  useFrame((state) => {
    if (groupRef.current) {
      // 整體浮動效果
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
      
      // 懸停時的呼吸效果
      if (isHovered) {
        const breathScale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05
        groupRef.current.scale.setScalar(breathScale)
      } else {
        groupRef.current.scale.setScalar(1)
      }
    }
    
    if (bodyRef.current && isActive) {
      // 活躍時的輕微搖擺
      bodyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group 
      ref={groupRef} 
      position={[0, 0, 4]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* 乩童身體 */}
      <group ref={bodyRef}>
        {/* 頭部 */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.5, 16, 8]} />
          <meshPhongMaterial color={0xFDBCB4} />
        </mesh>
        
        {/* 頭髮 */}
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.52, 16, 8]} />
          <meshPhongMaterial color={0x8B4513} />
        </mesh>

        {/* 身體 */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 1, 8]} />
          <meshPhongMaterial color={0x8B0000} />
        </mesh>

        {/* 手臂 */}
        <mesh position={[-0.6, 0.7, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.8, 8]} />
          <meshPhongMaterial color={0xFDBCB4} />
        </mesh>
        <mesh position={[0.6, 0.7, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.8, 8]} />
          <meshPhongMaterial color={0xFDBCB4} />
        </mesh>

        {/* 腿部 */}
        <mesh position={[-0.15, -0.7, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.8, 8]} />
          <meshPhongMaterial color={0x654321} />
        </mesh>
        <mesh position={[0.15, -0.7, 0]}>
          <cylinderGeometry args={[0.12, 0.15, 0.8, 8]} />
          <meshPhongMaterial color={0x654321} />
        </mesh>
      </group>

      {/* 乩童服飾 - 腰帶 */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.1, 8]} />
        <meshPhongMaterial color={0xFFD700} />
      </mesh>

      {/* 神聖光環 */}
      {isActive && (
        <group position={[0, 1.5, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1, 1.5, 32]} />
            <meshBasicMaterial 
              color={0xFFD700} 
              transparent 
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2, 32]} />
            <meshBasicMaterial 
              color={0xFFD700} 
              transparent 
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* 點擊提示光環 */}
      {!isActive && (
        <group position={[0, 1.5, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.7, 32]} />
            <meshBasicMaterial 
              color={0xFFD700} 
              transparent 
              opacity={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* 粒子效果 */}
      {isActive && (
        <group>
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 3,
                Math.random() * 2 + 1,
                (Math.random() - 0.5) * 2
              ]}
            >
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial 
                color={0xFFD700} 
                transparent 
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}