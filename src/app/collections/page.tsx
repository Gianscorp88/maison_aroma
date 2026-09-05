'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CategoryItem } from '@/lib/products-types';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CollectionsDirectoryPage() {
  const [collections, setCollections] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/categories', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: CategoryItem[]) => {
        const activeCollections = data
          .filter((c) => c.type === 'COLLECTION' && c.status === 'ACTIVE')
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setCollections(activeCollections);
      })
      .catch((err) => console.error('Error fetching collections directory:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      
      {/* Hero Banner */}
      <div className="bg-brand-teal-light border border-brand-teal/40 rounded-sm p-8 sm:p-16 text-center space-y-4 shadow-luxury relative overflow-hidden">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-brand-teal/30 rounded-full text-xs uppercase tracking-widest font-semibold text-brand-teal">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Haute Parfumerie & Artistry</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif text-brand-teal-deep font-semibold leading-tight">
          Le Collezioni
        </h1>

        <p className="text-base text-brand-stone max-w-2xl mx-auto font-light leading-relaxed">
          Scopri le collezioni Maison Aroma: mondi diversi, nati dalla stessa passione per la creazione artigianale. Ogni linea racconta una propria atmosfera attraverso forme, dettagli e fragranze accuratamente selezionate.
        </p>
      </div>

      {/* DYNAMIC COLLECTION CARDS FROM BACKOFFICE STORE */}
      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest text-brand-teal animate-pulse">
          Caricamento collezioni in corso...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col) => (
            <div
              key={col.id}
              className="bg-white border border-brand-teal/20 rounded-sm overflow-hidden shadow-luxury flex flex-col justify-between group hover:border-brand-teal transition-all"
            >
              <div className="h-64 bg-brand-teal-light overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={col.cardImage}
                  alt={col.title || col.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-brand-teal text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-xs shadow-md">
                  {col.eyebrow || col.name}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-brand-teal-deep">
                    {col.name || col.title}
                  </h2>
                  <p className="text-xs text-brand-stone font-light leading-relaxed mt-2">
                    {col.description}
                  </p>
                </div>

                <Link
                  href={`/collections/${col.slug}`}
                  className="px-5 py-3 bg-brand-teal text-white text-xs uppercase tracking-widest font-semibold hover:bg-brand-teal-dark transition-colors rounded-sm flex items-center justify-center space-x-2 shadow-luxury"
                >
                  <span>Esplora le Candele della Collezione</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
