import { NextResponse } from 'next/server';
import { getAllProducts, saveProduct, deleteProduct, getProductById } from '@/lib/products-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const product = getProductById(id);
      if (!product) {
        return NextResponse.json({ error: 'Prodotto non trovato' }, { status: 404 });
      }
      return NextResponse.json(product, { headers: NO_CACHE_HEADERS });
    }

    const products = getAllProducts();
    return NextResponse.json(products, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error fetching products API:', error);
    return NextResponse.json({ error: 'Errore durante il recupero dei prodotti' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.basePrice) {
      return NextResponse.json({ error: 'Nome prodotto e prezzo base sono obbligatori' }, { status: 400 });
    }

    // Auto-generate slug if missing
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .trim()
        .replace(/&/g, 'e')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const saved = saveProduct(body);
    return NextResponse.json(saved, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Error saving product API:', error);
    return NextResponse.json({ error: 'Errore durante il salvataggio del prodotto' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID prodotto obbligatorio' }, { status: 400 });
    }

    const success = deleteProduct(id);

    if (success) {
      return NextResponse.json({ message: 'Prodotto eliminato con successo' }, { headers: NO_CACHE_HEADERS });
    } else {
      return NextResponse.json({ error: 'Prodotto non trovato o non eliminato' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting product API:', error);
    return NextResponse.json({ error: 'Errore durante l\'eliminazione del prodotto' }, { status: 500 });
  }
}
