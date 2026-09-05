import React from 'react';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Flame, CheckCircle2, Clock, PackageCheck, AlertTriangle } from 'lucide-react';

export const revalidate = 0;

async function advanceProductionStage(formData: FormData) {
  'use server';
  const orderId = formData.get('orderId') as string;
  const newStatus = formData.get('newStatus') as string;

  await db.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  revalidatePath('/admin/production');
  revalidatePath('/admin');
}

export default async function AdminProductionPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  const columns = [
    { title: '1. Nuovi & In Attesa', status: 'RECEIVED', color: 'border-blue-500' },
    { title: '2. Bozza Grafica', status: 'PROOF_PENDING', color: 'border-amber-500' },
    { title: '3. In Colatura', status: 'IN_PRODUCTION', color: 'border-orange-500' },
    { title: '4. Quality Check', status: 'QUALITY_CHECK', statusNext: 'SHIPPED', color: 'border-purple-500' },
    { title: '5. Pronti / Spediti', status: 'SHIPPED', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-8">
      
      <div className="border-b border-neutral-800 pb-6 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Atelier Workflow</span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Kanban Produzione Sartoriale</h1>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        {columns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.status);
          return (
            <div key={col.status} className={`bg-neutral-950 p-4 rounded-sm border-t-4 ${col.color} border-x border-b border-neutral-800 space-y-4 min-h-[500px]`}>
              <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-white">{col.title}</h3>
                <span className="w-5 h-5 rounded-full bg-neutral-800 text-amber-500 text-[10px] font-bold flex items-center justify-center">
                  {colOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {colOrders.map((order) => {
                  return (
                    <div key={order.id} className="p-3 bg-neutral-900 rounded-xs border border-neutral-800 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-amber-500">#{order.orderNumber}</span>
                        <span className="text-[10px] text-neutral-400 font-sans">{order.eventType}</span>
                      </div>

                      <p className="font-semibold text-white truncate">{order.customerName}</p>

                      <div className="text-[10px] text-neutral-400 border-t border-b border-neutral-800 py-1 space-y-0.5">
                        {order.items.map((it) => (
                          <p key={it.id} className="truncate">
                            • {it.quantity}x {it.product.name}
                          </p>
                        ))}
                      </div>

                      {order.eventDate && (
                        <p className="text-[10px] text-amber-400 font-bold">
                          📅 Evento: {new Date(order.eventDate).toLocaleDateString('it-IT')}
                        </p>
                      )}

                      {/* Advance Button */}
                      {col.status !== 'SHIPPED' && (
                        <form action={advanceProductionStage} className="pt-1">
                          <input type="hidden" name="orderId" value={order.id} />
                          <input
                            type="hidden"
                            name="newStatus"
                            value={
                              col.status === 'RECEIVED'
                                ? 'PROOF_PENDING'
                                : col.status === 'PROOF_PENDING'
                                ? 'IN_PRODUCTION'
                                : col.status === 'IN_PRODUCTION'
                                ? 'QUALITY_CHECK'
                                : 'SHIPPED'
                            }
                          />
                          <button
                            type="submit"
                            className="w-full py-1 bg-neutral-800 text-neutral-200 text-[10px] font-bold uppercase hover:bg-amber-500 hover:text-neutral-950 transition-colors rounded-xs"
                          >
                            Avanza Fase →
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
