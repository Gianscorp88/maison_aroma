import { create } from 'zustand';

export interface CustomizerState {
  step: number;
  eventType: string; // Wedding, Baptism, Communion, Confirmation, Baby Shower, Birthday, Corporate, Luxury Gift
  candleModel: {
    id: string;
    name: string;
    vessel: string;
    basePrice: number;
    dimensions: string;
    weight: string;
    minQuantity: number;
    image: string;
  };
  fragrance: {
    id: string;
    name: string;
    notes: string;
    family: string;
    intensity: number;
    description: string;
  };
  colors: {
    waxColor: string;
    containerColor: string;
    labelColor: string;
    ribbonColor: string;
  };
  label: {
    names: string;
    date: string;
    phrase: string;
    fontStyle: 'classic-serif' | 'script-modern' | 'minimal-sans' | 'vintage-roman';
    companyLogo?: string;
  };
  packaging: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setEventType: (event: string) => void;
  setCandleModel: (model: CustomizerState['candleModel']) => void;
  setFragrance: (fragrance: CustomizerState['fragrance']) => void;
  setColors: (colors: Partial<CustomizerState['colors']>) => void;
  setLabel: (label: Partial<CustomizerState['label']>) => void;
  setPackaging: (packaging: CustomizerState['packaging']) => void;
  setQuantity: (qty: number) => void;
  resetCustomizer: () => void;

  // Calculators
  getUnitPrice: () => number;
  getTierDiscountPercentage: () => number;
  getTotalPrice: () => number;
}

export const initialCandleModel = {
  id: 'cand-01',
  name: 'Candela Bomboniera Elegance',
  vessel: 'Bicchiere Trasparente Scanalato',
  basePrice: 16.0,
  dimensions: '7.5cm x 8.5cm',
  weight: '160g',
  minQuantity: 10,
  image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
};

export const initialFragrance = {
  id: 'frag-01',
  name: 'Rosa di Maggio & Legno di Rosa',
  notes: 'Rosa Centifolia, Bergamotto, Legno di Cedro, Muschio Rosa',
  family: 'Fiorita Cipriata',
  intensity: 4,
  description: 'Un bouquet romantico ed avvolgente, perfetto per celebrare unione ed eleganza.',
};

export const initialPackaging = {
  id: 'pack-ivory',
  name: 'Scatola Luxury Avorio con Nastro in Seta',
  price: 2.50,
  image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop',
};

export const useCustomizerStore = create<CustomizerState>((set, get) => ({
  step: 1,
  eventType: 'Matrimonio',
  candleModel: initialCandleModel,
  fragrance: initialFragrance,
  colors: {
    waxColor: '#FDFBF7',
    containerColor: '#EAE5DC',
    labelColor: '#F7F3E9',
    ribbonColor: '#C5A059',
  },
  label: {
    names: 'Giulia & Marco',
    date: '15 Settembre 2026',
    phrase: 'Grazie per aver condiviso questo giorno con noi',
    fontStyle: 'classic-serif',
  },
  packaging: initialPackaging,
  quantity: 30,

  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: Math.min(8, state.step + 1) })),
  prevStep: () => set((state) => ({ step: Math.max(1, state.step - 1) })),
  
  setEventType: (eventType) => set({ eventType }),
  setCandleModel: (candleModel) => set({ candleModel, quantity: Math.max(get().quantity, candleModel.minQuantity) }),
  setFragrance: (fragrance) => set({ fragrance }),
  setColors: (newColors) => set((state) => ({ colors: { ...state.colors, ...newColors } })),
  setLabel: (newLabel) => set((state) => ({ label: { ...state.label, ...newLabel } })),
  setPackaging: (packaging) => set({ packaging }),
  setQuantity: (quantity) => set({ quantity: Math.max(get().candleModel.minQuantity || 1, quantity) }),

  resetCustomizer: () =>
    set({
      step: 1,
      eventType: 'Matrimonio',
      candleModel: initialCandleModel,
      fragrance: initialFragrance,
      colors: {
        waxColor: '#FDFBF7',
        containerColor: '#EAE5DC',
        labelColor: '#F7F3E9',
        ribbonColor: '#C5A059',
      },
      label: {
        names: 'Giulia & Marco',
        date: '15 Settembre 2026',
        phrase: 'Grazie per aver condiviso questo giorno con noi',
        fontStyle: 'classic-serif',
      },
      packaging: initialPackaging,
      quantity: 30,
    }),

  getTierDiscountPercentage: () => {
    const qty = get().quantity;
    if (qty >= 200) return 40;
    if (qty >= 100) return 35;
    if (qty >= 50) return 25;
    if (qty >= 30) return 15;
    if (qty >= 10) return 10;
    return 0;
  },

  getUnitPrice: () => {
    const { candleModel, packaging } = get();
    const rawPrice = candleModel.basePrice + packaging.price;
    const discount = get().getTierDiscountPercentage();
    const discounted = rawPrice * (1 - discount / 100);
    return Number(discounted.toFixed(2));
  },

  getTotalPrice: () => {
    const unitPrice = get().getUnitPrice();
    const qty = get().quantity;
    return Number((unitPrice * qty).toFixed(2));
  },
}));
