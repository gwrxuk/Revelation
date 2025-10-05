'use client'

import { useEffect, useState } from 'react'

interface OracleBannerProps {
  text: string
  isVisible: boolean
  isGenerating?: boolean
}

export default function OracleBanner({ text, isVisible, isGenerating = false }: OracleBannerProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const lines = text.split('\n')

  // 調試日誌
  console.log('OracleBanner Debug:', { text, isVisible, isGenerating, displayText, currentLineIndex })
  console.log('OracleBanner displayText lines:', displayText.split('\n'))
  console.log('OracleBanner text length:', text?.length || 0)
  console.log('OracleBanner displayText length:', displayText?.length || 0)

  useEffect(() => {
    console.log('OracleBanner useEffect triggered:', { isVisible, isGenerating, text })
    
    if (!isVisible) {
      setDisplayText('')
      setCurrentLineIndex(0)
      return
    }

    if (isGenerating) {
      setDisplayText(text)
      return
    }

    // 簡化：直接顯示文字，稍後再添加動畫
    if (text) {
      console.log('OracleBanner: Setting display text to:', text)
      setDisplayText(text)
    }

    // TODO: 稍後添加逐行動畫
    // 重置動畫狀態
    setCurrentLineIndex(lines.length)

  }, [isVisible, isGenerating, text])

  console.log('OracleBanner render check:', { isVisible, displayText })

  if (!isVisible) return null

  return (
    <div className="oracle-banner">
      <div className="oracle-container">
        {/* 神聖背景 */}
        <div className="oracle-background" />
        
        {/* 神諭內容 */}
        <div className="oracle-content">
          <div className="oracle-title">
            <span className="oracle-icon">🕊️</span>
            神靈降諭
            <span className="oracle-icon">🕊️</span>
          </div>
          
          <div className="oracle-text">
            {displayText ? (
              displayText.split('\n').map((line, index) => (
                <div 
                  key={index} 
                  className={`oracle-line ${isGenerating ? 'generating' : ''}`}
                  style={{ 
                    animationDelay: `${index * 0.3}s`
                  }}
                >
                  {line}
                </div>
              ))
            ) : (
              <div className="oracle-line">神諭準備中...</div>
            )}
          </div>
          
          {/* 生成指示器 */}
          {isGenerating && (
            <div className="generating-indicator">
              <div className="spinner" />
              <span>神靈書寫中...</span>
            </div>
          )}
        </div>

        {/* 裝飾邊框 */}
        <div className="oracle-border" />
      </div>

      <style jsx>{`
        .oracle-banner {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          pointer-events: none;
          max-width: 90vw;
          max-height: 80vh;
        }

        .oracle-container {
          position: relative;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(26, 26, 46, 0.95) 100%);
          border: 3px solid #FFD700;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 
            0 0 30px rgba(255, 215, 0, 0.5),
            inset 0 0 30px rgba(255, 215, 0, 0.1);
          backdrop-filter: blur(10px);
          min-width: 400px;
          max-width: 600px;
        }

        .oracle-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
          border-radius: 17px;
          pointer-events: none;
        }

        .oracle-content {
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .oracle-title {
          font-size: 1.8rem;
          color: #FFD700;
          font-weight: bold;
          margin-bottom: 20px;
          text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .oracle-icon {
          font-size: 1.5rem;
          animation: float 2s ease-in-out infinite;
        }

        .oracle-text {
          font-size: 1.3rem;
          color: #fff;
          line-height: 2;
          margin-bottom: 20px;
        }

        .oracle-line {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
          margin-bottom: 8px;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .oracle-line.generating {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .generating-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #FFD700;
          font-size: 1rem;
          margin-top: 15px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 215, 0, 0.3);
          border-top: 2px solid #FFD700;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .oracle-border {
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 23px;
          pointer-events: none;
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes glow {
          from { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          to { box-shadow: 0 0 40px rgba(255, 215, 0, 0.6); }
        }

        @media (max-width: 768px) {
          .oracle-container {
            min-width: 320px;
            padding: 20px;
          }
          
          .oracle-title {
            font-size: 1.4rem;
          }
          
          .oracle-text {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  )
}
