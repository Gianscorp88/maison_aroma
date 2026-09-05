import { NextResponse } from 'next/server';
import { getShopSettings, saveShopSettings } from '@/lib/shop-settings-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  try {
    const settings = getShopSettings();
    return NextResponse.json(settings, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('API Shop Settings GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch shop settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.isShopMode !== 'boolean') {
      return NextResponse.json({ error: 'Field "isShopMode" must be a boolean' }, { status: 400 });
    }

    const updated = saveShopSettings({ isShopMode: body.isShopMode });
    return NextResponse.json(updated, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('API Shop Settings POST Error:', error);
    return NextResponse.json({ error: 'Failed to update shop settings' }, { status: 500 });
  }
}
