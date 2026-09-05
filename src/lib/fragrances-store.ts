import fs from 'fs';
import path from 'path';
import { FragranceItem } from './products-types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const FILE_PATH = path.join(DATA_DIR, 'fragrances.json');

export const DEFAULT_FRAGRANCES: FragranceItem[] = [
  {
    id: 'fra-vaniglia-bourbon',
    name: 'Vaniglia Bourbon & Crema Chantilly',
    slug: 'vaniglia-bourbon',
    badge: 'GOURMAND AVVOLGENTE',
    description: 'Una fragranza avvolgente e golosa che richiama i dolci ricordi d’infanzia. Baccelli di vaniglia Madagascar sfumati con note morbide di crema chantilly e zucchero canna.',
    topNotes: ['Baccelli di Vaniglia'],
    heartNotes: ['Crema Chantilly'],
    baseNotes: ['Zucchero di Canna'],
    image: '/images/collezione-dessert-gourmet.jpg',
    status: 'ACTIVE',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fra-rosa-maggio',
    name: 'Rosa di Maggio & Legno di Rosa',
    slug: 'rosa-maggio',
    badge: 'FIORITA CIPRIATA',
    description: 'Il bouquet romantico par excellence. Una rosa nobile e vellutata adatta a matrimoni classici ed eventi eleganti.',
    topNotes: ['Bergamotto di Calabria'],
    heartNotes: ['Rosa Centifolia'],
    baseNotes: ['Legno di Cedro', 'Muschio Rosa'],
    image: '/images/collezione-romance.jpg',
    status: 'ACTIVE',
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fra-fior-di-cotone',
    name: 'Fior di Cotone & Talco',
    slug: 'fior-di-cotone',
    badge: 'FRESCA TALCATA',
    description: 'Delicata, soffice e pulita, pensata per cerimonie ed ambienti che ricercano purezza ed equilibrio.',
    topNotes: ['Fiori d’Arancio'],
    heartNotes: ['Fior di Cotone'],
    baseNotes: ['Talco di Riso', 'Muschio Bianco'],
    image: 'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=800&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fra-cocco-gourmet',
    name: 'Cocco Gourmet & Nocciola',
    slug: 'cocco-gourmet',
    badge: 'DOLCE SPEZIATA',
    description: 'Accordi caldi e cremosi di cocco tostato e nocciola croccante per una sensazione di benessere puro e golosità.',
    topNotes: ['Cocco Tostato'],
    heartNotes: ['Crema alla Nocciola'],
    baseNotes: ['Burro di Cacao'],
    image: '/images/collezione-dessert-gourmet.jpg',
    status: 'ACTIVE',
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fra-bergamotto-iris',
    name: 'Bergamotto & Iris Reale',
    slug: 'bergamotto-iris',
    badge: 'AGRUMATA ENERGIZZANTE',
    description: 'Note fresche ed eleganti che donano vitalità e raffinatezza agli spazi contemporanei.',
    topNotes: ['Bergamotto di Calabria'],
    heartNotes: ['Iris Reale'],
    baseNotes: ['Ambra Grigia'],
    image: '/images/collezione-minimal.jpg',
    status: 'ACTIVE',
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'fra-lavanda-provenza',
    name: 'Lavanda di Provenza & Timo',
    slug: 'lavanda-provenza',
    badge: 'BALSAMICA RILASSANTE',
    description: 'Aromi rilassanti e rigeneranti ispirati ai campi in fiore della Provenza.',
    topNotes: ['Fiori di Lavanda'],
    heartNotes: ['Timo Selvatico'],
    baseNotes: ['Legno di Sandalo'],
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(DEFAULT_FRAGRANCES, null, 2), 'utf-8');
  }
}

export function getAllFragrances(): FragranceItem[] {
  ensureFileExists();
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    const fragrances: FragranceItem[] = JSON.parse(raw);
    return fragrances.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (err) {
    console.error('Error reading fragrances.json:', err);
    return DEFAULT_FRAGRANCES;
  }
}

export function getFragranceBySlug(slug: string): FragranceItem | null {
  const fragrances = getAllFragrances();
  const target = decodeURIComponent(slug).toLowerCase().trim();
  const normalizedTarget = target.replace(/[^a-z0-9]/g, '');

  return (
    fragrances.find((f) => {
      const fSlug = (f.slug || '').toLowerCase().trim();
      return fSlug === target || fSlug.replace(/[^a-z0-9]/g, '') === normalizedTarget || f.id === target;
    }) || null
  );
}

export function saveFragrance(fragranceData: Partial<FragranceItem>): FragranceItem {
  const fragrances = getAllFragrances();
  const now = new Date().toISOString();

  let itemToSave: FragranceItem;

  if (fragranceData.id) {
    const idx = fragrances.findIndex((f) => f.id === fragranceData.id);
    if (idx !== -1) {
      itemToSave = {
        ...fragrances[idx],
        ...fragranceData,
        updatedAt: now,
      } as FragranceItem;
      fragrances[idx] = itemToSave;
    } else {
      itemToSave = {
        id: fragranceData.id,
        name: fragranceData.name || 'Nuova Fragranza',
        slug: fragranceData.slug || `fra-${Date.now()}`,
        badge: fragranceData.badge || 'FIORITA CIPRIATA',
        description: fragranceData.description || '',
        topNotes: fragranceData.topNotes || [],
        heartNotes: fragranceData.heartNotes || [],
        baseNotes: fragranceData.baseNotes || [],
        image: fragranceData.image || '/images/collezione-dessert-gourmet.jpg',
        status: fragranceData.status || 'ACTIVE',
        order: fragranceData.order !== undefined ? fragranceData.order : fragrances.length + 1,
        createdAt: now,
        updatedAt: now,
      };
      fragrances.push(itemToSave);
    }
  } else {
    const newId = `fra_${Date.now()}`;
    const slugBase = (fragranceData.slug || fragranceData.name || 'fragranza')
      .toLowerCase()
      .trim()
      .replace(/&/g, 'e')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    itemToSave = {
      id: newId,
      name: fragranceData.name || 'Nuova Fragranza',
      slug: slugBase,
      badge: fragranceData.badge || 'FIORITA CIPRIATA',
      description: fragranceData.description || '',
      topNotes: fragranceData.topNotes || [],
      heartNotes: fragranceData.heartNotes || [],
      baseNotes: fragranceData.baseNotes || [],
      image: fragranceData.image || '/images/collezione-dessert-gourmet.jpg',
      status: fragranceData.status || 'ACTIVE',
      order: fragranceData.order !== undefined ? fragranceData.order : fragrances.length + 1,
      createdAt: now,
      updatedAt: now,
    };
    fragrances.push(itemToSave);
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(fragrances, null, 2), 'utf-8');
  return itemToSave;
}

export function deleteFragrance(id: string): { success: boolean } {
  const fragrances = getAllFragrances();
  const filtered = fragrances.filter((f) => f.id !== id);

  if (filtered.length !== fragrances.length) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    return { success: true };
  }
  return { success: false };
}
