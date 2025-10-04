'use client'

import { useState, useCallback } from 'react'

interface OracleResponse {
  oracle: string
  timestamp: string
  fallback?: boolean
}

export function useOracle() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateOracle = useCallback(async (prompt?: string): Promise<string> => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-oracle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: OracleResponse = await response.json()
      return data.oracle

    } catch (err) {
      console.error('Error generating oracle:', err)
      setError(err instanceof Error ? err.message : '生成神諭時發生錯誤')
      
      // 回退到預設神諭
      const fallbackOracles = [
        '神靈降臨指引路\n智慧如光照眾生\n修行積德得福報\n慈悲為懷度有情',
        '鳳凰展翅降祥瑞\n乩筆書寫天機現\n誠心祈求必有應\n善念善行福自來',
        '道法自然順天意\n陰陽調和萬物生\n修身養性積功德\n神靈護佑保平安',
        '扶鸞降筆傳神意\n眾生求問得指引\n心存善念行正道\n神恩浩蕩澤萬民',
        '神靈顯聖在此時\n乩筆揮灑書天機\n誠心向道必有應\n福澤綿延世代傳'
      ]
      
      const randomOracle = fallbackOracles[Math.floor(Math.random() * fallbackOracles.length)]
      return randomOracle

    } finally {
      setIsGenerating(false)
    }
  }, [])

  return {
    generateOracle,
    isGenerating,
    error
  }
}
