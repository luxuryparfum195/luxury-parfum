import { create } from 'zustand'
import { Perfume } from '@/types'

interface AdminStoreState {
  perfumes: Perfume[]
  currentView: 'dashboard' | 'perfumes' | 'orders' | 'analytics' | 'settings'
  currentLang: 'fr' | 'ar' | 'en'
  isMenuOpen: boolean
  showModal: boolean
  selectedPerfume: Perfume | null
  
  setPerfumes: (perfumes: Perfume[]) => void
  setCurrentView: (view: 'dashboard' | 'perfumes' | 'orders' | 'analytics' | 'settings') => void
  setLanguage: (lang: 'fr' | 'ar' | 'en') => void
  toggleMenu: () => void
  setShowModal: (show: boolean) => void
  setSelectedPerfume: (perfume: Perfume | null) => void
  logout: () => void
}

export const useAdminStore = create<AdminStoreState>((set) => ({
  perfumes: [],
  currentView: 'dashboard',
  currentLang: 'fr',
  isMenuOpen: false,
  showModal: false,
  selectedPerfume: null,
  
  setPerfumes: (perfumes) => set({ perfumes }),
  
  setCurrentView: (view) => set({ currentView: view }),
  
  setLanguage: (lang) => set({ currentLang: lang }),
  
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  
  setShowModal: (show) => set({ showModal: show }),
  
  setSelectedPerfume: (perfume) => set({ selectedPerfume: perfume }),
  
  logout: () => {
    set({ currentView: 'dashboard' })
    window.location.href = '/'
  },
}))