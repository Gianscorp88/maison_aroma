import { getAllProducts, getProductBySlug as getStoreProductBySlug, FullProduct } from './products-store';

export interface Product {
  id: string;
  name: string;
  slug?: string;
  categoryName: string;
  categorySlug?: string;
  basePrice: number;
  minQuantity?: number;
  shortDescription: string;
  descriptionParagraph1: string;
  descriptionParagraph2?: string;
  galleryImages: { label: string; url: string }[];
  fragranceNotes: { note: string; detail: string }[];
  waxType?: string;
  burnTime?: string;
  dimensionsTech?: string;
  weight?: string;
  isBestSeller?: boolean;
}

export const PRODUCTS_DATA = getAllProducts();

export function getProductBySlug(slug: string): FullProduct | undefined {
  return getStoreProductBySlug(slug);
}
