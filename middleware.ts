import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Content Security Policy headers
  // Configured to allow Farcaster/Warpcast embedding and all required services
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.walletconnect.com https://*.walletconnect.org https://explorer-api.walletconnect.com https://*.reown.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: w3.org/svg/2000",
    "connect-src 'self' https://*.walletconnect.com https://*.walletconnect.org https://explorer-api.walletconnect.com https://*.reown.com https://*.rpc.privy.systems https://*.farcaster.xyz https://*.warpcast.com https://*.wrpcd.net https://auth.privy.io https://*.privy.io wss://*.walletconnect.com wss://*.walletconnect.org https://*.vercel.app",
    "frame-src 'self' https://*.walletconnect.com https://*.walletconnect.org https://*.reown.com https://*.farcaster.xyz https://*.warpcast.com https://warpcast.com https://*.ngrok-free.app https://*.ngrok.io https://*.vercel.app",
    "frame-ancestors 'self' https://*.farcaster.xyz https://farcaster.xyz https://*.warpcast.com https://warpcast.com https://*.ngrok-free.app https://*.ngrok.io",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', cspHeader)
  
  // Explicitly remove X-Frame-Options to allow Farcaster embedding
  // Next.js might set this by default, so we need to remove it
  response.headers.delete('X-Frame-Options')
  
  // Add other security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}


