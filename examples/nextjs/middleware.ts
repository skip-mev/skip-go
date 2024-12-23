import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const path = params.path?.join('/') || ''
  const { searchParams } = new URL(request.url)

  const skipUrl = `https://go.skip.build/api/skip/${path}${searchParams.toString() ? '?' + searchParams.toString() : ''}`

  const response = await fetch(skipUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response
}

export async function POST(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const path = params.path?.join('/') || ''
  const { searchParams } = new URL(request.url)

  const skipUrl = `https://go.skip.build/api/skip/${path}${searchParams.toString() ? '?' + searchParams.toString() : ''}`

  const response = await fetch(skipUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(await request.json()),
  })

  return response
}

// Add other methods (PUT, DELETE, etc.) as needed