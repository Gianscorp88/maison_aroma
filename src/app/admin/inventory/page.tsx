import React from 'react';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Package, AlertTriangle, Plus, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

async function updateStock(formData: FormData) {
  'use server';
  const itemId = formData.get('itemId') as string;
  const stock = parseFloat(formData.get('stock') as string) || 0;

  await db.inventoryItem.update({
    where: { id: itemId },
    data: { stock },
  });

  revalidatePath('/admin/inventory');
}

export default async function AdminInventoryPage() {
  const inventoryItems = await db.inventoryItem.findMany({
    orderBy: { category: 'asc' },
  });

  return (
    <div className="space-y-8">
      
      <div className="border-b border-neutral-800 pb-6 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Gestione Magazzino & Scorte</span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Materie Prime & Stock Atelier ({inventoryItems.length})</h1>
        </div>
      </div>

      <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="text-[10px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-2">Materia Prima / Componente</th>
                <th className="py-3 px-2">Categoria</th>
                <th className="py-3 px-2">Giacenza Attuale</th>
                <th className="py-3 px-2">Soglia Allarme</th>
                <th className="py-3 px-2">Stato</th>
                <th className="py-3 px-2 text-right">Aggiorna Giacenza</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {inventoryItems.map((item) => {
                const isLow = item.stock <= item.minAlert;

                return (
                  <tr key={item.id} className="hover:bg-neutral-900/60">
                    <td className="py-3 px-2 font-bold text-white">{item.name}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded-full text-[10px] uppercase text-amber-400 font-semibold">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-mono text-sm font-bold text-white">
                      {item.stock} {item.unit}
                    </td>
                    <td className="py-3 px-2 font-mono text-neutral-400">
                      {item.minAlert} {item.unit}
                    </td>
                    <td className="py-3 px-2">
                      {isLow ? (
                        <span className="px-2.5 py-1 bg-red-950 text-red-400 border border-red-800 rounded-full text-[10px] font-bold inline-flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Scorta Critica</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-[10px] font-bold">
                          Disponibile
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <form action={updateStock} className="inline-flex items-center space-x-2">
                        <input type="hidden" name="itemId" value={item.id} />
                        <input
                          type="number"
                          step="0.1"
                          name="stock"
                          defaultValue={item.stock}
                          className="w-20 px-2 py-1 bg-neutral-900 border border-neutral-700 text-white text-xs font-mono text-center rounded-xs"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 bg-neutral-800 text-neutral-200 text-[10px] uppercase font-bold hover:bg-amber-500 hover:text-neutral-950 rounded-xs"
                        >
                          Salva
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
