'use client';

import React, { useState, useEffect } from 'react';
import { FragranceItem } from '@/lib/products-types';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Flame,
  Sparkles,
  AlertTriangle,
  X,
  Check,
  Wind,
} from 'lucide-react';

export default function AdminFragrancesPage() {
  const [fragrances, setFragrances] = useState<FragranceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFragrance, setEditingFragrance] = useState<Partial<FragranceItem> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // String inputs for comma-separated notes in the modal
  const [topNotesInput, setTopNotesInput] = useState('');
  const [heartNotesInput, setHeartNotesInput] = useState('');
  const [baseNotesInput, setBaseNotesInput] = useState('');

  // Modal State for Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<FragranceItem | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/fragrances', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setFragrances(data);
      }
    } catch (err) {
      console.error('Error fetching admin fragrances data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingFragrance({
      name: '',
      slug: '',
      badge: 'FIORITA CIPRIATA',
      description: '',
      topNotes: [],
      heartNotes: [],
      baseNotes: [],
      image: '/images/collezione-dessert-gourmet.jpg',
      status: 'ACTIVE',
      order: fragrances.length + 1,
    });
    setTopNotesInput('');
    setHeartNotesInput('');
    setBaseNotesInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (fra: FragranceItem) => {
    setEditingFragrance({ ...fra });
    setTopNotesInput((fra.topNotes || []).join(', '));
    setHeartNotesInput((fra.heartNotes || []).join(', '));
    setBaseNotesInput((fra.baseNotes || []).join(', '));
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setEditingFragrance((prev) => (prev ? { ...prev, image: data.url } : null));
      } else {
        alert('Caricamento immagine fallito.');
      }
    } catch (err) {
      console.error('Error uploading fragrance image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveFragrance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFragrance?.name) return;

    const parseNotes = (input: string) =>
      input
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const payload = {
      ...editingFragrance,
      topNotes: parseNotes(topNotesInput),
      heartNotes: parseNotes(heartNotesInput),
      baseNotes: parseNotes(baseNotesInput),
    };

    try {
      const res = await fetch('/api/admin/fragrances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingFragrance(null);
        fetchData();
      } else {
        alert('Errore durante il salvataggio della fragranza.');
      }
    } catch (err) {
      console.error('Error saving fragrance:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/admin/fragrances?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeleteTarget(null);
        fetchData();
      } else {
        alert("Errore durante l'eliminazione della fragranza.");
      }
    } catch (err) {
      console.error('Error deleting fragrance:', err);
    }
  };

  const handleMoveOrder = async (fra: FragranceItem, direction: 'UP' | 'DOWN') => {
    const sorted = [...fragrances].sort((a, b) => (a.order || 0) - (b.order || 0));
    const index = sorted.findIndex((f) => f.id === fra.id);
    if (index === -1) return;

    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const otherFra = sorted[targetIndex];
    const currentOrder = fra.order || index + 1;
    const targetOrder = otherFra.order || targetIndex + 1;

    await Promise.all([
      fetch('/api/admin/fragrances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fra, order: targetOrder }),
      }),
      fetch('/api/admin/fragrances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...otherFra, order: currentOrder }),
      }),
    ]);

    fetchData();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
            <Flame className="w-6 h-6 text-amber-500" />
            <span>Gestione Fragranze & Note Olfattive</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Gestisci in modo dinamico le fragranze, i badge, le descrizioni e la piramide olfattiva (testa, cuore, fondo) visibili nelle schede prodotto e nelle pagine dedicate del sito.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-amber-500 text-neutral-950 text-xs font-bold uppercase rounded-xs hover:bg-amber-400 transition-colors flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nuova Fragranza</span>
        </button>
      </div>

      {/* Fragrances Table */}
      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest text-amber-500 animate-pulse">
          Caricamento catalogo fragranze in corso...
        </div>
      ) : fragrances.length === 0 ? (
        <div className="p-12 text-center bg-neutral-950 rounded-sm border border-neutral-800 space-y-3">
          <Wind className="w-8 h-8 text-neutral-600 mx-auto" />
          <p className="text-sm text-neutral-400">Nessuna fragranza trovata nel catalogo.</p>
          <button
            onClick={handleOpenCreateModal}
            className="text-xs font-bold text-amber-500 hover:underline uppercase"
          >
            Crea la prima fragranza →
          </button>
        </div>
      ) : (
        <div className="bg-neutral-950 rounded-sm border border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider font-bold border-b border-neutral-800">
                <tr>
                  <th className="py-3 px-4 w-16">Ordine</th>
                  <th className="py-3 px-4 w-20">Anteprima</th>
                  <th className="py-3 px-4">Nome & Slug</th>
                  <th className="py-3 px-4">Badge / Famiglia</th>
                  <th className="py-3 px-4">Piramide Olfattiva</th>
                  <th className="py-3 px-4">Stato</th>
                  <th className="py-3 px-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-medium">
                {fragrances.map((fra, idx) => (
                  <tr key={fra.id} className="hover:bg-neutral-900/50 transition-colors">
                    {/* Order Controls */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="font-mono text-neutral-400 font-bold">{fra.order || idx + 1}</span>
                        <div className="flex space-x-1">
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(fra, 'UP')}
                            disabled={idx === 0}
                            className="p-0.5 text-neutral-500 hover:text-amber-400 disabled:opacity-30"
                            title="Sposta su"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(fra, 'DOWN')}
                            disabled={idx === fragrances.length - 1}
                            className="p-0.5 text-neutral-500 hover:text-amber-400 disabled:opacity-30"
                            title="Sposta giù"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Image Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 bg-neutral-900 rounded-xs overflow-hidden border border-neutral-800 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={fra.image || '/images/collezione-dessert-gourmet.jpg'} alt={fra.name} className="w-full h-full object-cover" />
                      </div>
                    </td>

                    {/* Name & Slug */}
                    <td className="py-3 px-4 space-y-0.5">
                      <span className="font-serif text-sm font-bold text-white block">{fra.name}</span>
                      <span className="text-[10px] text-amber-500 font-mono block">/{fra.slug}</span>
                    </td>

                    {/* Badge */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase rounded-xs inline-block">
                        {fra.badge || 'FIORITA CIPRIATA'}
                      </span>
                    </td>

                    {/* Pyramid Notes Summary */}
                    <td className="py-3 px-4 text-[11px] space-y-0.5 max-w-xs">
                      <div><strong className="text-neutral-400">Testa:</strong> {fra.topNotes?.join(', ') || '-'}</div>
                      <div><strong className="text-neutral-400">Cuore:</strong> {fra.heartNotes?.join(', ') || '-'}</div>
                      <div><strong className="text-neutral-400">Fondo:</strong> {fra.baseNotes?.join(', ') || '-'}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {fra.status === 'ACTIVE' ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded-xs inline-flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>Attiva</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700 text-[10px] font-bold uppercase rounded-xs inline-flex items-center space-x-1">
                          <EyeOff className="w-3 h-3" />
                          <span>Disattivata</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(fra)}
                          className="px-2.5 py-1.5 bg-neutral-900 text-white border border-neutral-800 hover:border-amber-500 hover:text-amber-400 text-xs font-bold rounded-xs flex items-center space-x-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Modifica</span>
                        </button>

                        <button
                          onClick={() => setDeleteTarget(fra)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xs"
                          title="Elimina fragranza"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingFragrance && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-950 border border-neutral-800 rounded-sm w-full max-w-2xl overflow-hidden shadow-2xl space-y-6">
            <div className="flex justify-between items-center bg-neutral-900 p-4 border-b border-neutral-800">
              <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {editingFragrance.id ? `Modifica Fragranza: ${editingFragrance.name}` : 'Nuova Fragranza'}
                </span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFragrance} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status */}
                <div className="space-y-1">
                  <label className="block font-bold uppercase text-neutral-300">Stato Fragranza</label>
                  <select
                    value={editingFragrance.status || 'ACTIVE'}
                    onChange={(e) =>
                      setEditingFragrance({ ...editingFragrance, status: e.target.value as 'ACTIVE' | 'HIDDEN' })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-xs"
                  >
                    <option value="ACTIVE">Attiva / Visibile</option>
                    <option value="HIDDEN">Disattivata / Nascosta</option>
                  </select>
                </div>

                {/* Badge / Famiglia Olfattiva */}
                <div className="space-y-1">
                  <label className="block font-bold uppercase text-neutral-300">Badge / Famiglia Olfattiva *</label>
                  <input
                    type="text"
                    required
                    value={editingFragrance.badge || ''}
                    onChange={(e) => setEditingFragrance({ ...editingFragrance, badge: e.target.value })}
                    placeholder="es. FIORITA CIPRIATA, GOURMAND AVVOLGENTE"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-bold rounded-xs"
                  />
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="block font-bold uppercase text-neutral-300">Nome Fragranza *</label>
                  <input
                    type="text"
                    required
                    value={editingFragrance.name || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const autoSlug = val
                        .toLowerCase()
                        .trim()
                        .replace(/&/g, 'e')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      setEditingFragrance({
                        ...editingFragrance,
                        name: val,
                        slug: editingFragrance.slug ? editingFragrance.slug : autoSlug,
                      });
                    }}
                    placeholder="es. Rosa Centifolia & Legno di Rosa"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-xs font-serif font-bold text-sm"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <label className="block font-bold uppercase text-neutral-300">Slug URL *</label>
                  <input
                    type="text"
                    required
                    value={editingFragrance.slug || ''}
                    onChange={(e) => setEditingFragrance({ ...editingFragrance, slug: e.target.value })}
                    placeholder="es. rosa-centifolia"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-amber-400 font-mono text-xs rounded-xs"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block font-bold uppercase text-neutral-300">Descrizione Olfattiva</label>
                  <textarea
                    rows={3}
                    value={editingFragrance.description || ''}
                    onChange={(e) => setEditingFragrance({ ...editingFragrance, description: e.target.value })}
                    placeholder="Descrivi l'ispirazione, il carattere e le emozioni sollecitate dalla fragranza..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-xs"
                  />
                </div>

                {/* Structured Olfactory Pyramid */}
                <div className="space-y-3 sm:col-span-2 p-3.5 bg-neutral-900 rounded-xs border border-neutral-800 space-y-3">
                  <span className="block font-bold uppercase text-amber-400 text-xs">
                    📐 Piramide Olfattiva (Separate da virgola)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-neutral-300">Note di Testa</label>
                      <input
                        type="text"
                        value={topNotesInput}
                        onChange={(e) => setTopNotesInput(e.target.value)}
                        placeholder="Bergamotto, Lime..."
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-neutral-300">Note di Cuore</label>
                      <input
                        type="text"
                        value={heartNotesInput}
                        onChange={(e) => setHeartNotesInput(e.target.value)}
                        placeholder="Rosa Centifolia, Iris..."
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-neutral-300">Note di Fondo</label>
                      <input
                        type="text"
                        value={baseNotesInput}
                        onChange={(e) => setBaseNotesInput(e.target.value)}
                        placeholder="Legno di Cedro, Muschio..."
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="space-y-2 sm:col-span-2 p-3 bg-neutral-900 rounded-xs border border-neutral-800">
                  <label className="block font-bold uppercase text-neutral-300">Immagine Illustrativa</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-neutral-950 rounded-xs overflow-hidden border border-neutral-800 relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editingFragrance.image || '/images/collezione-dessert-gourmet.jpg'} alt="Preview" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editingFragrance.image || ''}
                        onChange={(e) => setEditingFragrance({ ...editingFragrance, image: e.target.value })}
                        placeholder="URL Immagine o carica file..."
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xs"
                      />

                      <label className="inline-flex items-center space-x-2 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950 text-xs font-bold uppercase rounded-xs cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Caricamento...' : 'Carica Nuova Immagine'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 rounded-xs text-xs font-bold uppercase"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-neutral-950 hover:bg-amber-400 rounded-xs text-xs font-bold uppercase flex items-center space-x-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Salva Fragranza</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-sm w-full max-w-md p-6 space-y-5 shadow-2xl text-center">
            <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-white">Elimina Fragranza: {deleteTarget.name}?</h3>
              <p className="text-xs text-neutral-400">
                Sei sicuro di voler eliminare la fragranza "{deleteTarget.name}"? L'azione rimuoverà la fragranza dal catalogo ma NON eliminerà alcun prodotto.
              </p>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-neutral-900 text-neutral-300 border border-neutral-800 text-xs font-bold uppercase rounded-xs hover:text-white"
              >
                Annulla
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase rounded-xs hover:bg-red-500 shadow-md"
              >
                Conferma Eliminazione
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
