import fs from 'fs';
import path from 'path';

export interface CustomizerEventOption {
  id: string;
  label: string;
  icon: string;
  subtitle?: string;
  status: 'ACTIVE' | 'HIDDEN';
  order: number;
}

export interface CustomizerModelOption {
  id: string;
  name: string;
  vessel: string;
  basePrice: number;
  dimensions: string;
  weight?: string;
  minQuantity: number;
  image: string;
  status: 'ACTIVE' | 'HIDDEN';
  order: number;
}

export interface CustomizerFragranceOption {
  id: string;
  name: string;
  notes: string;
  family: string;
  intensity?: number;
  description: string;
  status: 'ACTIVE' | 'HIDDEN';
  order: number;
}

export interface CustomizerColorOption {
  id: string;
  name: string;
  hex: string;
  category: 'wax' | 'container' | 'ribbon';
  status: 'ACTIVE' | 'HIDDEN';
  order: number;
}

export interface CustomizerFontOption {
  id: string;
  name: string;
  value: string;
  status: 'ACTIVE' | 'HIDDEN';
  order: number;
}

export interface CustomizerPackagingOption {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  status: 'ACTIVE' | 'HIDDEN';
  order: number;
}

export interface CustomizerDiscountTier {
  id: string;
  minQty: number;
  maxQty: number;
  discountPercentage: number;
  label?: string;
  status: 'ACTIVE' | 'HIDDEN';
  order: number;
}

export interface CustomizerConfig {
  events: CustomizerEventOption[];
  models: CustomizerModelOption[];
  fragrances: CustomizerFragranceOption[];
  colors: CustomizerColorOption[];
  fonts: CustomizerFontOption[];
  packagings: CustomizerPackagingOption[];
  discountTiers: CustomizerDiscountTier[];
  labelSettings: {
    namesPlaceholder: string;
    namesDefault: string;
    datePlaceholder: string;
    dateDefault: string;
    phrasePlaceholder: string;
    phraseDefault: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const FILE_PATH = path.join(DATA_DIR, 'customizer-settings.json');

export const DEFAULT_CUSTOMIZER_CONFIG: CustomizerConfig = {
  events: [
    { id: 'Matrimonio', label: 'Matrimonio & Sposi', icon: '💍', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 1 },
    { id: 'Battesimo', label: 'Battesimo & Nascita', icon: '👶', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 2 },
    { id: 'Comunione', label: 'Comunione & Cresima', icon: '🕊️', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 3 },
    { id: 'Baby Shower', label: 'Baby Shower', icon: '🧸', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 4 },
    { id: 'Compleanno', label: 'Compleanno & Festeggiamenti', icon: '🎂', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 5 },
    { id: 'Corporate', label: 'Evento Aziendale & Hotel', icon: '🏢', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 6 },
    { id: 'Regalo Luxury', label: 'Regalo Personale Luxury', icon: '🎁', subtitle: 'Stile coordinato', status: 'ACTIVE', order: 7 },
  ],
  models: [
    {
      id: 'cand-01',
      name: 'Candela Bomboniera Elegance',
      vessel: 'Bicchiere Trasparente Scanalato',
      basePrice: 16.0,
      dimensions: '7.5cm x 8.5cm',
      weight: '160g',
      minQuantity: 10,
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
      status: 'ACTIVE',
      order: 1,
    },
    {
      id: 'cand-02',
      name: 'Vaso Ceramica Artigianale',
      vessel: 'Gesso Ceramico Colato a Mano',
      basePrice: 20.0,
      dimensions: '8cm x 9cm',
      weight: '200g',
      minQuantity: 10,
      image: 'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=800&auto=format&fit=crop',
      status: 'ACTIVE',
      order: 2,
    },
    {
      id: 'cand-03',
      name: 'Apothecary Amber Jar',
      vessel: 'Vetro Ambrato d’Epoca',
      basePrice: 18.0,
      dimensions: '8.5cm x 9.5cm',
      weight: '220g',
      minQuantity: 10,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
      status: 'ACTIVE',
      order: 3,
    },
    {
      id: 'cand-04',
      name: 'Vaso Nero Satinato Velvet',
      vessel: 'Vetro Nero Opaco Luxury',
      basePrice: 22.0,
      dimensions: '8.5cm x 10cm',
      weight: '250g',
      minQuantity: 10,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
      status: 'ACTIVE',
      order: 4,
    },
  ],
  fragrances: [
    {
      id: 'frag-01',
      name: 'Rosa di Maggio & Legno di Rosa',
      notes: 'Rosa Centifolia, Bergamotto, Legno di Cedro, Muschio',
      family: 'Fiorita Cipriata',
      intensity: 4,
      description: 'Bouquet romantico ed avvolgente, perfetto per matrimoni eleganti.',
      status: 'ACTIVE',
      order: 1,
    },
    {
      id: 'frag-02',
      name: 'Fichi di Toscana & Foglia d’Olivo',
      notes: 'Nettare di Figo, Note Verdi d’Olivo, Legno di Sandalo',
      family: 'Fruttata Legnosa',
      intensity: 3,
      description: 'Profumo fresco della campagna toscana con sfumature morbide e rilassanti.',
      status: 'ACTIVE',
      order: 2,
    },
    {
      id: 'frag-03',
      name: 'Champagne & Pesca Bianca',
      notes: 'Bollicine di Franciacorta, Pesca Bianca, Fiori di Magnolia',
      family: 'Fruttata Gourmand',
      intensity: 4,
      description: 'Elegante e frizzante, ideale per brindare a momenti speciali.',
      status: 'ACTIVE',
      order: 3,
    },
    {
      id: 'frag-04',
      name: 'Lavanda Selvatica & Miele Dorato',
      notes: 'Fiori di Lavanda, Miele d’Acacia, Vaniglia Bourbon',
      family: 'Aromatica Dolciata',
      intensity: 3,
      description: 'Sensazione di benessere puro e calore familiare.',
      status: 'ACTIVE',
      order: 4,
    },
    {
      id: 'frag-05',
      name: 'Agrumi di Sicilia & Neroli',
      notes: 'Arancia Amara, Neroli, Ambra Calda',
      family: 'Citrica Speziata',
      intensity: 4,
      description: 'Energizzante e mediterraneo con scia calda e persistente.',
      status: 'ACTIVE',
      order: 5,
    },
    {
      id: 'frag-06',
      name: 'Oud Reale & Pepe Rosa',
      notes: 'Legno di Oud, Pepe Rosa, Note Ambrate',
      family: 'Orientale Speziata',
      intensity: 5,
      description: 'Intenso, lussuoso e moderno per omaggi aziendali e serate gala.',
      status: 'ACTIVE',
      order: 6,
    },
  ],
  colors: [
    { id: 'col-r-1', name: 'Avorio', hex: '#FDFBF7', category: 'ribbon', status: 'ACTIVE', order: 1 },
    { id: 'col-r-2', name: 'Rosa Cipria', hex: '#E8C5C8', category: 'ribbon', status: 'ACTIVE', order: 2 },
    { id: 'col-r-3', name: 'Verde Salvia', hex: '#8F9E8B', category: 'ribbon', status: 'ACTIVE', order: 3 },
    { id: 'col-r-4', name: 'Azzurro Polvere', hex: '#9BB7D4', category: 'ribbon', status: 'ACTIVE', order: 4 },
    { id: 'col-r-5', name: 'Oro Champenoise', hex: '#C5A059', category: 'ribbon', status: 'ACTIVE', order: 5 },
    { id: 'col-r-6', name: 'Beige Naturale', hex: '#EAE5DC', category: 'ribbon', status: 'ACTIVE', order: 6 },
    { id: 'col-r-7', name: 'Bianco', hex: '#FFFFFF', category: 'ribbon', status: 'ACTIVE', order: 7 },
    { id: 'col-r-8', name: 'Nero', hex: '#222222', category: 'ribbon', status: 'ACTIVE', order: 8 },
  ],
  fonts: [
    { id: 'f-1', name: 'Serif Elegante Classico (Playfair)', value: 'classic-serif', status: 'ACTIVE', order: 1 },
    { id: 'f-2', name: 'Corsivo Calligrafico Moderno', value: 'script-modern', status: 'ACTIVE', order: 2 },
    { id: 'f-3', name: 'Minimal Moderno Sans', value: 'minimal-sans', status: 'ACTIVE', order: 3 },
    { id: 'f-4', name: 'Vintage Romano Elegante', value: 'vintage-roman', status: 'ACTIVE', order: 4 },
  ],
  packagings: [
    {
      id: 'pack-ivory',
      name: 'Scatola Rigid Box Avorio con Nastro',
      price: 2.50,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
      description: 'Scatola rigida di lusso in cartone avorio con nastro in raso coordinato.',
      status: 'ACTIVE',
      order: 1,
    },
    {
      id: 'pack-linen',
      name: 'Sacchetto in Lino Naturale Ricamato',
      price: 1.50,
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600&auto=format&fit=crop',
      description: 'Sacchetto eco-friendly in puro lino lavato con cordoncino.',
      status: 'ACTIVE',
      order: 2,
    },
    {
      id: 'pack-crystal',
      name: 'Scatola Trasparente Cristallo',
      price: 1.20,
      image: 'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=600&auto=format&fit=crop',
      description: 'Astuccio trasparente ad alta brillantezza per mostrare la candela.',
      status: 'ACTIVE',
      order: 3,
    },
    {
      id: 'pack-none',
      name: 'Nessuna Confezione Singola (Sfusa)',
      price: 0.0,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop',
      description: 'Incluso nel prezzo base. Candela confezionata in imballo di protezione collettivo.',
      status: 'ACTIVE',
      order: 4,
    },
  ],
  discountTiers: [
    { id: 'tier-1', minQty: 10, maxQty: 29, discountPercentage: 10, label: '10-29 pezzi → 10% sconto', status: 'ACTIVE', order: 1 },
    { id: 'tier-2', minQty: 30, maxQty: 49, discountPercentage: 15, label: '30-49 pezzi → 15% sconto', status: 'ACTIVE', order: 2 },
    { id: 'tier-3', minQty: 50, maxQty: 99, discountPercentage: 25, label: '50-99 pezzi → 25% sconto', status: 'ACTIVE', order: 3 },
    { id: 'tier-4', minQty: 100, maxQty: 199, discountPercentage: 35, label: '100-199 pezzi → 35% sconto', status: 'ACTIVE', order: 4 },
    { id: 'tier-5', minQty: 200, maxQty: 9999, discountPercentage: 40, label: '200+ pezzi → 40% sconto', status: 'ACTIVE', order: 5 },
  ],
  labelSettings: {
    namesPlaceholder: 'es. Giulia & Marco',
    namesDefault: 'Giulia & Marco',
    datePlaceholder: 'es. 15 Settembre 2026',
    dateDefault: '15 Settembre 2026',
    phrasePlaceholder: 'es. Grazie per aver condiviso questo giorno con noi',
    phraseDefault: 'Grazie per aver condiviso questo giorno con noi',
  },
};

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(DEFAULT_CUSTOMIZER_CONFIG, null, 2), 'utf-8');
  }
}

export function getCustomizerConfig(): CustomizerConfig {
  ensureFileExists();
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_CUSTOMIZER_CONFIG,
      ...parsed,
    };
  } catch (err) {
    console.error('Error reading customizer-settings.json:', err);
    return DEFAULT_CUSTOMIZER_CONFIG;
  }
}

export function saveCustomizerConfig(newConfig: Partial<CustomizerConfig>): CustomizerConfig {
  const current = getCustomizerConfig();
  const merged = {
    ...current,
    ...newConfig,
  };
  fs.writeFileSync(FILE_PATH, JSON.stringify(merged, null, 2), 'utf-8');
  return merged;
}
