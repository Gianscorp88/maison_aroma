'use client';

import React, { useState, useEffect } from 'react';
import { useCustomizerStore } from '@/lib/customizer-store';
import { useCartStore } from '@/lib/cart-store';
import { useShopSettings } from '@/context/ShopSettingsContext';
import { CustomizerConfig } from '@/lib/customizer-config-store';
import { Sparkles, Flame, Check, ArrowRight, ArrowLeft, RefreshCw, ShoppingBag, Send, Info, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

// Fallback constants in case API is loading or offline
const FALLBACK_EVENTS = [
  { id: 'Matrimonio', label: 'Matrimonio & Sposi', icon: '💍', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 1 },
  { id: 'Battesimo', label: 'Battesimo & Nascita', icon: '👶', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 2 },
  { id: 'Comunione', label: 'Comunione & Cresima', icon: '🕊️', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 3 },
  { id: 'Baby Shower', label: 'Baby Shower', icon: '🧸', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 4 },
  { id: 'Compleanno', label: 'Compleanno & Festeggiamenti', icon: '🎂', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 5 },
  { id: 'Corporate', label: 'Evento Aziendale & Hotel', icon: '🏢', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 6 },
  { id: 'Regalo Luxury', label: 'Regalo Personale Luxury', icon: '🎁', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 7 },
];

const FALLBACK_MODELS = [
  {
    id: 'cand-01',
    name: 'Candela Bomboniera Elegance',
    vessel: 'Bicchiere Trasparente Scanalato',
    basePrice: 16.0,
    dimensions: '7.5cm x 8.5cm',
    weight: '160g',
    minQuantity: 10,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 1,
  },
  {
    id: 'cand-02',
    name: 'Vaso Ceramica Artigianale',
    vessel: 'Gesso Ceramico Colato a Mano',
    basePrice: 20.0,
    dimensions: '8cm x 9cm',
    weight: '200g',
    minQuantity: 10,
    image: 'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=800&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 2,
  },
  {
    id: 'cand-03',
    name: 'Apothecary Amber Jar',
    vessel: 'Vetro Ambrato d’Epoca',
    basePrice: 18.0,
    dimensions: '8.5cm x 9.5cm',
    weight: '220g',
    minQuantity: 10,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 3,
  },
  {
    id: 'cand-04',
    name: 'Vaso Nero Satinato Velvet',
    vessel: 'Vetro Nero Opaco Luxury',
    basePrice: 22.0,
    dimensions: '8.5cm x 10cm',
    weight: '250g',
    minQuantity: 10,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 4,
  },
];

const FALLBACK_FRAGRANCES = [
  {
    id: 'frag-01',
    name: 'Rosa di Maggio & Legno di Rosa',
    notes: 'Rosa Centifolia, Bergamotto, Legno di Cedro, Muschio',
    family: 'Fiorita Cipriata',
    intensity: 4,
    description: 'Bouquet romantico ed avvolgente, perfetto per matrimoni eleganti.',
    status: 'ACTIVE',
    order: 1,
  },
  {
    id: 'frag-02',
    name: 'Fichi di Toscana & Foglia d’Olivo',
    notes: 'Nettare di Figo, Note Verdi d’Olivo, Legno di Sandalo',
    family: 'Fruttata Legnosa',
    intensity: 3,
    description: 'Profumo fresco della campagna toscana con sfumature morbide e rilassanti.',
    status: 'ACTIVE',
    order: 2,
  },
  {
    id: 'frag-03',
    name: 'Champagne & Pesca Bianca',
    notes: 'Bollicine di Franciacorta, Pesca Bianca, Fiori di Magnolia',
    family: 'Fruttata Gourmand',
    intensity: 4,
    description: 'Elegante e frizzante, ideale per brindare a momenti speciali.',
    status: 'ACTIVE',
    order: 3,
  },
];

const FALLBACK_PACKAGINGS = [
  {
    id: 'pack-ivory',
    name: 'Scatola Rigid Box Avorio con Nastro',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 1,
  },
  {
    id: 'pack-linen',
    name: 'Sacchetto in Lino Naturale Ricamato',
    price: 1.50,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 2,
  },
  {
    id: 'pack-none',
    name: 'Nessuna Confezione Singola (Sfusa)',
    price: 0.0,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 3,
  },
];

export default function CustomizerPage() {
  const [config, setConfig] = useState<CustomizerConfig | null>(null);

  useEffect(() => {
    fetch('/api/admin/customizer', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setConfig(data);
      })
      .catch((err) => console.error('Error loading customizer dynamic config:', err));
  }, []);

  const activeEvents = (config?.events || FALLBACK_EVENTS)
    .filter((e) => e.status !== 'HIDDEN')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activeModels = (config?.models || FALLBACK_MODELS)
    .filter((m) => m.status !== 'HIDDEN')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activeFragrances = (config?.fragrances || FALLBACK_FRAGRANCES)
    .filter((f) => f.status !== 'HIDDEN')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activeColors = (config?.colors || [])
    .filter((c) => c.status !== 'HIDDEN')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activeFonts = (config?.fonts || [])
    .filter((ft) => ft.status !== 'HIDDEN')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activePackagings = (config?.packagings || FALLBACK_PACKAGINGS)
    .filter((p) => p.status !== 'HIDDEN')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const activeTiers = (config?.discountTiers || [])
    .filter((t) => t.status !== 'HIDDEN')
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const {
    step,
    setStep,
    nextStep,
    prevStep,
    eventType,
    setEventType,
    candleModel,
    setCandleModel,
    fragrance,
    setFragrance,
    colors,
    setColors,
    label,
    setLabel,
    packaging,
    setPackaging,
    quantity,
    setQuantity,
    resetCustomizer,
  } = useCustomizerStore();

  const { addItem } = useCartStore();
  const { isShopMode } = useShopSettings();
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Dynamic Discount Calculation based on Backoffice settings
  const getDynamicDiscount = (): number => {
    if (activeTiers.length > 0) {
      const match = activeTiers.find((t) => quantity >= t.minQty && quantity <= t.maxQty);
      if (match) return match.discountPercentage;
    }
    if (quantity >= 200) return 40;
    if (quantity >= 100) return 35;
    if (quantity >= 50) return 25;
    if (quantity >= 30) return 15;
    if (quantity >= 10) return 10;
    return 0;
  };

  const getDynamicUnitPrice = (): number => {
    const rawPrice = (candleModel?.basePrice || 16.0) + (packaging?.price || 0);
    const discount = getDynamicDiscount();
    return Number((rawPrice * (1 - discount / 100)).toFixed(2));
  };

  const getDynamicTotalPrice = (): number => {
    return Number((getDynamicUnitPrice() * quantity).toFixed(2));
  };

  const handleAddToCart = () => {
    addItem({
      productId: candleModel.id,
      name: `${candleModel.name} — Personalizzata (${eventType})`,
      image: candleModel.image,
      basePrice: candleModel.basePrice,
      unitPrice: getDynamicUnitPrice(),
      quantity: quantity,
      minQuantity: candleModel.minQuantity,
      customization: {
        eventType,
        vessel: candleModel.vessel,
        fragrance: fragrance.name,
        ribbonColor: colors.ribbonColor,
        fontStyle: label.fontStyle,
        namesText: label.names,
        dateText: label.date,
        phraseText: label.phrase,
        packaging: packaging.name,
        packagingPrice: packaging.price,
      },
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-linen pb-6 space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-brand-gold font-semibold">
            <Flame className="w-4 h-4" />
            <span>Configuratore Sartoriale Maison Aroma</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-espresso">
            Crea la Tua Candela Personalizzata
          </h1>
        </div>

        <button
          onClick={resetCustomizer}
          className="text-xs text-brand-stone hover:text-brand-espresso flex items-center space-x-1 underline"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Ricomincia Da Capo</span>
        </button>
      </div>

      {/* Wizard Progress Bar */}
      <div className="grid grid-cols-8 gap-2 border-b border-brand-linen pb-6">
        {[
          '1. Evento',
          '2. Vaso',
          '3. Fragranza',
          '4. Colori',
          '5. Etichetta',
          '6. Packaging',
          '7. Quantità',
          '8. Riepilogo',
        ].map((stepName, index) => {
          const currentStepNum = index + 1;
          const isActive = step === currentStepNum;
          const isCompleted = step > currentStepNum;
          return (
            <button
              key={index}
              onClick={() => setStep(currentStepNum)}
              className={`text-left p-2 rounded-xs border text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-brand-espresso text-brand-ivory border-brand-espresso shadow-sm'
                  : isCompleted
                  ? 'bg-brand-cream text-brand-espresso border-brand-gold/40'
                  : 'bg-brand-ivory text-brand-stone border-brand-linen hover:border-brand-stone'
              }`}
            >
              <span className="block font-bold">{stepName}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left Controls vs Right Live Canvas Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Options Column */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-brand-linen shadow-sm space-y-6">
          {/* STEP 1: EVENT TYPE */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Passo 1 di 8</span>
                <h2 className="text-2xl font-serif text-brand-espresso font-semibold">Per quale evento crei le tue candele?</h2>
                <p className="text-xs text-brand-stone">Seleziona il tipo di cerimonia per adattare stile ed etichette.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeEvents.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => setEventType(ev.label || ev.id)}
                    className={`p-4 rounded-sm border text-left flex items-center space-x-3 transition-all ${
                      eventType === (ev.label || ev.id)
                        ? 'border-brand-gold bg-brand-cream/60 ring-1 ring-brand-gold shadow-sm'
                        : 'border-brand-linen hover:border-brand-stone bg-brand-ivory/50'
                    }`}
                  >
                    <span className="text-2xl">{ev.icon}</span>
                    <div>
                      <h4 className="font-serif font-semibold text-sm text-brand-espresso">{ev.label}</h4>
                      <p className="text-[10px] text-brand-stone">{ev.subtitle || 'Stile coordinato'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: CANDLE MODEL */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Passo 2 di 8</span>
                <h2 className="text-2xl font-serif text-brand-espresso font-semibold">Scegli il Modello di Candela</h2>
                <p className="text-xs text-brand-stone">Seleziona il bicchiere ed il formato che preferisci.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setCandleModel(model as any)}
                    className={`p-4 rounded-sm border text-left flex flex-col justify-between space-y-3 transition-all ${
                      candleModel.id === model.id
                        ? 'border-brand-gold bg-brand-cream/60 ring-1 ring-brand-gold shadow-sm'
                        : 'border-brand-linen hover:border-brand-stone bg-brand-ivory/50'
                    }`}
                  >
                    <div className="h-32 bg-brand-linen/40 rounded-xs overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-sm text-brand-espresso">{model.name}</h4>
                      <p className="text-[11px] text-brand-stone">{model.vessel} • {model.dimensions}</p>
                      <div className="mt-2 flex justify-between items-center text-xs font-semibold text-brand-gold">
                        <span>Base €{model.basePrice.toFixed(2)} Cad.</span>
                        <span className="text-[10px] text-brand-stone font-normal">Min {model.minQuantity} pz</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: FRAGRANCE */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Passo 3 di 8</span>
                <h2 className="text-2xl font-serif text-brand-espresso font-semibold">Scegli la Fragranza d’Autore</h2>
                <p className="text-xs text-brand-stone">Tutte le fragranze sono formulate in Italia e ipoallergeniche.</p>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {activeFragrances.map((frag) => (
                  <button
                    key={frag.id}
                    onClick={() => setFragrance(frag as any)}
                    className={`w-full p-4 rounded-sm border text-left flex flex-col space-y-2 transition-all ${
                      fragrance.id === frag.id
                        ? 'border-brand-gold bg-brand-cream/60 ring-1 ring-brand-gold shadow-sm'
                        : 'border-brand-linen hover:border-brand-stone bg-brand-ivory/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif font-bold text-base text-brand-espresso">{frag.name}</h4>
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-brand-gold">{frag.family}</span>
                      </div>
                      <div className="flex text-brand-gold text-xs">
                        {'★'.repeat(frag.intensity || 4)}{'☆'.repeat(5 - (frag.intensity || 4))}
                      </div>
                    </div>
                    <p className="text-xs text-brand-stone italic">&ldquo;{frag.description}&rdquo;</p>
                    <p className="text-[11px] text-brand-espresso font-medium border-t border-brand-linen/40 pt-1">
                      Note: {frag.notes}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: COLORS */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Passo 4 di 8</span>
                <h2 className="text-2xl font-serif text-brand-espresso font-semibold">Personalizza Colori & Nastri</h2>
                <p className="text-xs text-brand-stone">Seleziona la tonalità cromatica del nastro per la tua composizione.</p>
              </div>

              {/* Ribbon Palette */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso">
                  COLORE DEL NASTRO:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(activeColors.length > 0
                    ? activeColors
                    : [
                        { name: 'Avorio', hex: '#FDFBF7' },
                        { name: 'Rosa Cipria', hex: '#E8C5C8' },
                        { name: 'Verde Salvia', hex: '#8F9E8B' },
                        { name: 'Azzurro Polvere', hex: '#9BB7D4' },
                        { name: 'Oro Champenoise', hex: '#C5A059' },
                        { name: 'Beige Naturale', hex: '#EAE5DC' },
                        { name: 'Bianco', hex: '#FFFFFF' },
                        { name: 'Nero', hex: '#222222' },
                      ]
                  ).map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setColors({ ribbonColor: item.hex })}
                      className={`p-3 rounded-sm border text-xs text-left flex items-center space-x-2 transition-all ${
                        colors.ribbonColor === item.hex ? 'border-brand-gold ring-1 ring-brand-gold bg-brand-cream' : 'border-brand-linen'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: item.hex }} />
                      <span className="font-medium text-brand-espresso text-[11px]">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: LABEL PERSONALIZATION */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Passo 5 di 8</span>
                <h2 className="text-2xl font-serif text-brand-espresso font-semibold">Personalizza l’Etichetta</h2>
                <p className="text-xs text-brand-stone">Inserisci i testi. La bozza grafica si aggiorna in tempo reale a destra.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                    Nomi / Intestazione ({config?.labelSettings?.namesPlaceholder || 'es. Giulia & Marco'}):
                  </label>
                  <input
                    type="text"
                    value={label.names}
                    onChange={(e) => setLabel({ names: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-brand-linen rounded-sm bg-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                    Data dell’Evento ({config?.labelSettings?.datePlaceholder || 'es. 15 Settembre 2026'}):
                  </label>
                  <input
                    type="text"
                    value={label.date}
                    onChange={(e) => setLabel({ date: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-brand-linen rounded-sm bg-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                    Dedica / Frase Corta (opzionale):
                  </label>
                  <input
                    type="text"
                    value={label.phrase}
                    onChange={(e) => setLabel({ phrase: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-brand-linen rounded-sm bg-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-espresso mb-1">
                    Stile Carattere (Font):
                  </label>
                  <select
                    value={label.fontStyle}
                    onChange={(e) => setLabel({ fontStyle: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-brand-linen rounded-sm bg-brand-ivory focus:outline-none focus:border-brand-gold font-serif"
                  >
                    {activeFonts.length > 0 ? (
                      activeFonts.map((ft) => (
                        <option key={ft.id} value={ft.value}>
                          {ft.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="classic-serif">Serif Elegante Classico (Playfair)</option>
                        <option value="script-modern">Corsivo Seta Calligrafico</option>
                        <option value="minimal-sans">Sans-Serif Minimale Moderno</option>
                        <option value="vintage-roman">Romano Antico Goffrato</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PACKAGING */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Passo 6 di 8</span>
                <h2 className="text-2xl font-serif text-brand-espresso font-semibold">Scegli la Confezione & Packaging</h2>
                <p className="text-xs text-brand-stone">Proteggi e presenta la bomboniera nel modo più raffinato.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activePackagings.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setPackaging(pack as any)}
                    className={`p-4 rounded-sm border text-left flex flex-col justify-between space-y-3 transition-all ${
                      packaging.id === pack.id
                        ? 'border-brand-gold bg-brand-cream/60 ring-1 ring-brand-gold shadow-sm'
                        : 'border-brand-linen hover:border-brand-stone bg-brand-ivory/50'
                    }`}
                  >
                    <div className="h-28 bg-brand-linen/40 rounded-xs overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pack.image} alt={pack.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif font-semibold text-sm text-brand-espresso">{pack.name}</h4>
                      <div className="mt-2 text-xs font-semibold text-brand-gold">
                        {pack.price === 0 ? 'Incluso nel prezzo base' : `+€${pack.price.toFixed(2)} Cad.`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: QUANTITY & VOLUMETRIC TIERING */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Passo 7 di 8</span>
                <h2 className="text-2xl font-serif text-brand-espresso font-semibold">Seleziona la Quantità</h2>
                <p className="text-xs text-brand-stone">Più ordini, maggiore è il risparmio applicato sui singoli lotti.</p>
              </div>

              <div className="p-6 bg-brand-cream/50 rounded-sm border border-brand-gold/30 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold uppercase tracking-wider text-brand-espresso">
                    Numero di Pezzi:
                  </label>
                  <input
                    type="number"
                    min={candleModel.minQuantity || 10}
                    max={1000}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || candleModel.minQuantity || 10)}
                    className="w-28 px-3 py-2 text-center text-lg font-bold border border-brand-gold rounded-sm bg-white"
                  />
                </div>

                {/* Tier Discount Badges */}
                <div className="pt-2 border-t border-brand-linen grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {activeTiers.length > 0 ? (
                    activeTiers.map((t) => (
                      <div
                        key={t.id}
                        className={`p-2 rounded-xs border ${
                          quantity >= t.minQty && quantity <= t.maxQty
                            ? 'bg-brand-gold text-brand-espresso border-brand-gold font-bold'
                            : 'bg-white text-brand-stone'
                        }`}
                      >
                        <span>{t.minQty}-{t.maxQty >= 999 ? '+' : t.maxQty} pz</span>
                        <span className="block text-[10px]">{t.discountPercentage}% Sconto</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className={`p-2 rounded-xs border ${quantity >= 10 && quantity < 30 ? 'bg-brand-gold text-brand-espresso border-brand-gold font-bold' : 'bg-white text-brand-stone'}`}>
                        <span>10-29 pz</span>
                        <span className="block text-[10px]">10% Sconto</span>
                      </div>
                      <div className={`p-2 rounded-xs border ${quantity >= 30 && quantity < 50 ? 'bg-brand-gold text-brand-espresso border-brand-gold font-bold' : 'bg-white text-brand-stone'}`}>
                        <span>30-49 pz</span>
                        <span className="block text-[10px]">15% Sconto</span>
                      </div>
                      <div className={`p-2 rounded-xs border ${quantity >= 50 && quantity < 100 ? 'bg-brand-gold text-brand-espresso border-brand-gold font-bold' : 'bg-white text-brand-stone'}`}>
                        <span>50-99 pz</span>
                        <span className="block text-[10px]">25% Sconto</span>
                      </div>
                      <div className={`p-2 rounded-xs border ${quantity >= 100 ? 'bg-brand-gold text-brand-espresso border-brand-gold font-bold' : 'bg-white text-brand-stone'}`}>
                        <span>100+ pz</span>
                        <span className="block text-[10px]">35% Sconto</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-2 text-center">
                  <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                    ✨ Risparmio applicato: {getDynamicDiscount()}% di sconto sul prezzo unitario!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: SUMMARY & CONFIRMATION */}
          {step === 8 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-brand-gold uppercase tracking-widest">Passo 8 di 8</span>
                <h2 className="text-2xl font-serif text-brand-espresso font-semibold">Riepilogo Configurazione</h2>
                <p className="text-xs text-brand-stone">Verifica tutti i dettagli prima di aggiungere al carrello o richiedere un preventivo.</p>
              </div>

              <div className="p-4 bg-brand-cream/40 rounded-sm border border-brand-linen space-y-3 text-xs text-brand-espresso">
                <div className="flex justify-between border-b border-brand-linen pb-2">
                  <span className="font-semibold">Tipo Evento:</span>
                  <span>{eventType}</span>
                </div>
                <div className="flex justify-between border-b border-brand-linen pb-2">
                  <span className="font-semibold">Modello Candela:</span>
                  <span>{candleModel.name} ({candleModel.dimensions})</span>
                </div>
                <div className="flex justify-between border-b border-brand-linen pb-2">
                  <span className="font-semibold">Fragranza Scelta:</span>
                  <span>{fragrance.name}</span>
                </div>
                <div className="flex justify-between border-b border-brand-linen pb-2">
                  <span className="font-semibold">Testo Etichetta:</span>
                  <span>&ldquo;{label.names}&rdquo; ({label.date})</span>
                </div>
                <div className="flex justify-between border-b border-brand-linen pb-2">
                  <span className="font-semibold">Packaging:</span>
                  <span>{packaging.name}</span>
                </div>
                <div className="flex justify-between border-b border-brand-linen pb-2">
                  <span className="font-semibold">Quantità & Sconto:</span>
                  <span>{quantity} pz ({getDynamicDiscount()}% Sconto Applicato)</span>
                </div>
                <div className="flex justify-between pt-2 text-base font-serif font-bold text-brand-gold">
                  <span>Prezzo Totale Calcolato:</span>
                  <span>€{getDynamicTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              {isShopMode && addedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-sm flex items-center justify-between">
                  <span>✨ Candela personalizzata aggiunta al carrello!</span>
                  <Link href="/checkout" className="underline font-bold">Vai al Checkout →</Link>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {isShopMode ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-colors rounded-sm shadow-luxury flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Aggiungi al Carrello (€{getDynamicTotalPrice().toFixed(2)})</span>
                    </button>

                    <Link
                      href="/request-quote"
                      className="py-3.5 px-6 border border-brand-espresso text-brand-espresso text-xs uppercase tracking-widest font-medium hover:bg-brand-cream transition-colors rounded-sm flex items-center justify-center space-x-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Richiedi Preventivo</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/request-quote"
                    className="w-full py-3.5 px-6 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-colors rounded-sm shadow-luxury flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Richiedi Preventivo per Questa Configurazione</span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Navigation Prev / Next Buttons */}
          <div className="flex justify-between pt-6 border-t border-brand-linen text-xs">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-4 py-2 bg-brand-ivory border border-brand-linen text-brand-espresso rounded-sm disabled:opacity-30 hover:border-brand-stone font-semibold flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Indietro</span>
            </button>

            {step < 8 && (
              <button
                onClick={nextStep}
                className="px-5 py-2 bg-brand-gold text-brand-espresso rounded-sm font-semibold hover:bg-brand-espresso hover:text-brand-ivory transition-colors flex items-center space-x-1 shadow-sm"
              >
                <span>Continua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Real-Time Live Preview Mockup */}
        <div className="lg:col-span-5 bg-brand-espresso text-brand-ivory p-6 sm:p-8 rounded-sm shadow-luxury border border-brand-gold/30 sticky top-28 space-y-6">
          <div className="text-center space-y-1 border-b border-brand-gold/20 pb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-semibold">Anteprima in Tempo Reale</span>
            <h3 className="font-serif text-lg font-bold">Bozza Digitale Candela</h3>
          </div>

          {/* Canvas Digital Candle Graphic Preview */}
          <div className="relative aspect-square max-w-xs mx-auto bg-brand-ivory/10 rounded-sm border border-brand-gold/30 p-6 flex flex-col justify-center items-center shadow-inner overflow-hidden">
            {/* Candle Container SVG Mockup */}
            <div
              className="w-44 h-52 rounded-b-md border-2 border-brand-gold/40 relative flex flex-col items-center justify-between p-3 shadow-2xl transition-all duration-300"
              style={{ backgroundColor: colors.containerColor }}
            >
              {/* Wick Flame */}
              <div className="absolute -top-6 w-3 h-5 bg-amber-400 rounded-full blur-[1px] animate-pulse flex items-center justify-center">
                <div className="w-1.5 h-2.5 bg-white rounded-full" />
              </div>

              {/* Ribbon Accent */}
              <div
                className="absolute top-2 left-0 right-0 h-4 shadow-sm flex items-center justify-center"
                style={{ backgroundColor: colors.ribbonColor }}
              >
                <div className="w-3 h-3 bg-brand-gold rounded-full border border-white/40" />
              </div>

              {/* Custom Label Box */}
              <div className="mt-8 w-36 bg-[#FBF9F5] border border-brand-gold/50 p-2.5 text-center text-brand-espresso shadow-md rounded-xs space-y-1">
                <span className="block text-[8px] uppercase tracking-widest font-semibold text-brand-gold">Maison Aroma</span>
                
                <p
                  className={`text-xs font-bold leading-tight ${
                    label.fontStyle === 'script-modern'
                      ? 'italic font-serif'
                      : label.fontStyle === 'minimal-sans'
                      ? 'font-sans uppercase text-[10px] tracking-wider'
                      : 'font-serif'
                  }`}
                >
                  {label.names || 'Giulia & Marco'}
                </p>

                <p className="text-[9px] text-brand-stone font-mono">
                  {label.date || '15.09.2026'}
                </p>

                {label.phrase && (
                  <p className="text-[8px] text-brand-espresso/80 italic border-t border-brand-gold/20 pt-0.5">
                    &ldquo;{label.phrase}&rdquo;
                  </p>
                )}
              </div>

              {/* Fragrance Tag */}
              <div className="text-[9px] text-brand-espresso/90 bg-white/60 px-2 py-0.5 rounded-full font-serif italic text-center w-full truncate">
                {fragrance.name}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown Summary Widget */}
          <div className="bg-brand-ivory/5 p-4 rounded-xs border border-brand-gold/20 text-xs space-y-2">
            <div className="flex justify-between text-brand-linen/80">
              <span>Evento:</span>
              <span className="font-semibold text-brand-gold">{eventType}</span>
            </div>
            <div className="flex justify-between text-brand-linen/80">
              <span>Modello:</span>
              <span className="font-semibold text-brand-ivory">{candleModel.name}</span>
            </div>
            <div className="flex justify-between text-brand-linen/80">
              <span>Prezzo Base Unitario:</span>
              <span className="font-mono">€{candleModel.basePrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-brand-linen/80">
              <span>Supplemento Packaging:</span>
              <span className="font-mono">+{packaging.price === 0 ? '€0.00' : `€${packaging.price?.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-brand-linen/80">
              <span>Sconto Volume ({quantity} pz):</span>
              <span className="font-mono text-emerald-400">-{getDynamicDiscount()}%</span>
            </div>
            <div className="border-t border-brand-gold/20 pt-2 flex justify-between text-sm font-bold text-brand-gold">
              <span>Totale Stimato ({quantity} pz):</span>
              <span className="font-mono text-base">€{getDynamicTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
