'use client'

import { useState, useCallback } from 'react'

interface TempleImageResponse {
  imageUrl: string
  type: string
  timestamp: string
  source?: string
  fallback?: boolean
}

export function useTempleImages() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<{ deity?: string, temple?: string }>({})

  const generateImage = useCallback(async (type: 'deity' | 'temple', oracleText?: string): Promise<string> => {
    console.log('useTempleImages: Starting image generation for type:', type)
    setIsGenerating(true)
    setError(null)

    try {
      console.log('useTempleImages: Making API request to /api/generate-temple-images')
      const response = await fetch('/api/generate-temple-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, oracleText }),
      })

      console.log('useTempleImages: API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.log('useTempleImages: API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data: TempleImageResponse = await response.json()
      console.log('useTempleImages: API response data:', data)
      
      // 將 DALL-E URL 轉換為代理 URL
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(data.imageUrl)}`
      console.log('useTempleImages: Returning proxy URL:', proxyUrl)

      // 更新圖片狀態
      setImages(prev => ({
        ...prev,
        [type]: proxyUrl
      }))

      return proxyUrl

    } catch (err) {
      console.error('useTempleImages: Error generating image:', err)
      setError(err instanceof Error ? err.message : '生成圖片時發生錯誤')
      
      // 回退到預設圖片 - 使用不需要代理的公開圖片
      const fallbackImages = {
        deity: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1024&h=1024&fit=crop&crop=center',
        temple: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1024&h=1024&fit=crop&crop=center'
      }
      
      const fallbackUrl = fallbackImages[type]
      console.log('useTempleImages: Using fallback image:', fallbackUrl)
      
      // 對於 Unsplash 圖片，直接使用 URL（通常不需要代理）
      // 更新圖片狀態
      setImages(prev => ({
        ...prev,
        [type]: fallbackUrl
      }))
      
      return fallbackUrl

    } finally {
      setIsGenerating(false)
    }
  }, [])

  const generateBothImages = useCallback(async (oracleText?: string): Promise<{ deity: string, temple: string }> => {
    console.log('useTempleImages: Generating both images')
    
    const [deityUrl, templeUrl] = await Promise.all([
      generateImage('deity', oracleText),
      generateImage('temple', oracleText)
    ])

    return { deity: deityUrl, temple: templeUrl }
  }, [generateImage])

  return {
    generateImage,
    generateBothImages,
    images,
    isGenerating,
    error
  }
}
