import fs from 'fs';
import path from 'path';
import {
  FullProduct,
  ProductImage,
  BadgeItem,
  FeatureItem,
  FragranceNoteItem,
  TechInfoItem,
  CustomFragranceOption,
  DEFAULT_CUSTOM_FRAGRANCES,
} from './products-types';

export * from './products-types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const FILE_PATH = path.join(DATA_DIR, 'products.json');

export const DEFAULT_PRODUCTS: FullProduct[] = [
  {
    id: 'bs-01',
    name: 'Coppa Chantilly & Fragoline di Bosco',
    slug: 'coppa-chantilly-fragoline-di-bosco',
    categoryName: 'Collezione Dessert Gourmet',
    categorySlug: 'dessert',
    basePrice: 24.0,
    isVatIncluded: true,
    eyebrowText: 'Creazione Artigianale • Collezione Dessert Gourmet',
    status: 'ACTIVE',
    isBestSeller: true,
    minQuantity: 5,
    shortDescription: 'Panna spumata in cera di soia con fragoline gourmand.',
    descriptionParagraph1: "Ispirata ai dessert delle migliori pasticcerie, questa candela artigianale conquista lo sguardo con il suo sorprendente realismo e avvolge l'ambiente con dolci note di vaniglia Bourbon, crema chantilly e fragoline di bosco. Realizzata a mano in cera di soia naturale, è pensata per decorare, profumare e regalare un'esperienza che va oltre una semplice candela.",
    galleryImages: [
      { id: 'img-1', url: '/images/collezione-dessert-gourmet.jpg', label: 'Vista Frontale', isMain: true },
      { id: 'img-2', url: 'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=800&auto=format&fit=crop', label: 'Dettaglio Panna' },
      { id: 'img-3', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop', label: 'Fiamma Accesa' },
      { id: 'img-4', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', label: 'Tavolo Elegante' },
    ],
    badges: [
      { id: 'bdg-1', text: 'Cera di Soia', icon: 'Leaf', active: true, order: 1 },
      { id: 'bdg-2', text: 'Fatta a Mano', icon: 'Flame', active: true, order: 2 },
      { id: 'bdg-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
    ],
    showHighlightBox: true,
    highlightBoxText: '✨ Ogni candela è realizzata a mano e può presentare leggere variazioni che la rendono unica.',
    features: [
      { id: 'ft-1', text: 'Cera di soia naturale', icon: 'Leaf', active: true, order: 1 },
      { id: 'ft-2', text: 'Colata a mano', icon: 'Flame', active: true, order: 2 },
      { id: 'ft-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
      { id: 'ft-4', text: 'Perfetta per arredare', icon: 'Home', active: true, order: 4 },
      { id: 'ft-5', text: 'Ideale come regalo elegante', icon: 'Gift', active: true, order: 5 },
    ],
    showFragranceProfile: true,
    allowCustomFragrance: true,
    customFragranceLabel: 'Vuoi una fragranza personalizzata?',
    fragranceNotes: [
      { id: 'fn-1', note: 'Vaniglia Bourbon', detail: 'dolce e avvolgente', order: 1 },
      { id: 'fn-2', note: 'Crema Chantilly', detail: 'morbida e vellutata', order: 2 },
      { id: 'fn-3', note: 'Fragoline di Bosco', detail: 'fresche e fruttate', order: 3 },
    ],
    showColorSection: true,
    standardColorName: 'Avorio Naturale Soia',
    standardColorHex: '#FAF8F5',
    allowCustomColor: true,
    customColorLabel: 'Indica un colore personalizzato',
    showTechDetails: true,
    techInfo: [
      { id: 'ti-1', key: 'Materiale Vaso', value: 'Coppa in Vetro Trasparente 250g', order: 1 },
      { id: 'ti-2', key: 'Cera', value: '100% Cera di Soia Naturale', order: 2 },
      { id: 'ti-3', key: 'Durata Bruciatura', value: 'Circa 45 ore', order: 3 },
      { id: 'ti-4', key: 'Stoppino', value: '100% Cotone biologico non trattato', order: 4 },
    ],
  },
  {
    id: 'bs-02',
    name: 'Rosa Incantata & Foglia d’Oro 24k',
    slug: 'rosa-incantata-foglia-d-oro',
    categoryName: 'Collezione Romance',
    categorySlug: 'romance',
    basePrice: 26.0,
    isVatIncluded: true,
    eyebrowText: 'Creazione Artigianale • Collezione Romance',
    status: 'ACTIVE',
    isBestSeller: true,
    minQuantity: 5,
    shortDescription: 'Boccioli di rosa vera e lamina in oro 24k.',
    descriptionParagraph1: "Un omaggio alla delicatezza ed al romanticismo più autentico. Boccioli di rosa cipria essiccati a mano impreziositi da sottili frammenti in foglia d'oro 24k. La cera vegetale cristallina dona una luce calda e rilassante, perfetta per creare un'atmosfera intima e raffinata.",
    galleryImages: [
      { id: 'img-201', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop', label: 'Vista Frontale', isMain: true },
      { id: 'img-202', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', label: 'Dettaglio Oro 24k' },
      { id: 'img-203', url: 'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=800&auto=format&fit=crop', label: 'Fiamma Accesa' },
      { id: 'img-204', url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop', label: 'Tavolo Elegante' },
    ],
    badges: [
      { id: 'bdg-1', text: 'Cera di Soia', icon: 'Leaf', active: true, order: 1 },
      { id: 'bdg-2', text: 'Fatta a Mano', icon: 'Flame', active: true, order: 2 },
      { id: 'bdg-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
    ],
    showHighlightBox: true,
    highlightBoxText: '✨ Ogni candela è realizzata a mano e può presentare leggere variazioni che la rendono unica.',
    features: [
      { id: 'ft-1', text: 'Cera di soia naturale', icon: 'Leaf', active: true, order: 1 },
      { id: 'ft-2', text: 'Colata a mano', icon: 'Flame', active: true, order: 2 },
      { id: 'ft-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
      { id: 'ft-4', text: 'Perfetta per arredare', icon: 'Home', active: true, order: 4 },
      { id: 'ft-5', text: 'Ideale come regalo elegante', icon: 'Gift', active: true, order: 5 },
    ],
    showFragranceProfile: true,
    allowCustomFragrance: true,
    customFragranceLabel: 'Vuoi una fragranza personalizzata?',
    fragranceNotes: [
      { id: 'fn-201', note: 'Rosa Centifolia', detail: 'nobile e vellutata', order: 1 },
      { id: 'fn-202', note: 'Oud Reale', detail: 'caldo e misterioso', order: 2 },
      { id: 'fn-203', note: 'Muschio Rosa', detail: 'delicato e cipriato', order: 3 },
    ],
    showColorSection: true,
    standardColorName: 'Rosa Cipria Naturale',
    standardColorHex: '#F7E7E6',
    allowCustomColor: true,
    customColorLabel: 'Indica un colore personalizzato',
    showTechDetails: true,
    techInfo: [
      { id: 'ti-201', key: 'Materiale Vaso', value: 'Vetro Bordo Oro 260g', order: 1 },
      { id: 'ti-202', key: 'Cera', value: '100% Cera di Soia Naturale', order: 2 },
      { id: 'ti-203', key: 'Durata Bruciatura', value: 'Circa 50 ore', order: 3 },
      { id: 'ti-204', key: 'Stoppino', value: '100% Cotone biologico non trattato', order: 4 },
    ],
  },
  {
    id: 'bs-03',
    name: 'Candela Trasparente "Rugiada & Seta"',
    slug: 'candela-trasparente-rugiada-seta',
    categoryName: 'Matrimoni & Sposi',
    categorySlug: 'matrimonio',
    basePrice: 18.5,
    isVatIncluded: true,
    eyebrowText: 'Creazione Artigianale • Matrimoni & Sposi',
    status: 'ACTIVE',
    isBestSeller: true,
    minQuantity: 10,
    shortDescription: 'Vetro apothecary trasparente con nastro in seta rosa cipria.',
    descriptionParagraph1: "Vetro apothecary trasparente con etichetta minimalista e nastro in seta rosa cipria colata a mano per matrimoni di prestigio. Fragranza delicata al muschio rosa e fava tonka formulata a Grasse.",
    galleryImages: [
      { id: 'img-301', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', label: 'Vista Frontale', isMain: true },
      { id: 'img-302', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop', label: 'Etichetta Sposi' },
      { id: 'img-303', url: 'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=800&auto=format&fit=crop', label: 'Fiamma Accesa' },
      { id: 'img-304', url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop', label: 'Tavolo Matrimonio' },
    ],
    badges: [
      { id: 'bdg-1', text: 'Cera di Soia', icon: 'Leaf', active: true, order: 1 },
      { id: 'bdg-2', text: 'Fatta a Mano', icon: 'Flame', active: true, order: 2 },
      { id: 'bdg-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
    ],
    showHighlightBox: true,
    highlightBoxText: '✨ Ogni candela è realizzata a mano e può presentare leggere variazioni che la rendono unica.',
    features: [
      { id: 'ft-1', text: 'Cera di soia naturale', icon: 'Leaf', active: true, order: 1 },
      { id: 'ft-2', text: 'Colata a mano', icon: 'Flame', active: true, order: 2 },
      { id: 'ft-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
      { id: 'ft-4', text: 'Perfetta per arredare', icon: 'Home', active: true, order: 4 },
      { id: 'ft-5', text: 'Ideale come regalo elegante', icon: 'Gift', active: true, order: 5 },
    ],
    showFragranceProfile: true,
    allowCustomFragrance: true,
    customFragranceLabel: 'Vuoi una fragranza personalizzata?',
    fragranceNotes: [
      { id: 'fn-301', note: 'Rosa Centifolia', detail: 'romantica', order: 1 },
      { id: 'fn-302', note: 'Muschio Bianco', detail: 'puro e delicato', order: 2 },
      { id: 'fn-303', note: 'Fava Tonka', detail: 'avvolgente', order: 3 },
    ],
    showColorSection: true,
    standardColorName: 'Avorio & Seta Rosa',
    standardColorHex: '#FAF8F5',
    allowCustomColor: true,
    customColorLabel: 'Indica un colore personalizzato',
    showTechDetails: true,
    techInfo: [
      { id: 'ti-301', key: 'Materiale Vaso', value: 'Vetro Apothecary Trasparente 200g', order: 1 },
      { id: 'ti-302', key: 'Cera', value: '100% Cera di Soia Naturale', order: 2 },
      { id: 'ti-303', key: 'Durata Bruciatura', value: 'Circa 40 ore', order: 3 },
      { id: 'ti-304', key: 'Stoppino', value: '100% Cotone biologico non trattato', order: 4 },
    ],
  },
  {
    id: 'bs-04',
    name: 'Monolite Scultoreo Cemento Avorio',
    slug: 'monolite-scultoreo-cemento-avorio',
    categoryName: 'Atelier Design',
    categorySlug: 'minimal',
    basePrice: 28.0,
    isVatIncluded: true,
    eyebrowText: 'Creazione Artigianale • Atelier Design',
    status: 'ACTIVE',
    isBestSeller: true,
    minQuantity: 5,
    shortDescription: 'Architettura minimale e vaso materico riutilizzabile.',
    descriptionParagraph1: "Linea essenziale ed ispirazione scultorea. Vaso colato in cemento avorio tattile riutilizzabile che si trasforma in un vero pezzo d'arredo. Fragranza legnosa al sandalo e vetiver formulata per elevare la percezione degli spazi contemporanei.",
    galleryImages: [
      { id: 'img-401', url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop', label: 'Vista Frontale', isMain: true },
      { id: 'img-402', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', label: 'Dettaglio Texture' },
      { id: 'img-403', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop', label: 'Fiamma Accesa' },
      { id: 'img-404', url: 'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=800&auto=format&fit=crop', label: 'Tavolo Elegante' },
    ],
    badges: [
      { id: 'bdg-1', text: 'Cera di Soia', icon: 'Leaf', active: true, order: 1 },
      { id: 'bdg-2', text: 'Fatta a Mano', icon: 'Flame', active: true, order: 2 },
      { id: 'bdg-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
    ],
    showHighlightBox: true,
    highlightBoxText: '✨ Ogni candela è realizzata a mano e può presentare leggere variazioni che la rendono unica.',
    features: [
      { id: 'ft-1', text: 'Cera vegetale pura', icon: 'Leaf', active: true, order: 1 },
      { id: 'ft-2', text: 'Colata a mano', icon: 'Flame', active: true, order: 2 },
      { id: 'ft-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
      { id: 'ft-4', text: 'Perfetta per arredare', icon: 'Home', active: true, order: 4 },
      { id: 'ft-5', text: 'Ideale come regalo elegante', icon: 'Gift', active: true, order: 5 },
    ],
    showFragranceProfile: true,
    allowCustomFragrance: true,
    customFragranceLabel: 'Vuoi una fragranza personalizzata?',
    fragranceNotes: [
      { id: 'fn-401', note: 'Legno di Sandalo', detail: 'secco e persistente', order: 1 },
      { id: 'fn-402', note: 'Vetiver di Haiti', detail: 'terroso e balsamico', order: 2 },
      { id: 'fn-403', note: 'Ambra Grigia', detail: 'avvolgente', order: 3 },
    ],
    showColorSection: true,
    standardColorName: 'Cemento Avorio Tattile',
    standardColorHex: '#EAE6E1',
    allowCustomColor: true,
    customColorLabel: 'Indica un colore personalizzato',
    showTechDetails: true,
    techInfo: [
      { id: 'ti-401', key: 'Materiale Vaso', value: 'Vaso in Cemento Avorio Artigianale 300g', order: 1 },
      { id: 'ti-402', key: 'Cera', value: '100% Cera Vegetale', order: 2 },
      { id: 'ti-403', key: 'Durata Bruciatura', value: 'Circa 55 ore', order: 3 },
      { id: 'ti-404', key: 'Stoppino', value: '100% Cotone biologico non trattato', order: 4 },
    ],
  },
  {
    id: 'prod-05',
    name: 'Candela Satinata "Bocciolo di Primavera"',
    slug: 'candela-satinata-bocciolo-primavera',
    categoryName: 'Battesimi & Nascita',
    categorySlug: 'battesimo',
    basePrice: 21.0,
    isVatIncluded: true,
    eyebrowText: 'Creazione Artigianale • Battesimi & Nascita',
    status: 'ACTIVE',
    isBestSeller: false,
    minQuantity: 10,
    shortDescription: 'Vetro bianco opaco satinato con nastro in lino naturale sage green.',
    descriptionParagraph1: "Vetro bianco opaco satinato da 220g con nastro in lino naturale sage green e cera di soia al fior di cotone. Pensata per celebrare nascite e battesimi con un tocco di pura delicatezza.",
    galleryImages: [
      { id: 'img-501', url: 'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=800&auto=format&fit=crop', label: 'Vista Frontale', isMain: true },
      { id: 'img-502', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop', label: 'Fiamma Accesa' },
      { id: 'img-503', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', label: 'Tavolo Elegante' },
    ],
    badges: [
      { id: 'bdg-1', text: 'Cera di Soia', icon: 'Leaf', active: true, order: 1 },
      { id: 'bdg-2', text: 'Fatta a Mano', icon: 'Flame', active: true, order: 2 },
      { id: 'bdg-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
    ],
    showHighlightBox: true,
    highlightBoxText: '✨ Ogni candela è realizzata a mano e può presentare leggere variazioni che la rendono unica.',
    features: [
      { id: 'ft-1', text: 'Cera di soia naturale', icon: 'Leaf', active: true, order: 1 },
      { id: 'ft-2', text: 'Colata a mano', icon: 'Flame', active: true, order: 2 },
      { id: 'ft-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
      { id: 'ft-4', text: 'Perfetta per arredare', icon: 'Home', active: true, order: 4 },
    ],
    showFragranceProfile: true,
    allowCustomFragrance: true,
    customFragranceLabel: 'Vuoi una fragranza personalizzata?',
    fragranceNotes: [
      { id: 'fn-501', note: 'Fior di Cotone', detail: 'soffice e pulito', order: 1 },
      { id: 'fn-502', note: 'Fiori d’Arancio', detail: 'luminosi e freschi', order: 2 },
      { id: 'fn-503', note: 'Talco di Riso', detail: 'delicato e rilassante', order: 3 },
    ],
    showColorSection: true,
    standardColorName: 'Bianco Neve Satinato',
    standardColorHex: '#FFFFFF',
    allowCustomColor: true,
    customColorLabel: 'Indica un colore personalizzato',
    showTechDetails: true,
    techInfo: [
      { id: 'ti-501', key: 'Materiale Vaso', value: 'Vetro Satinato Bianco 220g', order: 1 },
      { id: 'ti-502', key: 'Cera', value: '100% Cera di Soia Naturale', order: 2 },
      { id: 'ti-503', key: 'Durata Bruciatura', value: 'Circa 42 ore', order: 3 },
    ],
  },
  {
    id: 'prod-06',
    name: 'Candela Ambrata "Oud & Ambra Reale"',
    slug: 'candela-ambrata-oud-ambra-reale',
    categoryName: 'Eventi Aziendali & Hotel',
    categorySlug: 'corporate',
    basePrice: 22.5,
    isVatIncluded: true,
    eyebrowText: 'Creazione Artigianale • Eventi Aziendali',
    status: 'ACTIVE',
    isBestSeller: false,
    minQuantity: 10,
    shortDescription: 'Vetro ambrato vintage stile farmacia con sigillo in ceralacca.',
    descriptionParagraph1: "Vetro ambrato vintage stile farmacia da 250g con fragranza intensa al legno di oud e sigillo in ceralacca personalizzato per hotellerie ed eventi business di prestigio.",
    galleryImages: [
      { id: 'img-601', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop', label: 'Vista Frontale', isMain: true },
      { id: 'img-602', url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop', label: 'Fiamma Accesa' },
    ],
    badges: [
      { id: 'bdg-1', text: 'Cera Vegetale', icon: 'Leaf', active: true, order: 1 },
      { id: 'bdg-2', text: 'Fatta a Mano', icon: 'Flame', active: true, order: 2 },
      { id: 'bdg-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
    ],
    showHighlightBox: true,
    highlightBoxText: '✨ Ogni candela è realizzata a mano e può presentare leggere variazioni che la rendono unica.',
    features: [
      { id: 'ft-1', text: 'Cera vegetale pura', icon: 'Leaf', active: true, order: 1 },
      { id: 'ft-2', text: 'Colata a mano', icon: 'Flame', active: true, order: 2 },
      { id: 'ft-3', text: 'Made in Italy', icon: 'Award', active: true, order: 3 },
    ],
    showFragranceProfile: true,
    allowCustomFragrance: true,
    customFragranceLabel: 'Vuoi una fragranza personalizzata?',
    fragranceNotes: [
      { id: 'fn-601', note: 'Oud Nobile', detail: 'intenso e pregiato', order: 1 },
      { id: 'fn-602', note: 'Ambra Dorata', detail: 'calda e avvolgente', order: 2 },
      { id: 'fn-603', note: 'Legno di Cedro', detail: 'aromatico e virile', order: 3 },
    ],
    showColorSection: true,
    standardColorName: 'Ambrato Vintage',
    standardColorHex: '#B87333',
    allowCustomColor: true,
    customColorLabel: 'Indica un colore personalizzato',
    showTechDetails: true,
    techInfo: [
      { id: 'ti-601', key: 'Materiale Vaso', value: 'Vetro Ambrato Vintage 250g', order: 1 },
      { id: 'ti-602', key: 'Cera', value: '100% Cera Vegetale', order: 2 },
      { id: 'ti-603', key: 'Durata Bruciatura', value: 'Circa 48 ore', order: 3 },
    ],
  },
];

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(DEFAULT_PRODUCTS, null, 2), 'utf-8');
  }
}

export function getAllProducts(): FullProduct[] {
  try {
    ensureFileExists();
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    const products = JSON.parse(data) as FullProduct[];

    return products.map((p) => ({
      ...p,
      availableCustomFragrances:
        p.availableCustomFragrances && p.availableCustomFragrances.length > 0
          ? p.availableCustomFragrances
          : DEFAULT_CUSTOM_FRAGRANCES,
    }));
  } catch (err) {
    console.error('Error reading products.json:', err);
    return DEFAULT_PRODUCTS;
  }
}

export function getActiveProducts(): FullProduct[] {
  return getAllProducts().filter((p) => p.status === 'ACTIVE');
}

export function getProductBySlug(slug: string): FullProduct | undefined {
  if (!slug) return undefined;
  const decoded = decodeURIComponent(slug).toLowerCase().trim();
  const normalizedParam = decoded.replace(/[^a-z0-9]/g, '');

  return getAllProducts().find((p) => {
    if (!p) return false;
    if (p.id === slug || p.id === decoded) return true;
    if (p.slug) {
      const cleanPSlug = p.slug.toLowerCase().trim();
      if (cleanPSlug === decoded || cleanPSlug === slug.toLowerCase()) return true;
      if (cleanPSlug.replace(/[^a-z0-9]/g, '') === normalizedParam) return true;
    }
    return false;
  });
}

export function getProductById(id: string): FullProduct | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function saveProduct(productData: FullProduct): FullProduct {
  ensureFileExists();
  const products = getAllProducts();
  
  const now = new Date().toISOString();

  // Clean slug to ensure it's URL-friendly
  let cleanSlug = productData.slug || productData.name || 'prodotto';
  cleanSlug = cleanSlug
    .toLowerCase()
    .trim()
    .replace(/&/g, 'e')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  let updatedProduct: FullProduct = {
    ...productData,
    slug: cleanSlug,
    updatedAt: now,
  };

  const existingIndex = products.findIndex((p) => p.id === productData.id);

  if (existingIndex >= 0) {
    products[existingIndex] = updatedProduct;
  } else {
    if (!updatedProduct.id) {
      updatedProduct.id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    }
    updatedProduct.createdAt = now;
    products.push(updatedProduct);
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(products, null, 2), 'utf-8');
  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  ensureFileExists();
  const products = getAllProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length !== products.length) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  }
  return false;
}
