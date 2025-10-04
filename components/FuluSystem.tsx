'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { PhoenixBrush } from './PhoenixBrush'
import { ChineseTextRenderer } from './ChineseTextRenderer'
import { useOracle } from '../hooks/useOracle'

export function FuluSystem() {
  const [isActive, setIsActive] = useState(false)
  const [writtenText, setWrittenText] = useState('')
  const [showText, setShowText] = useState(false)
  const [isGeneratingOracle, setIsGeneratingOracle] = useState(false)
  
  const altarRef = useRef<THREE.Group>(null)
  const brushRef = useRef<THREE.Group>(null)
  const sandRef = useRef<THREE.Mesh>(null)
  
  const { camera, raycaster, mouse } = useThree()
  const { generateOracle, isGenerating, error } = useOracle()

  // 創建沙盤
  const createSandTray = () => {
    const group = new THREE.Group()

    // 沙盤邊框
    const borderGeometry = new THREE.BoxGeometry(8, 0.2, 6)
    const borderMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      shininess: 50
    })
    const border = new THREE.Mesh(borderGeometry, borderMaterial)
    border.position.y = 1.3
    border.receiveShadow = true
    border.castShadow = true
    group.add(border)

    // 沙盤表面
    const sandGeometry = new THREE.PlaneGeometry(7, 5)
    const sandMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xF5DEB3,
      shininess: 10,
      transparent: true,
      opacity: 0.9
    })
    const sandMesh = new THREE.Mesh(sandGeometry, sandMaterial)
    sandMesh.rotation.x = -Math.PI / 2
    sandMesh.position.y = 1.31
    sandMesh.receiveShadow = true
    group.add(sandMesh)

    // 沙盤裝飾邊框
    const innerBorderGeometry = new THREE.RingGeometry(2.5, 3, 32)
    const innerBorderMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFD700,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    })
    const innerBorder = new THREE.Mesh(innerBorderGeometry, innerBorderMaterial)
    innerBorder.rotation.x = -Math.PI / 2
    innerBorder.position.y = 1.32
    group.add(innerBorder)

    return group
  }

  // 創建供桌
  const createAltar = () => {
    const group = new THREE.Group()

    // 供桌主體 - 更大更清晰
    const altarGeometry = new THREE.BoxGeometry(10, 1.2, 6)
    const altarMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      shininess: 30,
      transparent: true,
      opacity: 0.95
    })
    const altarMesh = new THREE.Mesh(altarGeometry, altarMaterial)
    altarMesh.position.y = 0.6
    altarMesh.receiveShadow = true
    altarMesh.castShadow = true
    group.add(altarMesh)

    // 供桌邊緣裝飾 - 金色邊框
    const edgeGeometry = new THREE.BoxGeometry(10.2, 0.1, 6.2)
    const edgeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFD700,
      shininess: 100
    })
    const topEdge = new THREE.Mesh(edgeGeometry, edgeMaterial)
    topEdge.position.y = 1.25
    group.add(topEdge)

    // 供桌腿 - 更粗更明顯
    const legGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8)
    const legMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x654321,
      shininess: 50
    })

    const legPositions = [
      [-4.5, 0, -2.5], [4.5, 0, -2.5],
      [-4.5, 0, 2.5], [4.5, 0, 2.5]
    ]

    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial)
      leg.position.set(x, y, z)
      leg.receiveShadow = true
      leg.castShadow = true
      group.add(leg)
    })

    // 供桌表面裝飾
    const surfaceGeometry = new THREE.PlaneGeometry(8, 4)
    const surfaceMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      shininess: 80,
      transparent: true,
      opacity: 0.8
    })
    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial)
    surface.position.y = 1.21
    surface.rotation.x = -Math.PI / 2
    group.add(surface)

    return group
  }

  // 處理滑鼠點擊
  const handleClick = useCallback(async (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    
    console.log('供桌被點擊！開始扶鸞儀式')
    setIsActive(!isActive)
    
    if (!isActive) {
      // 開始扶鸞
      setIsGeneratingOracle(true)
      
      setTimeout(async () => {
        try {
          // 生成 AI 神諭
          const oracleText = await generateOracle('請賜予神諭指引')
          setWrittenText(oracleText)
          setShowText(true)
        } catch (err) {
          console.error('生成神諭失敗:', err)
          // 使用預設神諭
          setWrittenText('神靈降臨\n指引眾生\n福澤萬民\n功德無量')
          setShowText(true)
        } finally {
          setIsGeneratingOracle(false)
        }
      }, 2000)
    } else {
      setShowText(false)
      setWrittenText('')
    }
  }, [isActive, generateOracle])

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

  const altarGeometry = createAltar()
  const sandTrayGeometry = createSandTray()

  return (
    <group>
      {/* 供桌與沙盤 */}
      <group ref={altarRef} onClick={handleClick}>
        <primitive object={altarGeometry} />
        <primitive object={sandTrayGeometry} ref={sandRef} />
      </group>

      {/* 鳳凰乩筆 */}
      <group ref={brushRef} position={[0, 3, 0]}>
        <PhoenixBrush isActive={isActive} />
      </group>

      {/* 顯示的文字 */}
      {(showText || isGeneratingOracle) && (
        <group position={[0, 2.5, 0]}>
          <ChineseTextRenderer 
            text={isGeneratingOracle ? '神靈降臨中...\n乩筆書寫中...\n天機顯現中...\n請稍候...' : writtenText} 
            isGenerating={isGeneratingOracle}
          />
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

      {/* 點擊提示 */}
      {!isActive && (
        <group position={[0, 1.5, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4, 4.5, 32]} />
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
