export interface ProductImage {
  id: string;
  url: string;
  label?: string;
  altText?: string;
  isMain?: boolean;
}

export interface BadgeItem {
  id: string;
  text: string;
  icon?: string;
  active: boolean;
  order: number;
}

export interface FeatureItem {
  id: string;
  text: string;
  icon?: string;
  active: boolean;
  order: number;
}

export interface FragranceNoteItem {
  id: string;
  note: string;
  detail: string;
  order: number;
}

export interface TechInfoItem {
  id: string;
  key: string;
  value: string;
  order: number;
}

export interface CustomFragranceOption {
  id: string;
  name: string;
  active: boolean;
  order: number;
}

export interface CategoryItem {
  id: string;
  type: 'COLLECTION' | 'EVENT';
  name: string;
  title: string;
  slug: string;
  eyebrow?: string;
  description: string;
  cardImage: string;
  heroImage?: string;
  status: 'ACTIVE' | 'HIDDEN';
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FragranceItem {
  id: string;
  name: string;
  slug: string;
  badge: string;
  description: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  image?: string;
  status: 'ACTIVE' | 'HIDDEN';
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FullProduct {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  collectionIds?: string[];
  eventIds?: string[];
  basePrice: number;
  isVatIncluded: boolean;
  eyebrowText?: string;
  status: 'ACTIVE' | 'DRAFT' | 'HIDDEN';
  isBestSeller?: boolean;
  minQuantity?: number;
  shortDescription: string;
  descriptionParagraph1: string;
  descriptionParagraph2?: string;
  galleryImages: ProductImage[];
  badges: BadgeItem[];
  showHighlightBox: boolean;
  highlightBoxText: string;
  features: FeatureItem[];
  showFragranceProfile: boolean;
  allowCustomFragrance: boolean;
  customFragranceLabel?: string;
  fragranceNotes: FragranceNoteItem[];
  availableCustomFragrances?: CustomFragranceOption[];
  showColorSection: boolean;
  standardColorName: string;
  standardColorHex: string;
  allowCustomColor: boolean;
  customColorLabel?: string;
  showTechDetails: boolean;
  techInfo: TechInfoItem[];
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_CUSTOM_FRAGRANCES: CustomFragranceOption[] = [
  { id: 'cfg-1', name: 'Vaniglia Bourbon', active: true, order: 1 },
  { id: 'cfg-2', name: 'Fior di Cotone', active: true, order: 2 },
  { id: 'cfg-3', name: 'Cocco Gourmet', active: true, order: 3 },
  { id: 'cfg-4', name: 'Fragoline di Bosco', active: true, order: 4 },
  { id: 'cfg-5', name: 'Lavanda di Provenza', active: true, order: 5 },
  { id: 'cfg-6', name: 'Muschio Bianco', active: true, order: 6 },
  { id: 'cfg-7', name: 'Bergamotto & Iris', active: true, order: 7 },
  { id: 'cfg-8', name: 'Talco & Riso', active: true, order: 8 },
];

export function isProductInCategory(
  product: FullProduct,
  categoryOrSlug?: string,
  categoriesCatalog?: CategoryItem[]
): boolean {
  if (!product || product.status !== 'ACTIVE') return false;
  if (!categoryOrSlug || categoryOrSlug === 'ALL' || categoryOrSlug === 'catalogo') return true;

  const target = decodeURIComponent(categoryOrSlug).toLowerCase().trim();
  const normalizedTarget = target.replace(/[^a-z0-9]/g, '');

  const targetCategory = (categoriesCatalog || []).find(
    (c) =>
      c.id.toLowerCase() === target ||
      c.slug.toLowerCase() === target ||
      c.slug.replace(/[^a-z0-9]/g, '') === normalizedTarget ||
      c.name.toLowerCase() === target
  );

  const targetId = targetCategory?.id || target;

  if (product.collectionIds && product.collectionIds.includes(targetId)) return true;
  if (product.eventIds && product.eventIds.includes(targetId)) return true;

  if (targetCategory) {
    if (product.collectionIds && product.collectionIds.includes(targetCategory.id)) return true;
    if (product.eventIds && product.eventIds.includes(targetCategory.id)) return true;
  }

  const pCatSlug = (product.categorySlug || '').toLowerCase().trim();
  const pCatName = (product.categoryName || '').toLowerCase().trim();

  if (pCatSlug === target || pCatName === target) return true;
  if (pCatSlug.replace(/[^a-z0-9]/g, '') === normalizedTarget) return true;
  if (pCatName.replace(/[^a-z0-9]/g, '') === normalizedTarget) return true;

  if (target === 'dessert' && (pCatName.includes('dessert') || pCatSlug.includes('dessert'))) return true;
  if (target === 'romance' && (pCatName.includes('romance') || pCatSlug.includes('romance'))) return true;
  if (
    (target === 'minimal' || target === 'atelier') &&
    (pCatName.includes('atelier') || pCatName.includes('minimal') || pCatSlug.includes('minimal'))
  )
    return true;
  if (target === 'matrimonio' && (pCatName.includes('matrimoni') || pCatName.includes('sposi') || pCatSlug.includes('matrimonio'))) return true;
  if (target === 'battesimo' && (pCatName.includes('battesim') || pCatName.includes('nascita') || pCatSlug.includes('battesimo'))) return true;
  if (target === 'corporate' && (pCatName.includes('aziendal') || pCatName.includes('hotel') || pCatName.includes('corporate') || pCatSlug.includes('corporate'))) return true;

  return false;
}
