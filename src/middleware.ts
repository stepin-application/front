import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  // Protection uniquement de la route d'inscription entreprise
  if (request.nextUrl.pathname === '/register/company') {
    const token = request.cookies.get('company_access_token');

    // Si pas de token, on laisse passer (le composant AccessCodeVerification s'en occupera)
    if (!token) {
      return NextResponse.next();
    }

    try {
      const payload = await verifyToken(token.value);
      if (!payload) {
        throw new Error('Invalid token');
      }
      return NextResponse.next();
    } catch (error) {
      // Token invalide ou expiré, on supprime le cookie
      const response = NextResponse.redirect(new URL('/register', request.url));
      response.cookies.delete('company_access_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/register/company',
}; 