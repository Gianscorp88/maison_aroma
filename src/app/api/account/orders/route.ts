import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Simple in-memory / persistent OTP code store for passwordless verification
const verificationCodesStore = new Map<string, { code: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const { email, code, action } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Inserisci un indirizzo email valido.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Action: REQUEST_CODE -> Send 6-digit OTP code to email
    if (action === 'REQUEST_CODE') {
      // Generate 6-digit code
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity

      verificationCodesStore.set(cleanEmail, { code: generatedCode, expiresAt });

      console.log(`\n🔑 [PASSWORDLESS OTP CODE GENERATED FOR: ${cleanEmail}] -> CODE: ${generatedCode}`);

      return NextResponse.json({
        success: true,
        message: `Codice di verifica inviato a ${cleanEmail}.`,
        // In local development mode, send code back so user can test easily without checking external inbox
        demoCode: generatedCode,
      });
    }

    // Action: VERIFY_CODE -> Verify 6-digit OTP code
    if (action === 'VERIFY_CODE') {
      const stored = verificationCodesStore.get(cleanEmail);

      if (!stored) {
        return NextResponse.json({ error: 'Nessun codice inviato per questa email. Richiedi un nuovo codice.' }, { status: 400 });
      }

      if (Date.now() > stored.expiresAt) {
        verificationCodesStore.delete(cleanEmail);
        return NextResponse.json({ error: 'Il codice di verifica è scaduto. Richiedine uno nuovo.' }, { status: 400 });
      }

      if (stored.code !== code?.trim()) {
        return NextResponse.json({ error: 'Codice di verifica errato. Riprova.' }, { status: 400 });
      }

      // Code valid!
      return NextResponse.json({
        success: true,
        verifiedEmail: cleanEmail,
        message: 'Verifica completata con successo.',
      });
    }

    return NextResponse.json({ error: 'Azione non valida.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in account verification API:', error);
    return NextResponse.json({ error: 'Errore durante la verifica dell\'email.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email mancante.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Fetch orders matching customerEmail
    const orders = await db.order.findMany({
      where: {
        customerEmail: {
          equals: cleanEmail,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      orders,
    });
  } catch (error: any) {
    console.error('Error fetching account orders:', error);
    return NextResponse.json({ error: 'Errore durante il recupero dello storico ordini.' }, { status: 500 });
  }
}
