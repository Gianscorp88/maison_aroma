'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FullProduct, CategoryItem, isProductInCategory } from '@/lib/products-types';
import { Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<CategoryItem | null>(null);
  const [categoriesCatalog, setCategoriesCatalog] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resCat, resProd] = await Promise.all([
        fetch('/api/admin/categories', { cache: 'no-store' }),
        fetch('/api/admin/products', { cache: 'no-store' }),
      ]);

      let catCatalog: CategoryItem[] = [];
      if (resCat.ok) {
        catCatalog = await resCat.json();
        setCategoriesCatalog(catCatalog);
        const targetSlug = decodeURIComponent(slug).toLowerCase().trim();
        const found = catCatalog.find(
          (c) => c.slug.toLowerCase() === targetSlug || c.id.toLowerCase() === targetSlug
        );
        setCategory(found || null);
      }

      if (resProd.ok) {
        const all: FullProduct[] = await resProd.json();
        const collectionProducts = all.filter((p) => isProductInCategory(p, slug, catCatalog));
        setProducts(collectionProducts);
      }
    } catch (err) {
      console.error('Error fetching collection detail products:', err);
    } finally {
      setLoading(false);
    }
  };

  const collectionInfo = category || {
    title: `Collezione ${slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : ''}`,
    eyebrow: 'CREAZIONI ARTIGIANALI IN CERA DI SOIA',
    description: 'Esplora le candele colate a mano appartenenti a questa collezione esclusiva.',
    cardImage: '/images/collezione-dessert-gourmet.jpg',
    heroImage: '/images/collezione-dessert-gourmet.jpg',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Back Navigation Link (OUTSIDE the hero banner, left-aligned) */}
      <div>
        <Link
          href="/collections"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-brand-stone hover:text-brand-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-brand-teal" />
          <span>Tutte le Collezioni</span>
        </Link>
      </div>

      {/* Header Banner Hero Box */}
      <div className="relative rounded-sm overflow-hidden bg-brand-teal text-white shadow-luxury min-h-[300px] flex items-center justify-center p-8 sm:p-14 text-center">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collectionInfo.heroImage || collectionInfo.cardImage}
            alt={collectionInfo.title}
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-teal-deep via-brand-teal/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          {collectionInfo.eyebrow && (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/25 rounded-full text-xs uppercase tracking-widest font-semibold text-white">
              <span>{collectionInfo.eyebrow}</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white leading-tight">
            {category?.name || collectionInfo.title}
          </h1>

          <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed max-w-2xl mx-auto">
            {collectionInfo.description}
          </p>
        </div>
      </div>

      {/* Dynamic Products Grid */}
      <div className="space-y-8 pt-4">
        <div className="flex justify-between items-center border-b border-brand-teal/20 pb-4">
          <h2 className="text-2xl font-serif font-bold text-brand-teal-deep flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-brand-teal" />
            <span>Candele della Collezione ({products.length})</span>
          </h2>
          <span className="text-xs text-brand-stone uppercase tracking-wider font-medium">Aggiornato in tempo reale</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs uppercase tracking-widest text-brand-teal animate-pulse">
            Caricamento candele della collezione in corso...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-sm border border-brand-teal/20 space-y-3">
            <AlertCircle className="w-8 h-8 text-brand-stone/60 mx-auto" />
            <p className="text-sm text-brand-stone">Nessuna candela attualmente pubblicata in questa collezione.</p>
            <Link href="/shop" className="inline-block text-xs font-bold text-brand-teal hover:underline uppercase tracking-wider">
              Esplora tutto il catalogo →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((candle) => {
              const formattedPrice = candle.basePrice.toFixed(2).replace('.', ',');
              const mainImg = candle.galleryImages[0]?.url || '/images/collezione-dessert-gourmet.jpg';

              return (
                <div
                  key={candle.id}
                  className="bg-white border border-brand-teal/20 rounded-sm overflow-hidden shadow-luxury flex flex-col justify-between group hover:border-brand-teal hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-72 bg-brand-teal-light overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mainImg}
                      alt={candle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-brand-teal text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-xs shadow-md">
                      {candle.categoryName}
                    </span>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-serif text-xl font-bold text-brand-teal-deep leading-tight group-hover:text-brand-teal transition-colors">
                        {candle.name}
                      </h3>
                      <p className="text-xs text-brand-stone font-light leading-relaxed line-clamp-2">
                        {candle.shortDescription || candle.descriptionParagraph1}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-brand-teal/15 flex items-center justify-between">
                      <div>
                        <span className="text-xl font-serif font-bold text-brand-teal-deep">€{formattedPrice}</span>
                        {candle.isVatIncluded !== false && (
                          <span className="block text-[9px] text-brand-stone font-light uppercase">IVA inclusa</span>
                        )}
                      </div>

                      <Link
                        href={`/shop/${candle.slug}`}
                        className="px-4 py-2.5 bg-brand-teal text-white text-xs uppercase tracking-wider font-semibold hover:bg-brand-teal-dark transition-colors rounded-xs shadow-sm"
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
    </div>
  );
}
