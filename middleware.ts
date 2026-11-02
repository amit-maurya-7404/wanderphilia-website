// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const cookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const auth = await verifyAdminSessionToken(cookie);

    if (isLoginPage) {
      // If already logged in and visiting /admin/login, redirect to /admin
      if (auth.valid) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return NextResponse.next();
    }

    // For all other /admin routes, require valid authentication
    if (!auth.valid) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};

