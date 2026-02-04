'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAdminStore } from '@/store/useAdminStore'
import { adminTranslations as translations } from '@/lib/adminTranslations'
import { Button } from '@/ui/button'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function AdminHeader() {
  const { currentLang, setLanguage, isMenuOpen, toggleMenu, logout } = useAdminStore()
  const t = translations[currentLang]

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ]

  const navigation = [
    { key: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { key: 'perfumes', icon: Package, label: t.perfumes },
    { key: 'orders', icon: ShoppingCart, label: t.orders },
    { key: 'analytics', icon: BarChart3, label: t.analytics },
    { key: 'settings', icon: Settings, label: t.settings },
  ]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 py-6 px-8 bg-black/95 backdrop-blur-xl border-b border-luxury-gold-800 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold tracking-widest font-display bg-gradient-to-r from-luxury-gold-400 to-luxury-gold-200 bg-clip-text text-transparent"
          >
            LUXURY MAGIQUE
          </motion.div>
          <span className="text-xs text-luxury-gold-600/60 font-display tracking-wider">
            ADMIN
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => useAdminStore.setState({ currentView: item.key as any })}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-display tracking-widest text-sm",
                  useAdminStore.getState().currentView === item.key
                    ? "bg-luxury-gold-400/20 text-luxury-gold-400 border-luxury-gold-400"
                    : "text-white/60 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-display tracking-widest transition-all duration-300 border",
                  currentLang === lang.code
                    ? "border-luxury-gold-400 text-luxury-gold-400 bg-luxury-gold-400/10"
                    : "border-luxury-gold-800/50 text-white/60 hover:text-white/80 hover:bg-luxury-gold-800/20"
                )}
              >
                {lang.flag} {lang.code.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-white/60 hover:text-luxury-gold-400 hover:bg-luxury-gold-400/10"
          >
            <LogOut className="w-5 h-5" />
          </Button>

          {/* Mobile Menu */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-white/60 hover:text-white"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden mt-6 pt-6 border-t border-luxury-gold-800/30"
        >
          <div className="grid grid-cols-2 gap-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    useAdminStore.setState({ currentView: item.key as any, isMenuOpen: false })
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-300",
                    useAdminStore.getState().currentView === item.key
                      ? "bg-luxury-gold-400/20 text-luxury-gold-400 border-luxury-gold-400"
                      : "text-white/60 hover:text-white/80 hover:bg-white/5"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-display tracking-widest">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Mobile Language */}
          <div className="flex items-center gap-2 pt-4 mt-4 border-t border-luxury-gold-800/30">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-display tracking-widest transition-all duration-300 border",
                  currentLang === lang.code
                    ? "border-luxury-gold-400 text-luxury-gold-400 bg-luxury-gold-400/10"
                    : "border-luxury-gold-800/50 text-white/60 hover:text-white/80 hover:bg-luxury-gold-800/20"
                )}
              >
                {lang.flag} {lang.code.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </motion.header>
  )
}