import fs from 'fs';
import path from 'path';
import { CategoryItem } from './products-types';
import { getAllProducts, saveProduct } from './products-store';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const FILE_PATH = path.join(DATA_DIR, 'categories.json');

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  // COLLEZIONI
  {
    id: 'col-dessert',
    type: 'COLLECTION',
    name: 'Dessert Gourmet',
    title: 'Collezione Dessert Gourmet',
    slug: 'dessert',
    eyebrow: '🍦 DESSERT GOURMET',
    description: 'Creazioni ispirate all’alta pasticceria, modellate a mano in cera di soia per sorprendere lo sguardo prima ancora dell’olfatto. Dessert dall’aspetto incredibilmente realistico, accompagnati da fragranze golose e avvolgenti.',
    cardImage: '/images/collezione-dessert-gourmet.jpg',
    heroImage: '/images/collezione-dessert-gourmet.jpg',
    status: 'ACTIVE',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'col-romance',
    type: 'COLLECTION',
    name: 'Romance & Foglia d’Oro 24K',
    title: 'Collezione Romance & Foglia d’Oro 24K',
    slug: 'romance',
    eyebrow: '🌹 ELEGANZA ROMANTICA, DETTAGLI PREZIOSI E FOGLIA D’ORO 24K',
    description: 'Creazioni romantiche e raffinate, modellate a mano per trasformare la luce della candela in un piccolo gesto di bellezza. Tonalità delicate, dettagli preziosi e accenti in foglia d’oro 24K danno vita a una collezione pensata per celebrare emozioni, momenti speciali e atmosfere intime.',
    cardImage: '/images/collezione-romance.jpg',
    heroImage: '/images/collezione-romance.jpg',
    status: 'ACTIVE',
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'col-minimal',
    type: 'COLLECTION',
    name: 'Atelier Design',
    title: 'Atelier Design',
    slug: 'minimal',
    eyebrow: '🏛 FORME SCULTOREE, LINEE ESSENZIALI E DESIGN CONTEMPORANEO',
    description: 'Una collezione dedicata alla forma, alla materia e all’equilibrio degli spazi. Candele dal carattere scultoreo e dalle linee essenziali, pensate come veri elementi d’arredo capaci di portare eleganza, calore e personalità negli ambienti contemporanei.',
    cardImage: '/images/collezione-minimal.jpg',
    heroImage: '/images/collezione-minimal.jpg',
    status: 'ACTIVE',
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // EVENTI
  {
    id: 'evt-matrimonio',
    type: 'EVENT',
    name: 'Matrimoni & Sposi',
    title: 'Matrimoni & Sposi',
    slug: 'matrimonio',
    eyebrow: '💍 BOMBONIERE OLFATTIVE SARTORIALI PER LE TUE NOZZE',
    description: 'Candele esclusive colate a mano con bozza grafica personalizzata, nastri in seta e fragranze d’autore formulate a Grasse e Firenze per un ricordo matrimoniale indelebile.',
    cardImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-battesimo',
    type: 'EVENT',
    name: 'Battesimi & Nascita',
    title: 'Battesimi & Nascita',
    slug: 'battesimo',
    eyebrow: '👶 CANDELE DELICATE PER FESTEGGIARE NUOVI ARRIVI',
    description: 'Composizioni in cera botanica con fiocchi in nastro di lino rosa cipria o salvia, etichette con nome e data del battesimo e fragranze al fior di cotone e talco.',
    cardImage: 'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1572726729207-a78d6fea3177?q=80&w=800&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-comunione',
    type: 'EVENT',
    name: 'Comunioni & Cresime',
    title: 'Comunioni & Cresime',
    slug: 'comunione',
    eyebrow: '🕊️ RICORDI DI LUCE PER CERIMONIE SPECIALI',
    description: 'Candele simboliche personalizzate in vetro satinato ed elementi floreali essiccati, confezionate in scatole luxury avorio.',
    cardImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'evt-corporate',
    type: 'EVENT',
    name: 'Eventi Aziendali & Hotel',
    title: 'Eventi Aziendali & Hotel',
    slug: 'corporate',
    eyebrow: '🏢 OMAGGI DI PRESTIGIO E SIGNATURE SCENTS PER BRAND',
    description: 'Candele aziendali con logo impresso in foglia d’oro ed essenza firmata per cene di gala, omaggi clienti e boutique hotel.',
    cardImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
    status: 'ACTIVE',
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(DEFAULT_CATEGORIES, null, 2), 'utf-8');
  }
}

export function getAllCategories(): CategoryItem[] {
  ensureFileExists();
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    const categories: CategoryItem[] = JSON.parse(raw);
    return categories.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (err) {
    console.error('Error reading categories.json:', err);
    return DEFAULT_CATEGORIES;
  }
}

export function getCategoryBySlug(slug: string): CategoryItem | null {
  const categories = getAllCategories();
  const target = decodeURIComponent(slug).toLowerCase().trim();
  const normalizedTarget = target.replace(/[^a-z0-9]/g, '');

  return (
    categories.find((c) => {
      const cSlug = (c.slug || '').toLowerCase().trim();
      return cSlug === target || cSlug.replace(/[^a-z0-9]/g, '') === normalizedTarget || c.id === target;
    }) || null
  );
}

export function saveCategory(categoryData: Partial<CategoryItem>): CategoryItem {
  const categories = getAllCategories();
  const now = new Date().toISOString();

  let categoryToSave: CategoryItem;

  if (categoryData.id) {
    const idx = categories.findIndex((c) => c.id === categoryData.id);
    if (idx !== -1) {
      categoryToSave = {
        ...categories[idx],
        ...categoryData,
        updatedAt: now,
      } as CategoryItem;
      categories[idx] = categoryToSave;
    } else {
      categoryToSave = {
        id: categoryData.id,
        type: categoryData.type || 'COLLECTION',
        name: categoryData.name || 'Nuova Categoria',
        title: categoryData.title || categoryData.name || 'Nuova Categoria',
        slug: categoryData.slug || `cat-${Date.now()}`,
        eyebrow: categoryData.eyebrow || '',
        description: categoryData.description || '',
        cardImage: categoryData.cardImage || '/images/collezione-dessert-gourmet.jpg',
        heroImage: categoryData.heroImage || categoryData.cardImage || '/images/collezione-dessert-gourmet.jpg',
        status: categoryData.status || 'ACTIVE',
        order: categoryData.order !== undefined ? categoryData.order : categories.length + 1,
        createdAt: now,
        updatedAt: now,
      };
      categories.push(categoryToSave);
    }
  } else {
    const newId = `${categoryData.type === 'EVENT' ? 'evt' : 'col'}_${Date.now()}`;
    const slugBase = (categoryData.slug || categoryData.name || 'categoria')
      .toLowerCase()
      .trim()
      .replace(/&/g, 'e')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    categoryToSave = {
      id: newId,
      type: categoryData.type || 'COLLECTION',
      name: categoryData.name || 'Nuova Categoria',
      title: categoryData.title || categoryData.name || 'Nuova Categoria',
      slug: slugBase,
      eyebrow: categoryData.eyebrow || '',
      description: categoryData.description || '',
      cardImage: categoryData.cardImage || '/images/collezione-dessert-gourmet.jpg',
      heroImage: categoryData.heroImage || categoryData.cardImage || '/images/collezione-dessert-gourmet.jpg',
      status: categoryData.status || 'ACTIVE',
      order: categoryData.order !== undefined ? categoryData.order : categories.length + 1,
      createdAt: now,
      updatedAt: now,
    };
    categories.push(categoryToSave);
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(categories, null, 2), 'utf-8');
  return categoryToSave;
}

export function deleteCategory(id: string): { success: boolean; unboundProductsCount: number } {
  const categories = getAllCategories();
  const categoryToDelete = categories.find((c) => c.id === id);

  if (!categoryToDelete) {
    return { success: false, unboundProductsCount: 0 };
  }

  const updatedCategories = categories.filter((c) => c.id !== id);
  fs.writeFileSync(FILE_PATH, JSON.stringify(updatedCategories, null, 2), 'utf-8');

  // Unbind from all products without deleting products
  const products = getAllProducts();
  let unboundCount = 0;

  for (const product of products) {
    let modified = false;
    if (product.collectionIds && product.collectionIds.includes(id)) {
      product.collectionIds = product.collectionIds.filter((cid) => cid !== id);
      modified = true;
    }
    if (product.eventIds && product.eventIds.includes(id)) {
      product.eventIds = product.eventIds.filter((eid) => eid !== id);
      modified = true;
    }
    if (modified) {
      unboundCount++;
      saveProduct(product);
    }
  }

  return { success: true, unboundProductsCount: unboundCount };
}
