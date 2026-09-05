'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, User, Sparkles, Menu, X, Flame, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useShopSettings } from '@/context/ShopSettingsContext';
import BrandLogo from '@/components/BrandLogo';

export default function Header() {
  const { items, openCart } = useCartStore();
  const { isShopMode } = useShopSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-brand-ivory/90 backdrop-blur-md border-b border-brand-gold/20 shadow-sm">
      {/* Announcement Bar */}
      <div className="bg-brand-espresso text-brand-ivory text-[11px] py-2 px-4 text-center tracking-widest font-medium uppercase flex items-center justify-center space-x-2 border-b border-brand-gold/30">
        <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
        <span>MAISON AROMA CREAZIONI — Spedizione Gratuita per ordini superiori a €50</span>
        <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-espresso hover:text-brand-gold transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left Nav (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs uppercase tracking-widest font-medium">
            <Link href="/shop" className="text-brand-espresso hover:text-brand-gold transition-colors py-2">
              Shop
            </Link>
            
            <Link href="/customizer" className="text-brand-gold font-semibold flex items-center space-x-1 hover:text-brand-espresso transition-colors py-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Crea la Tua Candela</span>
            </Link>

            {/* Events Dropdown */}
            <div className="relative group py-2">
              <button className="flex items-center space-x-1 text-brand-espresso hover:text-brand-gold transition-colors">
                <span>Eventi</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute top-full left-0 w-64 bg-brand-ivory border border-brand-gold/30 shadow-luxury-lg rounded-sm py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                <Link href="/events/matrimonio" className="block px-4 py-2 text-xs text-brand-espresso hover:bg-brand-cream hover:text-brand-gold">
                  💍 Matrimoni & Sposi
                </Link>
                <Link href="/events/battesimo" className="block px-4 py-2 text-xs text-brand-espresso hover:bg-brand-cream hover:text-brand-gold">
                  👶 Battesimi & Nascita
                </Link>
                <Link href="/events/comunione" className="block px-4 py-2 text-xs text-brand-espresso hover:bg-brand-cream hover:text-brand-gold">
                  🕊️ Comunioni & Cresime
                </Link>
                <Link href="/events/corporate" className="block px-4 py-2 text-xs text-brand-espresso hover:bg-brand-cream hover:text-brand-gold">
                  🏢 Eventi Aziendali & Hotel
                </Link>
              </div>
            </div>

            <Link href="/fragrances" className="text-brand-espresso hover:text-brand-gold transition-colors py-2">
              Fragranze
            </Link>

            <Link href="/collections" className="text-brand-espresso hover:text-brand-gold transition-colors py-2 font-semibold text-brand-gold">
              Collezioni
            </Link>
          </nav>

          {/* Brand Logo - Official Maison aroma SVG Logo */}
          <div className="flex-1 lg:flex-none text-center">
            <Link href="/" className="inline-block group py-1">
              <BrandLogo variant="teal" size="md" />
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <Link href="/request-quote" className="hidden sm:inline-flex text-xs uppercase tracking-widest px-3 py-1.5 border border-brand-gold/50 text-brand-espresso hover:bg-brand-gold hover:text-brand-espresso transition-all rounded-xs">
              Richiedi Preventivo
            </Link>

            <Link href="/account" className="text-brand-espresso hover:text-brand-gold transition-colors" title="Account Cliente">
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            {isShopMode && (
              <button
                onClick={openCart}
                className="relative p-2 text-brand-espresso hover:text-brand-gold transition-colors"
                aria-label="Carrello"
              >
                <ShoppingBag className="w-6 h-6" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-gold text-brand-espresso text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-brand-ivory animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-linen bg-brand-cream/95 px-6 py-6 space-y-4">
          <Link
            href="/customizer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 text-brand-gold font-serif text-lg font-semibold py-2"
          >
            <Flame className="w-5 h-5" />
            <span>Personalizza la Tua Candela</span>
          </Link>
          
          <div className="space-y-2 border-t border-brand-linen pt-3">
            <p className="text-[10px] uppercase tracking-widest text-brand-stone font-bold">Catalogo & Eventi</p>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-brand-espresso font-medium py-1">
              Shop Completo
            </Link>
            <Link href="/events/matrimonio" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-brand-stone hover:text-brand-espresso py-1">
              Matrimoni & Bomboniere
            </Link>
            <Link href="/events/battesimo" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-brand-stone hover:text-brand-espresso py-1">
              Battesimi & Nascita
            </Link>
            <Link href="/events/corporate" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-brand-stone hover:text-brand-espresso py-1">
              Eventi Aziendali
            </Link>
          </div>

          <div className="space-y-2 border-t border-brand-linen pt-3">
            <Link href="/fragrances" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-brand-espresso font-medium py-1">
              Fragranze d’Autore
            </Link>
            <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-brand-gold font-semibold py-1">
              Collezioni (Dessert, Romance, Minimal)
            </Link>
            <Link href="/request-quote" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-brand-gold font-semibold py-1">
              Richiedi Preventivo Evento
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
