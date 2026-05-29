import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Detect Supabase auth session cookie (works with both old and new key formats)
  const cookies = request.cookies.getAll()
  const hasSession = cookies.some(
    (c) =>
      c.name.includes('auth-token') ||
      c.name.startsWith('sb-') ||
      c.name === 'supabase-auth-token'
  )

  // Redirect unauthenticated users away from dashboard
  if (pathname.startsWith('/dashboard') && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/login' || pathname === '/register') && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
