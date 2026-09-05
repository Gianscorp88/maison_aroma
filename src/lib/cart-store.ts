import { create } from 'zustand';

export interface CustomizationSelection {
  eventType?: string;
  vessel?: string;
  fragrance?: string;
  fragranceNotes?: string;
  waxColor?: string;
  customColor?: string;
  containerColor?: string;
  ribbonColor?: string;
  fontStyle?: string;
  namesText?: string;
  dateText?: string;
  phraseText?: string;
  packaging?: string;
  packagingPrice?: number;
  customizationFee?: number;
  previewCanvasDataUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  basePrice: number;
  unitPrice: number; // calculated unit price including customizations & tier
  quantity: number;
  customization?: CustomizationSelection;
  minQuantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  discountPercent: number;
  giftNote: string;
  
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  setGiftNote: (note: string) => void;
  
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingEstimate: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  promoCode: null,
  discountPercent: 0,
  giftNote: '',

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  addItem: (newItem) => {
    set((state) => {
      const id = `${newItem.productId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const itemWithId: CartItem = { ...newItem, id };
      return { items: [...state.items, itemWithId], isOpen: true };
    });
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },

  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === id) {
          const qty = Math.max(item.minQuantity || 1, quantity);
          // Recalculate tiered pricing dynamically
          let discountRatio = 1.0;
          if (qty >= 100) discountRatio = 0.65; // 35% discount for 100+
          else if (qty >= 50) discountRatio = 0.75; // 25% discount for 50+
          else if (qty >= 10) discountRatio = 0.85; // 15% discount for 10+
          
          const rawUnitPrice = item.basePrice + (item.customization?.packagingPrice || 0) + (item.customization?.customizationFee || 0);
          const newUnitPrice = Number((rawUnitPrice * discountRatio).toFixed(2));
          
          return { ...item, quantity: qty, unitPrice: newUnitPrice };
        }
        return item;
      }),
    }));
  },

  clearCart: () => set({ items: [], promoCode: null, discountPercent: 0, giftNote: '' }),

  applyPromoCode: (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'MAISON10' || cleanCode === 'SPOSA2026') {
      set({ promoCode: cleanCode, discountPercent: 10 });
      return true;
    } else if (cleanCode === 'LUXURY15') {
      set({ promoCode: cleanCode, discountPercent: 15 });
      return true;
    }
    return false;
  },

  removePromoCode: () => set({ promoCode: null, discountPercent: 0 }),
  setGiftNote: (giftNote) => set({ giftNote }),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal();
    return Number(((subtotal * get().discountPercent) / 100).toFixed(2));
  },

  getShippingEstimate: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    if (subtotal >= 150) return 0; // Free shipping over €150
    return 12.0; // Standard express courier in Italy/EU
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscountAmount();
    const shipping = get().getShippingEstimate();
    return Math.max(0, Number((subtotal - discount + shipping).toFixed(2)));
  },
}));
