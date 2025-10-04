'use client'

import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onLoaded: () => void
}

export default function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('正在載入神聖空間...')

  useEffect(() => {
    const loadingMessages = [
      '正在載入神聖空間...',
      '鳳凰降臨中...',
      '乩筆準備就緒...',
      '神靈即將降臨...',
      '扶鸞儀式準備完成'
    ]

    let currentMessageIndex = 0
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            onLoaded()
          }, 500)
          return 100
        }

        // 更新載入文字
        if (newProgress > (currentMessageIndex + 1) * 20) {
          currentMessageIndex = Math.min(currentMessageIndex + 1, loadingMessages.length - 1)
          setLoadingText(loadingMessages[currentMessageIndex])
        }

        return newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }, [onLoaded])

  return (
    <div className="loading-screen">
      {/* 神聖符號動畫 */}
      <div style={{
        fontSize: '4rem',
        color: '#FFD700',
        textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
        animation: 'spin 3s linear infinite',
        marginBottom: '20px'
      }}>
        卍
      </div>

      {/* 載入文字 */}
      <div className="loading-text">
        {loadingText}
      </div>

      {/* 進度條 */}
      <div style={{
        width: '300px',
        height: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '2px',
        marginTop: '20px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#FFD700',
          borderRadius: '2px',
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* 進度百分比 */}
      <div style={{
        marginTop: '10px',
        fontSize: '1rem',
        color: '#FFD700',
        textShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
      }}>
        {Math.round(progress)}%
      </div>

      {/* 神聖粒子背景 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1
      }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              backgroundColor: '#FFD700',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
