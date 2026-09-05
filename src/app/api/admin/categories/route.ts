import { NextResponse } from 'next/server';
import { getAllCategories, saveCategory, deleteCategory } from '@/lib/categories-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET() {
  try {
    const categories = getAllCategories();
    return NextResponse.json(categories, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('API Categories GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = saveCategory(body);
    return NextResponse.json(saved, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('API Categories POST Error:', error);
    return NextResponse.json({ error: 'Failed to save category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const result = deleteCategory(id);
    return NextResponse.json(result, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('API Categories DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
