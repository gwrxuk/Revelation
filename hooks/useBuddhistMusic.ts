'use client'

import { useState, useCallback, useRef } from 'react'

interface TaoistMusicResponse {
  audioDataUrl: string
  duration: number
  oracleText: string
  timestamp: string
  source?: string
  fallback?: boolean
}

export function useTaoistMusic() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentMusic, setCurrentMusic] = useState<string | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const generateMusic = useCallback(async (oracleText?: string, duration = 30): Promise<string> => {
    console.log('useTaoistMusic: Starting music generation for oracle:', oracleText)
    setIsGenerating(true)
    setError(null)

    try {
      console.log('useTaoistMusic: Making API request to /api/generate-buddhist-music')
      const response = await fetch('/api/generate-buddhist-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oracleText, duration }),
      })

      console.log('useBuddhistMusic: API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.log('useTaoistMusic: API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const data: TaoistMusicResponse = await response.json()
      console.log('useTaoistMusic: API response data:', data)
      console.log('useTaoistMusic: Returning audio URL:', data.audioDataUrl)

      setCurrentMusic(data.audioDataUrl)
      return data.audioDataUrl

    } catch (err) {
      console.error('useBuddhistMusic: Error generating music:', err)
      setError(err instanceof Error ? err.message : '生成佛教音樂時發生錯誤')
      
      // 回退到預設音樂
      const fallbackMusic = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAEAAABVAAQEBARUVFSkpKUVFRW1tbZGRkbGxsc3Nze3t7hISEjIyMlJSUm5ubpKSkrKystLS0vLy8xMTEzMzM1NTU3Nzc5OTk7Ozs9PT0////AAAAAAAAAAAAAExhdmM1OC4yNQAAAAAAAAAAAAAAACQAAAAEAAABVAB'
      console.log('useBuddhistMusic: Using fallback music')
      
      setCurrentMusic(fallbackMusic)
      return fallbackMusic

    } finally {
      setIsGenerating(false)
    }
  }, [])

  const playMusic = useCallback((audioUrl: string) => {
    console.log('useBuddhistMusic: Starting to play music:', audioUrl)
    
    try {
      // 停止當前播放的音樂
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // 創建新的音頻元素
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      
      audio.loop = false  // 不循環播放
      audio.volume = 0.6
      
      audio.addEventListener('loadstart', () => {
        console.log('useBuddhistMusic: Music loading started')
      })
      
      audio.addEventListener('canplay', () => {
        console.log('useBuddhistMusic: Music can play')
      })
      
      audio.addEventListener('play', () => {
        console.log('useBuddhistMusic: Music started playing')
        setIsPlaying(true)
      })
      
      audio.addEventListener('pause', () => {
        console.log('useBuddhistMusic: Music paused')
        setIsPlaying(false)
      })
      
      audio.addEventListener('ended', () => {
        console.log('useBuddhistMusic: Music ended')
        setIsPlaying(false)
        
        // 清除音樂源，防止循環播放
        audio.src = ''
        audio.load()
      })
      
      audio.addEventListener('error', (e) => {
        console.error('useBuddhistMusic: Music playback error:', e)
        setIsPlaying(false)
        setError('音樂播放失敗')
      })

      // 播放音樂
      audio.play().catch(err => {
        console.error('useBuddhistMusic: Failed to play music:', err)
        setError('無法播放音樂')
      })

    } catch (err) {
      console.error('useBuddhistMusic: Error setting up music playback:', err)
      setError('音樂播放設置失敗')
    }
  }, [])

  const stopMusic = useCallback(() => {
    console.log('useBuddhistMusic: Stopping music')
    
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ''
      audioRef.current.load()
      setIsPlaying(false)
    }
  }, [])

  const generateAndPlayMusic = useCallback(async (oracleText?: string, duration = 30) => {
    try {
      const audioUrl = await generateMusic(oracleText, duration)
      playMusic(audioUrl)
      return audioUrl
    } catch (err) {
      console.error('useBuddhistMusic: Error in generateAndPlayMusic:', err)
      setError('生成並播放音樂失敗')
    }
  }, [generateMusic, playMusic])

  return {
    generateMusic,
    playMusic,
    stopMusic,
    generateAndPlayMusic,
    currentMusic,
    isGenerating,
    isPlaying,
    error
  }
}
