'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Lock, Mail, Key, CheckCircle, CheckCircle2, ArrowRight, LogOut, Package } from 'lucide-react';

export default function CustomerAccountPage() {
  const [emailInput, setEmailInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [demoCodeNotice, setDemoCodeNotice] = useState('');
  const [step, setStep] = useState<'ENTER_EMAIL' | 'ENTER_CODE' | 'VERIFIED'>('ENTER_EMAIL');
  
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-restore session from sessionStorage if available
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('maison_customer_email');
    if (savedEmail) {
      setVerifiedEmail(savedEmail);
      setStep('VERIFIED');
      fetchOrders(savedEmail);
    }
  }, []);

  const fetchOrders = async (email: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/account/orders?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      } else {
        setErrorMsg(data.error || 'Impossibile recuperare lo storico ordini.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Errore di connessione al server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setErrorMsg('Inserisci un indirizzo email valido.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setDemoCodeNotice('');

    try {
      const res = await fetch('/api/account/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, action: 'REQUEST_CODE' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Errore durante la richiesta del codice.');
      }

      setStep('ENTER_CODE');
      if (data.demoCode) {
        setDemoCodeNotice(`Codice di verifica inviato! (Codice di prova locale: ${data.demoCode})`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Qualcosa è andato storto.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput) {
      setErrorMsg('Inserisci il codice di verifica a 6 cifre.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/account/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, code: codeInput, action: 'VERIFY_CODE' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Codice non valido.');
      }

      const cleanEmail = data.verifiedEmail;
      setVerifiedEmail(cleanEmail);
      sessionStorage.setItem('maison_customer_email', cleanEmail);
      setStep('VERIFIED');
      fetchOrders(cleanEmail);
    } catch (err: any) {
      setErrorMsg(err.message || 'Errore di verifica.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('maison_customer_email');
    setVerifiedEmail('');
    setEmailInput('');
    setCodeInput('');
    setOrders([]);
    setStep('ENTER_EMAIL');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      
      {/* Top Header */}
      <div className="bg-brand-cream border border-brand-gold/30 rounded-sm p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-brand-gold font-semibold">Area Cliente Riservata</span>
          <h1 className="text-3xl font-serif text-brand-espresso mt-1">
            {step === 'VERIFIED' ? 'Storico Ordini' : 'Accesso Storico Ordini'}
          </h1>
          <p className="text-xs text-brand-stone mt-1">
            {step === 'VERIFIED'
              ? `Email Verificata: ${verifiedEmail}`
              : 'Inserisci la tua email per accedere in modo sicuro allo storico dei tuoi ordini.'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {step === 'VERIFIED' && (
            <button
              onClick={handleLogout}
              className="px-4 py-3 bg-white border border-brand-linen text-brand-stone text-xs uppercase tracking-widest font-semibold hover:text-red-600 hover:border-red-200 transition-colors rounded-sm flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Esci</span>
            </button>
          )}
        </div>
      </div>

      {/* STEP 1: PASSWORDLESS EMAIL ENTRY */}
      {step === 'ENTER_EMAIL' && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-sm border border-brand-linen shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center mx-auto text-brand-gold">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-serif text-brand-espresso font-semibold">Consulta i Tuoi Ordini</h2>
            <p className="text-xs text-brand-stone">
              Nessuna password da ricordare. Ti invieremo un codice temporaneo di verifica per accedere al tuo storico.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 text-xs rounded-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-brand-espresso mb-1">
                Indirizzo Email dell&apos;Ordine *
              </label>
              <input
                type="email"
                required
                placeholder="es. sposa@maisonaroma.it"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full p-3 bg-brand-cream/30 border border-brand-linen rounded-sm text-sm text-brand-espresso focus:outline-none focus:border-brand-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-colors rounded-sm shadow-luxury flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Invio in corso...' : 'Invia Codice di Verifica'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: ENTER OTP CODE */}
      {step === 'ENTER_CODE' && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-sm border border-brand-linen shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center mx-auto text-brand-gold">
              <Key className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-serif text-brand-espresso font-semibold">Inserisci Codice di Verifica</h2>
            <p className="text-xs text-brand-stone">
              Inserisci il codice a 6 cifre inviato all&apos;indirizzo <strong className="text-brand-espresso">{emailInput}</strong>.
            </p>
          </div>

          {demoCodeNotice && (
            <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 text-xs rounded-sm font-semibold text-center">
              ✨ {demoCodeNotice}
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 text-xs rounded-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-brand-espresso mb-1">
                Codice a 6 Cifre *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="w-full p-3 bg-brand-cream/30 border border-brand-linen rounded-sm text-center font-mono text-xl text-brand-espresso focus:outline-none focus:border-brand-gold tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-colors rounded-sm shadow-luxury flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Verifica in corso...' : 'Verifica ed Accedi'}</span>
              <CheckCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => { setStep('ENTER_EMAIL'); setErrorMsg(''); }}
              className="w-full py-2 text-xs text-brand-stone hover:text-brand-espresso underline"
            >
              ← Torna all&apos;inserimento email
            </button>
          </form>
        </div>
      )}

      {/* STEP 3: VERIFIED ORDER HISTORY DISPLAY ONLY */}
      {step === 'VERIFIED' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif text-brand-espresso font-semibold border-b border-brand-linen pb-3">
            I Tuoi Ordini
          </h2>

          {loading ? (
            <div className="p-12 text-center text-xs uppercase tracking-widest text-brand-gold animate-pulse">
              Caricamento storico ordini in corso...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-12 text-center border border-brand-linen rounded-sm space-y-4 shadow-sm">
              <ShoppingBag className="w-10 h-10 text-brand-gold/60 mx-auto" />
              <h3 className="text-lg font-serif text-brand-espresso">Nessun ordine trovato</h3>
              <p className="text-xs text-brand-stone">Non risultano ordini collegati all&apos;indirizzo email <strong className="text-brand-espresso">{verifiedEmail}</strong>.</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-brand-espresso text-brand-ivory text-xs uppercase tracking-widest font-semibold hover:bg-brand-gold hover:text-brand-espresso transition-colors rounded-sm"
              >
                Crea il tuo Primo Ordine
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 rounded-sm border border-brand-linen shadow-sm space-y-6">
                  
                  {/* Order Top Header Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-brand-linen pb-4 gap-2">
                    <div>
                      <span className="font-serif text-lg font-bold text-brand-espresso">Ordine #{order.orderNumber}</span>
                      <p className="text-xs text-brand-stone">
                        Data Ordine: {new Date(order.createdAt).toLocaleDateString('it-IT')} • Evento: {order.eventType || 'Generico'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <span className="px-2.5 py-1 bg-brand-cream border border-brand-gold/40 text-brand-gold font-semibold rounded-full uppercase text-[10px]">
                        Stato Ordine: {order.status}
                      </span>
                      <span className="font-serif font-bold text-base text-brand-espresso">
                        €{order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Stato del tuo ordine */}
                  <div className="space-y-3 border-b border-brand-linen pb-4">
                    <h4 className="font-serif font-semibold text-sm text-brand-espresso">
                      Stato del tuo ordine
                    </h4>

                    {/* Single Status Card */}
                    <div className="p-3 bg-brand-cream border border-brand-gold/40 rounded-xs flex items-center space-x-3 text-xs">
                      <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0" />
                      <div>
                        <span className="font-bold text-brand-espresso block uppercase tracking-wider text-xs">Ordine ricevuto</span>
                        <span className="text-brand-stone text-[11px]">Il tuo ordine è stato registrato correttamente.</span>
                      </div>
                    </div>

                    {/* Informative Email Alert Box */}
                    <div className="p-3 bg-brand-cream/60 border border-brand-gold/30 rounded-xs text-xs flex items-start space-x-2.5 text-brand-espresso">
                      <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">
                        Ti terremo aggiornato via email. Riceverai una comunicazione quando il tuo ordine verrà spedito oppure, quando previsto, con la bozza grafica e tutte le indicazioni necessarie per approvarla.
                      </p>
                    </div>
                  </div>

                  {/* Dettaglio Articoli Ordinati */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-wider font-bold text-brand-stone">Dettaglio Articoli Ordinati:</h4>
                    <div className="space-y-3">
                      {order.items.map((item: any) => {
                        let customPayload: any = {};
                        try {
                          customPayload = typeof item.customization === 'string' ? JSON.parse(item.customization) : item.customization || {};
                        } catch (e) {}

                        // Clean fragrance display to prevent generic 'Fragranza: Fragranza' fallback
                        const displayFragrance = (customPayload.fragrance && customPayload.fragrance !== 'Fragranza')
                          ? customPayload.fragrance
                          : customPayload.fragranceName || 'Fior di Cotone';

                        return (
                          <div key={item.id} className="p-4 bg-brand-cream/30 rounded-sm border border-brand-linen text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="space-y-1">
                              <p className="font-serif font-bold text-brand-espresso text-sm">{item.product?.name || 'Candela Personalizzata'}</p>
                              <p className="text-brand-stone">Quantità: {item.quantity} pz • €{item.unitPrice.toFixed(2)} Cad.</p>
                              
                              {(displayFragrance || customPayload.ribbonColor || customPayload.namesText || customPayload.packaging) && (
                                <div className="mt-2 text-[11px] text-brand-stone space-y-0.5 border-l-2 border-brand-gold pl-2.5">
                                  {displayFragrance && <p><strong>Fragranza:</strong> {displayFragrance}</p>}
                                  {customPayload.ribbonColor && <p><strong>Nastro:</strong> {customPayload.ribbonColor}</p>}
                                  {customPayload.namesText && <p><strong>Nomi Etichetta:</strong> &ldquo;{customPayload.namesText}&rdquo;</p>}
                                  {customPayload.dateText && <p><strong>Data:</strong> {customPayload.dateText}</p>}
                                  {customPayload.phraseText && <p><strong>Frase:</strong> &ldquo;{customPayload.phraseText}&rdquo;</p>}
                                  {customPayload.packaging && <p><strong>Packaging:</strong> {customPayload.packaging}</p>}
                                </div>
                              )}
                            </div>

                            <span className="font-serif font-bold text-brand-gold text-sm font-mono self-end sm:self-center">
                              €{(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Details Footer */}
                  <div className="pt-2 border-t border-brand-linen flex justify-between items-center text-xs text-brand-stone">
                    <span>Metodo Pagamento: <strong className="text-brand-espresso">{order.paymentMethod}</strong></span>
                    <span>Stato Pagamento: <strong className="text-brand-gold">{order.paymentStatus}</strong></span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
