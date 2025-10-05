import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { type, oracleText } = await request.json()
  
  console.log('=== DALL-E API Debug ===')
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY)
  console.log('Type:', type)
  console.log('Oracle text:', oracleText)
  
  // 驗證 type 參數
  if (!type || !['deity', 'temple'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type parameter. Must be "deity" or "temple"' }, { status: 400 })
  }
  
  try {
    
    if (!process.env.OPENAI_API_KEY) {
      console.log('ERROR: No API key found')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // 根據類型生成不同的提示詞
    let prompt = ''
    if (type === 'deity') {
      prompt = `Traditional Chinese Taoist deity statue in a temple setting, majestic and divine, golden colors, intricate details, traditional Chinese art style, high quality, photorealistic, temple lighting, sacred atmosphere`
    } else if (type === 'temple') {
      prompt = `Traditional Chinese Taoist temple architecture, red and gold colors, traditional Chinese roof with upturned eaves, stone pillars, incense burners, sacred atmosphere, detailed architecture, high quality, photorealistic`
    } else {
      prompt = `Traditional Chinese Taoist temple scene, combining deity statues and temple architecture, red and gold colors, sacred atmosphere, traditional Chinese art style, high quality, photorealistic`
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.log('DALL-E API Error:', openaiResponse.status, errorText)
      throw new Error(`DALL-E API error: ${openaiResponse.status} - ${errorText}`)
    }

    const data = await openaiResponse.json()
    console.log('DALL-E Response:', JSON.stringify(data, null, 2))
    
    const imageUrl = data.data[0]?.url
    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E')
    }

    return NextResponse.json({ 
      imageUrl,
      type,
      timestamp: new Date().toISOString(),
      source: 'dalle'
    })

  } catch (error) {
    console.error('Error generating temple images:', error)
    
    // 回退到預設圖片 URL（可以是公開的廟宇圖片）
    const fallbackImages = {
      deity: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1024&h=1024&fit=crop&crop=center',
      temple: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1024&h=1024&fit=crop&crop=center'
    }
    
    const fallbackType = type || 'temple'
    
    return NextResponse.json({ 
      imageUrl: fallbackImages[fallbackType as keyof typeof fallbackImages],
      type: fallbackType,
      timestamp: new Date().toISOString(),
      fallback: true
    })
  }
}
