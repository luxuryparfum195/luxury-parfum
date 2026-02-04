"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

// Types
interface Parfum {
  id: string
  nom: string
  description: string
  prix_eur: number
  categorie: string
  notes_olfactives: string[]
  occasions: string[]
  image_url_1: string
  image_url_2: string
  stock_ml: number
  min_achat_ml: number
  max_achat_ml: number
  est_disponible: boolean
}

interface Settings {
  whatsapp_number: string
  taux_usd: number
  taux_fcfa: number
}

const translations = {
  fr: {
    collections: 'Collections', history: 'Notre Histoire', testimonials: 'Témoignages', cart: 'Panier',
    heroSubtitle: 'Parfums Haute Couture', heroTitle: "L'Art de la", heroHighlight: 'Séduction',
    heroDesc: "Découvrez notre collection exclusive de parfums de luxe. Chaque fragrance est une œuvre d'art olfactive créée pour les âmes raffinées.",
    discover: 'Découvrir la Collection', search: 'Rechercher', excellenceTitle: "L'Excellence de la Parfumerie",
    historyDesc1: "Fondée sur les principes de l'artisanat français, LUXURY PARFUM représente l'apogée de la parfumerie de luxe.",
    historyDesc2: "Notre philosophie unique vous permet d'acheter au millilitre, découvrant ainsi l'essence pure du luxe sans compromis.",
    fragrances: 'Fragrances', clients: 'Clients', premium: 'Premium', ourCreations: 'Nos Créations',
    exclusiveColl: 'Collection Exclusive', collDesc: "Explorez notre sélection de parfums d'exception.",
    details: 'Voir Détails', allCategories: 'Toutes', allOccasions: 'Toutes', total: 'Total',
    checkout: 'Commander', emptyCart: 'Votre panier est vide', continueShopping: 'Continuer',
    searchPlaceholder: 'Rechercher...', quantity: 'Quantité', addToCart: 'Ajouter au panier',
    orderWhatsapp: 'Commander sur WhatsApp', stock: 'Stock', outOfStock: 'Rupture de stock',
    enterQuantity: 'Entrez la quantité en ml', minOrder: 'Min', maxOrder: 'Max'
  },
  en: {
    collections: 'Collections', history: 'Our History', testimonials: 'Testimonials', cart: 'Cart',
    heroSubtitle: 'Haute Couture Perfumes', heroTitle: "The Art of", heroHighlight: 'Seduction',
    heroDesc: "Discover our exclusive collection of luxury perfumes. Each fragrance is an olfactory work of art.",
    discover: 'Discover Collection', search: 'Search', excellenceTitle: "The Excellence of Perfumery",
    historyDesc1: "Founded on French craftsmanship principles, LUXURY PARFUM represents the pinnacle of luxury perfumery.",
    historyDesc2: "Our unique philosophy allows you to buy by the milliliter, discovering pure essence of luxury.",
    fragrances: 'Fragrances', clients: 'Clients', premium: 'Premium', ourCreations: 'Our Creations',
    exclusiveColl: 'Exclusive Collection', collDesc: "Explore our selection of exceptional perfumes.",
    details: 'View Details', allCategories: 'All', allOccasions: 'All', total: 'Total',
    checkout: 'Checkout', emptyCart: 'Your cart is empty', continueShopping: 'Continue',
    searchPlaceholder: 'Search...', quantity: 'Quantity', addToCart: 'Add to cart',
    orderWhatsapp: 'Order on WhatsApp', stock: 'Stock', outOfStock: 'Out of stock',
    enterQuantity: 'Enter quantity in ml', minOrder: 'Min', maxOrder: 'Max'
  },
  ar: {
    collections: 'المجموعات', history: 'قصتنا', testimonials: 'شهادات', cart: 'السلة',
    heroSubtitle: 'عطور الهوت كوتور', heroTitle: 'فن', heroHighlight: 'الإغراء',
    heroDesc: "اكتشف مجموعتنا الحصرية من العطور الفاخرة.",
    discover: 'اكتشف المجموعة', search: 'بحث', excellenceTitle: 'التميز في صناعة العطور',
    historyDesc1: 'تأسست على مبادئ الحرفية الفرنسية.', historyDesc2: 'فلسفتنا الفريدة تتيح لك الشراء بالمليلتر.',
    fragrances: 'عطر', clients: 'عميل', premium: 'ممتاز', ourCreations: 'إبداعاتنا',
    exclusiveColl: 'مجموعة حصرية', collDesc: 'استكشف مجموعتنا المختارة.',
    details: 'عرض التفاصيل', allCategories: 'الكل', allOccasions: 'الكل', total: 'الإجمالي',
    checkout: 'إتمام الطلب', emptyCart: 'السلة فارغة', continueShopping: 'متابعة',
    searchPlaceholder: 'بحث...', quantity: 'الكمية', addToCart: 'أضف للسلة',
    orderWhatsapp: 'اطلب عبر واتساب', stock: 'المخزون', outOfStock: 'نفذ المخزون',
    enterQuantity: 'أدخل الكمية بالمل', minOrder: 'الحد الأدنى', maxOrder: 'الحد الأقصى'
  }
}



export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedPerfume, setSelectedPerfume] = useState<Parfum | null>(null)
  const [quantity, setQuantity] = useState(5)
  const [manualQuantity, setManualQuantity] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedOccasion, setSelectedOccasion] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [lang, setLang] = useState<'fr' | 'en' | 'ar'>('fr')
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'FCFA'>('EUR')
  const [parfums, setParfums] = useState<Parfum[]>([])
  const [settings, setSettings] = useState<Settings>({ whatsapp_number: '212600000000', taux_usd: 1.08, taux_fcfa: 655.957 })
  const [loading, setLoading] = useState(true)

  const t = translations[lang]
  const heroRef = useRef<HTMLElement>(null)

  // Load data from Supabase
  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        const [parfumsRes, settingsRes] = await Promise.all([
          supabase.from('parfums').select('*').eq('est_disponible', true).order('created_at', { ascending: false }),
          supabase.from('site_settings').select('*').eq('id', 1).single()
        ])

        if (!mounted) return

        if (parfumsRes.data) setParfums(parfumsRes.data)
        if (settingsRes.data) setSettings(settingsRes.data)
      } catch (error: any) {
        if (mounted && error.name !== 'AbortError' && !error.message?.includes('aborted')) {
          console.error('Error loading data:', error)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadData()

    return () => { mounted = false }
  }, [])

  useEffect(() => { document.body.dir = lang === 'ar' ? 'rtl' : 'ltr' }, [lang])
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const exchangeRates = { EUR: 1, USD: settings.taux_usd, FCFA: settings.taux_fcfa }

  const formatPrice = (priceInEur: number) => {
    const converted = priceInEur * exchangeRates[currency]
    if (currency === 'FCFA') return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(converted) + ' FCFA'
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency }).format(converted)
  }

  const addToCart = (parfum: Parfum, qty: number) => {
    const existing = cart.find(item => item.id === parfum.id)
    if (existing) {
      setCart(cart.map(item => item.id === parfum.id ? { ...item, quantity: item.quantity + qty } : item))
    } else {
      setCart([...cart, { ...parfum, quantity: qty, price: parfum.prix_eur }])
    }
    setShowCart(true)
    setSelectedPerfume(null)
    setManualQuantity('')
  }

  const removeFromCart = (id: string) => setCart(cart.filter(item => item.id !== id))
  const cartCount = cart.length
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const categories = useMemo(() => Array.from(new Set(parfums.map(p => p.categorie))), [parfums])
  const occasions = useMemo(() => Array.from(new Set(parfums.flatMap(p => p.occasions || []))), [parfums])

  const filteredPerfumes = parfums.filter(p => {
    const matchesSearch = p.nom.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || p.categorie === selectedCategory
    const matchesOccasion = !selectedOccasion || (p.occasions || []).includes(selectedOccasion)
    return matchesSearch && matchesCategory && matchesOccasion
  })

  const handleQuantityChange = (value: string) => {
    setManualQuantity(value)
    const num = parseInt(value)
    if (!isNaN(num) && selectedPerfume) {
      const clamped = Math.max(selectedPerfume.min_achat_ml, Math.min(selectedPerfume.max_achat_ml, num))
      setQuantity(clamped)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-xl py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <a href="#" className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-[#C9A227]" style={{ fontFamily: 'Cinzel, serif' }}>LUXURY PARFUM</a>
          <div className="hidden lg:flex gap-8 items-center">
            <a href="#collections" className={`font-medium hover:text-[#C9A227] transition-colors ${isScrolled ? 'text-gray-800' : 'text-white'}`}>{t.collections}</a>
            <a href="#about" className={`font-medium hover:text-[#C9A227] transition-colors ${isScrolled ? 'text-gray-800' : 'text-white'}`}>{t.history}</a>

          </div>
          <div className="flex items-center gap-4">
            <div className={`hidden sm:flex rounded-full p-1 border ${isScrolled ? 'bg-gray-100 border-gray-200' : 'bg-black/20 backdrop-blur-md border-white/10'}`}>
              {(['EUR', 'USD', 'FCFA'] as const).map(c => (
                <button key={c} onClick={() => setCurrency(c)} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${currency === c ? 'bg-[#C9A227] text-white' : isScrolled ? 'text-gray-500' : 'text-white/60'}`}>{c}</button>
              ))}
            </div>
            <div className={`flex rounded-full p-1 border ${isScrolled ? 'bg-gray-100 border-gray-200' : 'bg-black/20 backdrop-blur-md border-white/10'}`}>
              {(['fr', 'en', 'ar'] as const).map(l => (
                <button key={l} onClick={() => setLang(l)} className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all ${lang === l ? 'bg-[#C9A227] text-white' : isScrolled ? 'text-gray-500' : 'text-white/60'}`}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={() => setShowCart(true)} className="relative bg-[#C9A227] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#8B6914] transition-all">
              {t.cart}
              {cartCount > 0 && <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 z-0">
          <img src="https://i.postimg.cc/G2jML17x/catalog-ai-1-compressed-1-Page-02.jpg" alt="Hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className={`${lang === 'ar' ? 'lg:text-right' : 'lg:text-left'} text-center`}>
            <p className="text-[#C9A227] text-lg tracking-[0.3em] mb-6 uppercase">{t.heroSubtitle}</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8" style={{ fontFamily: 'Cinzel, serif' }}>{t.heroTitle} <span className="block text-[#C9A227]">{t.heroHighlight}</span></h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto lg:mx-0 mb-10">{t.heroDesc}</p>
            <a href="#collections" className="inline-block bg-[#C9A227] text-white px-8 py-4 rounded-full font-bold hover:bg-[#8B6914] transition-all">{t.discover}</a>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <img src="https://i.postimg.cc/fR3gxpyw/catalog-ai-1-compressed-1-Page-01.jpg" alt="Main" className="w-96 rounded-3xl shadow-2xl border border-white/10" style={{ transform: `perspective(1000px) rotateY(${(mousePos.x - 50) * 0.1}deg) rotateX(${(mousePos.y - 50) * -0.1}deg)` }} />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <img src="https://i.postimg.cc/SNX0mD82/catalog-ai-1-compressed-1-Page-04.jpg" alt="History" className="rounded-3xl shadow-2xl" />
          <div>
            <p className="text-[#C9A227] tracking-widest mb-4">{t.history}</p>
            <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Cinzel, serif' }}>{t.excellenceTitle}</h2>
            <p className="text-gray-600 mb-6">{t.historyDesc1}</p>
            <p className="text-gray-600 mb-10">{t.historyDesc2}</p>
            <div className="grid grid-cols-3 gap-4">
              {[{ val: `${parfums.length}+`, label: t.fragrances }, { val: '10K+', label: t.clients }, { val: '100%', label: t.premium }].map(s => (
                <div key={s.label} className="bg-[#FFFAF0] p-4 rounded-2xl text-center">
                  <p className="text-2xl font-bold text-[#C9A227]">{s.val}</p>
                  <p className="text-xs text-gray-500 uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#C9A227] tracking-widest mb-4 uppercase">{t.ourCreations}</p>
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>{t.exclusiveColl}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t.collDesc}</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full max-w-sm px-6 py-3 rounded-full border border-gray-200 focus:border-[#C9A227] outline-none" />
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-6 py-3 rounded-full border border-gray-200 bg-white outline-none">
              <option value="">{t.allCategories}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={selectedOccasion} onChange={e => setSelectedOccasion(e.target.value)} className="px-6 py-3 rounded-full border border-gray-200 bg-white outline-none">
              <option value="">{t.allOccasions}</option>
              {occasions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPerfumes.map(p => (
              <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer group" onClick={() => { setSelectedPerfume(p); setQuantity(p.min_achat_ml); setManualQuantity('') }}>
                <div className="relative h-80 overflow-hidden">
                  <img src={p.image_url_1 || 'https://via.placeholder.com/400'} alt={p.nom} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
                  <div className="absolute top-4 left-4 bg-white/90 px-4 py-1.5 rounded-full text-xs font-bold">{p.categorie}</div>
                  {p.stock_ml === 0 && <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">{t.outOfStock}</div>}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all px-8 py-3 bg-[#C9A227] text-white rounded-full font-bold">{t.details}</div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{p.nom}</h3>
                    <p className="text-[#C9A227] font-bold">{formatPrice(p.prix_eur)}/ml</p>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2">{p.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{t.stock}: {p.stock_ml}ml</p>
                </div>
              </div>
            ))}
          </div>

          {filteredPerfumes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">Aucun parfum trouvé</p>
            </div>
          )}
        </div>
      </section>



      {/* FOOTER */}
      <footer className="bg-[#0A0A0A] text-white py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-[#C9A227] mb-6 tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>LUXURY PARFUM</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-10">L'excellence de la parfumerie française au service de votre élégance.</p>
          <p className="text-gray-600 text-xs">© 2026 LUXURY PARFUM. All rights reserved.</p>
        </div>
      </footer>

      {/* PRODUCT MODAL */}
      {selectedPerfume && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedPerfume(null)}>
          <div className="bg-white rounded-[2rem] max-w-4xl w-full overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 h-80 md:h-auto relative">
              <img src={selectedPerfume.image_url_1} className="w-full h-full object-cover" alt={selectedPerfume.nom} />
              <button onClick={() => setSelectedPerfume(null)} className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl text-xl hover:scale-110 transition-all">✕</button>
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
              <span className="text-[#C9A227] uppercase tracking-[0.2em] text-xs font-bold">{selectedPerfume.categorie}</span>
              <h3 className="text-3xl font-bold mb-4 mt-2" style={{ fontFamily: 'Cinzel, serif' }}>{selectedPerfume.nom}</h3>
              <p className="text-gray-600 mb-6">{selectedPerfume.description}</p>
              <p className="text-sm text-gray-400 mb-6">{t.stock}: {selectedPerfume.stock_ml}ml | {t.minOrder}: {selectedPerfume.min_achat_ml}ml | {t.maxOrder}: {selectedPerfume.max_achat_ml}ml</p>

              {/* Quantity Selector */}
              <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A] mb-4">{t.quantity} (ml)</p>

                {/* Manual Input */}
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="number"
                    min={selectedPerfume.min_achat_ml}
                    max={selectedPerfume.max_achat_ml}
                    placeholder={t.enterQuantity}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#C9A227] outline-none text-center text-lg font-bold"
                    value={manualQuantity}
                    onChange={e => handleQuantityChange(e.target.value)}
                  />
                  <span className="text-gray-500 font-bold">ml</span>
                </div>

                {/* Quick Select Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[5, 10, 20, 30, 50, 100].filter(q => q >= selectedPerfume.min_achat_ml && q <= selectedPerfume.max_achat_ml).map(q => (
                    <button
                      key={q}
                      onClick={() => { setQuantity(q); setManualQuantity(q.toString()) }}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${quantity === q ? 'bg-[#C9A227] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {q}ml
                    </button>
                  ))}
                </div>

                {/* Price Display */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl">
                  <div>
                    <p className="text-sm text-gray-500">{t.total}</p>
                    <p className="text-3xl font-bold text-[#C9A227]">{formatPrice(selectedPerfume.prix_eur * quantity)}</p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p>{formatPrice(selectedPerfume.prix_eur)}/ml × {quantity}ml</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <button onClick={() => addToCart(selectedPerfume, quantity)} disabled={selectedPerfume.stock_ml === 0} className="w-full bg-[#C9A227] text-white py-5 rounded-full font-bold text-lg hover:bg-[#8B6914] transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4">{t.addToCart}</button>

              <button
                onClick={() => {
                  const message = `Bonjour, je souhaite commander: ${selectedPerfume.nom} (${quantity}ml). Prix: ${formatPrice(selectedPerfume.prix_eur * quantity)}`
                  window.open(`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(message)}`, '_blank')
                }}
                className="w-full bg-[#25D366] text-white py-5 rounded-full font-bold text-lg hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z" /></svg>
                {t.orderWhatsapp}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex justify-end" onClick={() => setShowCart(false)}>
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-8 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>{t.cart}</h3>
              <button onClick={() => setShowCart(false)} className="text-2xl hover:scale-110 transition-all">✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="text-gray-400 mb-8">{t.emptyCart}</p>
                <button onClick={() => setShowCart(false)} className="bg-[#C9A227] text-white px-8 py-4 rounded-full font-bold">{t.continueShopping}</button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-all">
                      <div className="flex-1">
                        <h4 className="font-bold">{item.nom}</h4>
                        <p className="text-xs text-gray-500">{item.quantity}ml × {formatPrice(item.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#C9A227]">{formatPrice(item.price * item.quantity)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 font-bold mt-2">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-8 mt-6 border-t">
                  <div className="flex justify-between items-end mb-8">
                    <p className="text-gray-500">{t.total}</p>
                    <p className="text-4xl font-bold text-[#C9A227]" style={{ fontFamily: 'Cinzel, serif' }}>{formatPrice(cartTotal)}</p>
                  </div>
                  <button
                    onClick={() => {
                      const items = cart.map(i => `${i.nom} (${i.quantity}ml)`).join(', ')
                      const message = `Commande:\n${items}\nTotal: ${formatPrice(cartTotal)}`
                      window.open(`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(message)}`, '_blank')
                    }}
                    className="w-full bg-[#25D366] text-white py-5 rounded-full font-bold text-lg"
                  >
                    {t.orderWhatsapp}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Outfit', sans-serif; }
        .font-arabic { font-family: 'Outfit', sans-serif; }
      `}</style>
    </div>
  )
}