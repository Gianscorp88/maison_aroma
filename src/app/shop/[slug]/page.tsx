'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { useShopSettings } from '@/context/ShopSettingsContext';
import { FullProduct } from '@/lib/products-types';
import {
  Sparkles,
  Leaf,
  Flame,
  Award,
  Home,
  Gift,
  ShoppingBag,
  Truck,
  Lock,
  ShieldCheck,
  Check,
  ChevronRight,
  ArrowLeft,
  Palette,
  Info,
} from 'lucide-react';

const renderIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Leaf':
      return <Leaf className="w-3.5 h-3.5" />;
    case 'Flame':
      return <Flame className="w-3.5 h-3.5" />;
    case 'Award':
      return <Award className="w-3.5 h-3.5" />;
    case 'Home':
      return <Home className="w-3.5 h-3.5" />;
    case 'Gift':
      return <Gift className="w-3.5 h-3.5" />;
    case 'Sparkles':
      return <Sparkles className="w-3.5 h-3.5" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-3.5 h-3.5" />;
    default:
      return <Leaf className="w-3.5 h-3.5" />;
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<FullProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFragranceInput, setShowFragranceInput] = useState(false);
  const [selectedCustomFragrance, setSelectedCustomFragrance] = useState<string | null>(null);
  const [fragranceErrorNotice, setFragranceErrorNotice] = useState<string | null>(null);
  const [showColorInput, setShowColorInput] = useState(false);
  const [customColorRequest, setCustomColorRequest] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const { addItem } = useCartStore();
  const { isShopMode } = useShopSettings();

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      if (res.ok) {
        const all: FullProduct[] = await res.json();
        const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
        const normalizedParam = decodedSlug.replace(/[^a-z0-9]/g, '');

        const found = all.find((p) => {
          if (!p) return false;
          if (p.id === slug || p.id === decodedSlug) return true;
          if (p.slug) {
            const cleanPSlug = p.slug.toLowerCase().trim();
            if (cleanPSlug === decodedSlug || cleanPSlug === slug.toLowerCase()) return true;
            if (cleanPSlug.replace(/[^a-z0-9]/g, '') === normalizedParam) return true;
          }
          return false;
        });

        if (found) {
          setProduct(found);
        }
      }
    } catch (err) {
      console.error('Error fetching product detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <Sparkles className="w-8 h-8 text-brand-teal animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-widest text-brand-teal font-semibold">Caricamento scheda candela...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-3xl font-serif text-brand-teal-deep">Prodotto non trovato</h1>
        <p className="text-sm text-brand-stone">La candela o il prodotto che stai cercando non è più disponibile o l'URL non è corretto.</p>
        <Link
          href="/shop"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-teal text-white text-xs uppercase tracking-widest font-semibold rounded-md hover:bg-brand-teal-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Torna allo Shop</span>
        </Link>
      </div>
    );
  }

  const formattedPrice = product.basePrice.toFixed(2).replace('.', ',');

  const activeBadges = (product.badges || []).filter((b) => b.active);
  const activeFeatures = (product.features || []).filter((f) => f.active);
  const mainImageIndex = activeImageIndex < product.galleryImages.length ? activeImageIndex : 0;

  const handleAddToCart = () => {
    if (showFragranceInput) {
      if (!selectedCustomFragrance) {
        setFragranceErrorNotice('Seleziona una fragranza prima di aggiungere il prodotto al carrello.');
        return;
      }
    }
    setFragranceErrorNotice(null);

    addItem({
      productId: product.id,
      name: product.name,
      image: product.galleryImages[0]?.url || '',
      basePrice: product.basePrice,
      unitPrice: product.basePrice,
      quantity: 1,
      minQuantity: product.minQuantity || 1,
      customization: {
        eventType: product.categoryName,
        fragrance: showFragranceInput && selectedCustomFragrance
          ? selectedCustomFragrance
          : (product.fragranceNotes || []).map((n) => n.note).join(', ') || 'Standard',
        customColor: showColorInput && customColorRequest ? `Personalizzato: ${customColorRequest}` : undefined,
        packaging: 'Scatola Luxury Avorio',
      },
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3500);
  };

  const getWhatsAppAdviceLink = () => {
    const msg = `Ciao Maison Aroma! Avrei bisogno di un consiglio per la candela "${product.name}" (€${formattedPrice}).`;
    return `https://wa.me/393401234567?text=${encodeURIComponent(msg)}`;
  };

  return (
    <main className="min-h-screen bg-brand-ivory/30 pt-8 sm:pt-12 md:pt-14 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-brand-stone font-light">
          <Link href="/" className="hover:text-brand-teal transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-brand-teal/40" />
          <Link href="/shop" className="hover:text-brand-teal transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-brand-teal/40" />
          <Link href={`/shop?category=${product.categorySlug}`} className="hover:text-brand-teal transition-colors">
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-brand-teal/40" />
          <span className="text-brand-teal font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start bg-white p-6 sm:p-10 rounded-lg border border-brand-teal/20 shadow-luxury">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="h-96 sm:h-[460px] bg-brand-teal-light/30 rounded-lg overflow-hidden border border-brand-teal/20 relative shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.galleryImages[mainImageIndex]?.url || product.galleryImages[0]?.url}
                alt={product.galleryImages[mainImageIndex]?.altText || product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnail Bar */}
            {product.galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.galleryImages.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-24 rounded-md overflow-hidden border-2 transition-all relative ${
                      activeImageIndex === idx
                        ? 'border-brand-teal shadow-md scale-[1.02]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.label || `Dettaglio ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-6 space-y-7">
            
            {/* Header & Badges */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-teal block">
                {product.eyebrowText || `Creazione Artigianale • ${product.categoryName}`}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-teal-deep leading-tight">
                {product.name}
              </h1>

              {/* Dynamic Badges */}
              {activeBadges.length > 0 && (
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider font-semibold pt-1">
                  {activeBadges.map((bdg, idx) => (
                    <span
                      key={bdg.id || idx}
                      className="px-3 py-1 bg-brand-teal-light text-brand-teal border border-brand-teal/25 rounded-full flex items-center gap-1.5"
                    >
                      {renderIcon(bdg.icon)}
                      <span>{bdg.text}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price Block */}
            <div className="border-y border-brand-teal/15 py-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-serif font-bold text-brand-teal-deep">
                €{formattedPrice}
              </div>
              {product.isVatIncluded !== false && (
                <p className="text-[10px] text-brand-stone font-light tracking-wide uppercase">
                  IVA inclusa
                </p>
              )}
            </div>

            {/* Description (Concise 4-5 lines) */}
            {product.descriptionParagraph1 && (
              <div className="text-xs text-brand-stone leading-relaxed font-light space-y-2">
                <p className="line-clamp-5">{product.descriptionParagraph1}</p>
                {product.descriptionParagraph2 && <p className="line-clamp-3">{product.descriptionParagraph2}</p>}
              </div>
            )}

            {/* Box Informativo Artigianale */}
            {product.showHighlightBox !== false && product.highlightBoxText && (
              <div className="p-3.5 bg-brand-teal-light/40 border-l-2 border-brand-teal rounded-r-md flex items-center space-x-2.5 text-xs text-brand-teal-deep">
                <Sparkles className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span className="font-serif italic text-brand-teal-deep/90">
                  {product.highlightBoxText}
                </span>
              </div>
            )}

            {/* Dynamic Caratteristiche List */}
            {activeFeatures.length > 0 && (
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal-deep">Caratteristiche</h4>
                <ul className="grid grid-cols-2 gap-3 text-xs text-brand-stone font-light">
                  {activeFeatures.map((ft, idx) => (
                    <li key={ft.id || idx} className="flex items-center space-x-2.5">
                      <span className="text-brand-teal flex-shrink-0">{renderIcon(ft.icon)}</span>
                      <span>{ft.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Profilo Olfattivo */}
            {product.showFragranceProfile !== false && (product.fragranceNotes?.length > 0 || (product.allowCustomFragrance && (product.availableCustomFragrances || []).some(f => f.active))) && (
              <div className="bg-brand-teal-light/20 p-6 rounded-lg border border-brand-teal/15 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-brand-teal/15 pb-3">
                  <h4 className="font-serif font-bold text-sm text-brand-teal-deep flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-brand-teal" />
                    <span>Profilo Olfattivo</span>
                  </h4>

                  {product.allowCustomFragrance !== false && (product.availableCustomFragrances || []).some(f => f.active) && (
                    <button
                      onClick={() => {
                        if (showFragranceInput) {
                          setShowFragranceInput(false);
                          setSelectedCustomFragrance(null);
                          setFragranceErrorNotice(null);
                        } else {
                          setShowFragranceInput(true);
                          setFragranceErrorNotice(null);
                        }
                      }}
                      className="text-[11px] text-brand-stone hover:text-brand-teal transition-colors font-medium underline underline-offset-2"
                    >
                      {showFragranceInput
                        ? 'Usa fragranza standard'
                        : product.customFragranceLabel || 'Vuoi una fragranza personalizzata?'}
                    </button>
                  )}
                </div>

                {/* Fragrance Cards (Profilo Olfattivo Standard) */}
                {product.fragranceNotes && product.fragranceNotes.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {product.fragranceNotes.map((noteItem, idx) => (
                      <div key={noteItem.id || idx} className="bg-white p-4 rounded-md border border-brand-teal/15 space-y-1 shadow-2xs">
                        <p className="font-serif font-bold text-brand-teal-deep text-sm">{noteItem.note}</p>
                        <p className="text-[11px] text-brand-stone italic">{noteItem.detail}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fragranza Personalizzata (Mini Box / Chip Selection) */}
                {showFragranceInput && (
                  <div className="pt-3 space-y-3 bg-white p-4.5 rounded-md border border-brand-teal/30 animate-in fade-in duration-200">
                    <label className="block text-[11px] font-bold text-brand-teal-deep uppercase tracking-wider">
                      SCEGLI LA FRAGRANZA CHE PREFERISCI:
                    </label>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {(product.availableCustomFragrances || [])
                        .filter((cfg) => cfg.active)
                        .map((opt) => {
                          const isSelected = selectedCustomFragrance === opt.name;
                          return (
                            <button
                              key={opt.id || opt.name}
                              type="button"
                              onClick={() => {
                                setSelectedCustomFragrance(opt.name);
                                setFragranceErrorNotice(null);
                              }}
                              className={`px-3 py-2 text-xs font-semibold rounded-md border transition-all flex items-center space-x-1.5 cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-teal/10 border-brand-teal text-brand-teal-deep shadow-2xs font-bold scale-[1.02]'
                                  : 'bg-white border-brand-teal/20 text-brand-stone hover:border-brand-teal/50 hover:bg-brand-teal-light/20'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />}
                              <span>{opt.name}</span>
                            </button>
                          );
                        })}
                    </div>

                    {fragranceErrorNotice && (
                      <div className="p-2.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs rounded-md flex items-center space-x-2 animate-in fade-in font-medium">
                        <span>⚠️ {fragranceErrorNotice}</span>
                      </div>
                    )}

                    <p className="text-[10px] text-brand-stone flex items-center space-x-1 pt-1">
                      <span>✨ Realizzeremo la tua candela utilizzando la fragranza scelta.</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Colore della candela */}
            {product.showColorSection !== false && (
              <div className="bg-brand-teal-light/20 p-6 rounded-lg border border-brand-teal/15 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-brand-teal/15 pb-3">
                  <h4 className="font-serif font-bold text-sm text-brand-teal-deep flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-brand-teal" />
                    <span>Colore della candela</span>
                  </h4>

                  {product.allowCustomColor !== false && (
                    <button
                      onClick={() => setShowColorInput(!showColorInput)}
                      className="text-[11px] text-brand-stone hover:text-brand-teal transition-colors font-medium underline underline-offset-2"
                    >
                      {showColorInput
                        ? 'Usa colore standard'
                        : product.customColorLabel || 'Indica un colore personalizzato'}
                    </button>
                  )}
                </div>

                {!showColorInput ? (
                  <div className="bg-white p-4 rounded-md border border-brand-teal/15 flex items-center justify-between shadow-2xs text-xs">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-brand-teal/20 flex-shrink-0"
                        style={{ backgroundColor: product.standardColorHex || '#FAF8F5' }}
                      />
                      <span className="font-serif font-bold text-brand-teal-deep text-xs">Colore Standard della Creazione</span>
                    </div>
                    <span className="text-[11px] text-brand-stone italic">{product.standardColorName || 'Avorio Naturale Soia'}</span>
                  </div>
                ) : (
                  <div className="pt-1 space-y-2 bg-white p-4 rounded-md border border-brand-teal/30 animate-in fade-in duration-200">
                    <label className="block text-[11px] font-bold text-brand-teal-deep uppercase tracking-wider">
                      Indica il colore desiderato:
                    </label>
                    <input
                      type="text"
                      placeholder="es. Rosa cipria, avorio caldo, verde salvia, azzurro polvere..."
                      value={customColorRequest}
                      onChange={(e) => setCustomColorRequest(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-brand-teal/30 rounded-md bg-white focus:outline-none focus:border-brand-teal"
                    />
                    <p className="text-[10px] text-brand-stone">
                      ✨ Realizzeremo la tua candela nel colore indicato, compatibilmente con le caratteristiche della lavorazione artigianale.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Technical Info Collapsible Dropdown */}
            {product.showTechDetails !== false && product.techInfo && product.techInfo.length > 0 && (
              <div className="border border-brand-teal/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowTechDetails(!showTechDetails)}
                  className="w-full p-4 bg-brand-cream/40 flex justify-between items-center text-xs font-medium text-brand-teal-deep hover:bg-brand-teal-light/40 transition-colors"
                >
                  <span>Informazioni Tecniche (Dimensioni & Materiali)</span>
                  <span className="text-brand-teal text-sm font-bold">{showTechDetails ? '−' : '+'}</span>
                </button>

                {showTechDetails && (
                  <div className="p-4 bg-white text-xs text-brand-stone space-y-2 border-t border-brand-teal/15 font-mono">
                    {product.techInfo.map((ti, idx) => (
                      <p key={ti.id || idx}>
                        <strong>{ti.key}:</strong> {ti.value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {isShopMode && addedNotice && (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-lg flex items-center space-x-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Candela aggiunta al carrello con successo! <Link href="/checkout" className="underline font-bold">Procedi al Checkout →</Link></span>
              </div>
            )}

            {/* Add To Cart CTA & Trust Signals */}
            <div className="space-y-5 pt-2">
              {isShopMode && (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4.5 px-6 bg-brand-teal text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-brand-teal-dark transition-all duration-300 rounded-[9px] shadow-luxury flex items-center justify-center space-x-2 text-sm"
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span>Aggiungi al Carrello — €{formattedPrice}</span>
                </button>
              )}

              {/* Trust Signals */}
              <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-brand-stone pt-2 border-t border-brand-teal/15 font-medium">
                <span className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Spedizione in 24/48h</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Pagamenti Sicuri</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Imballaggio Protetto</span>
                </span>
              </div>

              {/* WhatsApp Consultation Link */}
              <div className="text-center pt-1">
                <a
                  href={getWhatsAppAdviceLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-stone hover:text-brand-teal transition-colors font-medium inline-flex items-center space-x-1 underline underline-offset-2"
                >
                  <span>Hai bisogno di un consiglio? Contattaci su WhatsApp →</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
