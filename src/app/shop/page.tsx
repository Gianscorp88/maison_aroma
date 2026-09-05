'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { FullProduct, CategoryItem, isProductInCategory } from '@/lib/products-types';
import { Sparkles, AlertCircle } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categorySlug = searchParams.get('category');
  const sort = searchParams.get('sort') || 'featured';

  const [products, setProducts] = useState<FullProduct[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProd, resCat] = await Promise.all([
        fetch('/api/admin/products', { cache: 'no-store' }),
        fetch('/api/admin/categories', { cache: 'no-store' }),
      ]);

      if (resProd.ok) {
        const all: FullProduct[] = await resProd.json();
        setProducts(all.filter((p) => p.status === 'ACTIVE'));
      }

      if (resCat.ok) {
        const catData: CategoryItem[] = await resCat.json();
        setCategories(catData.filter((c) => c.status === 'ACTIVE'));
      }
    } catch (err) {
      console.error('Error loading shop data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter((prod) => isProductInCategory(prod, categorySlug || undefined, categories))
    .sort((a, b) => {
      if (sort === 'price-low') return a.basePrice - b.basePrice;
      if (sort === 'price-high') return b.basePrice - a.basePrice;
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-brand-teal-light border border-brand-teal/30 rounded-sm p-8 sm:p-12 text-center space-y-3 relative overflow-hidden">
        <span className="text-xs uppercase tracking-[0.3em] text-brand-teal font-semibold">Design, Profumo ed Emozione</span>
        <h1 className="text-4xl font-serif text-brand-teal-deep">La Collezione Completa Maison Aroma</h1>
        <p className="text-sm text-brand-stone max-w-2xl mx-auto font-light leading-relaxed">
          Ogni candela nasce per arredare, emozionare e rendere unico ogni ambiente. Esplora tutte le nostre collezioni artigianali, pensate per la casa, per i regali e per celebrare i momenti più importanti.
        </p>
      </div>

      {/* Filter & Sort Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-teal/20 pb-6">
        
        {/* Dynamic Category Pills */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`px-4 py-2 rounded-xs border text-xs uppercase tracking-wider font-medium transition-all ${
              !categorySlug
                ? 'bg-brand-teal text-white border-brand-teal'
                : 'bg-white text-brand-teal-deep border-brand-teal/20 hover:border-brand-teal'
            }`}
          >
            Tutti i Prodotti
          </Link>

          {categories.map((cat) => {
            const isSelected = categorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className={`px-4 py-2 rounded-xs border text-xs uppercase tracking-wider font-medium transition-all ${
                  isSelected
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-white text-brand-teal-deep border-brand-teal/20 hover:border-brand-teal'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          <span className="text-xs text-brand-stone uppercase tracking-wider font-medium">Ordina:</span>
          <select
            value={sort}
            onChange={(e) => {
              const val = e.target.value;
              const url = categorySlug ? `/shop?category=${categorySlug}&sort=${val}` : `/shop?sort=${val}`;
              router.push(url);
            }}
            className="px-3 py-1.5 bg-white border border-brand-teal/30 text-xs text-brand-teal-deep rounded-xs font-medium focus:outline-none focus:border-brand-teal"
          >
            <option value="featured">In Evidenza</option>
            <option value="price-low">Prezzo: dal più basso</option>
            <option value="price-high">Prezzo: dal più alto</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest text-brand-teal animate-pulse">
          Caricamento prodotti in corso...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-sm border border-brand-teal/20 space-y-3">
          <AlertCircle className="w-8 h-8 text-brand-stone/60 mx-auto" />
          <p className="text-sm text-brand-stone">Nessun prodotto trovato per questa categoria.</p>
          <Link href="/shop" className="inline-block text-xs font-bold text-brand-teal hover:underline uppercase tracking-wider">
            Mostra tutti i prodotti →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => {
            const formattedPrice = prod.basePrice.toFixed(2).replace('.', ',');
            const mainImg = prod.galleryImages[0]?.url || '/images/collezione-dessert-gourmet.jpg';

            return (
              <div
                key={prod.id}
                className="group flex flex-col bg-white border border-brand-teal/20 rounded-sm overflow-hidden shadow-sm hover:shadow-luxury hover:border-brand-teal transition-all duration-300 justify-between"
              >
                <div className="relative h-72 bg-brand-teal-light overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mainImg}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {prod.isBestSeller && (
                    <span className="absolute top-3 left-3 bg-brand-teal text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-xs shadow-md">
                      Bestseller
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-white/90 text-brand-teal-deep text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs border border-brand-teal/20">
                    {prod.categoryName}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-lg text-brand-teal-deep font-semibold line-clamp-1 group-hover:text-brand-teal transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-brand-stone line-clamp-2 mt-1 font-light">
                      {prod.shortDescription || prod.descriptionParagraph1}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-brand-teal/15 flex items-center justify-between">
                    <div>
                      <span className="text-base font-serif font-bold text-brand-teal-deep">€{formattedPrice}</span>
                      {prod.isVatIncluded !== false && (
                        <span className="block text-[9px] text-brand-stone font-light uppercase">IVA inclusa</span>
                      )}
                    </div>

                    <Link
                      href={`/shop/${prod.slug}`}
                      className="px-3.5 py-2 bg-brand-teal text-white text-xs uppercase tracking-wider font-semibold hover:bg-brand-teal-dark transition-colors rounded-xs shadow-sm"
                    >
                      Vedi Scheda →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs uppercase text-brand-teal">Caricamento Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
