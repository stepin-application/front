import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/register')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = request.cookies.get('stepin_role')?.value;

  const requireRole = (required: string) => {
    if (!role) return NextResponse.redirect(new URL('/login', request.url));
    if (role !== required) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  };

  if (pathname.startsWith('/admin')) {
    return requireRole('platform_admin');
  }
  if (pathname.startsWith('/students')) {
    return requireRole('student');
  }
  if (pathname.startsWith('/campaigns/school')) {
    return requireRole('school');
  }
  if (pathname.startsWith('/campaigns/company')) {
    return requireRole('company');
  }
  if (pathname.includes('/participants')) {
    return requireRole('school');
  }
  if (pathname.includes('/apply')) {
    return requireRole('student');
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/register/:path*',
    '/admin/:path*',
    '/students/:path*',
    '/campaigns/school/:path*',
    '/campaigns/company/:path*',
    '/campaigns/:path*/participants/:path*',
    '/campaigns/:path*/apply/:path*',
  ],
};
