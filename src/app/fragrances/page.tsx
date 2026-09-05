'use client';

import React, { useState, useEffect } from 'react';
import { FragranceItem } from '@/lib/products-types';
import { Sparkles, Wind } from 'lucide-react';

export default function FragrancesDirectoryPage() {
  const [fragrances, setFragrances] = useState<FragranceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/fragrances', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: FragranceItem[]) => {
        const active = data
          .filter((f) => f.status === 'ACTIVE')
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setFragrances(active);
      })
      .catch((err) => console.error('Error loading fragrances directory:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      
      {/* Hero Banner */}
      <div className="bg-brand-teal-light border border-brand-teal/40 rounded-sm p-8 sm:p-16 text-center space-y-4 shadow-luxury relative overflow-hidden">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-brand-teal/30 rounded-full text-xs uppercase tracking-widest font-semibold text-brand-teal">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ARTE OLFATTIVA · ESSENZE SELEZIONATE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif text-brand-teal-deep font-semibold leading-tight">
          L’Atelier delle Fragranze
        </h1>

        <p className="text-base text-brand-stone max-w-2xl mx-auto font-light leading-relaxed">
          Ogni fragranza nasce dall’incontro tra materie prime selezionate e raffinata arte profumiera. Esplora famiglie olfattive, accordi e note di testa, cuore e fondo per trovare l’essenza capace di raccontare il tuo ambiente.
        </p>
      </div>

      {/* DYNAMIC FRAGRANCE CARDS */}
      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest text-brand-teal animate-pulse">
          Caricamento libreria olfattiva in corso...
        </div>
      ) : fragrances.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-sm border border-brand-teal/20 space-y-3">
          <Wind className="w-8 h-8 text-brand-stone/60 mx-auto" />
          <p className="text-sm text-brand-stone">Nessuna fragranza attualmente pubblicata.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fragrances.map((fra) => (
            <div
              key={fra.id}
              className="bg-white border border-brand-teal/20 rounded-sm overflow-hidden shadow-luxury flex flex-col justify-between group hover:border-brand-teal transition-all"
            >
              <div className="h-56 bg-brand-teal-light overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fra.image || '/images/collezione-dessert-gourmet.jpg'}
                  alt={fra.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-brand-teal text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-xs shadow-md">
                  {fra.badge || 'FIORITA'}
                </span>
              </div>

              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h2 className="font-serif text-2xl font-semibold text-brand-teal-deep group-hover:text-brand-teal transition-colors">
                    {fra.name}
                  </h2>

                  <p className="text-xs text-brand-stone font-light leading-relaxed">
                    {fra.description}
                  </p>

                  {/* Pyramid Summary */}
                  <div className="p-3 bg-brand-teal-light/50 rounded-xs border border-brand-teal/15 text-[11px] space-y-1">
                    {fra.topNotes && fra.topNotes.length > 0 && (
                      <div><strong className="text-brand-teal-deep font-semibold">Testa:</strong> {fra.topNotes.join(', ')}</div>
                    )}
                    {fra.heartNotes && fra.heartNotes.length > 0 && (
                      <div><strong className="text-brand-teal-deep font-semibold">Cuore:</strong> {fra.heartNotes.join(', ')}</div>
                    )}
                    {fra.baseNotes && fra.baseNotes.length > 0 && (
                      <div><strong className="text-brand-teal-deep font-semibold">Fondo:</strong> {fra.baseNotes.join(', ')}</div>
                    )}
                  </div>
                </div>              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
