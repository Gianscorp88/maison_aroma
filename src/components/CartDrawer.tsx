'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { useShopSettings } from '@/context/ShopSettingsContext';
import { ShoppingBag, X, Trash2, Plus, Minus, Tag, ArrowRight, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';

export default function CartDrawer() {
  const { isShopMode } = useShopSettings();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    promoCode,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDiscountAmount,
    getShippingEstimate,
    getTotal,
  } = useCartStore();

  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');

  if (!isOpen || !isShopMode) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    setCodeSuccess('');
    const success = applyPromoCode(inputCode);
    if (success) {
      setCodeSuccess('Codice promozionale applicato con successo!');
      setInputCode('');
    } else {
      setCodeError('Codice non valido. Prova "MAISON10" o "SPOSA2026"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-espresso/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-ivory text-brand-espresso shadow-luxury-lg flex flex-col justify-between border-l border-brand-gold/20">
          
          {/* Header */}
          <div className="p-6 border-b border-brand-linen flex items-center justify-between bg-brand-cream/50">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              <h2 className="text-xl font-serif tracking-wide text-brand-espresso font-semibold">
                Il Tuo Carrello ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-brand-stone hover:text-brand-espresso transition-colors rounded-full hover:bg-brand-linen/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-cream mx-auto flex items-center justify-center text-brand-gold">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif text-brand-espresso">Il carrello è vuoto</h3>
                <p className="text-sm text-brand-stone max-w-xs mx-auto">
                  Esplora il nostro catalogo o crea la tua candela personalizzata per il tuo evento.
                </p>
                <button
                  onClick={closeCart}
                  className="inline-block mt-4 px-6 py-2.5 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-medium hover:bg-brand-gold hover:text-brand-espresso transition-all duration-300 rounded-sm"
                >
                  Inizia a Personalizzare
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex space-x-4 p-4 rounded-sm border border-brand-linen bg-white shadow-sm hover:border-brand-gold/40 transition-all"
                  >
                    <div className="w-20 h-20 bg-brand-cream rounded-sm overflow-hidden flex-shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-serif font-semibold text-brand-espresso line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-brand-stone hover:text-red-600 transition-colors ml-2"
                            title="Rimuovi prodotto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Customization Metadata Preview */}
                        {item.customization && (
                          <div className="mt-1 text-xs text-brand-stone space-y-0.5 border-l-2 border-brand-gold/40 pl-2 py-0.5 bg-brand-cream/30 rounded-r-xs">
                            {item.customization.eventType && (
                              <p className="font-medium text-brand-espresso">Evento: {item.customization.eventType}</p>
                            )}
                            {item.customization.fragrance && (
                              <p>Fragranza: {item.customization.fragrance}</p>
                            )}
                            {item.customization.customColor && (
                              <p>Colore: {item.customization.customColor}</p>
                            )}
                            {item.customization.namesText && (
                              <p>Nomi: &ldquo;{item.customization.namesText}&rdquo;</p>
                            )}
                            {item.customization.dateText && (
                              <p>Data: {item.customization.dateText}</p>
                            )}
                            {item.customization.packaging && (
                              <p className="truncate">Packaging: {item.customization.packaging}</p>
                            )}
                          </div>
                        )}

                        <div className="mt-2 text-xs font-semibold text-brand-gold">
                          €{item.unitPrice.toFixed(2)} Cad.
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-brand-linen/40">
                        <div className="flex items-center border border-brand-linen rounded-sm bg-brand-ivory">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-brand-linen text-brand-stone transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-medium text-brand-espresso">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-brand-linen text-brand-stone transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-brand-espresso">
                          €{(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Form */}
                <div className="pt-4 border-t border-brand-linen">
                  {promoCode ? (
                    <div className="flex justify-between items-center p-2.5 bg-emerald-50 text-emerald-800 rounded-sm text-xs border border-emerald-200">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Codice <strong>{promoCode}</strong> applicato</span>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-emerald-700 hover:underline font-medium"
                      >
                        Rimuovi
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCode} className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Codice Promozionale (es. MAISON10)"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value)}
                          className="flex-1 px-3 py-2 text-xs border border-brand-linen rounded-sm bg-white focus:outline-none focus:border-brand-gold"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-brand-espresso text-brand-ivory text-xs tracking-wider hover:bg-brand-gold hover:text-brand-espresso transition-colors rounded-sm"
                        >
                          Applica
                        </button>
                      </div>
                      {codeError && <p className="text-xs text-red-600">{codeError}</p>}
                      {codeSuccess && <p className="text-xs text-emerald-600 flex items-center gap-1"><Check className="w-3 h-3"/>{codeSuccess}</p>}
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-brand-linen bg-brand-cream/40 space-y-4">
              <div className="space-y-2 text-xs text-brand-stone">
                <div className="flex justify-between">
                  <span>Subtotale:</span>
                  <span className="text-brand-espresso font-medium">€{getSubtotal().toFixed(2)}</span>
                </div>
                {getDiscountAmount() > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Sconto promozionale:</span>
                    <span>-€{getDiscountAmount().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Spedizione stimata:</span>
                  <span className="text-brand-espresso font-medium">
                    {getShippingEstimate() === 0 ? (
                      <span className="text-emerald-700 font-medium">GRATUITA</span>
                    ) : (
                      `€${getShippingEstimate().toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-semibold text-brand-espresso pt-2 border-t border-brand-linen">
                  <span>Totale Stimato:</span>
                  <span className="text-brand-gold font-sans font-bold">€{getTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-all duration-300 rounded-sm shadow-luxury"
                >
                  <span>Procedi al Checkout Locale</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex justify-between text-[10px] text-brand-stone text-center pt-1">
                  <span>✨ Colate a mano in Italia</span>
                  <span>🔒 Checkout di Prova Locale</span>
                  <span>🚚 Spedizione Assicurata</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
