'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, Truck } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function Footer() {
  return (
    <footer className="bg-brand-espresso text-brand-ivory border-t border-brand-gold/30">
      {/* Brand Trust Badges */}
      <div className="border-b border-brand-gold/20 py-8 bg-brand-espresso/80">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <Sparkles className="w-6 h-6 text-brand-gold mx-auto" />
            <h4 className="font-serif text-sm font-semibold">100% Cera di Soia</h4>
            <p className="text-xs text-brand-linen/70">Cera di soia colata a mano</p>
          </div>
          <div className="space-y-1">
            <Heart className="w-6 h-6 text-brand-gold mx-auto" />
            <h4 className="font-serif text-sm font-semibold">Personalizzazione Grafica</h4>
            <p className="text-xs text-brand-linen/70">Nomi, date e dettagli personalizzati</p>
          </div>
          <div className="space-y-1">
            <Truck className="w-6 h-6 text-brand-gold mx-auto" />
            <h4 className="font-serif text-sm font-semibold">Spedizione Protetta</h4>
            <p className="text-xs text-brand-linen/70">Imballaggi curati per preservare ogni creazione</p>
          </div>
          <div className="space-y-1">
            <ShieldCheck className="w-6 h-6 text-brand-gold mx-auto" />
            <h4 className="font-serif text-sm font-semibold">Bozza Grafica Gratuita</h4>
            <p className="text-xs text-brand-linen/70">Ricevila via email prima della realizzazione</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="inline-block">
            <BrandLogo variant="light" size="md" />
          </Link>
          <p className="text-xs text-brand-linen/80 leading-relaxed max-w-sm">
            “Ogni creazione racconta un’emozione.” <br />
            Creiamo candele artigianali, bomboniere e composizioni profumate pensate per rendere speciali momenti, ambienti e ricordi.
          </p>
          <div className="pt-2 text-xs text-brand-gold font-serif italic">
            Atelier & Lab: Torino
          </div>
        </div>

        {/* Customer Care */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold text-brand-gold uppercase tracking-wider">ASSISTENZA CLIENTI</h4>
          <div className="text-xs text-brand-linen/90">
            <a
              href="mailto:maisonaromacreazioni@gmail.com"
              className="hover:text-brand-gold transition-colors underline"
            >
              maisonaromacreazioni@gmail.com
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-semibold text-brand-gold uppercase tracking-wider">ENTRA NEL MONDO MAISON AROMA</h4>
          <p className="text-xs text-brand-linen/70">
            Ricevi in anteprima novità, collezioni e ispirazioni firmate Maison Aroma.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <input
              type="email"
              placeholder="Il tuo indirizzo email..."
              className="w-full px-3 py-2 text-xs bg-brand-espresso border border-brand-gold/40 text-brand-ivory focus:outline-none focus:border-brand-gold rounded-sm"
            />
            <button
              type="submit"
              className="w-full py-2 bg-brand-gold text-brand-espresso text-xs uppercase tracking-widest font-semibold hover:bg-brand-ivory transition-colors rounded-sm"
            >
              ISCRIVITI
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-brand-gold/20 py-6 text-center text-xs text-brand-linen/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} Maison Aroma Creazioni. Tutti i diritti riservati. Made with ❤️ in Italy.</p>
          <div className="flex space-x-4 text-[11px]">
            <span className="hover:text-brand-gold cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-brand-gold cursor-pointer">Termini & Condizioni</span>
            <span>•</span>
            <span className="hover:text-brand-gold cursor-pointer">Spedizioni & Resi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
