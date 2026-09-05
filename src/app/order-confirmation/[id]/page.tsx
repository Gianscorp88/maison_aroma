import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { CheckCircle2, Clock, PackageCheck, Truck, Building, FileText, ArrowRight, Mail } from 'lucide-react';

export const revalidate = 0;

interface OrderConfirmationPageProps {
  params: {
    id: string;
  };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: { product: true },
      },
      proofs: true,
    },
  });

  if (!order) {
    notFound();
  }

  const shippingAddress = JSON.parse(order.shippingAddress || '{}');

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-brand-cream border border-brand-gold/40 rounded-sm p-8 text-center space-y-4 shadow-luxury">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-300">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-3xl font-serif text-brand-espresso">
          Grazie per il Tuo Ordine, {order.customerName}!
        </h1>

        <p className="text-sm text-brand-stone max-w-md mx-auto">
          Il tuo ordine <strong>#{order.orderNumber}</strong> è stato registrato con successo nel nostro atelier.
        </p>

        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-brand-gold/30 rounded-full text-xs font-semibold text-brand-gold">
          <span>Stato Pagamento: {order.paymentStatus}</span>
          <span>•</span>
          <span>Stato Ordine: {order.status}</span>
        </div>
      </div>

      {/* IBAN Notice if Bank Transfer */}
      {order.paymentMethod === 'BANK_TRANSFER' && (
        <div className="p-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-sm space-y-2 text-xs">
          <div className="flex items-center space-x-2 font-bold text-sm">
            <Building className="w-5 h-5 text-amber-700" />
            <span>Coordinate per Bonifico Bancario</span>
          </div>
          <p>Effettua il versamento di <strong>€{order.totalAmount.toFixed(2)}</strong> indicando la causale &ldquo;{order.orderNumber}&rdquo;.</p>
          <div className="p-3 bg-white rounded border border-amber-200 font-mono space-y-1">
            <p><strong>Beneficiario:</strong> Maison Aroma Creazioni S.r.l.</p>
            <p><strong>IBAN:</strong> IT 99 MAIS 0123 4567 8901 2345 6789</p>
            <p><strong>Banca:</strong> Unicredit Atelier Firenze</p>
          </div>
        </div>
      )}

      {/* Stato del tuo ordine */}
      <div className="bg-white p-6 rounded-sm border border-brand-linen shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-semibold text-brand-espresso border-b border-brand-linen pb-3">
          Stato del tuo ordine
        </h3>

        {/* Single status card */}
        <div className="p-4 bg-brand-cream border border-brand-gold/40 rounded-xs flex items-center space-x-3">
          <CheckCircle2 className="w-6 h-6 text-brand-gold shrink-0" />
          <div>
            <span className="font-bold text-brand-espresso block text-sm uppercase tracking-wider">Ordine ricevuto</span>
            <span className="text-xs text-brand-stone">Il tuo ordine è stato registrato correttamente.</span>
          </div>
        </div>

        {/* Informative email notice */}
        <div className="p-4 bg-brand-cream/60 border border-brand-gold/30 rounded-xs text-xs flex items-start space-x-3 text-brand-espresso">
          <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
          <p>
            Ti terremo aggiornato via email. Riceverai una comunicazione quando il tuo ordine verrà spedito oppure, quando previsto, con la bozza grafica e tutte le indicazioni necessarie per approvarla.
          </p>
        </div>
      </div>

      {/* Order Item Details */}
      <div className="bg-white p-6 rounded-sm border border-brand-linen shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-semibold text-brand-espresso border-b border-brand-linen pb-3">
          Dettaglio Articoli Ordinati
        </h3>

        <div className="space-y-4 text-xs divide-y divide-brand-linen">
          {order.items.map((item) => {
            let customPayload: any = {};
            try {
              customPayload = JSON.parse(item.customization);
            } catch (e) {}

            return (
              <div key={item.id} className="pt-4 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-sm text-brand-espresso">{item.product.name}</h4>
                  <p className="text-brand-stone">Quantità: {item.quantity} pz • €{item.unitPrice.toFixed(2)} Cad.</p>
                  
                  {(customPayload.fragrance || customPayload.fragranceName || customPayload.customColor || customPayload.namesText) && (
                    <div className="bg-brand-cream/60 p-2.5 rounded-xs border border-brand-gold/30 mt-2 space-y-0.5">
                      {(customPayload.fragrance || customPayload.fragranceName) && (
                        <p className="font-semibold text-brand-espresso">
                          Fragranza: {customPayload.fragrance !== 'Fragranza' ? customPayload.fragrance : customPayload.fragranceName || 'Fior di Cotone'}
                        </p>
                      )}
                      {customPayload.customColor && <p className="font-semibold text-brand-teal font-medium">Colore: {customPayload.customColor}</p>}
                      {customPayload.namesText && <p>Nomi: &ldquo;{customPayload.namesText}&rdquo;</p>}
                      {customPayload.dateText && <p>Data: {customPayload.dateText}</p>}
                      {customPayload.packaging && <p>Packaging: {customPayload.packaging}</p>}
                    </div>
                  )}
                </div>

                <div className="text-right font-serif font-bold text-base text-brand-espresso">
                  €{(item.unitPrice * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-brand-linen pt-4 text-xs space-y-1 text-right">
          <p>Subtotale: €{order.subtotal.toFixed(2)}</p>
          <p>Spedizione: {order.shippingFee === 0 ? 'GRATIS' : `€${order.shippingFee.toFixed(2)}`}</p>
          <p className="text-base font-serif font-bold text-brand-gold">Totale: €{order.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Customer Action Buttons */}
      <div className="flex justify-center items-center pt-4">
        <Link
          href="/shop"
          className="px-6 py-3 border border-brand-espresso text-brand-espresso text-xs uppercase tracking-widest font-semibold hover:bg-brand-cream transition-colors rounded-sm"
        >
          Torna allo Shop
        </Link>
      </div>

    </div>
  );
}
