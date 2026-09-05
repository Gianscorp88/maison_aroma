'use client';

import React, { useState, useEffect } from 'react';
import { CategoryItem, FullProduct } from '@/lib/products-types';
import {
  Plus,
  Edit2,
  Trash2,
  Image,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
  Calendar,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'COLLECTION' | 'EVENT'>('COLLECTION');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modal State for Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [deleteWarningProductsCount, setDeleteWarningProductsCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resCat, resProd] = await Promise.all([
        fetch('/api/admin/categories'),
        fetch('/api/admin/products'),
      ]);

      if (resCat.ok) {
        const catData = await resCat.json();
        setCategories(catData);
      }
      if (resProd.ok) {
        const prodData = await resProd.json();
        setProducts(prodData);
      }
    } catch (err) {
      console.error('Error fetching admin categories data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductsCountForCategory = (cat: CategoryItem) => {
    return products.filter((p) => {
      const targetSlug = cat.slug.toLowerCase();
      const targetId = cat.id.toLowerCase();
      const pCatName = (p.categoryName || '').toLowerCase();
      const pCatSlug = (p.categorySlug || '').toLowerCase();

      if (p.collectionIds && p.collectionIds.includes(cat.id)) return true;
      if (p.eventIds && p.eventIds.includes(cat.id)) return true;
      if (pCatSlug === targetSlug || pCatName === cat.name.toLowerCase()) return true;
      return false;
    }).length;
  };

  const handleOpenCreateModal = (type: 'COLLECTION' | 'EVENT') => {
    setEditingCategory({
      type,
      name: '',
      title: '',
      slug: '',
      eyebrow: '',
      description: '',
      cardImage: '/images/collezione-dessert-gourmet.jpg',
      heroImage: '/images/collezione-dessert-gourmet.jpg',
      status: 'ACTIVE',
      order: categories.filter((c) => c.type === type).length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryItem) => {
    setEditingCategory({ ...cat });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'cardImage' | 'heroImage') => {
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
        setEditingCategory((prev) => (prev ? { ...prev, [targetField]: data.url } : null));
      } else {
        alert('Caricamento immagine fallito.');
      }
    } catch (err) {
      console.error('Error uploading category image:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingCategory(null);
        fetchData();
      } else {
        alert('Errore durante il salvataggio della categoria.');
      }
    } catch (err) {
      console.error('Error saving category:', err);
    }
  };

  const handlePromptDelete = (cat: CategoryItem) => {
    const count = getProductsCountForCategory(cat);
    setDeleteWarningProductsCount(count);
    setDeleteTarget(cat);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeleteTarget(null);
        fetchData();
      } else {
        alert("Errore durante l'eliminazione della categoria.");
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  const handleMoveOrder = async (cat: CategoryItem, direction: 'UP' | 'DOWN') => {
    const sameTypeCats = categories
      .filter((c) => c.type === cat.type)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const index = sameTypeCats.findIndex((c) => c.id === cat.id);
    if (index === -1) return;

    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sameTypeCats.length) return;

    const otherCat = sameTypeCats[targetIndex];
    const currentOrder = cat.order || index + 1;
    const targetOrder = otherCat.order || targetIndex + 1;

    // Swap orders
    await Promise.all([
      fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cat, order: targetOrder }),
      }),
      fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...otherCat, order: currentOrder }),
      }),
    ]);

    fetchData();
  };

  const filteredCategories = categories.filter((c) => c.type === activeTab);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white flex items-center space-x-2">
            <Layers className="w-6 h-6 text-amber-500" />
            <span>Gestione Categorie (Collezioni & Eventi)</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Gestisci in modo dinamico i titoli, le immagini, i testi, i badge e l'ordine delle Collezioni e degli Eventi visualizzati sul sito.
          </p>
        </div>

        <button
          onClick={() => handleOpenCreateModal(activeTab)}
          className="px-4 py-2.5 bg-amber-500 text-neutral-950 text-xs font-bold uppercase rounded-xs hover:bg-amber-400 transition-colors flex items-center space-x-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'COLLECTION' ? '+ Nuova Collezione' : '+ Nuovo Evento'}</span>
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex space-x-4 border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('COLLECTION')}
          className={`pb-3 text-xs uppercase font-bold tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'COLLECTION'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Collezioni ({categories.filter((c) => c.type === 'COLLECTION').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('EVENT')}
          className={`pb-3 text-xs uppercase font-bold tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'EVENT'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Eventi ({categories.filter((c) => c.type === 'EVENT').length})</span>
        </button>
      </div>

      {/* Categories Table / List */}
      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest text-amber-500 animate-pulse">
          Caricamento categorie in corso...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-12 text-center bg-neutral-950 rounded-sm border border-neutral-800 space-y-3">
          <Layers className="w-8 h-8 text-neutral-600 mx-auto" />
          <p className="text-sm text-neutral-400">Nessuna categoria trovata in questa sezione.</p>
          <button
            onClick={() => handleOpenCreateModal(activeTab)}
            className="text-xs font-bold text-amber-500 hover:underline uppercase"
          >
            Crea la prima categoria →
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
                  <th className="py-3 px-4">Eyebrow / Badge</th>
                  <th className="py-3 px-4">Prodotti Associati</th>
                  <th className="py-3 px-4">Stato</th>
                  <th className="py-3 px-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-medium">
                {filteredCategories.map((cat, idx) => {
                  const prodCount = getProductsCountForCategory(cat);
                  return (
                    <tr key={cat.id} className="hover:bg-neutral-900/50 transition-colors">
                      {/* Order Controls */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <span className="font-mono text-neutral-400 font-bold">{cat.order || idx + 1}</span>
                          <div className="flex space-x-1">
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(cat, 'UP')}
                              disabled={idx === 0}
                              className="p-0.5 text-neutral-500 hover:text-amber-400 disabled:opacity-30"
                              title="Sposta su"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveOrder(cat, 'DOWN')}
                              disabled={idx === filteredCategories.length - 1}
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
                        <div className="w-14 h-14 bg-neutral-900 rounded-xs overflow-hidden border border-neutral-800 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={cat.cardImage} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                      </td>

                      {/* Name & Slug */}
                      <td className="py-3 px-4 space-y-0.5">
                        <span className="font-serif text-sm font-bold text-white block">{cat.name}</span>
                        <span className="text-[10px] text-amber-500 font-mono block">/{cat.slug}</span>
                      </td>

                      {/* Eyebrow */}
                      <td className="py-3 px-4">
                        <span className="text-[11px] text-neutral-300 font-medium italic max-w-xs block truncate">
                          {cat.eyebrow || '-'}
                        </span>
                      </td>

                      {/* Associated Products Count */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-neutral-900 border border-neutral-800 text-white font-mono rounded-xs">
                          {prodCount} prodotti
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {cat.status === 'ACTIVE' ? (
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase rounded-xs inline-flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>Pubblicata</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 border border-neutral-700 text-[10px] font-bold uppercase rounded-xs inline-flex items-center space-x-1">
                            <EyeOff className="w-3 h-3" />
                            <span>Nascosta</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(cat)}
                            className="px-2.5 py-1.5 bg-neutral-900 text-white border border-neutral-800 hover:border-amber-500 hover:text-amber-400 text-xs font-bold rounded-xs flex items-center space-x-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Modifica</span>
                          </button>

                          <button
                            onClick={() => handlePromptDelete(cat)}
                            className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-xs"
                            title="Elimina categoria"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-950 border border-neutral-800 rounded-sm w-full max-w-2xl overflow-hidden shadow-2xl space-y-6">
            <div className="flex justify-between items-center bg-neutral-900 p-4 border-b border-neutral-800">
              <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {editingCategory.id
                    ? `Modifica Categoria: ${editingCategory.name}`
                    : `Nuova ${editingCategory.type === 'COLLECTION' ? 'Collezione' : 'Categoria Evento'}`}
                </span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type */}
                <div className="space-y-1">
                  <label className="block font-bold uppercase text-neutral-300">Tipologia</label>
                  <select
                    value={editingCategory.type || 'COLLECTION'}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, type: e.target.value as 'COLLECTION' | 'EVENT' })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-xs"
                  >
                    <option value="COLLECTION">Collezione (es. Dessert Gourmet, Romance)</option>
                    <option value="EVENT">Evento (es. Matrimoni, San Valentino, Natale)</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="block font-bold uppercase text-neutral-300">Stato Pubblicazione</label>
                  <select
                    value={editingCategory.status || 'ACTIVE'}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, status: e.target.value as 'ACTIVE' | 'HIDDEN' })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-xs"
                  >
                    <option value="ACTIVE">Pubblicata sul sito</option>
                    <option value="HIDDEN">Nascosta / Bozza</option>
                  </select>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="block font-bold uppercase text-neutral-300">Nome Categoria *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const autoSlug = val
                        .toLowerCase()
                        .trim()
                        .replace(/&/g, 'e')
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '');
                      setEditingCategory({
                        ...editingCategory,
                        name: val,
                        title: val,
                        slug: editingCategory.slug ? editingCategory.slug : autoSlug,
                      });
                    }}
                    placeholder="es. Collezione Botanica"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-xs font-serif font-bold text-sm"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <label className="block font-bold uppercase text-neutral-300">Slug URL *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.slug || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    placeholder="es. collezione-botanica"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-amber-400 font-mono text-xs rounded-xs"
                  />
                </div>

                {/* Eyebrow / Badge */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block font-bold uppercase text-neutral-300">Badge / Eyebrow Superiore</label>
                  <input
                    type="text"
                    value={editingCategory.eyebrow || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, eyebrow: e.target.value })}
                    placeholder="es. 🌿 ELEGANZA BOTANICA, CERA DI SOIA E ESSENZE NATURALI"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-xs"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="block font-bold uppercase text-neutral-300">Testo Descrittivo</label>
                  <textarea
                    rows={3}
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    placeholder="Descrizione della collezione o evento..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-xs"
                  />
                </div>

                {/* Card Image */}
                <div className="space-y-2 sm:col-span-2 p-3 bg-neutral-900 rounded-xs border border-neutral-800">
                  <label className="block font-bold uppercase text-neutral-300">Immagine Card Categoria</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-neutral-950 rounded-xs overflow-hidden border border-neutral-800 relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editingCategory.cardImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editingCategory.cardImage || ''}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            cardImage: e.target.value,
                            heroImage: editingCategory.heroImage || e.target.value,
                          })
                        }
                        placeholder="URL Immagine o carica file..."
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xs"
                      />

                      <label className="inline-flex items-center space-x-2 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950 text-xs font-bold uppercase rounded-xs cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Caricamento...' : 'Carica Nuova Immagine'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'cardImage')}
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
                  <span>Salva Categoria</span>
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
              <h3 className="text-lg font-serif font-bold text-white">Elimina Categoria: {deleteTarget.name}?</h3>
              {deleteWarningProductsCount > 0 ? (
                <p className="text-xs text-amber-400 bg-amber-500/10 p-3 rounded-xs border border-amber-500/20 leading-relaxed font-medium">
                  ⚠️ Questa categoria contiene <strong>{deleteWarningProductsCount} prodotti</strong>. Eliminando la categoria i prodotti <strong>NON verranno eliminati</strong> dal sito, ma verranno semplicemente scollegati da questa categoria.
                </p>
              ) : (
                <p className="text-xs text-neutral-400">
                  Sei sicuro di voler eliminare la categoria "{deleteTarget.name}"? L'azione non può essere annullata.
                </p>
              )}
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
