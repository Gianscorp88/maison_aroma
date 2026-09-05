'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FullProduct } from '@/lib/products-types';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<FullProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.categoryName || 'Senza Categoria')));

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.categoryName === categoryFilter;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && p.status === 'ACTIVE') ||
      (statusFilter === 'HIDDEN' && (p.status === 'HIDDEN' || p.status === 'DRAFT'));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atelier Catalog Management</span>
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Gestione Prodotti ({products.length})</h1>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors rounded-xs shadow-md flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuovo Prodotto</span>
        </Link>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="bg-neutral-950 p-4 rounded-sm border border-neutral-800 flex flex-col md:flex-row justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cerca per nome candela o descrizione..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 rounded-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xs focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="ALL">Tutte le Collezioni</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-800 text-xs text-white rounded-xs focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="ALL">Tutti gli Stati</option>
            <option value="ACTIVE">Solo Pubblicati / Attivi</option>
            <option value="HIDDEN">Solo Bozza / Nascosti</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-neutral-950 rounded-sm border border-neutral-800 overflow-hidden shadow-luxury">
        {loading ? (
          <div className="p-12 text-center text-xs uppercase tracking-widest text-amber-500 animate-pulse">
            Caricamento prodotti in corso...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
            <p className="text-sm text-neutral-400">Nessun prodotto trovato con i filtri selezionati.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-xs text-amber-500 hover:underline font-semibold"
            >
              Resetta tutti i filtri
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-900/80 border-b border-neutral-800">
                <tr>
                  <th className="py-3.5 px-4">Prodotto</th>
                  <th className="py-3.5 px-3">Collezione / Categoria</th>
                  <th className="py-3.5 px-3">Prezzo</th>
                  <th className="py-3.5 px-3">Stato</th>
                  <th className="py-3.5 px-3">Ord. Minimo</th>
                  <th className="py-3.5 px-4 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/70">
                {filteredProducts.map((product) => {
                  const mainImage =
                    product.galleryImages.find((img) => img.isMain)?.url ||
                    product.galleryImages[0]?.url ||
                    'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=300&auto=format&fit=crop';

                  const formattedPrice = product.basePrice.toFixed(2).replace('.', ',');

                  return (
                    <tr key={product.id} className="hover:bg-neutral-900/60 transition-colors">
                      {/* Image & Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xs overflow-hidden bg-neutral-900 border border-neutral-800 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-serif font-bold text-white text-sm line-clamp-1">{product.name}</h3>
                            <span className="text-[10px] text-neutral-500 font-mono">/shop/{product.slug}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-3">
                        <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-amber-400 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                          {product.categoryName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-3 font-serif font-bold text-white text-sm">
                        €{formattedPrice}
                        {product.isVatIncluded && (
                          <span className="block text-[9px] font-normal font-sans text-neutral-500 uppercase">IVA incl.</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3">
                        {product.status === 'ACTIVE' ? (
                          <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-[10px] font-bold inline-flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Pubblicato</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-neutral-900 text-neutral-400 border border-neutral-700 rounded-full text-[10px] font-bold inline-flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            <span>Bozza / Nascosto</span>
                          </span>
                        )}
                      </td>

                      {/* Min Quantity */}
                      <td className="py-4 px-3 text-neutral-400 font-mono">
                        {product.minQuantity || 1} pz
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right space-x-2">
                        {/* Edit Button */}
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950 transition-colors rounded-xs text-[11px] font-semibold"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Modifica</span>
                        </Link>

                        {/* Preview Button */}
                        <a
                          href={`/shop/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800 transition-colors rounded-xs text-[11px]"
                          title="Vedi anteprima sul sito"
                        >
                          <Eye className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Anteprima</span>
                        </a>

                        {/* Delete Button */}
                        {deleteConfirmId === product.id ? (
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-2.5 py-1.5 bg-red-600 text-white rounded-xs text-[10px] font-bold uppercase animate-pulse"
                          >
                            Conferma Elimina
                          </button>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors rounded-xs"
                            title="Elimina prodotto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
