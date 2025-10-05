import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { oracleText, duration = 30 } = await request.json()
  
  try {
    
    console.log('=== Buddhist Music API Debug ===')
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY)
    console.log('Oracle text:', oracleText)
    console.log('Duration:', duration)
    
    if (!process.env.OPENAI_API_KEY) {
      console.log('ERROR: No API key found')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // 根據神諭內容生成音樂提示詞
    const musicPrompt = `Generate a peaceful Buddhist meditation music that matches the spiritual oracle message: "${oracleText}". 
    
    The music should be:
    - Calm and meditative
    - Traditional Buddhist style with chanting elements
    - Suitable for temple ceremonies
    - Harmonious and uplifting
    - Duration: ${duration} seconds
    - Include traditional instruments like singing bowls, bells, and gentle chanting
    - Create a sacred atmosphere that complements the oracle message`

    const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: `Buddhist meditation chant: Om mani padme hum, Om mani padme hum, Om mani padme hum. ${oracleText}. Om mani padme hum, Om mani padme hum, Om mani padme hum.`,
        voice: 'alloy',
        response_format: 'mp3',
        speed: 0.8
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.log('OpenAI TTS API Error:', openaiResponse.status, errorText)
      throw new Error(`OpenAI TTS API error: ${openaiResponse.status} - ${errorText}`)
    }

    // 將音頻轉換為 base64
    const audioBuffer = await openaiResponse.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    const audioDataUrl = `data:audio/mp3;base64,${base64Audio}`

    console.log('Buddhist music generated successfully')

    return NextResponse.json({ 
      audioDataUrl,
      duration,
      oracleText,
      timestamp: new Date().toISOString(),
      source: 'openai-tts'
    })

  } catch (error) {
    console.error('Error generating Buddhist music:', error)
    
    // 回退到預設的佛教音樂 URL（可以是公開的佛教音樂）
    const fallbackMusicUrls = [
      'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
      'https://www.soundjay.com/misc/sounds/bell-ringing-02.wav'
    ]
    
    const randomMusicUrl = fallbackMusicUrls[Math.floor(Math.random() * fallbackMusicUrls.length)]
    
    return NextResponse.json({ 
      audioDataUrl: randomMusicUrl,
      duration: 30,
      oracleText: oracleText || 'Default Buddhist meditation',
      timestamp: new Date().toISOString(),
      fallback: true
    })
  }
}
