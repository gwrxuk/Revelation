import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `你是台灣道教廟宇的神靈，專門透過扶鸞儀式傳達神諭。請以傳統道教的神聖語言和智慧，為信眾提供指引。

要求：
1. 使用繁體中文
2. 保持神聖莊嚴的語調
3. 內容要有深度和智慧
4. 格式為四句詩詞，每句7個字
5. 包含道教哲理和人生指引
6. 語言優美，富有詩意

範例格式：
神靈降臨指引路
智慧如光照眾生
修行積德得福報
慈悲為懷度有情`
          },
          {
            role: 'user',
            content: prompt || '請賜予神諭指引'
          }
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const data = await openaiResponse.json()
    const oracleText = data.choices[0]?.message?.content || '神靈降臨\n指引眾生\n福澤萬民\n功德無量'

    return NextResponse.json({ 
      oracle: oracleText,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating oracle:', error)
    
    // 回退到預設神諭
    const fallbackOracles = [
      '神靈降臨指引路\n智慧如光照眾生\n修行積德得福報\n慈悲為懷度有情',
      '鳳凰展翅降祥瑞\n乩筆書寫天機現\n誠心祈求必有應\n善念善行福自來',
      '道法自然順天意\n陰陽調和萬物生\n修身養性積功德\n神靈護佑保平安',
      '扶鸞降筆傳神意\n眾生求問得指引\n心存善念行正道\n神恩浩蕩澤萬民',
      '神靈顯聖在此時\n乩筆揮灑書天機\n誠心向道必有應\n福澤綿延世代傳'
    ]
    
    const randomOracle = fallbackOracles[Math.floor(Math.random() * fallbackOracles.length)]
    
    return NextResponse.json({ 
      oracle: randomOracle,
      timestamp: new Date().toISOString(),
      fallback: true
    })
  }
}
