'use client'

import React, { useState, useCallback, useEffect } from 'react'
import OracleBanner from './OracleBanner'
import { useOracle } from '../hooks/useOracle'

interface OracleManagerProps {
  isActive: boolean
  onOracleComplete?: () => void
}

export default function OracleManager({ isActive, onOracleComplete }: OracleManagerProps) {
  const [writtenText, setWrittenText] = useState('')
  const [showText, setShowText] = useState(false)
  const [isGeneratingOracle, setIsGeneratingOracle] = useState(false)
  
  const { generateOracle, isGenerating, error } = useOracle()

  const startOracleGeneration = useCallback(async () => {
    console.log('OracleManager: Starting oracle generation')
    setIsGeneratingOracle(true)
    setShowText(true)
    
    try {
      // 生成 AI 神諭
      console.log('OracleManager: Calling generateOracle')
      const oracleText = await generateOracle('請賜予神諭指引')
      console.log('OracleManager: Received oracle text:', oracleText)
      setWrittenText(oracleText)
    } catch (err) {
      console.error('生成神諭失敗:', err)
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
    } finally {
      console.log('OracleManager: Oracle generation complete')
      setIsGeneratingOracle(false)
      onOracleComplete?.()
    }
  }, [generateOracle, onOracleComplete])

  const clearOracle = useCallback(() => {
    setShowText(false)
    setWrittenText('')
    setIsGeneratingOracle(false)
  }, [])

  // 當 isActive 變化時處理神諭生成
  useEffect(() => {
    if (isActive) {
      // 延遲 2 秒後開始生成神諭
      const timer = setTimeout(() => {
        startOracleGeneration()
      }, 2000)
      
      return () => clearTimeout(timer)
    } else {
      clearOracle()
    }
  }, [isActive, startOracleGeneration, clearOracle])

  return (
    <OracleBanner 
      text={writtenText}
      isVisible={showText || isGeneratingOracle}
      isGenerating={isGeneratingOracle}
    />
  )
}
