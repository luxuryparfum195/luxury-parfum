import { create } from 'zustand'
import { Perfume, CartItem, Language } from '@/types'

interface StoreState {
  perfumes: Perfume[]
  cart: CartItem[]
  currentLang: Language
  currentView: 'home' | 'collections' | 'cart' | 'product'
  selectedProduct: Perfume | null
  isMenuOpen: boolean
  
  setPerfumes: (perfumes: Perfume[]) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (index: number) => void
  clearCart: () => void
  setLanguage: (lang: Language) => void
  setCurrentView: (view: 'home' | 'collections' | 'cart' | 'product') => void
  setSelectedProduct: (product: Perfume | null) => void
  toggleMenu: () => void
}

export const useStore = create<StoreState>((set) => ({
  perfumes: [],
  cart: [],
  currentLang: 'fr',
  currentView: 'home',
  selectedProduct: null,
  isMenuOpen: false,
  
  setPerfumes: (perfumes) => set({ perfumes }),
  
  addToCart: (item) => set((state) => ({ 
    cart: [...state.cart, item] 
  })),
  
  removeFromCart: (index) => set((state) => ({
    cart: state.cart.filter((_, i) => i !== index)
  })),
  
  clearCart: () => set({ cart: [] }),
  
  setLanguage: (lang) => set({ currentLang: lang }),
  
  setCurrentView: (view) => set({ currentView: view }),
  
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}))