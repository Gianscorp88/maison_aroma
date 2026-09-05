'use client';

import React, { useState, useEffect } from 'react';
import {
  CustomizerConfig,
  CustomizerEventOption,
  CustomizerModelOption,
  CustomizerFragranceOption,
  CustomizerColorOption,
  CustomizerFontOption,
  CustomizerPackagingOption,
  CustomizerDiscountTier,
} from '@/lib/customizer-config-store';
import {
  Sparkles,
  Flame,
  Plus,
  Edit2,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  X,
  Layers,
  Percent,
  Type,
  Package,
  Heart,
} from 'lucide-react';

export default function AdminCustomizerPage() {
  const [config, setConfig] = useState<CustomizerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');

  const [activeTab, setActiveTab] = useState<
    'events' | 'models' | 'fragrances' | 'colors' | 'label' | 'packaging' | 'discounts'
  >('events');

  // Modals state
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/customizer', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('Error fetching customizer config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (newConfig: Partial<CustomizerConfig>) => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/customizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });

      if (res.ok) {
        const updated = await res.json();
        setConfig(updated);
        setSaveNotice('Configurazione salvata con successo!');
        setTimeout(() => setSaveNotice(''), 3000);
      } else {
        alert('Errore durante il salvataggio della configurazione.');
      }
    } catch (err) {
      console.error('Error saving customizer config:', err);
    } finally {
      setSaving(false);
      setModalType(null);
      setEditingItem(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName = 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setEditingItem((prev: any) => (prev ? { ...prev, [fieldName]: data.url } : null));
      } else {
        alert('Caricamento immagine fallito.');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="py-20 text-center text-xs uppercase tracking-widest text-amber-500 animate-pulse">
        Caricamento impostazioni configuratore in corso...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>Gestione "Crea la Tua Candela Personalizzata"</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Amministra in tempo reale tutti gli 8 passaggi, prezzi, modelli, eventi, colori, etichette, packaging e sconti quantità del configuratore pubblico.
          </p>
        </div>

        {saveNotice && (
          <div className="px-3.5 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xs flex items-center space-x-1.5">
            <Check className="w-4 h-4" />
            <span>{saveNotice}</span>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
        {[
          { id: 'events', label: '1. Eventi', icon: Heart, count: config.events?.length },
          { id: 'models', label: '2. Vasi / Modelli', icon: Package, count: config.models?.length },
          { id: 'fragrances', label: '3. Fragranze', icon: Flame, count: config.fragrances?.length },
          { id: 'colors', label: '4. Colori', icon: Layers, count: config.colors?.length },
          { id: 'label', label: '5. Etichetta & Font', icon: Type, count: config.fonts?.length },
          { id: 'packaging', label: '6. Packaging', icon: Package, count: config.packagings?.length },
          { id: 'discounts', label: '7. Sconti Quantità', icon: Percent, count: config.discountTiers?.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xs flex items-center space-x-2 transition-all ${
                isActive
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-neutral-950 text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EVENTI */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-950 p-4 rounded-sm border border-neutral-800">
            <div>
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Tipi di Evento (Passo 1)</h3>
              <p className="text-xs text-neutral-400">Gestisci gli eventi selezionabili dal cliente nel primo passaggio.</p>
            </div>
            <button
              onClick={() => {
                setEditingItem({ id: `evt-${Date.now()}`, label: '', icon: '✨', subtitle: 'Stile coordinato', status: 'ACTIVE', order: (config.events?.length || 0) + 1 });
                setModalType('event');
              }}
              className="px-3 py-2 bg-amber-500 text-neutral-950 text-xs font-bold uppercase rounded-xs hover:bg-amber-400 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuovo Evento</span>
            </button>
          </div>

          <div className="bg-neutral-950 rounded-sm border border-neutral-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-neutral-400 uppercase font-bold border-b border-neutral-800">
                <tr>
                  <th className="p-3 w-16 text-center">Ordine</th>
                  <th className="p-3 w-16 text-center">Icona</th>
                  <th className="p-3">Nome Evento</th>
                  <th className="p-3">Sottotitolo</th>
                  <th className="p-3">Stato</th>
                  <th className="p-3 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-medium">
                {config.events?.sort((a,b)=>(a.order||0)-(b.order||0)).map((ev, idx) => (
                  <tr key={ev.id} className="hover:bg-neutral-900/50">
                    <td className="p-3 text-center font-mono text-neutral-400">{ev.order || idx + 1}</td>
                    <td className="p-3 text-center text-xl">{ev.icon}</td>
                    <td className="p-3 font-serif font-bold text-white">{ev.label}</td>
                    <td className="p-3 text-neutral-400">{ev.subtitle || '-'}</td>
                    <td className="p-3">
                      {ev.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded-xs">Attivo</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700 text-[10px] font-bold uppercase rounded-xs">Nascosto</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => { setEditingItem({ ...ev }); setModalType('event'); }}
                        className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-white rounded-xs"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => {
                          const updated = config.events.filter(e => e.id !== ev.id);
                          handleSaveConfig({ events: updated });
                        }}
                        className="p-1 text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: VASI / MODELLI */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-950 p-4 rounded-sm border border-neutral-800">
            <div>
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Modelli & Vasi Candela (Passo 2)</h3>
              <p className="text-xs text-neutral-400">Modifica vasi, prezzi base unitari, immagini e quantità minime.</p>
            </div>
            <button
              onClick={() => {
                setEditingItem({
                  id: `cand-${Date.now()}`,
                  name: '',
                  vessel: '',
                  basePrice: 18.0,
                  dimensions: '8cm x 9cm',
                  weight: '200g',
                  minQuantity: 10,
                  image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
                  status: 'ACTIVE',
                  order: (config.models?.length || 0) + 1,
                });
                setModalType('model');
              }}
              className="px-3 py-2 bg-amber-500 text-neutral-950 text-xs font-bold uppercase rounded-xs hover:bg-amber-400 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuovo Modello</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.models?.sort((a,b)=>(a.order||0)-(b.order||0)).map((m) => (
              <div key={m.id} className="bg-neutral-950 border border-neutral-800 rounded-sm p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-44 bg-neutral-900 rounded-xs overflow-hidden relative border border-neutral-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-neutral-950/80 backdrop-blur-xs text-amber-400 font-mono text-xs font-bold border border-neutral-800 rounded-xs">
                      €{m.basePrice.toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-white text-base leading-tight">{m.name}</h4>
                    <p className="text-xs text-amber-500 font-medium mt-0.5">{m.vessel}</p>
                    <p className="text-[11px] text-neutral-400 mt-1">{m.dimensions} • {m.weight || '200g'}</p>
                    <p className="text-[11px] text-neutral-400">Min. pezzi: <strong className="text-white font-mono">{m.minQuantity}</strong></p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-neutral-800/80">
                  {m.status === 'ACTIVE' ? (
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Attivo</span>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">Nascosto</span>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => { setEditingItem({ ...m }); setModalType('model'); }}
                      className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-white rounded-xs text-xs"
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => {
                        const updated = config.models.filter(item => item.id !== m.id);
                        handleSaveConfig({ models: updated });
                      }}
                      className="p-1 text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FRAGRANZE */}
      {activeTab === 'fragrances' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-950 p-4 rounded-sm border border-neutral-800">
            <div>
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Fragranze Configuratore (Passo 3)</h3>
              <p className="text-xs text-neutral-400">Gestisci le essenze selezionabili nel configuratore.</p>
            </div>
            <button
              onClick={() => {
                setEditingItem({
                  id: `frag-${Date.now()}`,
                  name: '',
                  family: 'Fiorita Cipriata',
                  notes: '',
                  description: '',
                  status: 'ACTIVE',
                  order: (config.fragrances?.length || 0) + 1,
                });
                setModalType('fragrance');
              }}
              className="px-3 py-2 bg-amber-500 text-neutral-950 text-xs font-bold uppercase rounded-xs hover:bg-amber-400 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuova Fragranza</span>
            </button>
          </div>

          <div className="bg-neutral-950 rounded-sm border border-neutral-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-neutral-400 uppercase font-bold border-b border-neutral-800">
                <tr>
                  <th className="p-3 w-16 text-center">Ordine</th>
                  <th className="p-3">Nome Fragranza</th>
                  <th className="p-3">Famiglia</th>
                  <th className="p-3">Note Olfattive</th>
                  <th className="p-3">Stato</th>
                  <th className="p-3 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-medium">
                {config.fragrances?.sort((a,b)=>(a.order||0)-(b.order||0)).map((f, idx) => (
                  <tr key={f.id} className="hover:bg-neutral-900/50">
                    <td className="p-3 text-center font-mono text-neutral-400">{f.order || idx + 1}</td>
                    <td className="p-3 font-serif font-bold text-white">{f.name}</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] rounded-xs font-bold">{f.family}</span></td>
                    <td className="p-3 text-neutral-300 max-w-xs truncate">{f.notes}</td>
                    <td className="p-3">
                      {f.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded-xs">Attiva</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700 text-[10px] font-bold uppercase rounded-xs">Nascosta</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => { setEditingItem({ ...f }); setModalType('fragrance'); }}
                        className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-white rounded-xs"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => {
                          const updated = config.fragrances.filter(item => item.id !== f.id);
                          handleSaveConfig({ fragrances: updated });
                        }}
                        className="p-1 text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COLORI */}
      {activeTab === 'colors' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-950 p-4 rounded-sm border border-neutral-800">
            <div>
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Colori del Nastro (Passo 4)</h3>
              <p className="text-xs text-neutral-400">Gestisci i colori disponibili per il nastro della candela ed i relativi codici HEX.</p>
            </div>
            <button
              onClick={() => {
                setEditingItem({
                  id: `col-${Date.now()}`,
                  name: '',
                  hex: '#FFFFFF',
                  category: 'ribbon',
                  status: 'ACTIVE',
                  order: (config.colors?.length || 0) + 1,
                });
                setModalType('color');
              }}
              className="px-3 py-2 bg-amber-500 text-neutral-950 text-xs font-bold uppercase rounded-xs hover:bg-amber-400 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuovo Colore Nastro</span>
            </button>
          </div>

          <div className="bg-neutral-950 rounded-sm border border-neutral-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-neutral-400 uppercase font-bold border-b border-neutral-800">
                <tr>
                  <th className="p-3 w-16 text-center">Anteprima</th>
                  <th className="p-3">Nome Colore</th>
                  <th className="p-3">Codice HEX</th>
                  <th className="p-3">Stato</th>
                  <th className="p-3 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-medium">
                {config.colors?.sort((a,b)=>(a.order||0)-(b.order||0)).map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-900/50">
                    <td className="p-3 text-center">
                      <div className="w-7 h-7 rounded-full border border-neutral-700 mx-auto shadow-sm" style={{ backgroundColor: c.hex }} />
                    </td>
                    <td className="p-3 font-serif font-bold text-white">{c.name}</td>
                    <td className="p-3 font-mono text-neutral-300">{c.hex}</td>
                    <td className="p-3">
                      {c.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded-xs">Attivo</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700 text-[10px] font-bold uppercase rounded-xs">Nascosto</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => { setEditingItem({ ...c, category: 'ribbon' }); setModalType('color'); }}
                        className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-white rounded-xs"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => {
                          const updated = config.colors.filter(item => item.id !== c.id);
                          handleSaveConfig({ colors: updated });
                        }}
                        className="p-1 text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ETICHETTA & FONT */}
      {activeTab === 'label' && (
        <div className="space-y-6">
          <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-4">
            <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-3">
              Impostazioni Testi Etichetta (Passo 5)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 uppercase font-bold mb-1">Placeholder Nomi</label>
                <input
                  type="text"
                  value={config.labelSettings?.namesPlaceholder || ''}
                  onChange={(e) =>
                    setConfig({ ...config, labelSettings: { ...config.labelSettings, namesPlaceholder: e.target.value } })
                  }
                  className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase font-bold mb-1">Placeholder Data</label>
                <input
                  type="text"
                  value={config.labelSettings?.datePlaceholder || ''}
                  onChange={(e) =>
                    setConfig({ ...config, labelSettings: { ...config.labelSettings, datePlaceholder: e.target.value } })
                  }
                  className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 uppercase font-bold mb-1">Placeholder Frase/Dedica</label>
                <input
                  type="text"
                  value={config.labelSettings?.phrasePlaceholder || ''}
                  onChange={(e) =>
                    setConfig({ ...config, labelSettings: { ...config.labelSettings, phrasePlaceholder: e.target.value } })
                  }
                  className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleSaveConfig({ labelSettings: config.labelSettings })}
                className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold uppercase rounded-xs hover:bg-amber-400 text-xs"
              >
                Salva Impostazioni Etichetta
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-neutral-950 p-4 rounded-sm border border-neutral-800">
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Font Selezionabili</h3>
              <button
                onClick={() => {
                  setEditingItem({
                    id: `f-${Date.now()}`,
                    name: '',
                    value: 'classic-serif',
                    status: 'ACTIVE',
                    order: (config.fonts?.length || 0) + 1,
                  });
                  setModalType('font');
                }}
                className="px-3 py-1.5 bg-amber-500 text-neutral-950 text-xs font-bold uppercase rounded-xs hover:bg-amber-400"
              >
                + Nuovo Font
              </button>
            </div>

            <div className="bg-neutral-950 rounded-sm border border-neutral-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900 text-neutral-400 uppercase font-bold border-b border-neutral-800">
                  <tr>
                    <th className="p-3">Nome Font</th>
                    <th className="p-3">Valore Interno</th>
                    <th className="p-3">Stato</th>
                    <th className="p-3 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-medium">
                  {config.fonts?.sort((a,b)=>(a.order||0)-(b.order||0)).map((ft) => (
                    <tr key={ft.id} className="hover:bg-neutral-900/50">
                      <td className="p-3 font-serif font-bold text-white">{ft.name}</td>
                      <td className="p-3 font-mono text-neutral-400">{ft.value}</td>
                      <td className="p-3">
                        {ft.status === 'ACTIVE' ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded-xs">Attivo</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700 text-[10px] font-bold uppercase rounded-xs">Nascosto</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => { setEditingItem({ ...ft }); setModalType('font'); }}
                          className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-white rounded-xs"
                        >
                          Modifica
                        </button>
                        <button
                          onClick={() => {
                            const updated = config.fonts.filter(item => item.id !== ft.id);
                            handleSaveConfig({ fonts: updated });
                          }}
                          className="p-1 text-neutral-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PACKAGING */}
      {activeTab === 'packaging' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-950 p-4 rounded-sm border border-neutral-800">
            <div>
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Confezioni & Packaging (Passo 6)</h3>
              <p className="text-xs text-neutral-400">Modifica scatole, sacchetti e supplementi di prezzo al pezzo.</p>
            </div>
            <button
              onClick={() => {
                setEditingItem({
                  id: `pack-${Date.now()}`,
                  name: '',
                  price: 2.0,
                  image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
                  description: '',
                  status: 'ACTIVE',
                  order: (config.packagings?.length || 0) + 1,
                });
                setModalType('packaging');
              }}
              className="px-3 py-2 bg-amber-500 text-neutral-950 text-xs font-bold uppercase rounded-xs hover:bg-amber-400 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuovo Packaging</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.packagings?.sort((a,b)=>(a.order||0)-(b.order||0)).map((p) => (
              <div key={p.id} className="bg-neutral-950 border border-neutral-800 rounded-sm p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-40 bg-neutral-900 rounded-xs overflow-hidden relative border border-neutral-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-neutral-950/80 backdrop-blur-xs text-amber-400 font-mono text-xs font-bold border border-neutral-800 rounded-xs">
                      {p.price > 0 ? `+ €${p.price.toFixed(2)} cad.` : 'Incluso'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-white text-base leading-tight">{p.name}</h4>
                    <p className="text-xs text-neutral-400 mt-1">{p.description || '-'}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-neutral-800/80">
                  {p.status === 'ACTIVE' ? (
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Attivo</span>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-bold uppercase">Nascosto</span>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => { setEditingItem({ ...p }); setModalType('packaging'); }}
                      className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-white rounded-xs text-xs"
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => {
                        const updated = config.packagings.filter(item => item.id !== p.id);
                        handleSaveConfig({ packagings: updated });
                      }}
                      className="p-1 text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SCONTI QUANTITÀ */}
      {activeTab === 'discounts' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-neutral-950 p-4 rounded-sm border border-neutral-800">
            <div>
              <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider">Fasce Sconto Volume Quantità (Passo 7)</h3>
              <p className="text-xs text-neutral-400">Imposta le soglie minime/massime ed i relativi sconti percentuali sul totale.</p>
            </div>
            <button
              onClick={() => {
                setEditingItem({
                  id: `tier-${Date.now()}`,
                  minQty: 10,
                  maxQty: 29,
                  discountPercentage: 10,
                  label: '',
                  status: 'ACTIVE',
                  order: (config.discountTiers?.length || 0) + 1,
                });
                setModalType('discount');
              }}
              className="px-3 py-2 bg-amber-500 text-neutral-950 text-xs font-bold uppercase rounded-xs hover:bg-amber-400 flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuova Fascia Sconto</span>
            </button>
          </div>

          <div className="bg-neutral-950 rounded-sm border border-neutral-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-neutral-400 uppercase font-bold border-b border-neutral-800">
                <tr>
                  <th className="p-3 w-16 text-center">Ordine</th>
                  <th className="p-3">Quantità Minima</th>
                  <th className="p-3">Quantità Massima</th>
                  <th className="p-3">% Sconto Volume</th>
                  <th className="p-3">Descrizione Fascia</th>
                  <th className="p-3">Stato</th>
                  <th className="p-3 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-medium">
                {config.discountTiers?.sort((a,b)=>(a.order||0)-(b.order||0)).map((t, idx) => (
                  <tr key={t.id} className="hover:bg-neutral-900/50">
                    <td className="p-3 text-center font-mono text-neutral-400">{t.order || idx + 1}</td>
                    <td className="p-3 font-mono font-bold text-white">{t.minQty} pezzi</td>
                    <td className="p-3 font-mono text-neutral-300">{t.maxQty >= 999 ? 'Oltre (∞)' : `${t.maxQty} pezzi`}</td>
                    <td className="p-3 font-mono font-bold text-amber-400 text-sm">-{t.discountPercentage}%</td>
                    <td className="p-3 text-neutral-300">{t.label || `${t.minQty}-${t.maxQty} pz → ${t.discountPercentage}%`}</td>
                    <td className="p-3">
                      {t.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded-xs">Attiva</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700 text-[10px] font-bold uppercase rounded-xs">Disattivata</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => { setEditingItem({ ...t }); setModalType('discount'); }}
                        className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-amber-500 text-white rounded-xs"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => {
                          const updated = config.discountTiers.filter(item => item.id !== t.id);
                          handleSaveConfig({ discountTiers: updated });
                        }}
                        className="p-1 text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DYNAMIC EDIT MODAL */}
      {modalType && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-950 border border-neutral-800 rounded-sm w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h3 className="font-serif font-bold text-white text-base">Modifica Elemento ({modalType.toUpperCase()})</h3>
              <button onClick={() => setModalType(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (modalType === 'event') {
                  const items = [...(config.events || [])];
                  const idx = items.findIndex((i) => i.id === editingItem.id);
                  if (idx >= 0) items[idx] = editingItem;
                  else items.push(editingItem);
                  handleSaveConfig({ events: items });
                } else if (modalType === 'model') {
                  const items = [...(config.models || [])];
                  const idx = items.findIndex((i) => i.id === editingItem.id);
                  if (idx >= 0) items[idx] = editingItem;
                  else items.push(editingItem);
                  handleSaveConfig({ models: items });
                } else if (modalType === 'fragrance') {
                  const items = [...(config.fragrances || [])];
                  const idx = items.findIndex((i) => i.id === editingItem.id);
                  if (idx >= 0) items[idx] = editingItem;
                  else items.push(editingItem);
                  handleSaveConfig({ fragrances: items });
                } else if (modalType === 'color') {
                  const items = [...(config.colors || [])];
                  const idx = items.findIndex((i) => i.id === editingItem.id);
                  if (idx >= 0) items[idx] = editingItem;
                  else items.push(editingItem);
                  handleSaveConfig({ colors: items });
                } else if (modalType === 'font') {
                  const items = [...(config.fonts || [])];
                  const idx = items.findIndex((i) => i.id === editingItem.id);
                  if (idx >= 0) items[idx] = editingItem;
                  else items.push(editingItem);
                  handleSaveConfig({ fonts: items });
                } else if (modalType === 'packaging') {
                  const items = [...(config.packagings || [])];
                  const idx = items.findIndex((i) => i.id === editingItem.id);
                  if (idx >= 0) items[idx] = editingItem;
                  else items.push(editingItem);
                  handleSaveConfig({ packagings: items });
                } else if (modalType === 'discount') {
                  const items = [...(config.discountTiers || [])];
                  const idx = items.findIndex((i) => i.id === editingItem.id);
                  if (idx >= 0) items[idx] = editingItem;
                  else items.push(editingItem);
                  handleSaveConfig({ discountTiers: items });
                }
              }}
              className="space-y-4 text-xs"
            >
              {/* Event Form */}
              {modalType === 'event' && (
                <>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Nome Evento *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.label}
                      onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Icona / Emoji</label>
                    <input
                      type="text"
                      value={editingItem.icon}
                      onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Sottotitolo</label>
                    <input
                      type="text"
                      value={editingItem.subtitle || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                </>
              )}

              {/* Model Form */}
              {modalType === 'model' && (
                <>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Nome Modello *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Tipologia Contenitore / Vaso</label>
                    <input
                      type="text"
                      value={editingItem.vessel}
                      onChange={(e) => setEditingItem({ ...editingItem, vessel: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase font-bold text-neutral-300 mb-1">Prezzo Base (€) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editingItem.basePrice}
                        onChange={(e) => setEditingItem({ ...editingItem, basePrice: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-bold text-neutral-300 mb-1">Min. Quantità *</label>
                      <input
                        type="number"
                        required
                        value={editingItem.minQuantity}
                        onChange={(e) => setEditingItem({ ...editingItem, minQuantity: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase font-bold text-neutral-300 mb-1">Dimensioni</label>
                      <input
                        type="text"
                        value={editingItem.dimensions}
                        onChange={(e) => setEditingItem({ ...editingItem, dimensions: e.target.value })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-bold text-neutral-300 mb-1">Peso Cera</label>
                      <input
                        type="text"
                        value={editingItem.weight || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, weight: e.target.value })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">URL Immagine</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editingItem.image}
                        onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                      />
                      <label className="px-3 py-2 bg-neutral-800 text-amber-400 border border-neutral-700 cursor-pointer rounded-xs flex items-center font-bold">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Fragrance Form */}
              {modalType === 'fragrance' && (
                <>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Nome Fragranza (es. Rosa di Maggio & Legno di Rosa) *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase font-bold text-neutral-300 mb-1">Famiglia Olfattiva *</label>
                      <input
                        type="text"
                        required
                        placeholder="es. Fiorita Cipriata"
                        value={editingItem.family || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, family: e.target.value })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-bold text-neutral-300 mb-1">Intensità (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={editingItem.intensity || 4}
                        onChange={(e) => setEditingItem({ ...editingItem, intensity: parseInt(e.target.value) || 4 })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Note Olfattive (Testa, Cuore, Fondo)</label>
                    <input
                      type="text"
                      placeholder="es. Rosa Centifolia, Bergamotto, Legno di Cedro, Muschio"
                      value={editingItem.notes || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Descrizione Sensoriale</label>
                    <textarea
                      rows={2}
                      placeholder="es. Bouquet romantico ed avvolgente, perfetto per matrimoni eleganti."
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                </>
              )}

              {/* Font Form */}
              {modalType === 'font' && (
                <>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Nome Font Visualizzato *</label>
                    <input
                      type="text"
                      required
                      placeholder="es. Serif Elegante Classico (Playfair)"
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Valore CSS / Interno *</label>
                    <input
                      type="text"
                      required
                      placeholder="es. classic-serif"
                      value={editingItem.value || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white font-mono"
                    />
                  </div>
                </>
              )}

              {/* Color Form */}
              {modalType === 'color' && (
                <>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Nome Colore Nastro (es. Verde Salvia) *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value, category: 'ribbon' })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Codice HEX Colore *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.hex}
                      onChange={(e) => setEditingItem({ ...editingItem, hex: e.target.value, category: 'ribbon' })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white font-mono"
                    />
                  </div>
                </>
              )}

              {/* Packaging Form */}
              {modalType === 'packaging' && (
                <>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Nome Confezione *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">Supplemento Prezzo al pezzo (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase font-bold text-neutral-300 mb-1">URL Immagine</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editingItem.image}
                        onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                      />
                      <label className="px-3 py-2 bg-neutral-800 text-amber-400 border border-neutral-700 cursor-pointer rounded-xs flex items-center font-bold">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden" />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Discount Form */}
              {modalType === 'discount' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block uppercase font-bold text-neutral-300 mb-1">Quantità Min *</label>
                      <input
                        type="number"
                        required
                        value={editingItem.minQty}
                        onChange={(e) => setEditingItem({ ...editingItem, minQty: parseInt(e.target.value) || 1 })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-bold text-neutral-300 mb-1">Quantità Max *</label>
                      <input
                        type="number"
                        required
                        value={editingItem.maxQty}
                        onChange={(e) => setEditingItem({ ...editingItem, maxQty: parseInt(e.target.value) || 999 })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block uppercase font-bold text-neutral-300 mb-1">% Sconto *</label>
                      <input
                        type="number"
                        required
                        value={editingItem.discountPercentage}
                        onChange={(e) => setEditingItem({ ...editingItem, discountPercentage: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Common Status & Order */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                <div>
                  <label className="block uppercase font-bold text-neutral-300 mb-1">Stato</label>
                  <select
                    value={editingItem.status || 'ACTIVE'}
                    onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                  >
                    <option value="ACTIVE">Attivo</option>
                    <option value="HIDDEN">Nascosto</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase font-bold text-neutral-300 mb-1">Posizione Ordine</label>
                  <input
                    type="number"
                    value={editingItem.order || 1}
                    onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-400 border border-neutral-800 rounded-xs font-bold uppercase"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold uppercase rounded-xs hover:bg-amber-400 shadow-md"
                >
                  {saving ? 'Salvataggio...' : 'Salva Modifiche'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
