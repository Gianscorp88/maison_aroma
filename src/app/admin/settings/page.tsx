'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, ShoppingBag, Eye, CheckCircle2, ShieldCheck, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';

export default function AdminShopSettingsPage() {
  const [isShopMode, setIsShopMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/shop-settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.isShopMode === 'boolean') {
          setIsShopMode(data.isShopMode);
        }
      }
    } catch (err) {
      console.error('Error fetching shop settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (newState: boolean) => {
    try {
      setSaving(true);
      setSaveFeedback(null);
      const res = await fetch('/api/admin/shop-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isShopMode: newState }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsShopMode(data.isShopMode);
        setSaveFeedback(
          data.isShopMode
            ? 'Modalità SHOP ATTIVO abilitata con successo! Tutte le funzionalità di acquisto sono ora attive sul sito.'
            : 'Modalità SITO VETRINA abilitata con successo! Tutte le funzioni di acquisto e il carrello sono ora disabilitati.'
        );
        setTimeout(() => setSaveFeedback(null), 5000);
      } else {
        alert('Errore durante il salvataggio delle impostazioni.');
      }
    } catch (err) {
      console.error('Error updating shop settings:', err);
      alert('Errore di connessione durante il salvataggio.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">Configurazione Piattaforma</span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Impostazioni Shop</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Controlla a livello globale se il sito opera come E-commerce attivo o come Vetrina di consultazione.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-sm transition-colors"
          >
            <span>Apri Sito Pubblico</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs uppercase tracking-widest text-amber-500 animate-pulse">
          Caricamento impostazioni in corso...
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Main Toggle Control Card */}
          <div className="bg-neutral-950 p-6 sm:p-8 rounded-sm border border-neutral-800 space-y-6 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 pb-6 border-b border-neutral-800">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">Controllo Globale</span>
                <h2 className="text-xl font-serif font-bold text-white">Modalità Shop</h2>
                <p className="text-xs text-neutral-400 max-w-xl">
                  Seleziona lo stato di funzionamento del sito. L'impostazione è persistente e si applica in tempo reale a tutti i visitatori.
                </p>
              </div>

              {/* Interactive Toggle Switch */}
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleToggle(!isShopMode)}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-950 ${
                    isShopMode ? 'bg-emerald-600' : 'bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      isShopMode ? 'translate-x-9' : 'translate-x-1'
                    }`}
                  />
                </button>

                <span className="font-serif font-bold text-sm text-white min-w-[140px]">
                  {isShopMode ? (
                    <span className="text-emerald-400 flex items-center space-x-1.5">
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      <span>ON — Shop attivo</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center space-x-1.5">
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span>OFF — Sito vetrina</span>
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Notification Feedback Toast */}
            {saveFeedback && (
              <div className="p-4 rounded-sm border bg-emerald-950/60 border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{saveFeedback}</span>
              </div>
            )}

            {/* Detailed State Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Option 1: Shop Attivo */}
              <div
                onClick={() => !saving && handleToggle(true)}
                className={`p-6 rounded-sm border transition-all cursor-pointer space-y-4 ${
                  isShopMode
                    ? 'bg-emerald-950/20 border-emerald-500/70 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-neutral-900/50 border-neutral-800 opacity-60 hover:opacity-100 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-white text-base">ON — Shop Attivo</h3>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold">E-commerce Completo</span>
                    </div>
                  </div>
                  {isShopMode && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                      ATTIVO
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Tutte le funzionalità di vendita online sono abilitate. I clienti possono selezionare le quantità, aggiungere prodotti al carrello, accedere al checkout e confermare gli ordini.
                </p>

                <div className="space-y-2 pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                  <p className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Carrello e icona header visibili</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pulsanti "Aggiungi al Carrello" e selettori attivi</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Checkout e pagamento simulato/bonifico disponibili</span>
                  </p>
                </div>
              </div>

              {/* Option 2: Sito Vetrina */}
              <div
                onClick={() => !saving && handleToggle(false)}
                className={`p-6 rounded-sm border transition-all cursor-pointer space-y-4 ${
                  !isShopMode
                    ? 'bg-amber-950/20 border-amber-500/70 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-neutral-900/50 border-neutral-800 opacity-60 hover:opacity-100 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-full bg-amber-500/10 text-amber-400">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-white text-base">OFF — Sito Vetrina</h3>
                      <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">Solo Consultazione</span>
                    </div>
                  </div>
                  {!isShopMode && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                      ATTIVO
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Il sito si trasforma in una vetrina digitale. Tutti i prodotti, le collezioni, le foto e le descrizioni restano visibili, ma l'acquisto online è completamente rimosso e protetto.
                </p>

                <div className="space-y-2 pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                  <p className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Catalogo, foto, fragranze e schede 100% visibili</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Carrello e pulsanti "Aggiungi al Carrello" rimossi</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Checkout bloccato e API ordini protetta (403)</span>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Technical Info Box */}
          <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-3">
            <h4 className="font-serif font-semibold text-sm text-neutral-200 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Sicurezza & Persistenza Architetturale</span>
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              La configurazione viene salvata in modo persistente sul server. Quando la Modalità Shop è <strong>OFF</strong>, l'endpoint di backend <code className="text-amber-400 font-mono">/api/orders</code> respinge automaticamente qualsiasi chiamata di creazione ordine, garantendo che non sia possibile forzare acquisti né via interfaccia né tramite script o chiamate dirette.
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
