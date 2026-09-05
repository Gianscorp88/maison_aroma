import { NextResponse } from 'next/server';
import { getCustomizerConfig, saveCustomizerConfig } from '@/lib/customizer-config-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  try {
    const config = getCustomizerConfig();
    return NextResponse.json(config, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('API Customizer GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch customizer config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = saveCustomizerConfig(body);
    return NextResponse.json(saved, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('API Customizer POST Error:', error);
    return NextResponse.json({ error: 'Failed to save customizer config' }, { status: 500 });
  }
}
