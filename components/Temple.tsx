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

    // 廟宇主體 - 更大的紅色建築
    const templeBase = new THREE.BoxGeometry(12, 4, 8)
    const templeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B0000,
      shininess: 30,
      transparent: true,
      opacity: 0.95
    })
    const templeMesh = new THREE.Mesh(templeBase, templeMaterial)
    templeMesh.position.y = 2
    templeMesh.receiveShadow = true
    templeMesh.castShadow = true
    group.add(templeMesh)

    // 廟宇屋頂 - 多層金色瓦片
    const roofGeometry = new THREE.ConeGeometry(8, 3, 8)
    const roofMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFD700,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    })
    const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial)
    roofMesh.position.y = 5.5
    roofMesh.rotation.y = Math.PI / 8
    roofMesh.receiveShadow = true
    roofMesh.castShadow = true
    group.add(roofMesh)

    // 屋頂裝飾 - 龍頭
    const dragonGeometry = new THREE.ConeGeometry(0.5, 1, 6)
    const dragonMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFF4500,
      shininess: 50
    })
    const dragon = new THREE.Mesh(dragonGeometry, dragonMaterial)
    dragon.position.y = 7.5
    dragon.rotation.z = Math.PI
    group.add(dragon)

    // 廟宇柱子 - 更多柱子
    const pillarGeometry = new THREE.CylinderGeometry(0.4, 0.5, 5, 12)
    const pillarMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      shininess: 50
    })
    
    const pillarPositions = [
      [-4, 2.5, -3], [0, 2.5, -3], [4, 2.5, -3],
      [-4, 2.5, 3], [0, 2.5, 3], [4, 2.5, 3]
    ]
    
    pillarPositions.forEach(([x, y, z]) => {
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
      pillar.position.set(x, y, z)
      pillar.receiveShadow = true
      pillar.castShadow = true
      group.add(pillar)
    })

    // 廟宇階梯 - 更寬的階梯
    const stepGeometry = new THREE.BoxGeometry(14, 0.3, 3)
    const stepMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x696969,
      shininess: 30
    })
    
    for (let i = 0; i < 7; i++) {
      const step = new THREE.Mesh(stepGeometry, stepMaterial)
      step.position.set(0, i * 0.3, -4 - i * 0.3)
      step.receiveShadow = true
      step.castShadow = true
      group.add(step)
    }

    // 廟宇大門
    const doorGeometry = new THREE.BoxGeometry(2, 3, 0.2)
    const doorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x654321,
      shininess: 80
    })
    const door = new THREE.Mesh(doorGeometry, doorMaterial)
    door.position.set(0, 1, 4.1)
    door.receiveShadow = true
    door.castShadow = true
    group.add(door)

    // 廟宇窗戶
    const windowGeometry = new THREE.BoxGeometry(1.5, 2, 0.1)
    const windowMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      shininess: 60
    })
    
    const windowPositions = [
      [-3, 2, 4.05], [3, 2, 4.05]
    ]
    
    windowPositions.forEach(([x, y, z]) => {
      const window = new THREE.Mesh(windowGeometry, windowMaterial)
      window.position.set(x, y, z)
      group.add(window)
    })

    // 廟宇裝飾 - 橫樑
    const beamGeometry = new THREE.BoxGeometry(12, 0.3, 0.3)
    const beamMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFD700,
      shininess: 100
    })
    
    for (let i = 0; i < 3; i++) {
      const beam = new THREE.Mesh(beamGeometry, beamMaterial)
      beam.position.set(0, 3.5 + i * 0.5, 0)
      group.add(beam)
    }

    // 廟宇基座
    const baseGeometry = new THREE.BoxGeometry(14, 0.5, 10)
    const baseMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,
      shininess: 40
    })
    const base = new THREE.Mesh(baseGeometry, baseMaterial)
    base.position.y = -0.25
    base.receiveShadow = true
    group.add(base)

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
