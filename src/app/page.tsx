import React from 'react';
import Link from 'next/link';
import { PRODUCTS_DATA, Product } from '@/lib/products';
import { Sparkles, Flame, ArrowRight, Palette, HeartHandshake, Wand2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-brand-teal text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-lemon-candles.jpg"
            alt="Maison Aroma Lemons Candle Basket"
            className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-teal-deep via-brand-teal/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 space-y-6 pt-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-white text-xs uppercase tracking-[0.25em] font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Design in Cera di Soia & Home Fragrance</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight leading-[1.15] text-white">
            Ogni momento speciale <br />
            <span className="italic font-light text-brand-teal-light">merita la sua luce.</span>
          </h1>

          <p className="text-base sm:text-lg text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
            Realizziamo candele artigianali in cera di soia naturale, progettate e colate a mano in Italia. Ogni creazione unisce design, profumo e personalizzazione per rendere unico ogni momento.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/customizer"
              className="w-full sm:w-auto px-8 py-4 bg-white text-brand-teal-deep text-xs uppercase tracking-widest font-semibold hover:bg-brand-teal-light transition-all duration-300 rounded-sm shadow-luxury flex items-center justify-center space-x-2"
            >
              <Flame className="w-4 h-4 text-brand-teal" />
              <span>Crea la Tua Candela</span>
            </Link>

            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 border border-white/60 text-white text-xs uppercase tracking-widest font-semibold hover:bg-white/10 transition-all rounded-sm"
            >
              Esplora lo Shop
            </Link>

            <Link
              href="/request-quote"
              className="w-full sm:w-auto px-8 py-4 text-white text-xs uppercase tracking-widest font-semibold hover:underline"
            >
              Richiedi Preventivo Evento →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PERCHÉ SCEGLIERE MAISON AROMA */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-teal font-semibold">Valori & Artigianalità</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-brand-teal-deep font-semibold">
            Perché scegliere Maison Aroma
          </h2>
          <div className="w-16 h-0.5 bg-brand-teal/40 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-sm border border-brand-teal/20 shadow-sm hover:shadow-luxury hover:border-brand-teal transition-all space-y-4 text-center group">
            <div className="w-14 h-14 rounded-full bg-brand-teal-light text-brand-teal mx-auto flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-colors">
              <Palette className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-teal-deep">Design esclusivo</h3>
            <p className="text-xs text-brand-stone font-light leading-relaxed">
              Creazioni eleganti e moderne che valorizzano qualsiasi ambiente.
            </p>
          </div>

          <div className="bg-white p-8 rounded-sm border border-brand-teal/20 shadow-sm hover:shadow-luxury hover:border-brand-teal transition-all space-y-4 text-center group">
            <div className="w-14 h-14 rounded-full bg-brand-teal-light text-brand-teal mx-auto flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-colors">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-teal-deep">Cera di soia naturale</h3>
            <p className="text-xs text-brand-stone font-light leading-relaxed">
              Una combustione più pulita, una migliore diffusione della fragranza e materiali di qualità.
            </p>
          </div>

          <div className="bg-white p-8 rounded-sm border border-brand-teal/20 shadow-sm hover:shadow-luxury hover:border-brand-teal transition-all space-y-4 text-center group">
            <div className="w-14 h-14 rounded-full bg-brand-teal-light text-brand-teal mx-auto flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-colors">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-teal-deep">Fatte a mano</h3>
            <p className="text-xs text-brand-stone font-light leading-relaxed">
              Ogni candela viene colata, rifinita e controllata artigianalmente.
            </p>
          </div>

          <div className="bg-white p-8 rounded-sm border border-brand-teal/20 shadow-sm hover:shadow-luxury hover:border-brand-teal transition-all space-y-4 text-center group">
            <div className="w-14 h-14 rounded-full bg-brand-teal-light text-brand-teal mx-auto flex items-center justify-center group-hover:bg-brand-teal group-hover:text-white transition-colors">
              <Wand2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-teal-deep">Personalizzabili</h3>
            <p className="text-xs text-brand-stone font-light leading-relaxed">
              Scegli forma, colore, profumo e confezione per creare un ricordo davvero unico.
            </p>
          </div>
        </div>
      </section>

      {/* 3. LE COLLEZIONI */}
      <section className="bg-brand-teal-light py-16 border-y border-brand-teal/20">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white border border-brand-teal/40 mx-auto flex items-center justify-center text-brand-teal">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif text-brand-teal-deep font-semibold">Le Collezioni</h2>
            <p className="text-sm font-medium text-brand-teal max-w-3xl mx-auto tracking-wide">
              Ogni collezione nasce da un'ispirazione diversa, ma con un'unica filosofia: creare candele artigianali che uniscono design, profumo ed emozione.
            </p>
            <p className="text-xs text-brand-stone max-w-2xl mx-auto font-light leading-relaxed">
              Dalle creazioni decorative alle candele più romantiche, ogni pezzo è progettato per emozionare, profumare e arredare con eleganza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-brand-teal/20 rounded-sm overflow-hidden shadow-luxury flex flex-col justify-between group hover:border-brand-teal transition-all">
              <div className="h-60 bg-brand-teal-light overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/collezione-dessert-gourmet.jpg"
                  alt="Collezione Dessert Gourmet"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-brand-teal text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-xs">
                  🍓 Collezione Dessert Gourmet
                </span>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-brand-teal-deep">Collezione Dessert Gourmet</h3>
                  <p className="text-xs text-brand-stone font-light leading-relaxed mt-1">
                    Le candele che sorprendono al primo sguardo. Dolci dall'aspetto incredibilmente realistico, realizzati a mano in cera di soia e impreziositi da fragranze gourmand che ricordano le migliori pasticcerie.
                  </p>
                </div>
                <Link href="/collections/dessert" className="inline-flex items-center space-x-1 text-xs uppercase font-semibold text-brand-teal hover:text-brand-teal-dark pt-2">
                  <span>Esplora la collezione →</span>
                </Link>
              </div>
            </div>

            <div className="bg-white border border-brand-teal/20 rounded-sm overflow-hidden shadow-luxury flex flex-col justify-between group hover:border-brand-teal transition-all">
              <div className="h-60 bg-brand-teal-light overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/collezione-romance.jpg"
                  alt="Collezione Romance"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-brand-teal text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-xs">
                  🌹 ROMANCE
                </span>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-brand-teal-deep">Collezione Romance</h3>
                  <p className="text-xs text-brand-stone font-light leading-relaxed mt-1">
                    Un omaggio alla delicatezza e al romanticismo. Fiori secchi, forme eleganti e dettagli raffinati si fondono in creazioni pensate per celebrare l'amore, i ricordi più belli e gli ambienti più accoglienti.
                  </p>
                </div>
                <Link href="/collections/romance" className="inline-flex items-center space-x-1 text-xs uppercase font-semibold text-brand-teal hover:text-brand-teal-dark pt-2">
                  <span>Esplora la collezione →</span>
                </Link>
              </div>
            </div>

            <div className="bg-white border border-brand-teal/20 rounded-sm overflow-hidden shadow-luxury flex flex-col justify-between group hover:border-brand-teal transition-all">
              <div className="h-60 bg-brand-teal-light overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/collezione-minimal.jpg"
                  alt="Atelier Design"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-brand-teal text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-xs">
                  ✨ Atelier Design
                </span>
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-brand-teal-deep">Atelier Design</h3>
                  <p className="text-xs text-brand-stone font-light leading-relaxed mt-1">
                    Candele decorative dal design essenziale, create per diventare veri elementi d'arredo. Linee pulite, forme contemporanee e materiali di qualità per valorizzare ogni ambiente con stile.
                  </p>
                </div>
                <Link href="/collections/minimal" className="inline-flex items-center space-x-1 text-xs uppercase font-semibold text-brand-teal hover:text-brand-teal-dark pt-2">
                  <span>Esplora la collezione →</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link
              href="/collections"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold px-8 py-3.5 bg-brand-teal text-white hover:bg-brand-teal-dark transition-colors rounded-sm shadow-luxury"
            >
              <span>Vedi Tutte le Collezioni</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-end border-b border-brand-teal/20 pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-brand-teal font-semibold">I Più Amati dai Nostri Clienti</span>
            <h2 className="text-3xl font-serif text-brand-teal-deep">Le Candele Bestseller</h2>
          </div>
          <Link href="/shop" className="text-xs uppercase tracking-widest font-semibold text-brand-teal-deep hover:text-brand-teal transition-colors mt-4 sm:mt-0">
            Vedi Tutto il Catalogo →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS_DATA.filter((p) => p.isBestSeller).map((candle) => (
            <Link
              key={candle.id}
              href={`/shop/${candle.slug}`}
              className="group flex flex-col bg-white border border-brand-teal/20 rounded-sm overflow-hidden shadow-sm hover:shadow-luxury hover:border-brand-teal transition-all duration-300 justify-between"
            >
              <div className="relative h-64 bg-brand-teal-light overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={candle.galleryImages[0]?.url}
                  alt={candle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-brand-teal text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-xs">
                  Bestseller
                </span>
                <span className="absolute bottom-3 right-3 bg-brand-teal text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-xs shadow-md">
                  Vedi Scheda →
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-brand-stone font-medium">
                    {candle.categoryName}
                  </span>
                  <h3 className="font-serif text-lg text-brand-teal-deep font-semibold line-clamp-1 group-hover:text-brand-teal transition-colors mt-0.5">
                    {candle.name}
                  </h3>
                  <p className="text-xs text-brand-stone line-clamp-2 mt-1 font-light">
                    {candle.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-brand-teal/15 flex items-center justify-between">
                  <span className="text-base font-serif font-bold text-brand-teal-deep">€{candle.basePrice.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-serif text-brand-teal-deep">
          Creiamo qualcosa che i tuoi ospiti ricorderanno.
        </h2>
        <p className="text-sm text-brand-stone max-w-xl mx-auto">
          Inizia ora a personalizzare le tue candele online o richiedi un preventivo su misura per il tuo evento speciale.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
          <Link
            href="/customizer"
            className="w-full sm:w-auto px-8 py-4 bg-brand-teal text-white text-xs uppercase tracking-widest font-semibold hover:bg-brand-teal-dark transition-colors rounded-sm shadow-luxury"
          >
            Disegna le Tue Candele
          </Link>
          <Link
            href="/request-quote"
            className="w-full sm:w-auto px-8 py-4 border border-brand-teal text-brand-teal-deep text-xs uppercase tracking-widest font-semibold hover:bg-brand-teal-light transition-colors rounded-sm"
          >
            Richiedi Preventivo Su Misura
          </Link>
        </div>
      </section>

    </div>
  );
}
