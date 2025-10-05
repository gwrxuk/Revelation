'use client'

import React, { useState, useCallback, useEffect } from 'react'
import OracleBanner from './OracleBanner'
import { AudioPlayer } from './AudioPlayer'
import { useOracle } from '../hooks/useOracle'
import { useTempleImages } from '../hooks/useTempleImages'
import { useTaoistMusic } from '../hooks/useBuddhistMusic'

interface OracleManagerProps {
  isActive: boolean
  onOracleComplete?: () => void
  onImagesGenerated?: (images: { deity?: string, temple?: string }) => void
}

export default function OracleManager({ isActive, onOracleComplete, onImagesGenerated }: OracleManagerProps) {
  const [writtenText, setWrittenText] = useState('')
  const [showText, setShowText] = useState(false)
  const [isGeneratingOracle, setIsGeneratingOracle] = useState(false)
  const [musicEnded, setMusicEnded] = useState(false)
  
  const { generateOracle, isGenerating, error } = useOracle()
  const { generateBothImages, isGenerating: isGeneratingImages } = useTempleImages()
  const { 
    generateAndPlayMusic, 
    stopMusic, 
    currentMusic, 
    isPlaying: isMusicPlaying, 
    isGenerating: isGeneratingMusic,
    error: musicError 
  } = useTaoistMusic()

  const startOracleGeneration = useCallback(async () => {
    console.log('OracleManager: Starting oracle generation')
    setIsGeneratingOracle(true)
    setShowText(true)
    
    try {
      // 並行生成神諭、圖片和音樂
      console.log('OracleManager: Calling generateOracle, generateBothImages, and generateAndPlayMusic')
      const [oracleText, images] = await Promise.all([
        generateOracle('請賜予神諭指引'),
        generateBothImages()
      ])
      
      console.log('OracleManager: Received oracle text:', oracleText)
      console.log('OracleManager: Received images:', images)
      
      setWrittenText(oracleText)
      
      // 生成並播放佛教音樂（異步執行，不阻塞神諭顯示）
      console.log('OracleManager: Generating and playing Buddhist music')
      generateAndPlayMusic(oracleText, 30).catch(err => {
        console.error('OracleManager: Music generation failed:', err)
      })
      
      // 通知父組件圖片已生成
      if (onImagesGenerated) {
        console.log('OracleManager: Calling onImagesGenerated with:', images)
        onImagesGenerated(images)
      }
      
    } catch (err) {
      console.error('生成神諭或圖片失敗:', err)
      // 使用預設神諭
      const fallbackOracles = [
        '神靈降臨指引路\n智慧如光照眾生\n修行積德得福報\n慈悲為懷度有情',
        '鳳凰展翅降祥瑞\n乩筆書寫天機現\n誠心祈求必有應\n善念善行福自來',
        '道法自然順天意\n陰陽調和萬物生\n修身養性積功德\n神靈護佑保平安',
        '扶鸞降筆傳神意\n眾生求問得指引\n心存善念行正道\n神恩浩蕩澤萬民',
        '神靈顯聖在此時\n乩筆揮灑書天機\n誠心向道必有應\n福澤綿延世代傳'
      ]
      
      const randomOracle = fallbackOracles[Math.floor(Math.random() * fallbackOracles.length)]
      console.log('OracleManager: Using fallback oracle:', randomOracle)
      setWrittenText(randomOracle)
      
      // 嘗試生成備用圖片
      try {
        const fallbackImages = await generateBothImages(randomOracle)
        if (onImagesGenerated) {
          onImagesGenerated(fallbackImages)
        }
      } catch (imageErr) {
        console.error('生成備用圖片也失敗:', imageErr)
      }
      
    } finally {
      console.log('OracleManager: Oracle generation complete')
      setIsGeneratingOracle(false)
      // 不要立即調用 onOracleComplete，讓用戶有時間閱讀神諭
      // onOracleComplete?.()
    }
  }, [generateOracle, generateBothImages, generateAndPlayMusic, onOracleComplete, onImagesGenerated])

  const clearOracle = useCallback(() => {
    setShowText(false)
    setWrittenText('')
    setIsGeneratingOracle(false)
    setMusicEnded(false)
    // 不停止音樂播放，讓音樂播放到結束
    // stopMusic()
  }, [])

  // 當 isActive 變化時處理神諭生成
  useEffect(() => {
    if (isActive && !isGeneratingOracle && !showText) {
      // 延遲 2 秒後開始生成神諭
      const timer = setTimeout(() => {
        startOracleGeneration()
      }, 2000)
      
      return () => clearTimeout(timer)
    } else if (!isActive) {
      clearOracle()
    }
  }, [isActive, isGeneratingOracle, showText, startOracleGeneration, clearOracle])

  // 當神諭生成完成且顯示時，等待音樂播放結束
  useEffect(() => {
    if (showText && !isGeneratingOracle && writtenText && !isMusicPlaying && !isGeneratingMusic) {
      console.log('OracleManager: Music has ended, setting delayed close timer')
      const delayedCloseTimer = setTimeout(() => {
        console.log('OracleManager: Closing oracle after music ended + 3 seconds')
        clearOracle()
        onOracleComplete?.()
      }, 3000) // 音樂播放完畢後 3 秒關閉神諭
      
      return () => clearTimeout(delayedCloseTimer)
    }
  }, [showText, isGeneratingOracle, writtenText, isMusicPlaying, isGeneratingMusic, clearOracle, onOracleComplete])

  return (
    <>
      <OracleBanner 
        text={writtenText}
        isVisible={showText || isGeneratingOracle}
        isGenerating={isGeneratingOracle}
      />
      
      {/* 音頻播放器 - 只在有音樂時渲染 */}
      {currentMusic && (
        <AudioPlayer
          audioUrl={currentMusic}
          isPlaying={isMusicPlaying}
          volume={0.6}
          loop={false}
          onError={(error) => console.error('Music playback error:', error)}
        />
      )}
    </>
  )
}
