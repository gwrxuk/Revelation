'use client'

import { useState } from 'react'

interface UIOverlayProps {
  showInstructions: boolean
  onToggleInstructions: () => void
}

export default function UIOverlay({ showInstructions, onToggleInstructions }: UIOverlayProps) {
  const [isMuted, setIsMuted] = useState(false)

  return (
    <div className="ui-overlay">
      {/* 標題 */}
      <div className="title-overlay">
        <h1 className="main-title">台灣道教廟宇元宇宙</h1>
        <p className="subtitle">扶鸞儀式 - 鳳凰乩筆的神聖力量</p>
      </div>

      {/* 控制按鈕 */}
      <div className="ui-element" style={{ top: '20px', right: '20px' }}>
        <button
          onClick={onToggleInstructions}
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid #FFD700',
            borderRadius: '8px',
            color: '#FFD700',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {showInstructions ? '隱藏說明' : '顯示說明'}
        </button>
      </div>

      {/* 音效控制 */}
      <div className="ui-element" style={{ top: '80px', right: '20px' }}>
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid #FFD700',
            borderRadius: '50%',
            color: '#FFD700',
            padding: '10px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* 說明面板 */}
      {showInstructions && (
        <div className="instruction-panel">
          <h3 className="instruction-title">扶鸞儀式說明</h3>
          <div className="instruction-text">
            <p><strong>扶鸞</strong>，字面意為「扶持鳳凰」，是台灣傳統道教的重要儀式。</p>
            <p>鳳凰象徵神靈，透過乩筆書寫神諭，指引眾生。</p>
            <br />
            <p><strong>操作方式：</strong></p>
            <p>• 點擊供桌開始扶鸞儀式</p>
            <p>• 觀察鳳凰乩筆的神聖力量</p>
            <p>• 感受神靈降臨的神聖文字</p>
            <br />
            <p><strong>文化意義：</strong></p>
            <p>扶鸞是台灣道教文化的重要組成部分，</p>
            <p>體現了人神溝通的傳統智慧與精神信仰。</p>
          </div>
        </div>
      )}

      {/* 文化資訊 */}
      <div className="ui-element" style={{ bottom: '20px', left: '20px' }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.7)',
          border: '1px solid #FFD700',
          borderRadius: '8px',
          padding: '15px',
          color: '#fff',
          fontSize: '0.9rem',
          maxWidth: '300px',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ color: '#FFD700', marginBottom: '10px' }}>文化背景</h4>
          <p>扶鸞儀式源自中國古代，在台灣發展出獨特的在地特色。</p>
          <p>乩筆被視為鳳凰羽毛，是神靈與人間溝通的橋樑。</p>
        </div>
      </div>

      {/* 互動提示 */}
      <div className="ui-element" style={{ bottom: '20px', right: '20px' }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.7)',
          border: '1px solid #FFD700',
          borderRadius: '8px',
          padding: '15px',
          color: '#fff',
          fontSize: '0.9rem',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ color: '#FFD700', marginBottom: '10px' }}>互動提示</h4>
          <p>🖱️ 點擊供桌開始儀式</p>
          <p>👁️ 觀察鳳凰乩筆的動畫</p>
          <p>📖 閱讀神靈降臨的文字</p>
        </div>
      </div>
    </div>
  )
}
