import React from 'react';
import Link from 'next/link';
import { Sparkles, Flame, Heart, ShieldCheck } from 'lucide-react';

export default function CraftPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.3em] text-brand-gold font-semibold">Artigianato Italiano</span>
        <h1 className="text-4xl sm:text-5xl font-serif text-brand-espresso">La Nostra Lavorazione a Mano</h1>
        <p className="text-base text-brand-stone max-w-2xl mx-auto font-light leading-relaxed">
          Ogni candela Maison Aroma nasce da un gesto rituale: la fusione a bagnomaria delle cera botanica, l’aggiunta dell’essenza profumata alla temperatura ideale ed la versata a mano nei bicchieri.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="h-96 bg-brand-cream rounded-sm overflow-hidden border border-brand-linen shadow-luxury">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1000&auto=format&fit=crop"
            alt="Hand Pouring Process"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-serif text-brand-espresso">100% Cera di Soia & Cocco Pure</h2>
          <p className="text-xs text-brand-stone leading-relaxed font-light">
            Utilizziamo esclusivamente cera di soia biologica biodegradabile, priva di paraffina, ftalati e derivati del petrolio. Questo assicura una bruciatura pulita ed atossica senza fumo nero.
          </p>

          <h2 className="text-3xl font-serif text-brand-espresso">Stoppini in Cotone o Legno</h2>
          <p className="text-xs text-brand-stone leading-relaxed font-light">
            I nostri stoppini in puro cotone non trattato garantiscono un bruciare costante ed il caratteristico bagliore caldo e rilassante.
          </p>

          <Link
            href="/customizer"
            className="inline-block px-8 py-3.5 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-colors rounded-sm shadow-luxury"
          >
            Crea la Tua Candela Sartoriale
          </Link>
        </div>
      </div>

    </div>
  );
}
