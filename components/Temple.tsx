'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Temple() {
  const templeRef = useRef<THREE.Group>(null)
  const incenseRef = useRef<THREE.Group>(null)

  // 創建廟宇幾何體
  const createTempleGeometry = () => {
    const group = new THREE.Group()

    // 廟宇主體 - 紅色建築
    const templeBase = new THREE.BoxGeometry(8, 3, 6)
    const templeMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x8B0000,
      transparent: true,
      opacity: 0.9
    })
    const templeMesh = new THREE.Mesh(templeBase, templeMaterial)
    templeMesh.position.y = 1.5
    templeMesh.receiveShadow = true
    templeMesh.castShadow = true
    group.add(templeMesh)

    // 廟宇屋頂 - 金色瓦片
    const roofGeometry = new THREE.ConeGeometry(6, 2, 8)
    const roofMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xFFD700,
      transparent: true,
      opacity: 0.8
    })
    const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial)
    roofMesh.position.y = 4
    roofMesh.rotation.y = Math.PI / 8
    roofMesh.receiveShadow = true
    roofMesh.castShadow = true
    group.add(roofMesh)

    // 廟宇柱子
    const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.3, 4, 8)
    const pillarMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x8B4513,
      transparent: true,
      opacity: 0.9
    })
    
    const pillarPositions = [
      [-3, 2, -2.5], [3, 2, -2.5],
      [-3, 2, 2.5], [3, 2, 2.5]
    ]
    
    pillarPositions.forEach(([x, y, z]) => {
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
      pillar.position.set(x, y, z)
      pillar.receiveShadow = true
      pillar.castShadow = true
      group.add(pillar)
    })

    // 廟宇階梯
    const stepGeometry = new THREE.BoxGeometry(10, 0.3, 2)
    const stepMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x696969,
      transparent: true,
      opacity: 0.8
    })
    
    for (let i = 0; i < 5; i++) {
      const step = new THREE.Mesh(stepGeometry, stepMaterial)
      step.position.set(0, i * 0.3, -3 - i * 0.3)
      step.receiveShadow = true
      group.add(step)
    }

    return group
  }

  // 創建香爐
  const createIncenseBurner = () => {
    const group = new THREE.Group()

    // 香爐主體
    const burnerGeometry = new THREE.CylinderGeometry(1, 1.2, 1.5, 12)
    const burnerMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x8B4513
    })
    const burner = new THREE.Mesh(burnerGeometry, burnerMaterial)
    burner.position.y = 0.75
    burner.receiveShadow = true
    burner.castShadow = true
    group.add(burner)

    // 香煙粒子
    const smokeGeometry = new THREE.SphereGeometry(0.1, 8, 8)
    const smokeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.3
    })

    for (let i = 0; i < 20; i++) {
      const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial)
      smoke.position.set(
        (Math.random() - 0.5) * 2,
        Math.random() * 3 + 2,
        (Math.random() - 0.5) * 2
      )
      smoke.scale.setScalar(Math.random() * 0.5 + 0.5)
      group.add(smoke)
    }

    return group
  }

  // 動畫效果
  useFrame((state) => {
    if (templeRef.current) {
      templeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
    
    if (incenseRef.current) {
      // 香煙飄動效果
      incenseRef.current.children.forEach((child, index) => {
        if (index > 0 && child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
          child.position.y += 0.01
          child.rotation.y += 0.02
          child.material.opacity = Math.max(0, child.material.opacity - 0.005)
          
          if (child.position.y > 5) {
            child.position.y = 2
            child.material.opacity = 0.3
          }
        }
      })
    }
  })

  const templeGeometry = createTempleGeometry()
  const incenseGeometry = createIncenseBurner()

  return (
    <group ref={templeRef}>
      <primitive object={templeGeometry} />
      <group ref={incenseRef} position={[0, 0, 2]}>
        <primitive object={incenseGeometry} />
      </group>
    </group>
  )
}
