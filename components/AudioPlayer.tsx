'use client'

import { useEffect, useRef } from 'react'

interface AudioPlayerProps {
  audioUrl?: string | null
  isPlaying: boolean
  volume?: number
  loop?: boolean
  onPlayStart?: () => void
  onPlayEnd?: () => void
  onError?: (error: string) => void
}

export function AudioPlayer({ 
  audioUrl, 
  isPlaying, 
  volume = 0.6, 
  loop = true,
  onPlayStart,
  onPlayEnd,
  onError 
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioUrl) return

    // 清理之前的音頻元素
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current.load()
    }

    // 創建新的音頻元素
    const audio = new Audio(audioUrl)
    audioRef.current = audio
    
    // 設置音頻屬性
    audio.volume = volume
    audio.loop = loop
    
    // 事件監聽器
    const handlePlay = () => {
      console.log('AudioPlayer: Music started playing')
      onPlayStart?.()
    }
    
    const handlePause = () => {
      console.log('AudioPlayer: Music paused')
    }
    
    const handleEnded = () => {
      console.log('AudioPlayer: Music ended')
      onPlayEnd?.()
      
      // 清除音頻源，防止循環播放
      if (audioRef.current) {
        audioRef.current.src = ''
        audioRef.current.load()
      }
    }
    
    const handleError = (e: Event) => {
      console.error('AudioPlayer: Music playback error:', e)
      onError?.('音樂播放失敗')
    }
    
    const handleLoadStart = () => {
      console.log('AudioPlayer: Music loading started')
    }
    
    const handleCanPlay = () => {
      console.log('AudioPlayer: Music can play')
    }

    // 添加事件監聽器
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      // 清理事件監聽器
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
      
      // 停止並清理音頻
      audio.pause()
      audio.currentTime = 0
    }
  }, [audioUrl, volume, loop, onPlayStart, onPlayEnd, onError])

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      console.log('AudioPlayer: Starting playback')
      audioRef.current.play().catch(err => {
        console.error('AudioPlayer: Failed to play:', err)
        onError?.('無法播放音樂')
      })
    } else {
      console.log('AudioPlayer: Stopping playback')
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [isPlaying, onError])

  // 清理函數
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        console.log('AudioPlayer: Cleaning up audio on unmount')
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = ''
        audioRef.current.load()
      }
    }
  }, [])

  // 這個組件不渲染任何可見元素，只處理音頻播放
  return null
}
