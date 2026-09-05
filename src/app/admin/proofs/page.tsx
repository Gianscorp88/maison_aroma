import React from 'react';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Image, Upload, CheckCircle2, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export const revalidate = 0;

async function createProofVersion(formData: FormData) {
  'use server';
  const orderId = formData.get('orderId') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const notes = formData.get('notes') as string;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { proofs: true },
  });

  if (order) {
    const nextVersion = order.proofs.length + 1;

    await db.proofVersion.create({
      data: {
        orderId,
        version: nextVersion,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
        notes: notes || 'Bozza digitale etichetta e packaging allegata per approvazione.',
        status: 'PENDING',
      },
    });

    await db.order.update({
      where: { id: orderId },
      data: {
        proofStatus: 'PROOF_SENT',
        status: 'PROOF_PENDING',
      },
    });
  }

  revalidatePath('/admin/proofs');
  revalidatePath('/admin/orders');
}

export default async function AdminProofsPage() {
  const ordersWithCustomization = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { product: true } },
      proofs: true,
    },
  });

  return (
    <div className="space-y-8">
      
      <div className="border-b border-neutral-800 pb-6 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Design & Proofing Workflow</span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Approvazione Bozze Grafiche Etichette</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {ordersWithCustomization.map((order) => {
          const latestProof = order.proofs[order.proofs.length - 1];

          return (
            <div key={order.id} className="lg:col-span-6 bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-6">
              
              <div className="flex justify-between items-start border-b border-neutral-800 pb-3">
                <div>
                  <span className="font-mono font-bold text-amber-500 text-sm">Ord. #{order.orderNumber}</span>
                  <h3 className="font-serif font-bold text-white text-base">{order.customerName}</h3>
                  <p className="text-xs text-neutral-400">Email: {order.customerEmail}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  order.proofStatus === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  Bozza: {order.proofStatus}
                </span>
              </div>

              {/* Latest Proof Card */}
              {latestProof ? (
                <div className="p-4 bg-neutral-900 rounded-xs border border-neutral-800 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">Versione v{latestProof.version}</span>
                    <span className="text-neutral-400 font-mono">{new Date(latestProof.createdAt).toLocaleDateString('it-IT')}</span>
                  </div>

                  <div className="h-40 bg-neutral-950 rounded border border-neutral-800 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={latestProof.imageUrl} alt="Proof" className="w-full h-full object-cover" />
                  </div>

                  <p className="text-xs text-neutral-300 italic">&ldquo;{latestProof.notes}&rdquo;</p>
                  
                  {latestProof.feedback && (
                    <div className="p-2.5 bg-neutral-950 text-amber-300 text-xs rounded border border-amber-500/30">
                      <strong>Feedback Cliente:</strong> &ldquo;{latestProof.feedback}&rdquo;
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-neutral-900/40 rounded border border-dashed border-neutral-800 text-center text-xs text-neutral-500">
                  Nessuna bozza ancora caricata per questo ordine.
                </div>
              )}

              {/* Form to Upload New Proof Version */}
              <form action={createProofVersion} className="bg-neutral-900 p-4 rounded-xs border border-neutral-800 space-y-3 text-xs">
                <input type="hidden" name="orderId" value={order.id} />
                
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center space-x-1">
                  <Upload className="w-3.5 h-3.5 text-amber-500" />
                  <span>Carica Nuova Bozza Grafica (v{(order.proofs.length || 0) + 1})</span>
                </h4>

                <div>
                  <label className="block text-neutral-400 mb-1">URL Immagine Bozza / Anteprima Canvas:</label>
                  <input
                    type="text"
                    name="imageUrl"
                    defaultValue="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop"
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 text-white rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Note per il Cliente:</label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="es. Bozza etichetta in font serif con foglia oro..."
                    className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 text-white rounded-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors rounded-xs"
                >
                  Invia Bozza al Cliente
                </button>
              </form>

            </div>
          );
        })}
      </div>

    </div>
  );
}
