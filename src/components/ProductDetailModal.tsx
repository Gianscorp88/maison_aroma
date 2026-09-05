'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { useShopSettings } from '@/context/ShopSettingsContext';
import { X, Check, ShoppingBag, Sparkles, ShieldCheck, Truck, Lock, Leaf, Flame, Award, Home, Gift, Palette } from 'lucide-react';

export interface CandleProductDetail {
  id: string;
  name: string;
  categoryName: string;
  basePrice: number;
  descriptionParagraph1: string;
  descriptionParagraph2: string;
  galleryImages: { label: string; url: string }[];
  fragranceNotes: { note: string; detail: string }[];
  dimensionsTech?: string;
}

interface ProductDetailModalProps {
  product: CandleProductDetail;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFragranceInput, setShowFragranceInput] = useState(false);
  const [customFragranceRequest, setCustomFragranceRequest] = useState('');
  const [showColorInput, setShowColorInput] = useState(false);
  const [customColorRequest, setCustomColorRequest] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);

  const { addItem } = useCartStore();
  const { isShopMode } = useShopSettings();

  const formattedPrice = product.basePrice.toFixed(2).replace('.', ',');

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.galleryImages[0]?.url || '',
      basePrice: product.basePrice,
      unitPrice: product.basePrice,
      quantity: 1,
      minQuantity: 1,
      customization: {
        eventType: product.categoryName,
        fragrance: showFragranceInput && customFragranceRequest ? `Personalizzata: ${customFragranceRequest}` : product.fragranceNotes.map(n => n.note).join(', '),
        customColor: showColorInput && customColorRequest ? `Personalizzato: ${customColorRequest}` : undefined,
        packaging: 'Scatola Luxury Avorio',
      },
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const getWhatsAppAdviceLink = () => {
    const msg = `Ciao Maison Aroma! Avrei bisogno di un consiglio per la candela "${product.name}" (€${formattedPrice}).`;
    return `https://wa.me/393401234567?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-teal-deep/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white text-brand-teal-deep max-w-4xl w-full rounded-lg border border-brand-teal/30 shadow-luxury-lg overflow-hidden relative my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-brand-teal-light/50 border-b border-brand-teal/20 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-teal">
              Creazione Artigianale • {product.categoryName}
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-teal-deep mt-0.5">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-brand-stone hover:text-brand-teal-deep rounded-full hover:bg-brand-teal-soft transition-colors"
            aria-label="Chiudi"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[82vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left: Photo Gallery */}
            <div className="space-y-4">
              <div className="h-80 sm:h-96 bg-brand-teal-light/40 rounded-lg overflow-hidden border border-brand-teal/20 relative shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.galleryImages[activeImageIndex]?.url || product.galleryImages[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Thumbnail Bar */}
              <div className="grid grid-cols-4 gap-2">
                {product.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-20 rounded-md overflow-hidden border-2 transition-all relative ${
                      activeImageIndex === idx ? 'border-brand-teal shadow-md scale-[1.02]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Price, Badges, Features */}
            <div className="space-y-6">
              
              {/* Badges (3 badge ufficiali) */}
              <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-semibold">
                <span className="px-3 py-1 bg-brand-teal-light text-brand-teal border border-brand-teal/25 rounded-full flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-brand-teal" /> Cera di Soia
                </span>
                <span className="px-3 py-1 bg-brand-teal-light text-brand-teal border border-brand-teal/25 rounded-full flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-brand-teal" /> Fatta a Mano
                </span>
                <span className="px-3 py-1 bg-brand-teal-light text-brand-teal border border-brand-teal/25 rounded-full flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-brand-teal" /> Made in Italy
                </span>
              </div>

              {/* Prezzo Semplificato */}
              <div className="border-b border-brand-teal/15 pb-4 space-y-1">
                <div className="text-3xl sm:text-4xl font-serif font-bold text-brand-teal-deep">
                  €{formattedPrice}
                </div>
                <p className="text-[10px] text-brand-stone font-light tracking-wide uppercase">
                  IVA inclusa
                </p>
              </div>

              {/* Descrizione Sintetica (Max 4-5 righe) */}
              <div className="text-xs text-brand-stone leading-relaxed font-light">
                <p className="line-clamp-5">
                  {product.descriptionParagraph1} {product.descriptionParagraph2}
                </p>
              </div>

              {/* Box Informativo Artigianale */}
              <div className="p-3.5 bg-brand-teal-light/40 border-l-2 border-brand-teal rounded-r-md flex items-center space-x-2.5 text-xs text-brand-teal-deep">
                <Sparkles className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span className="font-serif italic text-brand-teal-deep/90">
                  ✨ Ogni candela è realizzata a mano e può presentare leggere variazioni che la rendono unica.
                </span>
              </div>

              {/* Caratteristiche con Icone SVG Minimal */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal-deep">Caratteristiche</h4>
                <ul className="grid grid-cols-2 gap-3 text-xs text-brand-stone font-light">
                  <li className="flex items-center space-x-2.5">
                    <Leaf className="w-4 h-4 text-brand-teal flex-shrink-0" />
                    <span>Cera di soia naturale</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Flame className="w-4 h-4 text-brand-teal flex-shrink-0" />
                    <span>Colata a mano</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Award className="w-4 h-4 text-brand-teal flex-shrink-0" />
                    <span>Made in Italy</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <Home className="w-4 h-4 text-brand-teal flex-shrink-0" />
                    <span>Perfetta per arredare</span>
                  </li>
                  <li className="flex items-center space-x-2.5 col-span-2">
                    <Gift className="w-4 h-4 text-brand-teal flex-shrink-0" />
                    <span>Ideale come regalo elegante</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Profilo Olfattivo Section */}
          <div className="bg-brand-teal-light/20 p-6 rounded-lg border border-brand-teal/15 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-brand-teal/15 pb-3">
              <h4 className="font-serif font-bold text-sm text-brand-teal-deep flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-teal" />
                <span>Profilo Olfattivo</span>
              </h4>

              {/* Link discreto per personalizzazione */}
              <button
                onClick={() => setShowFragranceInput(!showFragranceInput)}
                className="text-[11px] text-brand-stone hover:text-brand-teal transition-colors font-medium underline underline-offset-2"
              >
                {showFragranceInput ? 'Usa fragranza standard' : 'Vuoi una fragranza personalizzata?'}
              </button>
            </div>

            {/* Griglia Note Olfattive Pulita (Senza ripetizioni "NOTA OLFATTIVA") */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {product.fragranceNotes.map((noteItem, idx) => (
                <div key={idx} className="bg-white p-4 rounded-md border border-brand-teal/15 space-y-1 shadow-2xs">
                  <p className="font-serif font-bold text-brand-teal-deep text-sm">{noteItem.note}</p>
                  <p className="text-[11px] text-brand-stone italic">{noteItem.detail}</p>
                </div>
              ))}
            </div>

            {showFragranceInput && (
              <div className="pt-2 space-y-2 bg-white p-4 rounded-md border border-brand-teal/30 animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-brand-teal-deep uppercase tracking-wider">
                  Specifica le note olfattive desiderate:
                </label>
                <input
                  type="text"
                  placeholder="es. Desidero fragranza al fior di cotone con note di talco..."
                  value={customFragranceRequest}
                  onChange={(e) => setCustomFragranceRequest(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-brand-teal/30 rounded-md bg-white focus:outline-none focus:border-brand-teal"
                />
                <p className="text-[10px] text-brand-stone">
                  ✨ Formuleremo una bozza olfattiva su misura per il tuo lotto.
                </p>
              </div>
            )}
          </div>

          {/* Colore della candela */}
          <div className="bg-brand-teal-light/20 p-6 rounded-lg border border-brand-teal/15 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-brand-teal/15 pb-3">
              <h4 className="font-serif font-bold text-sm text-brand-teal-deep flex items-center space-x-2">
                <Palette className="w-4 h-4 text-brand-teal" />
                <span>Colore della candela</span>
              </h4>

              <button
                onClick={() => setShowColorInput(!showColorInput)}
                className="text-[11px] text-brand-stone hover:text-brand-teal transition-colors font-medium underline underline-offset-2"
              >
                {showColorInput ? 'Usa colore standard' : 'Indica un colore personalizzato'}
              </button>
            </div>

            {!showColorInput ? (
              <div className="bg-white p-4 rounded-md border border-brand-teal/15 flex items-center justify-between shadow-2xs text-xs">
                <div className="flex items-center space-x-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-100/80 border border-brand-teal/20 flex-shrink-0" />
                  <span className="font-serif font-bold text-brand-teal-deep text-xs">Colore Standard della Creazione</span>
                </div>
                <span className="text-[11px] text-brand-stone italic">Avorio Naturale Soia</span>
              </div>
            ) : (
              <div className="pt-1 space-y-2 bg-white p-4 rounded-md border border-brand-teal/30 animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-brand-teal-deep uppercase tracking-wider">
                  Indica il colore desiderato:
                </label>
                <input
                  type="text"
                  placeholder="es. Rosa cipria, avorio caldo, verde salvia, azzurro polvere..."
                  value={customColorRequest}
                  onChange={(e) => setCustomColorRequest(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-brand-teal/30 rounded-md bg-white focus:outline-none focus:border-brand-teal"
                />
                <p className="text-[10px] text-brand-stone">
                  ✨ Realizzeremo la tua candela nel colore indicato, compatibilmente con le caratteristiche della lavorazione artigianale.
                </p>
              </div>
            )}
          </div>

          {/* Technical Info Collapsible Dropdown */}
          <div className="border border-brand-teal/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowTechDetails(!showTechDetails)}
              className="w-full p-4 bg-brand-cream/40 flex justify-between items-center text-xs font-medium text-brand-teal-deep hover:bg-brand-teal-light/40 transition-colors"
            >
              <span>Informazioni Tecniche (Dimensioni & Materiali)</span>
              <span className="text-brand-teal text-sm font-bold">{showTechDetails ? '−' : '+'}</span>
            </button>

            {showTechDetails && (
              <div className="p-4 bg-white text-xs text-brand-stone space-y-2 border-t border-brand-teal/15 font-mono">
                <p><strong>Materiale Vaso:</strong> {product.dimensionsTech || 'Vetro farmacista rigenerato / Cemento ceramico colato'}</p>
                <p><strong>Cera:</strong> 100% Cera di soia naturale priva di paraffina e ftalati</p>
                <p><strong>Stoppino:</strong> 100% Cotone biologico non trattato</p>
              </div>
            )}
          </div>

          {isShopMode && addedNotice && (
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-lg flex items-center space-x-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Candela aggiunta al carrello con successo! <Link href="/checkout" className="underline font-bold">Procedi al Checkout →</Link></span>
            </div>
          )}

          {/* Premium Call-to-Action Button & Trust Signals */}
          <div className="space-y-5 pt-2">
            {isShopMode && (
              <button
                onClick={handleAddToCart}
                className="w-full py-4.5 px-6 bg-brand-teal text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-brand-teal-dark transition-all duration-300 rounded-[9px] shadow-luxury flex items-center justify-center space-x-2 text-sm"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Aggiungi al Carrello — €{formattedPrice}</span>
              </button>
            )}

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-brand-stone pt-2 border-t border-brand-teal/15 font-medium">
              <span className="flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-teal" />
                <span>Spedizione in 24/48h</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-teal" />
                <span>Pagamenti Sicuri</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                <span>Imballaggio Protetto</span>
              </span>
            </div>

            {/* Subtle Advice link */}
            <div className="text-center pt-1">
              <a
                href={getWhatsAppAdviceLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand-stone hover:text-brand-teal transition-colors font-medium inline-flex items-center space-x-1 underline underline-offset-2"
              >
                <span>Hai bisogno di un consiglio? Contattaci su WhatsApp →</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
