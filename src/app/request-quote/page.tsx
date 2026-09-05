import React from 'react';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

export const revalidate = 0;

async function handleCreateQuote(formData: FormData) {
  'use server';
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const eventType = formData.get('eventType') as string;
  const eventDate = formData.get('eventDate') as string;
  const quantity = parseInt(formData.get('quantity') as string) || 50;
  const budget = formData.get('budget') as string;
  const details = formData.get('details') as string;

  await db.quoteRequest.create({
    data: {
      name,
      email,
      phone,
      eventType: eventType || 'Generico',
      eventDate: eventDate ? new Date(eventDate) : new Date(),
      quantity,
      budget,
      details,
      status: 'NEW',
    },
  });

  redirect('/request-quote?success=true');
}

interface RequestQuotePageProps {
  searchParams: {
    success?: string;
  };
}

export default function RequestQuotePage({ searchParams }: RequestQuotePageProps) {
  const isSuccess = searchParams.success === 'true';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      
      <div className="bg-brand-cream border border-brand-gold/30 rounded-sm p-8 text-center space-y-3">
        <span className="text-xs uppercase tracking-[0.3em] text-brand-gold font-semibold">Grandi Eventi & Matrimoni</span>
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-espresso">Richiedi un Preventivo Su Misura</h1>
        <p className="text-sm text-brand-stone max-w-xl mx-auto font-light">
          Organizzi un grande evento (200+ ospiti), un Gala aziendale o cerchi una bomboniera con profumo su misura? Il nostro atelier ti risponderà entro 24 ore.
        </p>
      </div>

      {isSuccess ? (
        <div className="p-8 bg-emerald-50 border border-emerald-200 text-center space-y-4 rounded-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-serif text-emerald-950 font-bold">Richiesta Inviata Con Successo!</h2>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            Il nostro atelier ha preso in carico la tua richiesta. Riceverai il preventivo personalizzato ed un campione olfattivo al tuo indirizzo email.
          </p>
        </div>
      ) : (
        <form action={handleCreateQuote} className="bg-white p-8 rounded-sm border border-brand-linen shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold uppercase text-brand-espresso mb-1">Nome e Cognome:</label>
              <input
                type="text"
                name="name"
                required
                placeholder="es. Giulia Bianchi"
                className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-brand-espresso mb-1">Email:</label>
              <input
                type="email"
                name="email"
                required
                placeholder="es. giulia@sposa.it"
                className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-brand-espresso mb-1">Telefono:</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+39 340 1234567"
                className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-brand-espresso mb-1">Tipo di Evento:</label>
              <select
                name="eventType"
                className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold font-serif"
              >
                <option value="Matrimonio">Matrimonio & Sposi</option>
                <option value="Battesimo">Battesimo & Nascita</option>
                <option value="Comunione">Comunione & Cresima</option>
                <option value="Eventi Aziendali">Evento Aziendale & Hotel</option>
                <option value="Altro">Altro Evento Speciale</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase text-brand-espresso mb-1">Data dell’Evento:</label>
              <input
                type="date"
                name="eventDate"
                required
                className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-brand-espresso mb-1">Quantità Stimata (Pezzi):</label>
              <input
                type="number"
                name="quantity"
                defaultValue={100}
                min={10}
                className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold uppercase text-brand-espresso mb-1">Budget Approssimativo:</label>
              <select
                name="budget"
                className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold"
              >
                <option value="€500 - €1.000">€500 - €1.000</option>
                <option value="€1.000 - €2.500">€1.000 - €2.500</option>
                <option value="€2.500 - €5.000">€2.500 - €5.000</option>
                <option value="€5.000+">Oltre €5.000</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold uppercase text-brand-espresso mb-1">Desiderate & Dettagli Personalizzati:</label>
              <textarea
                name="details"
                rows={4}
                required
                placeholder="Descrivi la location, lo stile di allestimento, le fragranze o eventuali loghi da incider..."
                className="w-full px-3 py-2 border border-brand-linen rounded-xs bg-brand-ivory focus:outline-none focus:border-brand-gold text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-all duration-300 rounded-sm shadow-luxury flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Invia Richiesta Preventivo</span>
          </button>
        </form>
      )}

    </div>
  );
}
