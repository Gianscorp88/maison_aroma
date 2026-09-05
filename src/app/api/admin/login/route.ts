import { NextResponse } from 'next/server';
import { verifyAdminCredentials, createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json({ error: 'Username ed email sono obbligatori' }, { status: 400 });
    }

    const isValid = verifyAdminCredentials(username, password);

    if (!isValid) {
      return NextResponse.json({ error: 'Credenziali non valide. Riprova.' }, { status: 401 });
    }

    const token = createSessionToken();

    const response = NextResponse.json({ success: true, redirectUrl: '/admin' });

    // Set HTTP-Only Secure Cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error handling admin login:', error);
    return NextResponse.json({ error: 'Errore server durante l\'autenticazione' }, { status: 500 });
  }
}
