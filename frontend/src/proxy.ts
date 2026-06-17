import { NextRequest, NextResponse } from 'next/server';

interface JwtPayload {
  sub: string;
  email: string;
  role: 'admin' | 'professor' | 'aluno';
  exp: number;
}

const PUBLIC_PATHS = ['/login_cadastro'];

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/':               ['admin', 'professor'],
  '/chamada':        ['professor', 'admin'],
  '/turmas':         ['professor', 'admin'],
  '/relatorios':     ['professor', 'admin'],
  '/dashboard-admin':['admin'],
};

function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return null;
    const json = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('engnet_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login_cadastro', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = decodeJwt(token);

  if (!payload) {
    const res = NextResponse.redirect(new URL('/login_cadastro', request.url));
    res.cookies.delete('engnet_token');
    return res;
  }

  if (Date.now() / 1000 > payload.exp) {
    const res = NextResponse.redirect(new URL('/login_cadastro', request.url));
    res.cookies.delete('engnet_token');
    return res;
  }

  // Verifica role
  const requiredRoles = PROTECTED_ROUTES[pathname];
  if (requiredRoles && !requiredRoles.includes(payload.role)) {
    const fallback: Record<string, string> = {
      admin:     '/',
      professor: '/chamada',
      aluno:     '/aluno',
    };
    return NextResponse.redirect(
      new URL(fallback[payload.role] ?? '/', request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
};