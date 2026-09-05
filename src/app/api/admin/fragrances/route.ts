import { NextResponse } from 'next/server';
import { getAllFragrances, saveFragrance, deleteFragrance } from '@/lib/fragrances-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  try {
    const fragrances = getAllFragrances();
    return NextResponse.json(fragrances, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('API Fragrances GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch fragrances' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = saveFragrance(body);
    return NextResponse.json(saved, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('API Fragrances POST Error:', error);
    return NextResponse.json({ error: 'Failed to save fragrance' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Fragrance ID is required' }, { status: 400 });
    }

    const result = deleteFragrance(id);
    return NextResponse.json(result, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('API Fragrances DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete fragrance' }, { status: 500 });
  }
}
