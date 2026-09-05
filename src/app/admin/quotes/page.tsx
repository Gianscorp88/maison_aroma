import React from 'react';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { MessageSquare, CheckCircle2, ArrowRight, DollarSign } from 'lucide-react';

export const revalidate = 0;

async function updateQuoteStatus(formData: FormData) {
  'use server';
  const quoteId = formData.get('quoteId') as string;
  const status = formData.get('status') as string;

  await db.quoteRequest.update({
    where: { id: quoteId },
    data: { status },
  });

  revalidatePath('/admin/quotes');
}

export default async function AdminQuotesPage() {
  let quotes: any[] = [];
  try {
    quotes = await db.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Failed to query quotes in AdminQuotesPage:', err);
  }

  return (
    <div className="space-y-8">
      
      <div className="border-b border-neutral-800 pb-6 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Richieste Grandi Eventi</span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Preventiazioni Su Misura ({quotes.length})</h1>
        </div>
      </div>

      <div className="space-y-6">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-800 pb-3 gap-2">
              <div>
                <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">{quote.eventType}</span>
                <h3 className="font-serif font-bold text-lg text-white">{quote.name}</h3>
                <p className="text-xs text-neutral-400">
                  Email: {quote.email} • Tel: {quote.phone} • Data Evento: {new Date(quote.eventDate).toLocaleDateString('it-IT')}
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                quote.status === 'NEW' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                Stato: {quote.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300">
              <div className="bg-neutral-900 p-3 rounded border border-neutral-800">
                <span className="text-neutral-400 block">Quantità Richiesta:</span>
                <span className="text-base font-serif font-bold text-white">{quote.quantity} Pezzi</span>
              </div>

              <div className="bg-neutral-900 p-3 rounded border border-neutral-800">
                <span className="text-neutral-400 block">Budget Indicativo:</span>
                <span className="text-base font-serif font-bold text-amber-400">{quote.budget || 'Non specificato'}</span>
              </div>

              <div className="bg-neutral-900 p-3 rounded border border-neutral-800">
                <span className="text-neutral-400 block">Data Richiesta:</span>
                <span className="text-xs text-neutral-300 font-mono">{new Date(quote.createdAt).toLocaleDateString('it-IT')}</span>
              </div>
            </div>

            <div className="bg-neutral-900 p-4 rounded border border-neutral-800 text-xs text-neutral-200">
              <span className="text-neutral-400 font-bold block mb-1">Dettagli & Desiderata Cliente:</span>
              <p className="italic leading-relaxed">&ldquo;{quote.details}&rdquo;</p>
            </div>

            <form action={updateQuoteStatus} className="flex justify-between items-center pt-2">
              <input type="hidden" name="quoteId" value={quote.id} />
              
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-neutral-400 font-medium">Aggiorna Stato Preventivo:</span>
                <select
                  name="status"
                  defaultValue={quote.status}
                  className="px-3 py-1 bg-neutral-900 border border-neutral-700 text-white rounded-xs text-xs"
                >
                  <option value="NEW">NUOVO</option>
                  <option value="IN_REVIEW">IN REVISIONE</option>
                  <option value="QUOTE_SENT">PREVENTIVO INVIATO</option>
                  <option value="ACCEPTED">ACCETTATO</option>
                  <option value="REJECTED">RIFIUTATO</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 text-neutral-950 font-bold uppercase text-xs hover:bg-amber-400 transition-colors rounded-xs"
              >
                Salva Stato
              </button>
            </form>

          </div>
        ))}
      </div>

    </div>
  );
}
