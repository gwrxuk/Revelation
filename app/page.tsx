'use client'

import { Suspense, useState } from 'react'
import TempleScene from '@/components/TempleScene'
import LoadingScreen from '@/components/LoadingScreen'
import UIOverlay from '@/components/UIOverlay'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  return (
    <main>
      {/* 載入畫面 */}
      {!isLoaded && (
        <LoadingScreen onLoaded={() => setIsLoaded(true)} />
      )}

      {/* 主要 3D 場景 */}
      {isLoaded && (
        <Suspense fallback={<LoadingScreen onLoaded={() => {}} />}>
          <TempleScene />
        </Suspense>
      )}

      {/* UI 覆蓋層 */}
      {isLoaded && (
        <UIOverlay 
          showInstructions={showInstructions}
          onToggleInstructions={() => setShowInstructions(!showInstructions)}
        />
      )}
    </main>
  )
}
