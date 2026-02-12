import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 1. Rutas protegidas (El admin)
  const protectedPaths = ['/orders', '/inventory', '/products', '/customers', '/dashboard'];
  const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) || req.nextUrl.pathname === '/';

  // 2. Buscamos la cookie VIP
  const cookie = req.cookies.get('bloomly_session');

  // CASO A: Intenta entrar a zona protegida SIN cookie
  if (isProtected && !cookie) {
    // Lo mandamos a la página de login bonita
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // CASO B: Ya tiene cookie pero quiere entrar al Login (Redundante)
if (req.nextUrl.pathname === '/login' && cookie) {
    // CORRECCIÓN: Lo mandamos directo a su oficina (/dashboard)
    return NextResponse.redirect(new URL('/dashboard', req.url)); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};