import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY
  const hasApiKey = !!apiKey
  const apiKeyLength = apiKey ? apiKey.length : 0

  return NextResponse.json({
    hasApiKey: hasApiKey,
    apiKeyLength: apiKeyLength,
    message: hasApiKey ? 'OpenAI API Key is configured for DALL-E.' : 'OpenAI API Key is NOT configured.',
    testUrl: 'http://localhost:3000/api/generate-temple-images'
  })
}
