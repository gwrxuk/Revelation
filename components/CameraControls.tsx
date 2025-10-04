'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function CameraControls() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const moveSpeed = 0.1
  const rotateSpeed = 0.02
  const mouseSensitivity = 0.002

  const { camera, gl } = useThree()

  useEffect(() => {
    const canvas = gl.domElement
    let isMouseDown = false
    let mouseX = 0
    let mouseY = 0

    // 滑鼠按下事件
    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown = true
      mouseX = event.clientX
      mouseY = event.clientY
    }

    // 滑鼠移動事件
    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return

      const deltaX = event.clientX - mouseX
      const deltaY = event.clientY - mouseY

      // 水平旋轉
      camera.rotation.y -= deltaX * mouseSensitivity
      
      // 垂直旋轉（限制角度）
      camera.rotation.x -= deltaY * mouseSensitivity
      camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x))

      mouseX = event.clientX
      mouseY = event.clientY
    }

    // 滑鼠放開事件
    const handleMouseUp = () => {
      isMouseDown = false
    }

    // 鍵盤事件
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = new THREE.Vector3()
      
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          // 前進
          direction.set(0, 0, -moveSpeed)
          break
        case 'KeyS':
        case 'ArrowDown':
          // 後退
          direction.set(0, 0, moveSpeed)
          break
        case 'KeyA':
        case 'ArrowLeft':
          // 左移
          direction.set(-moveSpeed, 0, 0)
          break
        case 'KeyD':
        case 'ArrowRight':
          // 右移
          direction.set(moveSpeed, 0, 0)
          break
        case 'KeyQ':
        case 'Space':
          // 上升
          direction.set(0, moveSpeed, 0)
          break
        case 'KeyE':
        case 'ShiftLeft':
          // 下降
          direction.set(0, -moveSpeed, 0)
          break
        default:
          return
      }

      // 應用相機的旋轉到移動方向
      direction.applyQuaternion(camera.quaternion)
      camera.position.add(direction)
    }

    // 滑鼠滾輪縮放
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const scale = event.deltaY > 0 ? 1.1 : 0.9
      const direction = new THREE.Vector3(0, 0, 1)
      direction.applyQuaternion(camera.quaternion)
      direction.multiplyScalar(scale - 1)
      camera.position.add(direction)
    }

    // 添加事件監聽器
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('wheel', handleWheel)
    window.addEventListener('keydown', handleKeyDown)

    // 清理事件監聽器
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [camera, gl])

  // 限制相機位置範圍
  useFrame(() => {
    // 限制 Y 軸高度
    camera.position.y = Math.max(0.5, Math.min(10, camera.position.y))
    
    // 限制 X 和 Z 軸範圍
    camera.position.x = Math.max(-20, Math.min(20, camera.position.x))
    camera.position.z = Math.max(-20, Math.min(20, camera.position.z))
  })

  return null // 這個組件不需要渲染任何內容
}
