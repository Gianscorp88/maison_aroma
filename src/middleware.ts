import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'maison_aroma_admin_session';

// Simple HMAC verification in Edge-compatible Web Crypto API
async function verifyEdgeToken(token?: string): Promise<boolean> {
  if (!token || !token.includes('.')) return false;

  const [base64Payload, signature] = token.split('.');
  if (!base64Payload || !signature) return false;

  try {
    const encoder = new TextEncoder();
    const secretKeyData = encoder.encode('maison_aroma_session_jwt_secret_key_998877');

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      secretKeyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const binarySignature = Uint8Array.from(
      atob(signature.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0)
    );

    const payloadData = encoder.encode(base64Payload);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      cryptoKey,
      binarySignature,
      payloadData
    );

    if (!isValid) return false;

    // Check expiration
    const payloadStr = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadStr);

    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login and logout routes freely
  if (pathname === '/admin/login' || pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    if (pathname === '/admin/login') {
      const sessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
      const isAuthenticated = await verifyEdgeToken(sessionToken);
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
    return NextResponse.next();
  }

  // Intercept Admin pages (/admin/*)
  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isAuthenticated = await verifyEdgeToken(sessionToken);

    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow GET requests on public catalog & customizer endpoints so public site can read configuration
  const isPublicCatalogRead = request.method === 'GET' && (
    pathname.startsWith('/api/admin/categories') ||
    pathname.startsWith('/api/admin/products') ||
    pathname.startsWith('/api/admin/fragrances') ||
    pathname.startsWith('/api/admin/customizer') ||
    pathname.startsWith('/api/admin/shop-settings')
  );

  // Intercept Admin API mutations (POST, DELETE, PUT) and protected endpoints (/api/upload)
  if ((pathname.startsWith('/api/admin') || pathname.startsWith('/api/upload')) && !isPublicCatalogRead) {
    const sessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isAuthenticated = await verifyEdgeToken(sessionToken);

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Accesso negato. Autenticazione richiesta per apportare modifiche.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/upload'],
};
