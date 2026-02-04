'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/store/useStore'
import { translations } from '@/lib/translations'
import { ShoppingCart, Menu, X, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const { currentLang, setLanguage, cart, isMenuOpen, toggleMenu } = useStore()
  const t = translations[currentLang]

  const languages: Array<{ code: 'fr' | 'ar' | 'en'; name: string; flag: string }> = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-6 px-8 transition-all duration-500",
        currentLang === 'fr' ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-luxury-gold-200' :
        currentLang === 'ar' ? 'bg-black/95 backdrop-blur-md shadow-lg border-b border-luxury-gold-800' :
        'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-luxury-gold-700'
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-3xl md:text-4xl font-bold tracking-widest font-display"
        >
          {Array.from('LUXURY MAGIQUE').map((letter, index) => (
            <motion.span
              key={index}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "inline-block transition-all duration-300",
                currentLang === 'fr' ? 'text-luxury-gold-400' :
                currentLang === 'ar' ? 'text-luxury-gold-300' :
                'text-luxury-gold-500'
              )}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {['home', 'collections', 'cart'].map((item) => (
            <button
              key={item}
              onClick={() => useStore.setState({ currentView: item as any })}
              className={cn(
                "nav-item relative px-6 py-2 text-sm font-display tracking-widest transition-all duration-300",
                currentLang === 'fr' ? 'text-luxury-black-600 hover:text-luxury-gold-400' :
                currentLang === 'ar' ? 'text-white/80 hover:text-luxury-gold-300' :
                'text-white/80 hover:text-luxury-gold-500'
              )}
            >
              {t[item]}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-display tracking-widest transition-all duration-300 border",
                  currentLang === 'fr' ? 'border-luxury-gold-200 text-luxury-black-600 hover:bg-luxury-gold-100' :
                  currentLang === 'ar' ? 'border-luxury-gold-800 text-white/60 hover:bg-luxury-gold-900' :
                  'border-luxury-gold-700 text-white/60 hover:bg-luxury-gold-800',
                  currentLang === lang.code ? 'opacity-100 bg-luxury-gold-400/10' : 'opacity-60'
                )}
              >
                {lang.flag} {lang.code.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Cart Icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => useStore.setState({ currentView: 'cart' })}
            className={cn(
              "relative p-2 rounded-lg transition-all duration-300",
              currentLang === 'fr' ? 'hover:bg-luxury-gold-100' :
              currentLang === 'ar' ? 'hover:bg-luxury-gold-900' :
              'hover:bg-luxury-gold-800'
            )}
          >
            <ShoppingCart 
              className={cn(
                "w-6 h-6",
                currentLang === 'fr' ? 'text-luxury-black-600' :
                currentLang === 'ar' ? 'text-luxury-gold-300' :
                'text-luxury-gold-500'
              )}
            />
            {cart.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-luxury-gold-400 to-luxury-gold-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
              >
                {cart.length}
              </motion.span>
            )}
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2"
          >
            {isMenuOpen ? (
              <X className={cn("w-6 h-6", currentLang === 'fr' ? 'text-luxury-black-600' : 'text-white')} />
            ) : (
              <Menu className={cn("w-6 h-6", currentLang === 'fr' ? 'text-luxury-black-600' : 'text-white')} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-6 pt-6 border-t"
            dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex flex-col gap-4">
              {['home', 'collections', 'cart'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    useStore.setState({ currentView: item as any, isMenuOpen: false })
                  }}
                  className={cn(
                    "text-lg font-display tracking-widest text-left py-2",
                    currentLang === 'fr' ? 'text-luxury-black-600' : 'text-white'
                  )}
                >
                  {t[item]}
                </button>
              ))}
              
              <div className="flex items-center gap-2 pt-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-display tracking-widest transition-all duration-300 border",
                      currentLang === 'fr' ? 'border-luxury-gold-200 text-luxury-black-600' :
                      currentLang === 'ar' ? 'border-luxury-gold-800 text-white/60' :
                      'border-luxury-gold-700 text-white/60',
                      currentLang === lang.code ? 'opacity-100 bg-luxury-gold-400/10' : 'opacity-60'
                    )}
                  >
                    {lang.flag} {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}