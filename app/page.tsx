"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

// Images du Hero Slider
const heroSlides = [
  '/hero-slide-1.jpg',
  '/hero-slide-2.jpg',
  '/hero-slide-3.jpg',
  '/hero-slide-4.jpg',
  '/hero-slide-5.jpg'
]

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
  hero_bg_image?: string
  hero_perfume_1?: string
  hero_perfume_2?: string
  hero_perfume_3?: string
}

interface HeroText {
  subtitle: string
  title_line1: string
  title_highlight: string
  description: string
  button_text: string
}

// Textes "À propos" en 3 langues
const aboutTexts = {
  fr: {
    mainTitle: "Présentation Officielle",
    intro: "Nous sommes une entreprise spécialisée dans l'univers de la parfumerie. Nous croyons que le parfum n'est pas seulement une fragrance, mais une signature personnelle qui exprime l'identité et le goût.",
    introSub: "Nous opérons à travers deux divisions complémentaires, alliant authenticité et créativité, afin d'offrir une expérience olfactive raffinée, accessible à tous les goûts et à tous les budgets, sans aucun compromis sur la qualité ni sur la crédibilité.",
    division1Title: "Parfums Originaux",
    division1Subtitle: "Original Fragrances",
    division1Text: "Nous proposons une sélection rigoureuse de parfums originaux issus de grandes marques internationales reconnues, avec un engagement total envers l'authenticité et une qualité pleinement garantie.",
    division1Text2: "Convaincus que le parfum de luxe doit être accessible à tous, nous mettons à disposition nos parfums originaux en différents formats, allant de 3 ml, 5 ml, 10 ml, jusqu'à 50 ml et 100 ml.",
    division2Title: "Parfums de Création",
    division2Subtitle: "Signature & Crafted Fragrances",
    division2Text: "Au sein de notre division de parfums de création, nous passons du choix à la création. Nous sélectionnons avec le plus grand soin les meilleures huiles parfumées.",
    division2Features: [
      "Matières premières de haute qualité",
      "Composants purs et sûrs, respectueux de la santé",
      "Ajouts soigneusement étudiés pour renforcer la tenue"
    ],
    visionTitle: "Notre Vision",
    visionText: "Devenir une marque de parfumerie de confiance, alliant authenticité, accessibilité et créativité, et permettre à chacun de créer sa propre signature olfactive."
  },
  en: {
    mainTitle: "Official Presentation",
    intro: "We are a company specialized in the world of perfumery. We believe that perfume is not just a fragrance, but a personal signature that expresses identity and taste.",
    introSub: "We operate through two complementary divisions, combining authenticity and creativity, to offer a refined olfactory experience, accessible to all tastes and budgets, without any compromise on quality or credibility.",
    division1Title: "Original Fragrances",
    division1Subtitle: "Authentic Perfumes",
    division1Text: "We offer a rigorous selection of original perfumes from renowned international brands, with a total commitment to authenticity and fully guaranteed quality.",
    division1Text2: "Convinced that luxury perfume should be accessible to all, we make our original perfumes available in different formats, ranging from 3ml, 5ml, 10ml, up to 50ml and 100ml.",
    division2Title: "Crafted Fragrances",
    division2Subtitle: "Signature & Custom Blends",
    division2Text: "Within our creation division, we move from selection to creation. We carefully select the finest perfume oils with utmost care.",
    division2Features: [
      "High-quality raw materials",
      "Pure and safe components, health-conscious",
      "Carefully studied additions to enhance longevity"
    ],
    visionTitle: "Our Vision",
    visionText: "To become a trusted perfumery brand, combining authenticity, accessibility and creativity, and enabling everyone to create their own olfactory signature."
  },
  ar: {
    mainTitle: "التعريف الرسمي للشركة",
    intro: "نحن شركة متخصصة في عالم العطور، نؤمن بأن العطر ليس مجرد رائحة، بل بصمة شخصية تعبّر عن الهوية والذوق.",
    introSub: "نعمل من خلال قسمين متكاملين، يجمعان بين الأصالة والإبداع، لنقدّم تجربة عطرية راقية تناسب جميع الأذواق والميزانيات دون المساس بالجودة أو المصداقية.",
    division1Title: "العطور الأصلية",
    division1Subtitle: "Original Fragrances",
    division1Text: "نقدّم مجموعة مختارة من العطور الأصلية للعلامات العالمية الموثوقة، مع التزام كامل بالأصالة والجودة المضمونة.",
    division1Text2: "انطلاقًا من إيماننا بأن العطر الفاخر يجب أن يكون متاحًا للجميع، نوفر عطورنا الأصلية بمقاسات متعددة تبدأ من 3 مل، 5 مل، 10 مل، وصولًا إلى 50 مل و100 مل.",
    division2Title: "العطور المركبة",
    division2Subtitle: "Signature & Crafted Fragrances",
    division2Text: "في قسم العطور المركبة، ننتقل من الاختيار إلى الإبداع. نقوم بعناية فائقة باختيار أجود الزيوت العطرية.",
    division2Features: [
      "خامات عالية الجودة",
      "مواد نقية وآمنة تحافظ على الصحة العامة",
      "إضافات مدروسة تعزّز ثبات العطر وأدائه"
    ],
    visionTitle: "رؤيتنا",
    visionText: "أن نكون علامة عطرية موثوقة تجمع بين الأصالة، الإتاحة، والإبداع، وتمكّن كل شخص من أن يصنع لنفسه بصمته العطرية الخاصة."
  }
}

// Textes par défaut (fallback)
const defaultHeroTexts: Record<'fr' | 'en' | 'ar', HeroText> = {
  fr: {
    subtitle: 'Parfums Haute Couture',
    title_line1: "L'Art de la",
    title_highlight: 'Séduction',
    description: "Découvrez notre collection exclusive de parfums de luxe. Chaque fragrance est une œuvre d'art olfactive créée pour les âmes raffinées.",
    button_text: 'Découvrir la Collection'
  },
  en: {
    subtitle: 'Haute Couture Perfumes',
    title_line1: "The Art of",
    title_highlight: 'Seduction',
    description: "Discover our exclusive collection of luxury perfumes. Each fragrance is an olfactory work of art.",
    button_text: 'Discover Collection'
  },
  ar: {
    subtitle: 'عطور الهوت كوتور',
    title_line1: 'فن',
    title_highlight: 'الإغراء',
    description: "اكتشف مجموعتنا الحصرية من العطور الفاخرة. كل عطر هو عمل فني عطري مصنوع للأرواح الراقية.",
    button_text: 'اكتشف المجموعة'
  }
}

const translations = {
  fr: {
    collections: 'Collections', history: 'Notre Histoire', testimonials: 'Témoignages', cart: 'Panier',
    search: 'Rechercher', excellenceTitle: "L'Excellence de la Parfumerie",
    historyDesc1: "Fondée sur les principes de l'artisanat français, LUXURY PARFUM représente l'apogée de la parfumerie de luxe.",
    historyDesc2: "Notre philosophie unique vous permet d'acheter au millilitre, découvrant ainsi l'essence pure du luxe sans compromis.",
    fragrances: 'Fragrances', clients: 'Clients', premium: 'Premium', ourCreations: 'Nos Créations',
    exclusiveColl: 'Collection Exclusive', collDesc: "Explorez notre sélection de parfums d'exception.",
    details: 'Voir Détails', allCategories: 'Toutes', allOccasions: 'Toutes', total: 'Total',
    checkout: 'Commander', emptyCart: 'Votre panier est vide', continueShopping: 'Continuer',
    searchPlaceholder: 'Rechercher...', quantity: 'Quantité', addToCart: 'Ajouter au panier',
    orderWhatsapp: 'Commander sur WhatsApp', stock: 'Stock', outOfStock: 'Rupture de stock',
    enterQuantity: 'Entrez la quantité en ml', minOrder: 'Min', maxOrder: 'Max',
    homme: 'Homme', femme: 'Femme', unisexe: 'Unisexe', all: 'Tous'
  },
  en: {
    collections: 'Collections', history: 'Our History', testimonials: 'Testimonials', cart: 'Cart',
    search: 'Search', excellenceTitle: "The Excellence of Perfumery",
    historyDesc1: "Founded on French craftsmanship principles, LUXURY PARFUM represents the pinnacle of luxury perfumery.",
    historyDesc2: "Our unique philosophy allows you to buy by the milliliter, discovering pure essence of luxury.",
    fragrances: 'Fragrances', clients: 'Clients', premium: 'Premium', ourCreations: 'Our Creations',
    exclusiveColl: 'Exclusive Collection', collDesc: "Explore our selection of exceptional perfumes.",
    details: 'View Details', allCategories: 'All', allOccasions: 'All', total: 'Total',
    checkout: 'Checkout', emptyCart: 'Your cart is empty', continueShopping: 'Continue',
    searchPlaceholder: 'Search...', quantity: 'Quantity', addToCart: 'Add to cart',
    orderWhatsapp: 'Order on WhatsApp', stock: 'Stock', outOfStock: 'Out of stock',
    enterQuantity: 'Enter quantity in ml', minOrder: 'Min', maxOrder: 'Max',
    homme: 'Men', femme: 'Women', unisexe: 'Unisex', all: 'All'
  },
  ar: {
    collections: 'المجموعات', history: 'قصتنا', testimonials: 'شهادات', cart: 'السلة',
    search: 'بحث', excellenceTitle: 'التميز في صناعة العطور',
    historyDesc1: 'تأسست على مبادئ الحرفية الفرنسية.', historyDesc2: 'فلسفتنا الفريدة تتيح لك الشراء بالمليلتر.',
    fragrances: 'عطر', clients: 'عميل', premium: 'ممتاز', ourCreations: 'إبداعاتنا',
    exclusiveColl: 'مجموعة حصرية', collDesc: 'استكشف مجموعتنا المختارة.',
    details: 'عرض التفاصيل', allCategories: 'الكل', allOccasions: 'الكل', total: 'الإجمالي',
    checkout: 'إتمام الطلب', emptyCart: 'السلة فارغة', continueShopping: 'متابعة',
    searchPlaceholder: 'بحث...', quantity: 'الكمية', addToCart: 'أضف للسلة',
    orderWhatsapp: 'اطلب عبر واتساب', stock: 'المخزون', outOfStock: 'نفذ المخزون',
    enterQuantity: 'أدخل الكمية بالمل', minOrder: 'الحد الأدنى', maxOrder: 'الحد الأقصى',
    homme: 'رجال', femme: 'نساء', unisexe: 'للجنسين', all: 'الكل'
  }
}

// Catégories de genre principales
const genderCategories = ['Homme', 'Femme', 'Unisexe']

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedPerfume, setSelectedPerfume] = useState<Parfum | null>(null)
  const [quantity, setQuantity] = useState(5)
  const [manualQuantity, setManualQuantity] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGender, setSelectedGender] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [hoveredPerfume, setHoveredPerfume] = useState<number | null>(null)
  const [lang, setLang] = useState<'fr' | 'en' | 'ar'>('fr')
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'FCFA'>('EUR')
  const [parfums, setParfums] = useState<Parfum[]>([])
  const [settings, setSettings] = useState<Settings>({
    whatsapp_number: '212600000000',
    taux_usd: 1.08,
    taux_fcfa: 655.957,
    hero_bg_image: ''
  })
  const [heroTexts, setHeroTexts] = useState<Record<'fr' | 'en' | 'ar', HeroText>>(defaultHeroTexts)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  const t = translations[lang]
  const heroText = heroTexts[lang]
  const aboutT = aboutTexts[lang]
  const heroRef = useRef<HTMLElement>(null)

  // Auto-slide toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Fonctions de navigation du slider
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [])

  // Load data from Supabase
  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        const [parfumsRes, settingsRes, heroTextsRes] = await Promise.all([
          supabase.from('parfums').select('*').eq('est_disponible', true).order('created_at', { ascending: false }),
          supabase.from('site_settings').select('*').eq('id', 1).single(),
          supabase.from('hero_texts').select('*')
        ])

        if (!mounted) return

        if (parfumsRes.data) setParfums(parfumsRes.data)
        if (settingsRes.data) setSettings(settingsRes.data)

        // Charger les textes du hero depuis la base de données
        if (heroTextsRes.data && heroTextsRes.data.length > 0) {
          const textsFromDb: Record<string, HeroText> = {}
          heroTextsRes.data.forEach((row: any) => {
            textsFromDb[row.language] = {
              subtitle: row.subtitle,
              title_line1: row.title_line1,
              title_highlight: row.title_highlight,
              description: row.description,
              button_text: row.button_text
            }
          })
          setHeroTexts({ ...defaultHeroTexts, ...textsFromDb } as Record<'fr' | 'en' | 'ar', HeroText>)
        }
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

  const categories = useMemo(() => Array.from(new Set(parfums.map(p => p.categorie).filter(c => !genderCategories.includes(c)))), [parfums])

  // 3 premiers parfums pour le hero
  const heroPerfumes = useMemo(() => parfums.slice(0, 3), [parfums])

  const filteredPerfumes = parfums.filter(p => {
    const matchesSearch = p.nom.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGender = !selectedGender || p.categorie === selectedGender
    const matchesCategory = !selectedCategory || p.categorie === selectedCategory
    return matchesSearch && matchesGender && matchesCategory
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

      {/* HERO - SLIDER SPECTACULAIRE */}
      <section ref={heroRef} className="min-h-screen flex items-center relative overflow-hidden">
        {/* Background Slider avec transitions */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img
                src={heroSlides[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay élégant avec gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/40"></div>

          {/* Particules flottantes dorées */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#C9A227] rounded-full opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  x: [-10, 10, -10],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Flèches de navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 group"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#C9A227] group-hover:border-[#C9A227] group-hover:scale-110">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-white transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 group"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-[#C9A227] group-hover:border-[#C9A227] group-hover:scale-110">
            <svg className="w-6 h-6 md:w-8 md:h-8 text-white transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        {/* Contenu du Hero */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center w-full pt-20">
          {/* Texte du Hero - Immobile */}
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`${lang === 'ar' ? 'lg:text-right' : 'lg:text-left'} text-center`}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#C9A227] text-lg tracking-[0.3em] mb-6 uppercase font-bold"
            >
              {heroText.subtitle}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-white mb-8"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {heroText.title_line1}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="block text-[#C9A227] mt-2"
              >
                {heroText.title_highlight}
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-200 text-lg max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              {heroText.description}
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              href="#collections"
              className="inline-block bg-[#C9A227] text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-[#8B6914] hover:scale-105 transition-all shadow-2xl shadow-[#C9A227]/30"
            >
              {heroText.button_text}
            </motion.a>
          </motion.div>

          {/* 3 Parfums avec animations au survol */}
          <div className="hidden lg:flex justify-center items-center gap-6">
            {heroPerfumes.map((parfum, index) => (
              <motion.div
                key={parfum.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                onMouseEnter={() => setHoveredPerfume(index)}
                onMouseLeave={() => setHoveredPerfume(null)}
                onClick={() => { setSelectedPerfume(parfum); setQuantity(parfum.min_achat_ml); setManualQuantity('') }}
                className={`relative cursor-pointer transition-all duration-500 ${hoveredPerfume === index
                  ? 'scale-110 z-20'
                  : hoveredPerfume !== null
                    ? 'scale-95 opacity-70'
                    : 'scale-100'
                  }`}
              >
                <div className="relative group">
                  <div className={`absolute -inset-4 bg-[#C9A227]/30 rounded-3xl blur-xl transition-opacity duration-500 ${hoveredPerfume === index ? 'opacity-100' : 'opacity-0'}`}></div>
                  <div className="relative w-48 h-64 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                    <img
                      src={parfum.image_url_1 || 'https://via.placeholder.com/200x300'}
                      alt={parfum.nom}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-4 transition-opacity duration-300 ${hoveredPerfume === index ? 'opacity-100' : 'opacity-0'}`}>
                      <p className="text-white font-bold text-sm truncate">{parfum.nom}</p>
                      <p className="text-[#C9A227] font-bold text-lg">{formatPrice(parfum.prix_eur)}/ml</p>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-[#C9A227] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {parfum.categorie}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Indicateurs de slide */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${currentSlide === index
                ? 'w-12 h-3 bg-[#C9A227]'
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                }`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* FILTRES PAR GENRE - Homme/Femme/Unisexe */}
      <section className="py-8 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedGender('')}
              className={`px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 ${selectedGender === ''
                ? 'bg-[#C9A227] text-white shadow-lg shadow-[#C9A227]/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
            >
              {t.all}
            </button>
            <button
              onClick={() => setSelectedGender('Homme')}
              className={`px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${selectedGender === 'Homme'
                ? 'bg-[#C9A227] text-white shadow-lg shadow-[#C9A227]/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
            >
              <span>👔</span> {t.homme}
            </button>
            <button
              onClick={() => setSelectedGender('Femme')}
              className={`px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${selectedGender === 'Femme'
                ? 'bg-[#C9A227] text-white shadow-lg shadow-[#C9A227]/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
            >
              <span>👗</span> {t.femme}
            </button>
            <button
              onClick={() => setSelectedGender('Unisexe')}
              className={`px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${selectedGender === 'Unisexe'
                ? 'bg-[#C9A227] text-white shadow-lg shadow-[#C9A227]/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
            >
              <span>✨</span> {t.unisexe}
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT - PRÉSENTATION COMPLÈTE */}
      <section id="about" className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#1a1a1a] overflow-hidden">
        {/* Titre principal animé */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 px-4"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent mx-auto mb-8"
          />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
            <span className="text-[#C9A227]">{aboutT.mainTitle}</span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed"
          >
            {aboutT.intro}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 text-base md:text-lg max-w-4xl mx-auto mt-6 leading-relaxed"
          >
            {aboutT.introSub}
          </motion.p>
        </motion.div>

        {/* Divisions */}
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          {/* Division 1: Parfums Originaux */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#C9A227]/20 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src="/hero-slide-3.jpg"
                  alt="Parfums Originaux"
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[#C9A227] text-sm tracking-[0.3em] uppercase font-bold">01</span>
                </div>
              </div>
            </div>
            <div className={`space-y-6 ${lang === 'ar' ? 'text-right' : ''}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-[#C9A227] text-sm tracking-[0.3em] uppercase font-bold">{aboutT.division1Subtitle}</span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mt-2" style={{ fontFamily: 'Cinzel, serif' }}>
                  {aboutT.division1Title}
                </h3>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 text-lg leading-relaxed"
              >
                {aboutT.division1Text}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 leading-relaxed"
              >
                {aboutT.division1Text2}
              </motion.p>
              {/* Tailles disponibles */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-3 pt-4"
              >
                {['3ml', '5ml', '10ml', '50ml', '100ml'].map((size, i) => (
                  <motion.span
                    key={size}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                    className="px-4 py-2 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-full text-[#C9A227] text-sm font-bold"
                  >
                    {size}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Division 2: Parfums de Création */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className={`space-y-6 order-2 lg:order-1 ${lang === 'ar' ? 'text-right' : ''}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-[#C9A227] text-sm tracking-[0.3em] uppercase font-bold">{aboutT.division2Subtitle}</span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mt-2" style={{ fontFamily: 'Cinzel, serif' }}>
                  {aboutT.division2Title}
                </h3>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 text-lg leading-relaxed"
              >
                {aboutT.division2Text}
              </motion.p>
              {/* Caractéristiques */}
              <motion.ul
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="space-y-4 pt-4"
              >
                {aboutT.division2Features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.15 }}
                    className="flex items-center gap-4 text-gray-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            <div className="relative group order-1 lg:order-2">
              <div className="absolute -inset-4 bg-gradient-to-l from-[#C9A227]/20 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src="/hero-slide-5.jpg"
                  alt="Parfums de Création"
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[#C9A227] text-sm tracking-[0.3em] uppercase font-bold">02</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#C9A227]/5 via-[#C9A227]/10 to-[#C9A227]/5"></div>
          <div className="max-w-4xl mx-auto px-4 py-20 text-center relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#C9A227]/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
                {aboutT.visionTitle}
              </h3>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                {aboutT.visionText}
              </p>
            </motion.div>
            {/* Statistiques animées */}
            <div className="grid grid-cols-3 gap-8 mt-16">
              {[
                { val: `${parfums.length}+`, label: t.fragrances },
                { val: '10K+', label: t.clients },
                { val: '100%', label: t.premium }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-center"
                >
                  <motion.p
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
                    className="text-4xl md:text-5xl font-bold text-[#C9A227]"
                    style={{ fontFamily: 'Cinzel, serif' }}
                  >
                    {stat.val}
                  </motion.p>
                  <p className="text-gray-400 text-sm uppercase tracking-widest mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
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
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full max-w-sm px-6 py-3 rounded-full border border-gray-200 focus:border-[#C9A227] outline-none"
            />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-6 py-3 rounded-full border border-gray-200 bg-white outline-none"
            >
              <option value="">{t.allCategories}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPerfumes.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => { setSelectedPerfume(p); setQuantity(p.min_achat_ml); setManualQuantity('') }}
              >
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
              </motion.div>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] max-w-4xl w-full overflow-hidden flex flex-col md:flex-row"
            onClick={e => e.stopPropagation()}
          >
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
          </motion.div>
        </div>
      )}

      {/* CART MODAL */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex justify-end" onClick={() => setShowCart(false)}>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="bg-white w-full max-w-md h-full shadow-2xl p-8 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
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
          </motion.div>
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