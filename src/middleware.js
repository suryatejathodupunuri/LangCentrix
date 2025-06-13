import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'
import CONFIG from '../config.js'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Check if user is trying to access protected routes
    const isProtectedRoute = CONFIG.PROTECTED_ROUTES.some(route =>
      pathname.startsWith(route)
    )

    // If accessing protected route without proper authentication
    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // If user is authenticated and trying to access login/signup
    if ((pathname === '/login' || pathname === '/signup') && token) {
      return NextResponse.redirect(new URL(CONFIG.AUTH.LOGIN_REDIRECT, req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to public routes
        const isPublicRoute = CONFIG.PUBLIC_ROUTES.includes(pathname) ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon.ico')
        
        if (isPublicRoute) return true
        
        // For protected routes, require token
        const isProtectedRoute = CONFIG.PROTECTED_ROUTES.some(route =>
          pathname.startsWith(route)
        )
        
        if (isProtectedRoute) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}