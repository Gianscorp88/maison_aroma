'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FullProduct, ProductImage, BadgeItem, FeatureItem, FragranceNoteItem, TechInfoItem, CustomFragranceOption, CategoryItem, FragranceItem, DEFAULT_CUSTOM_FRAGRANCES } from '@/lib/products-types';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Sparkles,
  Leaf,
  Flame,
  Award,
  Home,
  Gift,
  Palette,
  Info,
  Check,
  FileText,
  Tag,
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { name: 'Collezione Dessert Gourmet', slug: 'dessert' },
  { name: 'Collezione Romance', slug: 'romance' },
  { name: 'Matrimoni & Sposi', slug: 'matrimonio' },
  { name: 'Atelier Design', slug: 'minimal' },
  { name: 'Battesimi & Nascita', slug: 'battesimo' },
  { name: 'Eventi Aziendali & Hotel', slug: 'corporate' },
];

const ICON_OPTIONS = ['Leaf', 'Flame', 'Award', 'Home', 'Gift', 'Sparkles', 'ShieldCheck'];

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);
  const [allFragrances, setAllFragrances] = useState<FragranceItem[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/categories', { cache: 'no-store' }),
      fetch('/api/admin/fragrances', { cache: 'no-store' }),
    ])
      .then(async ([resCat, resFra]) => {
        if (resCat.ok) setAllCategories(await resCat.json());
        if (resFra.ok) setAllFragrances(await resFra.json());
      })
      .catch((err) => console.error('Error loading admin metadata:', err));
  }, []);

  // Form State
  const [product, setProduct] = useState<FullProduct>({
    id: isNew ? '' : id,
    name: '',
    slug: '',
    categoryName: 'Collezione Dessert Gourmet',
    categorySlug: 'dessert',
    basePrice: 24.0,
    isVatIncluded: true,
    eyebrowText: '',
    status: 'ACTIVE',
    isBestSeller: false,
    minQuantity: 1,
    shortDescription: '',
    descriptionParagraph1: '',
    descriptionParagraph2: '',
    galleryImages: [],
    badges: [
      { id: 'b-1', text: 'Cera di Soia', icon: 'Leaf', active: true, order: 1 },
      { id: 'b-2', text: 'Fatta a Mano', icon: 'Flame', active: true, order: 2 },
      { id: 'b-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
    ],
    showHighlightBox: true,
    highlightBoxText: '✨ Ogni candela è realizzata a mano e può presentare leggere variazioni che la rendono unica.',
    features: [
      { id: 'f-1', text: 'Cera di soia naturale', icon: 'Leaf', active: true, order: 1 },
      { id: 'f-2', text: 'Colata a mano', icon: 'Flame', active: true, order: 2 },
      { id: 'f-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
      { id: 'f-4', text: 'Perfetta per arredare', icon: 'Home', active: true, order: 4 },
      { id: 'f-5', text: 'Ideale come regalo elegante', icon: 'Gift', active: true, order: 5 },
    ],
    showFragranceProfile: true,
    allowCustomFragrance: true,
    customFragranceLabel: 'Vuoi una fragranza personalizzata?',
    fragranceNotes: [],
    showColorSection: true,
    standardColorName: 'Avorio Naturale Soia',
    standardColorHex: '#FAF8F5',
    allowCustomColor: true,
    customColorLabel: 'Indica un colore personalizzato',
    showTechDetails: true,
    techInfo: [
      { id: 't-1', key: 'Materiale Vaso', value: 'Vetro Trasparente 250g', order: 1 },
      { id: 't-2', key: 'Cera', value: '100% Cera di Soia Naturale', order: 2 },
      { id: 't-3', key: 'Durata Bruciatura', value: 'Circa 45 ore', order: 3 },
    ],
  });

  useEffect(() => {
    if (!isNew) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/products?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (name: string) => {
    setProduct((prev) => ({
      ...prev,
      name,
      slug: isNew || !prev.slug ? generateSlug(name) : prev.slug,
    }));
  };

  const handleCategoryChange = (catName: string) => {
    const selected = CATEGORY_OPTIONS.find((c) => c.name === catName);
    setProduct((prev) => ({
      ...prev,
      categoryName: catName,
      categorySlug: selected ? selected.slug : 'catalogo',
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', files[0]);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const newImg: ProductImage = {
          id: `img_${Date.now()}`,
          url: data.url,
          label: `Foto ${product.galleryImages.length + 1}`,
          isMain: product.galleryImages.length === 0,
        };

        setProduct((prev) => ({
          ...prev,
          galleryImages: [...prev.galleryImages, newImg],
        }));
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddExternalImageUrl = () => {
    const url = prompt('Inserisci l’URL dell’immagine:');
    if (!url) return;

    const newImg: ProductImage = {
      id: `img_${Date.now()}`,
      url,
      label: `Foto ${product.galleryImages.length + 1}`,
      isMain: product.galleryImages.length === 0,
    };

    setProduct((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, newImg],
    }));
  };

  const setMainImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.map((img, i) => ({
        ...img,
        isMain: i === index,
      })),
    }));
  };

  const removeImage = (index: number) => {
    setProduct((prev) => {
      const updated = prev.galleryImages.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isMain)) {
        updated[0].isMain = true;
      }
      return { ...prev, galleryImages: updated };
    });
  };

  const moveImage = (index: number, direction: 'UP' | 'DOWN') => {
    const images = [...product.galleryImages];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= images.length) return;

    const temp = images[index];
    images[index] = images[targetIndex];
    images[targetIndex] = temp;

    setProduct((prev) => ({ ...prev, galleryImages: images }));
  };

  // Badge Handlers
  const addBadge = () => {
    const newBdg: BadgeItem = {
      id: `bdg_${Date.now()}`,
      text: 'Nuovo Badge',
      icon: 'Leaf',
      active: true,
      order: product.badges.length + 1,
    };
    setProduct((prev) => ({ ...prev, badges: [...prev.badges, newBdg] }));
  };

  // Features Handlers
  const addFeature = () => {
    const newFt: FeatureItem = {
      id: `ft_${Date.now()}`,
      text: 'Nuova Caratteristica',
      icon: 'Leaf',
      active: true,
      order: product.features.length + 1,
    };
    setProduct((prev) => ({ ...prev, features: [...prev.features, newFt] }));
  };

  // Fragrance Notes Handlers
  const addFragranceNote = () => {
    const newNote: FragranceNoteItem = {
      id: `fn_${Date.now()}`,
      note: 'Nome Nota',
      detail: 'Descrizione / sensazione',
      order: product.fragranceNotes.length + 1,
    };
    setProduct((prev) => ({ ...prev, fragranceNotes: [...prev.fragranceNotes, newNote] }));
  };

  // Custom Fragrance Options Handler
  const addCustomFragranceOption = () => {
    const list = product.availableCustomFragrances || DEFAULT_CUSTOM_FRAGRANCES;
    const newCfg: CustomFragranceOption = {
      id: `cfg_${Date.now()}`,
      name: 'Nuova Fragranza (es. Talco & Iris)',
      active: true,
      order: list.length + 1,
    };
    setProduct((prev) => ({
      ...prev,
      availableCustomFragrances: [...list, newCfg],
    }));
  };

  // Tech Info Handlers
  const addTechInfo = () => {
    const newTech: TechInfoItem = {
      id: `ti_${Date.now()}`,
      key: 'Etichetta (es. Peso)',
      value: 'Valore (es. 250g)',
      order: product.techInfo.length + 1,
    };
    setProduct((prev) => ({ ...prev, techInfo: [...prev.techInfo, newTech] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaveSuccess(false);

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        const savedData = await res.json();
        setProduct(savedData);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);

        if (isNew) {
          router.push(`/admin/products/${savedData.id}`);
        }
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs uppercase tracking-widest text-amber-500 animate-pulse">
        Caricamento scheda prodotto...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-800 pb-6 gap-4 sticky top-0 bg-neutral-900/90 backdrop-blur-md z-30 py-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products"
            className="p-2 text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-800 rounded-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500">
              {isNew ? 'Nuova Candela / Bomboniera' : `ID: ${product.id}`}
            </span>
            <h1 className="text-2xl font-serif font-bold text-white">
              {product.name || 'Nuovo Prodotto'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!isNew && (
            <a
              href={`/shop/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-neutral-950 text-neutral-300 border border-neutral-800 text-xs uppercase font-bold hover:bg-neutral-800 transition-colors rounded-xs flex items-center space-x-1.5"
            >
              <Eye className="w-4 h-4 text-amber-500" />
              <span>Anteprima</span>
            </a>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all rounded-xs shadow-md flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Salvataggio...' : 'Salva Modifiche'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs rounded-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">Modifiche salvate con successo! Il prodotto è aggiornato sul sito.</span>
          </div>
          <a href={`/shop/${product.slug}`} target="_blank" rel="noopener noreferrer" className="underline font-bold">
            Vedi sul sito →
          </a>
        </div>
      )}

      {/* SECTION 1: INFORMAZIONI PRINCIPALI */}
      <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-6">
        <h2 className="text-lg font-serif font-bold text-white border-b border-neutral-800 pb-3 flex items-center space-x-2">
          <Tag className="w-4 h-4 text-amber-500" />
          <span>1. Informazioni Principali</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome Prodotto */}
          <div className="space-y-1.5 col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Nome Prodotto *
            </label>
            <input
              type="text"
              required
              value={product.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="es. Coppa Chantilly & Fragoline di Bosco"
              className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 text-white text-sm rounded-xs focus:outline-none focus:border-amber-500 font-serif"
            />
          </div>

          {/* Slug URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Slug URL Univoco (/shop/[slug])
            </label>
            <input
              type="text"
              value={product.slug}
              onChange={(e) => setProduct({ ...product, slug: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono rounded-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Sezione Collezioni (Multi-Select) */}
          <div className="space-y-2 col-span-2 sm:col-span-1 p-3.5 bg-neutral-900 rounded-xs border border-neutral-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>Collezioni Associate</span>
              <span className="text-[10px] text-neutral-400 font-normal">Seleziona 1 o più</span>
            </label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {allCategories
                .filter((c) => c.type === 'COLLECTION')
                .map((cat) => {
                  const isChecked = (product.collectionIds || []).includes(cat.id) || product.categoryName === cat.name;
                  return (
                    <label key={cat.id} className="flex items-center space-x-2 text-xs text-white hover:bg-neutral-800 p-1.5 rounded-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          let current = [...(product.collectionIds || [])];
                          if (e.target.checked) {
                            if (!current.includes(cat.id)) current.push(cat.id);
                          } else {
                            current = current.filter((id) => id !== cat.id);
                          }
                          setProduct({
                            ...product,
                            collectionIds: current,
                            categoryName: cat.name,
                            categorySlug: cat.slug,
                          });
                        }}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <span className="font-serif font-bold">{cat.name}</span>
                    </label>
                  );
                })}
            </div>
          </div>

          {/* Sezione Eventi (Multi-Select) */}
          <div className="space-y-2 col-span-2 sm:col-span-1 p-3.5 bg-neutral-900 rounded-xs border border-neutral-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
              <span>Eventi / Occasioni Associate</span>
              <span className="text-[10px] text-neutral-400 font-normal">Seleziona 1 o più</span>
            </label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {allCategories
                .filter((c) => c.type === 'EVENT')
                .map((cat) => {
                  const isChecked = (product.eventIds || []).includes(cat.id);
                  return (
                    <label key={cat.id} className="flex items-center space-x-2 text-xs text-white hover:bg-neutral-800 p-1.5 rounded-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          let current = [...(product.eventIds || [])];
                          if (e.target.checked) {
                            if (!current.includes(cat.id)) current.push(cat.id);
                          } else {
                            current = current.filter((id) => id !== cat.id);
                          }
                          setProduct({
                            ...product,
                            eventIds: current,
                          });
                        }}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <span>{cat.name}</span>
                    </label>
                  );
                })}
            </div>
          </div>

          {/* Prezzo Base */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Prezzo (€) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={product.basePrice}
              onChange={(e) => setProduct({ ...product, basePrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-sm font-serif font-bold rounded-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quantità Minima */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Quantità Minima Ordinabile
            </label>
            <input
              type="number"
              value={product.minQuantity || 1}
              onChange={(e) => setProduct({ ...product, minQuantity: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-xs font-mono rounded-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Eyebrow Text */}
          <div className="space-y-1.5 col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Testo Superiore / Eyebrow (opzionale)
            </label>
            <input
              type="text"
              value={product.eyebrowText || ''}
              onChange={(e) => setProduct({ ...product, eyebrowText: e.target.value })}
              placeholder="es. CREAZIONE ARTIGIANALE • COLLEZIONE DESSERT GOURMET"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs rounded-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Toggles: Stato e Bestseller */}
          <div className="flex flex-wrap items-center gap-6 col-span-2 pt-2 border-t border-neutral-800/80">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={product.status === 'ACTIVE'}
                onChange={(e) => setProduct({ ...product, status: e.target.checked ? 'ACTIVE' : 'HIDDEN' })}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="text-xs font-bold text-white uppercase">Pubblicato sul Sito</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={product.isVatIncluded}
                onChange={(e) => setProduct({ ...product, isVatIncluded: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="text-xs font-bold text-white uppercase">Mostra "IVA inclusa"</span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!product.isBestSeller}
                onChange={(e) => setProduct({ ...product, isBestSeller: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="text-xs font-bold text-amber-400 uppercase">Contrassegna come Bestseller</span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 2: IMMAGINI E GALLERY */}
      <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <h2 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
            <Upload className="w-4 h-4 text-amber-500" />
            <span>2. Media & Gallery Immagini ({product.galleryImages.length})</span>
          </h2>

          <div className="flex items-center space-x-2">
            <label className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase rounded-xs cursor-pointer inline-flex items-center space-x-1">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Caricamento...' : 'Carica Foto'}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              type="button"
              onClick={handleAddExternalImageUrl}
              className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 hover:border-amber-500 text-neutral-300 text-xs rounded-xs"
            >
              + Inserisci URL Foto
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {product.galleryImages.map((img, idx) => (
            <div
              key={img.id || idx}
              className={`p-3 bg-neutral-900 rounded-sm border space-y-3 relative ${
                img.isMain ? 'border-amber-500 bg-amber-500/5' : 'border-neutral-800'
              }`}
            >
              <div className="h-40 bg-neutral-950 rounded-xs overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.label || 'Foto'} className="w-full h-full object-cover" />

                {img.isMain && (
                  <span className="absolute top-2 left-2 bg-amber-500 text-neutral-950 text-[9px] font-bold uppercase px-2 py-0.5 rounded-xs shadow-md">
                    Foto Principale
                  </span>
                )}
              </div>

              {/* Label & Alt */}
              <input
                type="text"
                value={img.label || ''}
                onChange={(e) => {
                  const updated = [...product.galleryImages];
                  updated[idx].label = e.target.value;
                  setProduct({ ...product, galleryImages: updated });
                }}
                placeholder="Etichetta (es. Vista Frontale)"
                className="w-full px-2 py-1 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xs"
              />

              {/* Image Toolbar Actions */}
              <div className="flex justify-between items-center pt-1 border-t border-neutral-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => setMainImage(idx)}
                  className={`font-bold uppercase ${img.isMain ? 'text-amber-400' : 'text-neutral-400 hover:text-white'}`}
                >
                  {img.isMain ? '✓ Principale' : 'Imposta Principale'}
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 'UP')}
                    disabled={idx === 0}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 'DOWN')}
                    disabled={idx === product.galleryImages.length - 1}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="p-1 text-neutral-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: BADGES SUPERIORI */}
      <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <h2 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>3. Badge Superiori ({product.badges.length})</span>
          </h2>
          <button
            type="button"
            onClick={addBadge}
            className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950 text-xs font-bold uppercase rounded-xs"
          >
            + Aggiungi Badge
          </button>
        </div>

        <div className="space-y-3">
          {product.badges.map((bdg, idx) => (
            <div key={bdg.id || idx} className="flex items-center space-x-3 bg-neutral-900 p-3 rounded-xs border border-neutral-800">
              <input
                type="checkbox"
                checked={bdg.active}
                onChange={(e) => {
                  const updated = [...product.badges];
                  updated[idx].active = e.target.checked;
                  setProduct({ ...product, badges: updated });
                }}
                className="w-4 h-4 accent-amber-500"
              />
              <input
                type="text"
                value={bdg.text}
                onChange={(e) => {
                  const updated = [...product.badges];
                  updated[idx].text = e.target.value;
                  setProduct({ ...product, badges: updated });
                }}
                className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xs"
                placeholder="Testo Badge (es. Cera di Soia)"
              />
              <select
                value={bdg.icon || 'Leaf'}
                onChange={(e) => {
                  const updated = [...product.badges];
                  updated[idx].icon = e.target.value;
                  setProduct({ ...product, badges: updated });
                }}
                className="px-2 py-1.5 bg-neutral-950 border border-neutral-800 text-amber-400 text-xs rounded-xs"
              >
                {ICON_OPTIONS.map((ico, i) => (
                  <option key={i} value={ico}>
                    {ico}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setProduct({ ...product, badges: product.badges.filter((_, i) => i !== idx) });
                }}
                className="p-1.5 text-neutral-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: DESCRIZIONE & BOX EVIDENZA */}
      <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-6">
        <h2 className="text-lg font-serif font-bold text-white border-b border-neutral-800 pb-3 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-amber-500" />
          <span>4. Descrizione & Box Evidenza Artigianale</span>
        </h2>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Descrizione Principale Prodotto (Massimo 4-5 righe)
            </label>
            <textarea
              rows={4}
              value={product.descriptionParagraph1}
              onChange={(e) => setProduct({ ...product, descriptionParagraph1: e.target.value })}
              className="w-full p-3 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-xs leading-relaxed focus:outline-none focus:border-amber-500"
              placeholder="Descrizione sintetica ed emozionale..."
            />
          </div>

          <div className="p-4 bg-neutral-900 rounded-sm border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.showHighlightBox}
                  onChange={(e) => setProduct({ ...product, showHighlightBox: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-xs font-bold text-white uppercase">Mostra Box Evidenza Artigianale</span>
              </label>
            </div>

            {product.showHighlightBox && (
              <input
                type="text"
                value={product.highlightBoxText}
                onChange={(e) => setProduct({ ...product, highlightBoxText: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-amber-300 italic text-xs rounded-xs"
                placeholder="Testo nel box evidenza..."
              />
            )}
          </div>
        </div>
      </div>

      {/* SECTION 5: CARATTERISTICHE (LISTA DINAMICA) */}
      <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <h2 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
            <span>5. Lista Caratteristiche Prodotto ({product.features.length})</span>
          </h2>
          <button
            type="button"
            onClick={addFeature}
            className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950 text-xs font-bold uppercase rounded-xs"
          >
            + Aggiungi Caratteristica
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {product.features.map((ft, idx) => (
            <div key={ft.id || idx} className="flex items-center space-x-2 bg-neutral-900 p-2.5 rounded-xs border border-neutral-800">
              <input
                type="checkbox"
                checked={ft.active}
                onChange={(e) => {
                  const updated = [...product.features];
                  updated[idx].active = e.target.checked;
                  setProduct({ ...product, features: updated });
                }}
                className="w-4 h-4 accent-amber-500"
              />
              <input
                type="text"
                value={ft.text}
                onChange={(e) => {
                  const updated = [...product.features];
                  updated[idx].text = e.target.value;
                  setProduct({ ...product, features: updated });
                }}
                className="flex-1 px-3 py-1 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xs"
                placeholder="es. Colata a mano"
              />
              <select
                value={ft.icon || 'Leaf'}
                onChange={(e) => {
                  const updated = [...product.features];
                  updated[idx].icon = e.target.value;
                  setProduct({ ...product, features: updated });
                }}
                className="px-2 py-1 bg-neutral-950 border border-neutral-800 text-amber-400 text-xs rounded-xs"
              >
                {ICON_OPTIONS.map((ico, i) => (
                  <option key={i} value={ico}>
                    {ico}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setProduct({ ...product, features: product.features.filter((_, i) => i !== idx) });
                }}
                className="p-1 text-neutral-500 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: PROFILO OLFATTIVO & FRAGRANZA PERSONALIZZATA */}
      <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <h2 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>6. Profilo Olfattivo & Fragranza Personalizzata</span>
          </h2>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={product.showFragranceProfile}
              onChange={(e) => setProduct({ ...product, showFragranceProfile: e.target.checked })}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-xs font-bold text-white uppercase">Mostra Sezione Olfattiva</span>
          </label>
        </div>

        {product.showFragranceProfile && (
          <div className="space-y-6">
            {/* Fragrance Notes List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Note Olfattive Dinamiche ({product.fragranceNotes.length})
                </span>
                <button
                  type="button"
                  onClick={addFragranceNote}
                  className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950 text-xs font-bold uppercase rounded-xs"
                >
                  + Aggiungi Nota Olfattiva
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {product.fragranceNotes.map((fn, idx) => (
                  <div key={fn.id || idx} className="p-3 bg-neutral-900 rounded-xs border border-neutral-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold">Nota #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setProduct({
                            ...product,
                            fragranceNotes: product.fragranceNotes.filter((_, i) => i !== idx),
                          });
                        }}
                        className="p-1 text-neutral-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={fn.note}
                      onChange={(e) => {
                        const updated = [...product.fragranceNotes];
                        updated[idx].note = e.target.value;
                        setProduct({ ...product, fragranceNotes: updated });
                      }}
                      placeholder="Nome Nota (es. Vaniglia Bourbon)"
                      className="w-full px-2.5 py-1.5 bg-neutral-950 border border-neutral-800 text-white font-serif font-bold text-xs rounded-xs"
                    />

                    <input
                      type="text"
                      value={fn.detail}
                      onChange={(e) => {
                        const updated = [...product.fragranceNotes];
                        updated[idx].detail = e.target.value;
                        setProduct({ ...product, fragranceNotes: updated });
                      }}
                      placeholder="Dettaglio (es. dolce e avvolgente)"
                      className="w-full px-2.5 py-1 bg-neutral-950 border border-neutral-800 text-neutral-300 italic text-[11px] rounded-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Fragrance Toggle & Fragrances List */}
            <div className="p-4 bg-neutral-900 rounded-sm border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.allowCustomFragrance}
                    onChange={(e) => setProduct({ ...product, allowCustomFragrance: e.target.checked })}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-xs font-bold text-white uppercase">Permetti Fragranza Personalizzata</span>
                </label>
              </div>

              {product.allowCustomFragrance && (
                <div className="space-y-4 pt-2 border-t border-neutral-800">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                      Testo link personalizzazione (es. "Vuoi una fragranza personalizzata?")
                    </label>
                    <input
                      type="text"
                      value={product.customFragranceLabel || 'Vuoi una fragranza personalizzata?'}
                      onChange={(e) => setProduct({ ...product, customFragranceLabel: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xs font-medium"
                    />
                  </div>

                  {/* Available Custom Fragrances Catalog */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Fragranze Personalizzate Disponibili sul Prodotto ({(product.availableCustomFragrances || DEFAULT_CUSTOM_FRAGRANCES).length})
                      </span>
                      <button
                        type="button"
                        onClick={addCustomFragranceOption}
                        className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950 text-[11px] font-bold uppercase rounded-xs"
                      >
                        + Aggiungi Fragranza
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {(product.availableCustomFragrances || DEFAULT_CUSTOM_FRAGRANCES).map((cfg, idx) => (
                        <div key={cfg.id || idx} className="flex items-center space-x-2 bg-neutral-950 p-2.5 rounded-xs border border-neutral-800">
                          <input
                            type="checkbox"
                            checked={cfg.active}
                            onChange={(e) => {
                              const list = [...(product.availableCustomFragrances || DEFAULT_CUSTOM_FRAGRANCES)];
                              list[idx].active = e.target.checked;
                              setProduct({ ...product, availableCustomFragrances: list });
                            }}
                            className="w-4 h-4 accent-amber-500"
                            title="Attiva / Disattiva per questo prodotto"
                          />
                          <input
                            type="text"
                            value={cfg.name}
                            onChange={(e) => {
                              const list = [...(product.availableCustomFragrances || DEFAULT_CUSTOM_FRAGRANCES)];
                              list[idx].name = e.target.value;
                              setProduct({ ...product, availableCustomFragrances: list });
                            }}
                            className="flex-1 px-3 py-1 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-xs font-medium"
                            placeholder="Nome Fragranza (es. Fior di Cotone)"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const list = (product.availableCustomFragrances || DEFAULT_CUSTOM_FRAGRANCES).filter((_, i) => i !== idx);
                              setProduct({ ...product, availableCustomFragrances: list });
                            }}
                            className="p-1 text-neutral-500 hover:text-red-400"
                            title="Elimina fragranza"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 7: COLORE DELLA CANDELA */}
      <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <h2 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
            <Palette className="w-4 h-4 text-amber-500" />
            <span>7. Colore della Candela</span>
          </h2>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={product.showColorSection}
              onChange={(e) => setProduct({ ...product, showColorSection: e.target.checked })}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-xs font-bold text-white uppercase">Mostra Sezione Colore</span>
          </label>
        </div>

        {product.showColorSection && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Nome Colore Standard
                </label>
                <input
                  type="text"
                  value={product.standardColorName}
                  onChange={(e) => setProduct({ ...product, standardColorName: e.target.value })}
                  placeholder="es. Avorio Naturale Soia"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-white text-xs rounded-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Colore Visuale (HEX Color Picker)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={product.standardColorHex || '#FAF8F5'}
                    onChange={(e) => setProduct({ ...product, standardColorHex: e.target.value })}
                    className="w-10 h-9 bg-neutral-900 border border-neutral-800 rounded-xs cursor-pointer"
                  />
                  <input
                    type="text"
                    value={product.standardColorHex || '#FAF8F5'}
                    onChange={(e) => setProduct({ ...product, standardColorHex: e.target.value })}
                    className="w-28 px-3 py-2 bg-neutral-900 border border-neutral-800 text-amber-400 font-mono text-xs rounded-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-900 rounded-sm border border-neutral-800 space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.allowCustomColor}
                  onChange={(e) => setProduct({ ...product, allowCustomColor: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-xs font-bold text-white uppercase">Permetti Colore Personalizzato</span>
              </label>

              {product.allowCustomColor && (
                <input
                  type="text"
                  value={product.customColorLabel || 'Indica un colore personalizzato'}
                  onChange={(e) => setProduct({ ...product, customColorLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 text-white text-xs rounded-xs"
                  placeholder="Testo del link per la richiesta colore..."
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 8: INFORMAZIONI TECNICHE (CHIAVE -> VALORE) */}
      <div className="bg-neutral-950 p-6 rounded-sm border border-neutral-800 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <h2 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-500" />
            <span>8. Specifiche Tecniche Dinamiche ({product.techInfo.length})</span>
          </h2>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={product.showTechDetails}
                onChange={(e) => setProduct({ ...product, showTechDetails: e.target.checked })}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="text-xs font-bold text-white uppercase">Mostra Sezione Tecniche</span>
            </label>
            <button
              type="button"
              onClick={addTechInfo}
              className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-neutral-950 text-xs font-bold uppercase rounded-xs"
            >
              + Aggiungi Specifica
            </button>
          </div>
        </div>

        {product.showTechDetails && (
          <div className="space-y-3">
            {product.techInfo.map((ti, idx) => (
              <div key={ti.id || idx} className="flex items-center space-x-3 bg-neutral-900 p-3 rounded-xs border border-neutral-800">
                <input
                  type="text"
                  value={ti.key}
                  onChange={(e) => {
                    const updated = [...product.techInfo];
                    updated[idx].key = e.target.value;
                    setProduct({ ...product, techInfo: updated });
                  }}
                  className="w-1/3 px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-white font-mono text-xs rounded-xs"
                  placeholder="Etichetta (es. Materiale Vaso)"
                />
                <input
                  type="text"
                  value={ti.value}
                  onChange={(e) => {
                    const updated = [...product.techInfo];
                    updated[idx].value = e.target.value;
                    setProduct({ ...product, techInfo: updated });
                  }}
                  className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs rounded-xs"
                  placeholder="Valore (es. Coppa in Vetro 250g)"
                />
                <button
                  type="button"
                  onClick={() => {
                    setProduct({
                      ...product,
                      techInfo: product.techInfo.filter((_, i) => i !== idx),
                    });
                  }}
                  className="p-1.5 text-neutral-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button Bar */}
      <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
        <Link
          href="/admin/products"
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          ← Torna alla Lista Prodotti
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 bg-amber-500 text-neutral-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all rounded-xs shadow-luxury flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Salvataggio...' : 'Salva Modifiche Prodotto'}</span>
        </button>
      </div>
    </form>
  );
}
