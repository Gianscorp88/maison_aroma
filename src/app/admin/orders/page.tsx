import React from 'react';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { ShoppingBag, Send, Mail, CheckCircle2, FileText } from 'lucide-react';
import { sendOrderStatusUpdateEmail, sendProofEmail } from '@/lib/email-service';

export const revalidate = 0;

async function updateOrderStatus(formData: FormData) {
  'use server';
  const orderId = formData.get('orderId') as string;
  const status = formData.get('status') as string;
  const paymentStatus = formData.get('paymentStatus') as string;

  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data: {
      status,
      paymentStatus,
    },
    include: {
      items: { include: { product: true } },
    },
  });

  // Automatically trigger email update to customer
  await sendOrderStatusUpdateEmail(updatedOrder, status);

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
}

async function sendProofToCustomer(formData: FormData) {
  'use server';
  const orderId = formData.get('orderId') as string;
  const proofUrl = formData.get('proofUrl') as string;
  const proofNotes = formData.get('proofNotes') as string;

  if (!proofUrl) return;

  const updatedOrder = await db.order.update({
    where: { id: orderId },
    data: {
      proofStatus: 'PROOF_SENT',
    },
  });

  // Create proof record
  await db.proofVersion.create({
    data: {
      orderId: updatedOrder.id,
      imageUrl: proofUrl,
      notes: proofNotes || '',
      status: 'SENT',
    },
  });

  // Send proof email to customer
  await sendProofEmail(updatedOrder, proofUrl, proofNotes);

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
}

export default async function AdminOrdersPage() {
  let orders: any[] = [];
  try {
    orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
        proofs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  } catch (err) {
    console.error('Failed to query orders in AdminOrdersPage:', err);
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Gestione Vendite & Lotti</span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Ordini Clienti ({orders.length})</h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-neutral-950 p-12 text-center rounded-sm border border-neutral-800 space-y-3">
          <ShoppingBag className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-serif text-white">Nessun ordine presente</h3>
          <p className="text-xs text-neutral-400">Gli ordini inviati dal sito appariranno automaticamente in questa schermata.</p>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {orders.map((order) => {
            let shippingAddress: any = {};
            try {
              shippingAddress = JSON.parse(order.shippingAddress || '{}');
            } catch {
              shippingAddress = { street: order.shippingAddress || '' };
            }
            const latestProof = order.proofs?.[0];

            return (
              <div key={order.id} className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-6 shadow-lg">
                
                {/* Order Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-800 pb-4 gap-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-lg font-bold text-amber-500">#{order.orderNumber}</span>
                      <span className="text-xs text-neutral-400 font-sans">
                        {new Date(order.createdAt).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white mt-1">
                      Cliente: {order.customerName} (<a href={`mailto:${order.customerEmail}`} className="text-amber-400 underline">{order.customerEmail}</a>) • Tel: {order.customerPhone}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Spedizione: {shippingAddress.street}, {shippingAddress.city} ({shippingAddress.province}) {shippingAddress.postalCode}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-neutral-400">Totale Ordine:</span>
                    <span className="font-serif text-xl font-bold text-amber-400">€{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Items & Customizations */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-400">Articoli Acquistati & Personalizzazioni:</h4>
                  <div className="space-y-2">
                    {order.items.map((item: any) => {
                      let customPayload: any = {};
                      try {
                        customPayload = typeof item.customization === 'string' ? JSON.parse(item.customization) : item.customization || {};
                      } catch (e) {}

                      return (
                        <div key={item.id} className="p-3 bg-neutral-900 rounded-xs border border-neutral-800 text-xs flex justify-between items-start">
                          <div>
                            <p className="font-bold text-white">{item.product?.name || 'Candela Personalizzata'}</p>
                            <p className="text-neutral-400">Q.tà: {item.quantity} pz • Prezzo Unitario: €{item.unitPrice.toFixed(2)}</p>
                            
                            {(customPayload.fragrance || customPayload.ribbonColor || customPayload.namesText || customPayload.packaging) && (
                              <div className="mt-2 text-[11px] text-amber-300 space-y-0.5 border-l-2 border-amber-500 pl-2">
                                {customPayload.fragrance && <p>Fragranza: {customPayload.fragrance}</p>}
                                {customPayload.ribbonColor && <p className="text-teal-300 font-bold">Nastro: {customPayload.ribbonColor}</p>}
                                {customPayload.namesText && <p>Nomi Etichetta: &ldquo;{customPayload.namesText}&rdquo;</p>}
                                {customPayload.dateText && <p>Data Etichetta: {customPayload.dateText}</p>}
                                {customPayload.phraseText && <p>Frase: &ldquo;{customPayload.phraseText}&rdquo;</p>}
                                {customPayload.packaging && <p>Packaging: {customPayload.packaging}</p>}
                              </div>
                            )}
                          </div>

                          <span className="font-bold text-white font-mono">
                            €{(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Send Graphic Proof via Email Form */}
                <div className="bg-neutral-900/60 p-4 rounded-xs border border-neutral-800 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Mail className="w-4 h-4" />
                    <span>Invia Bozza Grafica via Email al Cliente</span>
                  </div>

                  {latestProof && (
                    <p className="text-xs text-neutral-400 italic">
                      Ultime bozze inviate: v{latestProof.version} ({new Date(latestProof.createdAt).toLocaleDateString('it-IT')})
                    </p>
                  )}

                  <form action={sendProofToCustomer} className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs items-end">
                    <input type="hidden" name="orderId" value={order.id} />
                    
                    <div className="md:col-span-5">
                      <label className="block text-neutral-400 font-medium mb-1">URL Immagine Bozza *</label>
                      <input
                        type="text"
                        name="proofUrl"
                        required
                        placeholder="https://... oppure /images/..."
                        className="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-700 text-white rounded-xs"
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label className="block text-neutral-400 font-medium mb-1">Note per il Cliente</label>
                      <input
                        type="text"
                        name="proofNotes"
                        placeholder="es. Bozza etichetta con font Playfair ed inchiostro dorato."
                        className="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-700 text-white rounded-xs"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 font-bold uppercase rounded-xs flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Invia Bozza</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Status Editor Form */}
                <form action={updateOrderStatus} className="bg-neutral-900 p-4 rounded-xs border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs">
                  <input type="hidden" name="orderId" value={order.id} />
                  
                  <div>
                    <label className="block text-neutral-400 font-medium mb-1">Stato Ordine:</label>
                    <select
                      name="status"
                      defaultValue={order.status}
                      className="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-700 text-white rounded-xs font-bold"
                    >
                      <option value="RECEIVED">RICEVUTO</option>
                      <option value="PROOF_PENDING">BOZZA IN ATTESA</option>
                      <option value="IN_PRODUCTION">IN PRODUZIONE</option>
                      <option value="QUALITY_CHECK">CONTROLLO QUALITÀ</option>
                      <option value="SHIPPED">SPEDITO</option>
                      <option value="DELIVERED">CONSEGNATO</option>
                      <option value="CANCELLED">ANNULLATO</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-medium mb-1">Stato Pagamento:</label>
                    <select
                      name="paymentStatus"
                      defaultValue={order.paymentStatus}
                      className="w-full px-2 py-1.5 bg-neutral-950 border border-neutral-700 text-white rounded-xs font-bold"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID (SALDATO)</option>
                      <option value="AWAITING_TRANSFER">IN ATTESA BONIFICO</option>
                      <option value="FAILED">FAILED</option>
                      <option value="REFUNDED">RIMBORSATO</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors rounded-xs"
                    >
                      Aggiorna Stato & Invia Email
                    </button>
                  </div>
                </form>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
