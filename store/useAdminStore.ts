import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'fr' | 'ar' | 'en'
type AdminView = 'dashboard' | 'perfumes' | 'orders' | 'analytics' | 'settings'

interface AdminState {
    // Language
    currentLang: Language
    setLanguage: (lang: Language) => void

    // Navigation
    currentView: AdminView
    setCurrentView: (view: AdminView) => void

    // Mobile Menu
    isMenuOpen: boolean
    toggleMenu: () => void
    closeMenu: () => void

    // Auth
    isAuthenticated: boolean
    login: (password: string) => boolean
    logout: () => void
}

const ADMIN_PASSWORD = 'luxury2024' // À changer en production

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            // Language - default French
            currentLang: 'fr',
            setLanguage: (lang) => set({ currentLang: lang }),

            // Navigation - default dashboard
            currentView: 'dashboard',
            setCurrentView: (view) => set({ currentView: view }),

            // Mobile Menu
            isMenuOpen: false,
            toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
            closeMenu: () => set({ isMenuOpen: false }),

            // Auth
            isAuthenticated: false,
            login: (password) => {
                if (password === ADMIN_PASSWORD) {
                    set({ isAuthenticated: true })
                    return true
                }
                return false
            },
            logout: () => set({ isAuthenticated: false, currentView: 'dashboard' }),
        }),
        {
            name: 'admin-storage',
            partialize: (state) => ({
                currentLang: state.currentLang,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
)
