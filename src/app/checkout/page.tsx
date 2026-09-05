'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { useShopSettings } from '@/context/ShopSettingsContext';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, ShieldCheck, Check, AlertTriangle, ArrowRight, Lock, Building, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDiscountAmount, getShippingEstimate, getTotal, clearCart } = useCartStore();
  const { isShopMode, loading: settingsLoading } = useShopSettings();

  useEffect(() => {
    if (!settingsLoading && !isShopMode) {
      router.replace('/shop');
    }
  }, [isShopMode, settingsLoading, router]);

  const [formData, setFormData] = useState({
    firstName: 'Giulia',
    lastName: 'Bianchi',
    email: 'sposa@maisonaroma.it',
    phone: '+39 333 9988776',
    street: 'Via della Spiga 14',
    city: 'Milano',
    province: 'MI',
    postalCode: '20121',
    country: 'Italia',
    eventType: 'Matrimonio',
    eventDate: '2026-09-15',
    notes: 'Si prega di consegnare entro le ore 12:00 in location.',
    paymentMethod: 'TEST_APPROVED',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!settingsLoading && !isShopMode) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-serif text-brand-espresso">Acquisto Online Non Disponibile</h1>
        <p className="text-sm text-brand-stone">Il sito è attualmente in modalità vetrina. Per informazioni o preventivi personalizzati, puoi contattarci o esplorare le creazioni.</p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-colors rounded-sm"
          >
            Esplora lo Shop
          </Link>
          <Link
            href="/request-quote"
            className="inline-block px-6 py-3 border border-brand-espresso text-brand-espresso text-xs uppercase tracking-widest font-semibold hover:bg-brand-cream transition-colors rounded-sm"
          >
            Richiedi Preventivo
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-3xl font-serif text-brand-espresso">Il tuo carrello è vuoto</h1>
        <p className="text-sm text-brand-stone">Aggiungi prodotti o crea la tua candela personalizzata per procedere al checkout.</p>
        <Link
          href="/customizer"
          className="inline-block px-6 py-3 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-colors rounded-sm"
        >
          Crea una Candela Personalizzata
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          street: formData.street,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: formData.country,
          eventType: formData.eventType,
          eventDate: formData.eventDate,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            basePrice: i.basePrice,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
            image: i.image,
            customization: i.customization,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Errore nella creazione dell’ordine.');
      }

      if (typeof window !== 'undefined' && formData.email) {
        sessionStorage.setItem('maison_customer_email', formData.email.trim().toLowerCase());
      }

      clearCart();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Qualcosa è andato storto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      
      {/* Header */}
      <div className="border-b border-brand-linen pb-6">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-brand-gold font-bold">
          <Lock className="w-4 h-4" />
          <span>Checkout Sicuro Locale — Fase 1 (Senza Dipendenza Stripe)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-espresso mt-1">
          Finalizza il Tuo Ordine
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 text-xs rounded-sm flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Customer Info */}
          <div className="bg-white p-6 rounded-sm border border-brand-linen shadow-sm space-y-4">
            <h3 className="font-serif text-lg text-brand-espresso font-semibold border-b border-brand-linen pb-2">
              1. Dettagli Cliente & Contatti
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-brand-espresso mb-1">Nome:</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-brand-espresso mb-1">Cognome:</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-brand-espresso mb-1">Email per Conferma:</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-brand-espresso mb-1">Telefono (per Corriere):</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address & Event Date */}
          <div className="bg-white p-6 rounded-sm border border-brand-linen shadow-sm space-y-4">
            <h3 className="font-serif text-lg text-brand-espresso font-semibold border-b border-brand-linen pb-2">
              2. Indirizzo di Spedizione & Dati Evento
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium text-brand-espresso mb-1">Indirizzo & Numero Civico:</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-brand-espresso mb-1">Città:</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-brand-espresso mb-1">Provincia:</label>
                  <input
                    type="text"
                    required
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold uppercase"
                  />
                </div>
                <div>
                  <label className="block font-medium text-brand-espresso mb-1">CAP:</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-brand-espresso mb-1">Tipo di Evento:</label>
                <input
                  type="text"
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block font-medium text-brand-espresso mb-1">Data dell’Evento:</label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-brand-espresso mb-1">Note per la Consegna / Artigiano:</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Local Test Payment Methods */}
          <div className="bg-white p-6 rounded-sm border border-brand-linen shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-brand-linen pb-2">
              <h3 className="font-serif text-lg text-brand-espresso font-semibold">
                3. Metodo di Pagamento Locale (Simulato)
              </h3>
              <span className="text-[10px] uppercase font-bold text-brand-gold bg-brand-cream px-2 py-0.5 rounded-xs border border-brand-gold/30">
                Sviluppo Locale SENZA Stripe
              </span>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Option 1: Test Payment Approved */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-sm border cursor-pointer transition-all ${
                  formData.paymentMethod === 'TEST_APPROVED'
                    ? 'border-brand-gold bg-brand-cream/60 ring-1 ring-brand-gold'
                    : 'border-brand-linen hover:border-brand-stone'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="TEST_APPROVED"
                  checked={formData.paymentMethod === 'TEST_APPROVED'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center space-x-2 font-bold text-brand-espresso">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>Pagamento di Prova Approvato (Simulazione Carta OK)</span>
                  </div>
                  <p className="text-brand-stone text-[11px] mt-0.5">
                    Simula la transazione eseguita con successo. L’ordine risulterà immediatamente <strong className="text-emerald-700">PAID</strong>.
                  </p>
                </div>
              </label>

              {/* Option 2: Bank Transfer */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-sm border cursor-pointer transition-all ${
                  formData.paymentMethod === 'BANK_TRANSFER'
                    ? 'border-brand-gold bg-brand-cream/60 ring-1 ring-brand-gold'
                    : 'border-brand-linen hover:border-brand-stone'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="BANK_TRANSFER"
                  checked={formData.paymentMethod === 'BANK_TRANSFER'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center space-x-2 font-bold text-brand-espresso">
                    <Building className="w-4 h-4 text-brand-gold" />
                    <span>Bonifico Bancario Anticipato</span>
                  </div>
                  <p className="text-brand-stone text-[11px] mt-0.5">
                    Riceverai le coordinate IBAN nella pagina di conferma. L’ordine risulterà <strong className="text-amber-700">AWAITING_TRANSFER</strong>.
                  </p>
                </div>
              </label>

              {/* Option 3: Test Payment Declined */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-sm border cursor-pointer transition-all ${
                  formData.paymentMethod === 'TEST_DECLINED'
                    ? 'border-brand-gold bg-brand-cream/60 ring-1 ring-brand-gold'
                    : 'border-brand-linen hover:border-brand-stone'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="TEST_DECLINED"
                  checked={formData.paymentMethod === 'TEST_DECLINED'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center space-x-2 font-bold text-brand-espresso">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Test Carta Rifiutata (Verifica Gestione Errori)</span>
                  </div>
                  <p className="text-brand-stone text-[11px] mt-0.5">
                    Simula un rifiuto del pagamento per testare la segnalazione di errore.
                  </p>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right Order Summary & Confirm */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-cream/60 p-6 rounded-sm border border-brand-linen shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-xl text-brand-espresso font-semibold border-b border-brand-linen pb-3">
              Riepilogo Ordine ({items.length} Articoli)
            </h3>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 text-xs">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start border-b border-brand-linen/40 pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-brand-espresso">{item.name}</h4>
                    <p className="text-brand-stone font-mono">Q.tà: {item.quantity} x €{item.unitPrice.toFixed(2)}</p>
                    {item.customization?.fragrance && (
                      <p className="text-[10px] text-brand-stone italic">Fragranza: {item.customization.fragrance}</p>
                    )}
                    {item.customization?.customColor && (
                      <p className="text-[10px] text-brand-teal font-medium">Colore: {item.customization.customColor}</p>
                    )}
                    {item.customization?.namesText && (
                      <p className="text-[10px] text-brand-gold font-medium">Nomi: {item.customization.namesText}</p>
                    )}
                  </div>
                  <span className="font-semibold text-brand-espresso">
                    €{(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-brand-espresso border-t border-brand-linen pt-4">
              <div className="flex justify-between">
                <span>Subtotale:</span>
                <span>€{getSubtotal().toFixed(2)}</span>
              </div>
              {getDiscountAmount() > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Sconto Promozionale:</span>
                  <span>-€{getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Spedizione Express Italia:</span>
                <span>{getShippingEstimate() === 0 ? <strong className="text-emerald-700">GRATIS</strong> : `€${getShippingEstimate().toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-serif font-bold text-brand-espresso pt-3 border-t border-brand-linen">
                <span>Totale Da Pagare:</span>
                <span className="text-brand-gold font-sans">€{getTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-all duration-300 rounded-sm shadow-luxury flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Creazione Ordine In Corso...</span>
              ) : (
                <>
                  <span>Conferma Ordine Locale (€{getTotal().toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[10px] text-brand-stone text-center space-y-1">
              <p>🔒 Transazione locale di test sicura. Nessun addebito su carte reali.</p>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
