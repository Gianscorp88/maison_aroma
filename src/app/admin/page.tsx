import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { getShopSettings } from '@/lib/shop-settings-store';
import { DollarSign, ShoppingBag, Flame, AlertTriangle, FileText, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function AdminOverviewPage() {
  const shopSettings = getShopSettings();
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  const quotes = await db.quoteRequest.findMany({
    where: { status: 'NEW' },
  });

  const lowStockItems = await db.inventoryItem.findMany({
    where: { stock: { lte: db.inventoryItem.fields.minAlert } },
  });

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingProofOrders = orders.filter((o) => o.proofStatus === 'AWAITING_PROOF' || o.proofStatus === 'PROOF_SENT');
  const inProductionOrders = orders.filter((o) => o.status === 'IN_PRODUCTION');

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Atelier Control Panel</span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Dashboard Amministrazione</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/settings"
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs border flex items-center space-x-2 transition-colors ${
              shopSettings.isShopMode
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-400 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 border-amber-500/60 text-amber-400 hover:bg-amber-900/60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${shopSettings.isShopMode ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>Modalità: {shopSettings.isShopMode ? 'Shop Attivo' : 'Sito Vetrina'}</span>
          </Link>

          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-amber-500 text-neutral-950 font-semibold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors rounded-xs"
          >
            Gestisci Tutti gli Ordini ({orders.length})
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Revenue */}
        <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Fatturato Incassato</span>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-serif font-bold text-white">€{totalRevenue.toFixed(2)}</p>
          <span className="text-[10px] text-neutral-500">Ordini confermati & saldati</span>
        </div>

        {/* Card 2: Production Queue */}
        <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">In Colatura & Produzione</span>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-serif font-bold text-amber-400">{inProductionOrders.length}</p>
          <span className="text-[10px] text-neutral-500">Lotti in lavorazione a mano</span>
        </div>

        {/* Card 3: Pending Proofs */}
        <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Bozze Grafiche In Attesa</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-serif font-bold text-amber-400">{pendingProofOrders.length}</p>
          <span className="text-[10px] text-neutral-500">Approvazione cliente richiesta</span>
        </div>

        {/* Card 4: Quotes / Stock Alert */}
        <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-2">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Preventivi & Stock Critico</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-2xl font-serif font-bold text-white">{quotes.length} Prev.</span>
            <span className="text-xs text-red-400">{lowStockItems.length} Stock Allarmi</span>
          </div>
          <span className="text-[10px] text-neutral-500">Richieste eventi da quotare</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <h3 className="font-serif text-lg font-bold text-white">Ultimi Ordini Ricevuti</h3>
          <Link href="/admin/orders" className="text-xs text-amber-500 hover:underline flex items-center space-x-1">
            <span>Vedi Tutti</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="text-[10px] uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-2">N° Ordine</th>
                <th className="py-3 px-2">Cliente</th>
                <th className="py-3 px-2">Evento & Data</th>
                <th className="py-3 px-2">Stato Pagamento</th>
                <th className="py-3 px-2">Stato Produzione</th>
                <th className="py-3 px-2 text-right">Totale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 font-mono">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-neutral-900/60">
                  <td className="py-3 px-2 font-bold text-amber-500">{order.orderNumber}</td>
                  <td className="py-3 px-2 font-sans font-medium text-white">{order.customerName}</td>
                  <td className="py-3 px-2 font-sans">{order.eventType || 'Generico'}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.paymentStatus === 'PAID' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-sans">
                    <span className="text-neutral-300">{order.status}</span>
                  </td>
                  <td className="py-3 px-2 text-right font-serif font-bold text-white text-sm">
                    €{order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
