import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only handle requests to /api/skip/*
  if (!request.nextUrl.pathname.startsWith('/api/skip/')) {
    return NextResponse.next()
  }

  // Transform the request URL from /api/skip/* to go.skip.build/api/skip/*
  const skipUrl = new URL(request.nextUrl.pathname.replace('/api/skip/', '/api/skip/'), 'https://go.skip.build')
  skipUrl.search = request.nextUrl.search // Preserve query parameters

  // Forward the request to Skip API
  return NextResponse.rewrite(skipUrl, {
    request: {
      // Forward headers
      headers: new Headers({
        'Content-Type': 'application/json',
        // Add any other required headers
      })
    }
  })
}

export const config = {
  matcher: '/api/skip/:path*',  // Only match /api/skip routes
}