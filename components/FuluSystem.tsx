'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PhoenixBrush } from './PhoenixBrush'
import { ChineseTextRenderer } from './ChineseTextRenderer'

export function FuluSystem() {
  const [isActive, setIsActive] = useState(false)
  const [writtenText, setWrittenText] = useState('')
  const [showText, setShowText] = useState(false)
  
  const altarRef = useRef<THREE.Group>(null)
  const brushRef = useRef<THREE.Group>(null)
  const sandRef = useRef<THREE.Mesh>(null)
  
  const { camera, raycaster, mouse } = useThree()

  // 創建沙盤
  const createSandTray = () => {
    const sandGeometry = new THREE.PlaneGeometry(6, 4)
    const sandMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xF5DEB3,
      transparent: true,
      opacity: 0.8
    })
    const sandMesh = new THREE.Mesh(sandGeometry, sandMaterial)
    sandMesh.rotation.x = -Math.PI / 2
    sandMesh.position.y = 1
    sandMesh.receiveShadow = true
    return sandMesh
  }

  // 創建供桌
  const createAltar = () => {
    const group = new THREE.Group()

    // 供桌主體
    const altarGeometry = new THREE.BoxGeometry(8, 1, 4)
    const altarMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x8B4513,
      transparent: true,
      opacity: 0.9
    })
    const altarMesh = new THREE.Mesh(altarGeometry, altarMaterial)
    altarMesh.position.y = 0.5
    altarMesh.receiveShadow = true
    altarMesh.castShadow = true
    group.add(altarMesh)

    // 供桌腿
    const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8)
    const legMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x654321,
      transparent: true,
      opacity: 0.9
    })

    const legPositions = [
      [-3.5, 0, -1.5], [3.5, 0, -1.5],
      [-3.5, 0, 1.5], [3.5, 0, 1.5]
    ]

    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial)
      leg.position.set(x, y, z)
      leg.receiveShadow = true
      leg.castShadow = true
      group.add(leg)
    })

    return group
  }

  // 處理滑鼠點擊
  const handleClick = useCallback((event: MouseEvent) => {
    event.preventDefault()
    
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(altarRef.current?.children || [])
    
    if (intersects.length > 0) {
      setIsActive(!isActive)
      
      if (!isActive) {
        // 開始扶鸞
        setTimeout(() => {
          setWrittenText('神靈降臨\n指引眾生\n福澤萬民\n功德無量')
          setShowText(true)
        }, 2000)
      } else {
        setShowText(false)
        setWrittenText('')
      }
    }
  }, [isActive, camera, mouse, raycaster])

  // 動畫效果
  useFrame((state) => {
    if (altarRef.current) {
      altarRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.02
    }
    
    if (brushRef.current && isActive) {
      // 乩筆飄動效果
      brushRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1
      brushRef.current.position.y = 3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.2
    }
  })

  // 添加事件監聽器
  useEffect(() => {
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [handleClick])

  const altarGeometry = createAltar()
  const sandTray = createSandTray()

  return (
    <group>
      {/* 供桌與沙盤 */}
      <group ref={altarRef}>
        <primitive object={altarGeometry} />
        <primitive object={sandTray} ref={sandRef} />
      </group>

      {/* 鳳凰乩筆 */}
      <group ref={brushRef} position={[0, 3, 0]}>
        <PhoenixBrush isActive={isActive} />
      </group>

      {/* 顯示的文字 */}
      {showText && (
        <group position={[0, 2.5, 0]}>
          <ChineseTextRenderer text={writtenText} />
        </group>
      )}

      {/* 神聖光環 */}
      {isActive && (
        <group position={[0, 2, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2, 2.5, 32]} />
            <meshBasicMaterial 
              color={0xFFD700} 
              transparent 
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3, 3.5, 32]} />
            <meshBasicMaterial 
              color={0xFFD700} 
              transparent 
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}
