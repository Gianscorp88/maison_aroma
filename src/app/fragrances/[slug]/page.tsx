'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FragranceItem } from '@/lib/products-types';
import { ArrowLeft, Sparkles, AlertCircle, Wind } from 'lucide-react';

export default function FragranceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [fragrance, setFragrance] = useState<FragranceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/fragrances', { cache: 'no-store' });
      if (res.ok) {
        const catalog: FragranceItem[] = await res.json();
        const targetSlug = decodeURIComponent(slug).toLowerCase().trim();
        const found = catalog.find(
          (f) => f.slug.toLowerCase() === targetSlug || f.id.toLowerCase() === targetSlug
        );
        setFragrance(found || null);
      }
    } catch (err) {
      console.error('Error fetching fragrance detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs uppercase tracking-widest text-brand-teal animate-pulse">
        Caricamento profilo olfattivo in corso...
      </div>
    );
  }

  if (!fragrance) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-center">
        <div className="p-12 bg-white rounded-sm border border-brand-teal/20 space-y-4">
          <AlertCircle className="w-10 h-10 text-brand-stone/60 mx-auto" />
          <h1 className="text-2xl font-serif font-bold text-brand-teal-deep">Fragranza non trovata</h1>
          <p className="text-sm text-brand-stone max-w-md mx-auto">
            La fragranza richiesta non è presente nel catalogo o è stata disattivata.
          </p>
          <Link
            href="/fragrances"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-brand-teal hover:underline pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Torna alla Libreria Olfattiva</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      
      {/* Back Navigation Link */}
      <div>
        <Link
          href="/fragrances"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-brand-stone hover:text-brand-teal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-brand-teal" />
          <span>Tutte le Fragranze</span>
        </Link>
      </div>

      {/* Main Fragrance Banner Card */}
      <div className="bg-white border border-brand-teal/25 rounded-sm overflow-hidden shadow-luxury">
        <div className="relative h-72 sm:h-96 bg-brand-teal-light">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fragrance.image || '/images/collezione-dessert-gourmet.jpg'}
            alt={fragrance.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-teal-deep/90 via-brand-teal-deep/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] uppercase font-bold tracking-widest rounded-xs inline-block">
              {fragrance.badge || 'HAUTE PARFUMERIE'}
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              {fragrance.name}
            </h1>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-12 space-y-8">
          
          {/* Description */}
          <div className="space-y-3 border-b border-brand-teal/15 pb-6">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-teal flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Profilo & Ispirazione Olfattiva</span>
            </h2>
            <p className="text-base text-brand-stone font-light leading-relaxed">
              {fragrance.description}
            </p>
          </div>

          {/* Structured Olfactory Pyramid Box */}
          <div className="bg-brand-teal-light border border-brand-teal/30 rounded-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-sm font-serif font-bold text-brand-teal-deep uppercase tracking-wider flex items-center space-x-2 border-b border-brand-teal/20 pb-3">
              <Wind className="w-4 h-4 text-brand-teal" />
              <span>Piramide Olfattiva</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Note di Testa */}
              <div className="space-y-2 bg-white/80 p-4 rounded-xs border border-brand-teal/15">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal block">
                  Top Notes • Note di Testa
                </span>
                <p className="text-sm font-serif font-semibold text-brand-teal-deep">
                  {fragrance.topNotes && fragrance.topNotes.length > 0
                    ? fragrance.topNotes.join(', ')
                    : 'Non specificato'}
                </p>
                <span className="text-[10px] text-brand-stone font-light block">
                  Prima impressione olfattiva (0-15 minuti)
                </span>
              </div>

              {/* Note di Cuore */}
              <div className="space-y-2 bg-white/80 p-4 rounded-xs border border-brand-teal/15">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal block">
                  Heart Notes • Note di Cuore
                </span>
                <p className="text-sm font-serif font-semibold text-brand-teal-deep">
                  {fragrance.heartNotes && fragrance.heartNotes.length > 0
                    ? fragrance.heartNotes.join(', ')
                    : 'Non specificato'}
                </p>
                <span className="text-[10px] text-brand-stone font-light block">
                  Il cuore pulsante del profumo (15-60 minuti)
                </span>
              </div>

              {/* Note di Fondo */}
              <div className="space-y-2 bg-white/80 p-4 rounded-xs border border-brand-teal/15">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-teal block">
                  Base Notes • Note di Fondo
                </span>
                <p className="text-sm font-serif font-semibold text-brand-teal-deep">
                  {fragrance.baseNotes && fragrance.baseNotes.length > 0
                    ? fragrance.baseNotes.join(', ')
                    : 'Non specificato'}
                </p>
                <span className="text-[10px] text-brand-stone font-light block">
                  La scia persistente che rimane nell'ambiente
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      {/* NOTE: THE BLOCK "Le nostre candele con questa fragranza" HAS BEEN COMPLETELY REMOVED AS REQUESTED. */}
    </div>
  );
}
