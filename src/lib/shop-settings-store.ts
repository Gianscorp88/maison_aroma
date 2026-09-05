import fs from 'fs';
import path from 'path';

export interface ShopSettings {
  isShopMode: boolean;
  updatedAt: string;
}

const DEFAULT_SHOP_SETTINGS: ShopSettings = {
  isShopMode: true,
  updatedAt: new Date().toISOString(),
};

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const FILE_PATH = path.join(DATA_DIR, 'shop-settings.json');

function ensureFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(DEFAULT_SHOP_SETTINGS, null, 2), 'utf-8');
  }
}

export function getShopSettings(): ShopSettings {
  ensureFileExists();
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SHOP_SETTINGS,
      ...parsed,
    };
  } catch (err) {
    console.error('Error reading shop-settings.json:', err);
    return DEFAULT_SHOP_SETTINGS;
  }
}

export function saveShopSettings(newSettings: Partial<ShopSettings>): ShopSettings {
  const current = getShopSettings();
  const merged: ShopSettings = {
    ...current,
    ...newSettings,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(FILE_PATH, JSON.stringify(merged, null, 2), 'utf-8');
  return merged;
}
