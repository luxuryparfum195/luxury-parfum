"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import Head from 'next/head'

// --- DATA ---

const perfumes = [
  {
    id: '1',
    nom: 'Nuit de Diamant',
    description: 'Un parfum mystérieux aux notes de bois de santal et de rose bulgare, créé pour les âmes élégantes.',
    prix_par_ml: 2.50,
    image_url_1: 'https://i.postimg.cc/fR3gxpyw/catalog-ai-1-compressed-1-Page-01.jpg',
    image_url_2: 'https://i.postimg.cc/SNX0mD82/catalog-ai-1-compressed-1-Page-04.jpg',
    stock_max_ml: 50,
    min_achat_ml: 5,
    notes_olfactives: ['Rose', 'Santal', 'Vanille', 'Musk'],
    category: 'Oriental',
    occasions: ['Mariage', 'Soirée']
  },
  {
    id: '2',
    nom: 'Or Noir',
    description: "L'essence de l'Orient avec oud et ambre, une signature olfactive inoubliable.",
    prix_par_ml: 3.00,
    image_url_1: 'https://i.postimg.cc/SNX0mD82/catalog-ai-1-compressed-1-Page-04.jpg',
    image_url_2: 'https://i.postimg.cc/WbqyBtLt/catalog-ai-1-compressed-1-Page-05.jpg',
    stock_max_ml: 30,
    min_achat_ml: 5,
    notes_olfactives: ['Oud', 'Ambre', 'Musk', 'Épices'],
    category: 'Boisé',
    occasions: ['Réunion', 'Travail', 'Soirée']
  },
  {
    id: '3',
    nom: 'Éclat Doré',
    description: 'Fraîcheur citrus et fleurs blanches, un parfum lumineux et raffiné.',
    prix_par_ml: 2.00,
    image_url_1: 'https://i.postimg.cc/WbqyBtLt/catalog-ai-1-compressed-1-Page-05.jpg',
    image_url_2: 'https://i.postimg.cc/VsVTZnhx/catalog-ai-1-compressed-1-Page-06.jpg',
    stock_max_ml: 40,
    min_achat_ml: 5,
    notes_olfactives: ['Citron', 'Jasmin', 'Muguet', 'Bergamote'],
    category: 'Frais',
    occasions: ['Quotidien', 'Sortie', 'Travail']
  },
  {
    id: '4',
    nom: 'Velours Royal',
    description: 'Un mélange royal de rose de Damas et de patchouli, symbole de sophistication.',
    prix_par_ml: 3.50,
    image_url_1: 'https://i.postimg.cc/VsVTZnhx/catalog-ai-1-compressed-1-Page-06.jpg',
    image_url_2: 'https://i.postimg.cc/1zsYVHgF/catalog-ai-1-compressed-1-Page-21.jpg',
    stock_max_ml: 25,
    min_achat_ml: 5,
    notes_olfactives: ['Rose de Damas', 'Patchouli', 'Iris', 'Oud'],
    category: 'Floral',
    occasions: ['Mariage', 'Soirée']
  },
  {
    id: '5',
    nom: 'Mystère Céleste',
    description: 'Notes célestes de jasmin et ylang-ylang, un voyage sensoriel unique.',
    prix_par_ml: 2.80,
    image_url_1: 'https://i.postimg.cc/1zsYVHgF/catalog-ai-1-compressed-1-Page-21.jpg',
    image_url_2: 'https://i.postimg.cc/SN8hWgKd/catalog-ai-1-compressed-1-Page-22.jpg',
    stock_max_ml: 35,
    min_achat_ml: 5,
    notes_olfactives: ['Jasmin', 'Ylang-Ylang', 'Benjoin', 'Musc Blanc'],
    category: 'Oriental',
    occasions: ['Sortie', 'Réunion']
  },
  {
    id: '6',
    nom: 'Ambre Éternel',
    description: 'Un parfum intemporel aux notes chaudes et envoûtantes.',
    prix_par_ml: 2.70,
    image_url_1: 'https://i.postimg.cc/SN8hWgKd/catalog-ai-1-compressed-1-Page-22.jpg',
    image_url_2: 'https://i.postimg.cc/Dzf33FPP/catalog-ai-1-compressed-1-Page-23.jpg',
    stock_max_ml: 45,
    min_achat_ml: 5,
    notes_olfactives: ['Ambre', 'Vanille', 'Tonka', 'Cèdre'],
    category: 'Ambré',
    occasions: ['Quotidien', 'Travail']
  }
]

const translations = {
  fr: {
    collections: 'Collections',
    history: 'Notre Histoire',
    testimonials: 'Témoignages',
    cart: 'Panier',
    heroSubtitle: 'Parfums Haute Couture',
    heroTitle: "L'Art de la",
    heroHighlight: 'Séduction',
    heroDesc: "Découvrez notre collection exclusive de parfums de luxe. Chaque fragrance est une œuvre d'art olfactive créée pour les âmes raffinées.",
    discover: 'Découvrir la Collection',
    search: 'Rechercher',
    excellenceTitle: "L'Excellence de la Parfumerie",
    historyDesc1: "Fondée sur les principes de l'artisanat français, LUXURY PARFUM représente l'apogée de la parfumerie de luxe. Chaque fragrance est composée avec des ingrédients rares sourcés des quatre coins du monde.",
    historyDesc2: "Notre philosophie unique vous permet d'acheter au millilitre, découvrant ainsi l'essence pure du luxe sans compromis.",
    yearsExcellence: "Années d'Excellence",
    fragrances: 'Fragrances',
    clients: 'Clients',
    premium: 'Premium',
    ourCreations: 'Nos Créations',
    exclusiveColl: 'Collection Exclusive',
    collDesc: 'Explorez notre sélection de parfums d\'exception, créés pour sublimer votre personnalité.',
    buy: 'Acheter',
    details: 'Voir Détails',
    stock: 'Stock',
    searchTitle: 'Rechercher un Parfum',
    searchPlaceholder: 'Nom du parfum, description...',
    category: 'Catégorie',
    allCategories: 'Toutes les catégories',
    occasion: 'Occasion',
    allOccasions: 'Toutes les occasions',
    popularOccasions: 'Occasions populaires',
    reset: 'Réinitialiser',
    resultsFound: 'parfum(s) trouvé(s)',
    newsTitle: 'Rejoignez Notre Cercle VIP',
    newsDesc: 'Inscrivez-vous pour recevoir des offres exclusives, des avant-premières et des conseils parfumés.',
    emailPlaceholder: 'Votre adresse email',
    subscribe: 'S\'inscrire',
    footerDesc: "L'excellence de la parfumerie française au service de votre élégance. Chaque fragrance est une promesse de raffinement.",
    total: 'Total',
    checkout: 'Commander',
    emptyCart: 'Votre panier est vide',
    continueShopping: 'Continuer vos achats'
  },
  en: {
    collections: 'Collections',
    history: 'Our History',
    testimonials: 'Testimonials',
    cart: 'Cart',
    heroSubtitle: 'Haute Couture Perfumes',
    heroTitle: "The Art of",
    heroHighlight: 'Seduction',
    heroDesc: "Discover our exclusive collection of luxury perfumes. Each fragrance is an olfactory work of art created for refined souls.",
    discover: 'Discover Collection',
    search: 'Search',
    excellenceTitle: "The Excellence of Perfumery",
    historyDesc1: "Founded on the principles of French craftsmanship, LUXURY PARFUM represents the pinnacle of luxury perfumery. Each fragrance is composed of rare ingredients sourced from around the world.",
    historyDesc2: "Our unique philosophy allows you to buy by the milliliter, discovering the pure essence of luxury without compromise.",
    yearsExcellence: "Years of Excellence",
    fragrances: 'Fragrances',
    clients: 'Clients',
    premium: 'Premium',
    ourCreations: 'Our Creations',
    exclusiveColl: 'Exclusive Collection',
    collDesc: 'Explore our selection of exceptional perfumes, created to enhance your personality.',
    buy: 'Buy',
    details: 'View Details',
    stock: 'Stock',
    searchTitle: 'Search for a Perfume',
    searchPlaceholder: 'Perfume name, description...',
    category: 'Category',
    allCategories: 'All Categories',
    occasion: 'Occasion',
    allOccasions: 'All Occasions',
    popularOccasions: 'Popular Occasions',
    reset: 'Reset',
    resultsFound: 'perfume(s) found',
    newsTitle: 'Join Our VIP Circle',
    newsDesc: 'Sign up to receive exclusive offers, previews and scented tips.',
    emailPlaceholder: 'Your email address',
    subscribe: 'Subscribe',
    footerDesc: "French perfumery excellence serving your elegance. Each fragrance is a promise of refinement.",
    total: 'Total',
    checkout: 'Checkout',
    emptyCart: 'Your cart is empty',
    continueShopping: 'Continue Shopping'
  },
  ar: {
    collections: 'المجموعات',
    history: 'قصتنا',
    testimonials: 'شهادات العملاء',
    cart: 'السلة',
    heroSubtitle: 'عطور الهوت كوتور',
    heroTitle: 'فن',
    heroHighlight: 'الإغراء',
    heroDesc: "اكتشف مجموعتنا الحصرية من العطور الفاخرة. كل عطر هو عمل فني عطري صمم للأرواح الراقية.",
    discover: 'اكتشف المجموعة',
    search: 'بحث',
    excellenceTitle: 'التميز في صناعة العطور',
    historyDesc1: 'تأسست لوكجري بارفيوم على مبادئ الحرفية الفرنسية، وتمثل قمة صناعة العطور الفاخرة. يتكون كل عطر من مكونات نادرة مستوردة من جميع أنحاء العالم.',
    historyDesc2: 'تسمح لك فلسفتنا الفريدة بالشراء بالمليلتر، مما يتيح لك اكتشاف الجوهر النقي للفخامة دون مساومة.',
    yearsExcellence: 'سنوات من التميز',
    fragrances: 'عطر',
    clients: 'عميل',
    premium: 'ممتاز',
    ourCreations: 'إبداعاتنا',
    exclusiveColl: 'مجموعة حصرية',
    collDesc: 'استكشف مجموعتنا المختارة من العطور الاستثنائية، المصممة لتعزيز شخصيتك.',
    buy: 'شراء',
    details: 'عرض التفاصيل',
    stock: 'المخزون',
    searchTitle: 'البحث عن عطر',
    searchPlaceholder: 'اسم العطر، الوصف...',
    category: 'الفئة',
    allCategories: 'جميع الفئات',
    occasion: 'المناسبة',
    allOccasions: 'جميع المناسبات',
    popularOccasions: 'مناسبات شعبية',
    reset: 'إعادة تعيين',
    resultsFound: 'عطر تم العثور عليه',
    newsTitle: 'انضم إلى دائرة كبار الشخصيات لدينا',
    newsDesc: 'سجل لتلقي العروض الحصرية والمعاينات والنصائح العطرية.',
    emailPlaceholder: 'بريدك الإلكتروني',
    subscribe: 'اشتراك',
    footerDesc: 'تميز صناعة العطور الفرنسية في خدمة أناقتك. كل عطر هو وعد بالرقي.',
    total: 'الإجمالي',
    checkout: 'إتمام الطلب',
    emptyCart: 'سلة التسوق فارغة',
    continueShopping: 'مواصلة التسوق'
  }
}

const testimonials = [
  {
    id: 1,
    name: "Sophie Laurent",
    role: "Cliente VIP",
    text: "Une expérience olfactive inégalée. Le concept d'achat au millilitre est révolutionnaire pour tester des fragrances rares.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sophie"
  },
  {
    id: 2,
    name: "Marc Duboi",
    role: "Amateur de Parfums",
    text: "Or Noir est devenu ma signature. La tenue est exceptionnelle et les compliments ne s'arrêtent jamais.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=marc"
  },
  {
    id: 3,
    name: "Elena Ross",
    role: "Sommelier de Fragrances",
    text: "La qualité des ingrédients est palpable. On sent tout le savoir-faire de la parfumerie française traditionnelle.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=elena"
  }
]

// --- HELPER COMPONENTS ---

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedPerfume, setSelectedPerfume] = useState<any>(null)
  const [quantity, setQuantity] = useState(5)
  const [showCart, setShowCart] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedOccasion, setSelectedOccasion] = useState('')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [lang, setLang] = useState<'fr' | 'en' | 'ar'>('fr')
  const [currency, setCurrency] = useState<'EUR' | 'USD' | 'FCFA'>('EUR')
  const t = translations[lang]

  const exchangeRates = {
    EUR: 1,
    USD: 1.08,
    FCFA: 655.957
  }

  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  useEffect(() => {
    // Retrait total du délai artificiel de chargement
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const addToCart = (perfume: any, qty: number) => {
    const existing = cart.find(item => item.id === perfume.id)
    if (existing) {
      setCart(cart.map(item => item.id === perfume.id ? { ...item, quantity: item.quantity + qty } : item))
    } else {
      setCart([...cart, { ...perfume, quantity: qty, price: perfume.prix_par_ml }])
    }
    setShowCart(true)
    setSelectedPerfume(null)
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const cartCount = cart.reduce((acc, item) => acc + 1, 0)
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const formatPrice = (priceInEur: number) => {
    const converted = priceInEur * exchangeRates[currency]
    if (currency === 'FCFA') {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(converted).replace('XOF', 'FCFA')
    }
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'fr-FR', { style: 'currency', currency: currency }).format(converted)
  }

  const categories = useMemo(() => Array.from(new Set(perfumes.map(p => p.category))), [])
  const occasions = useMemo(() => Array.from(new Set(perfumes.flatMap(p => p.occasions))), [])

  const filteredPerfumes = perfumes.filter(p => {
    const matchesSearch = p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || p.category === selectedCategory
    const matchesOccasion = !selectedOccasion || p.occasions.includes(selectedOccasion)
    return matchesSearch && matchesCategory && matchesOccasion
  })



  return (
    <div className={`min-h-screen bg-white text-gray-900 ${lang === 'ar' ? 'font-arabic' : ''}`} style={{ scrollBehavior: 'smooth' }}>
      {/* ===== NAVBAR ===== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-xl py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <a href="#" className="text-2xl md:text-3xl font-bold tracking-[0.2em]" style={{ fontFamily: 'Cinzel, serif', color: isScrolled ? '#C9A227' : '#C9A227' }}>
            LUXURY PARFUM
          </a>

          <div className="hidden lg:flex gap-8 items-center">
            <a href="#collections" className={`font-medium hover:text-[#C9A227] transition-colors ${isScrolled ? 'text-gray-800' : 'text-white'}`}>{t.collections}</a>
            <a href="#about" className={`font-medium hover:text-[#C9A227] transition-colors ${isScrolled ? 'text-gray-800' : 'text-white'}`}>{t.history}</a>
            <a href="#testimonials" className={`font-medium hover:text-[#C9A227] transition-colors ${isScrolled ? 'text-gray-800' : 'text-white'}`}>{t.testimonials}</a>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <div className={`hidden sm:flex rounded-full p-1 border ${isScrolled ? 'bg-gray-100 border-gray-200' : 'bg-black/20 backdrop-blur-md border-white/10'}`}>
              {(['EUR', 'USD', 'FCFA'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${currency === c ? 'bg-[#C9A227] text-white shadow-lg' : isScrolled ? 'text-gray-500 hover:text-black' : 'text-white/60 hover:text-white'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className={`flex rounded-full p-1 border ${isScrolled ? 'bg-gray-100 border-gray-200' : 'bg-black/20 backdrop-blur-md border-white/10'}`}>
              {(['fr', 'en', 'ar'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all ${lang === l ? 'bg-[#C9A227] text-white shadow-lg' : isScrolled ? 'text-gray-500 hover:text-black' : 'text-white/60 hover:text-white'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button onClick={() => setShowCart(true)} className="relative btn-luxury text-sm">
              <span>{t.cart}</span>
              {cartCount > 0 && <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="hero-bg min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://i.postimg.cc/G2jML17x/catalog-ai-1-compressed-1-Page-02.jpg" alt="Hero" className="w-full h-full object-cover opacity-40 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>

        {/* Mouse Particles */}
        <div className="absolute inset-0 pointer-events-none z-1">
          {Array.from({ length: 30 }).map((_, i) => {
            const baseX = (i % 6) * 20
            const baseY = Math.floor(i / 6) * 20
            const offsetX = (mousePos.x - 50) * (0.02 + i * 0.005)
            const offsetY = (mousePos.y - 50) * (0.02 + i * 0.005)
            return (
              <div
                key={i}
                className="absolute rounded-full bg-[#C9A227] transition-all duration-300 ease-out"
                style={{
                  left: `${baseX + offsetX}%`,
                  top: `${baseY + offsetY}%`,
                  width: `${3 + (i % 4)}px`,
                  height: `${3 + (i % 4)}px`,
                  opacity: 0.3 + (i % 5) * 0.1,
                  boxShadow: '0 0 10px rgba(201, 162, 39, 0.5)'
                }}
              />
            )
          })}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className={`${lang === 'ar' ? 'lg:text-right' : 'lg:text-left'} text-center`}>
            <p className="text-[#C9A227] text-lg tracking-[0.3em] mb-6 uppercase">{t.heroSubtitle}</p>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8" style={{ fontFamily: 'Cinzel, serif' }}>{t.heroTitle} <span className="block text-[#C9A227]">{t.heroHighlight}</span></h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-10">{t.heroDesc}</p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${lang === 'ar' ? 'lg:justify-start' : 'lg:justify-start'}`}>
              <a href="#collections" className="btn-luxury">{t.discover}</a>
              <button onClick={() => setShowSearch(true)} className="btn-outline flex items-center gap-2 justify-center" style={{ color: '#C9A227', borderColor: '#C9A227' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                {t.search}
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group">
              <div className="absolute inset-0 rounded-full blur-3xl opacity-40 bg-[#C9A227]"></div>
              <img
                src="https://i.postimg.cc/fR3gxpyw/catalog-ai-1-compressed-1-Page-01.jpg"
                alt="Main"
                className="w-96 rounded-3xl shadow-2xl glow-gold border border-white/10 floating"
                style={{ transform: `perspective(1000px) rotateY(${(mousePos.x - 50) * 0.1}deg) rotateX(${(mousePos.y - 50) * -0.1}deg)` }}
              />
              <div className={`absolute -bottom-6 ${lang === 'ar' ? '-left-6' : '-right-6'} bg-black/80 backdrop-blur-md rounded-2xl p-4 border border-[#C9A227]/30`}>
                <p className="text-[#C9A227] text-2xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{t.premium}</p>
                <p className="text-white text-[10px] tracking-widest uppercase">Collection 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img src="https://i.postimg.cc/SNX0mD82/catalog-ai-1-compressed-1-Page-04.jpg" alt="History" className="rounded-3xl shadow-2xl relative z-10" />
              <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-[#C9A227] rounded-full opacity-20 z-0"></div>
            </div>
            <div>
              <p className="text-[#C9A227] tracking-widest mb-4">{t.history}</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: 'Cinzel, serif' }}>{t.excellenceTitle}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">{t.historyDesc1}</p>
              <p className="text-gray-600 mb-10 leading-relaxed text-lg">{t.historyDesc2}</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { val: '50+', label: t.fragrances },
                  { val: '10K+', label: t.clients },
                  { val: '100%', label: t.premium }
                ].map(s => (
                  <div key={s.label} className="bg-[#FFFAF0] p-4 rounded-2xl text-center">
                    <p className="text-2xl font-bold text-[#C9A227]">{s.val}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COLLECTIONS ===== */}
      <section id="collections" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#C9A227] tracking-widest mb-4 uppercase">{t.ourCreations}</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>{t.exclusiveColl}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t.collDesc}</p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <div className="relative w-full max-w-sm">
              <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:border-[#C9A227] outline-none transition-all" />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="px-6 py-3 rounded-full border border-gray-200 bg-white outline-none">
              <option value="">{t.allCategories}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={selectedOccasion} onChange={e => setSelectedOccasion(e.target.value)} className="px-6 py-3 rounded-full border border-gray-200 bg-white outline-none">
              <option value="">{t.allOccasions}</option>
              {occasions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPerfumes.map(per => (
              <div
                key={per.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedPerfume(per);
                  setQuantity(per.min_achat_ml);
                }}
              >
                <div className="relative h-80 overflow-hidden">
                  <img src={per.image_url_1} alt={per.nom} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest text-[#0A0A0A]">{per.category}</div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 px-8 py-3 bg-[#C9A227] text-white rounded-full font-bold shadow-xl">{t.details}</div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{per.nom}</h3>
                    <p className="text-[#C9A227] font-bold">{formatPrice(per.prix_par_ml)}/ml</p>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{per.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#C9A227] tracking-widest mb-4 uppercase">{t.testimonials}</p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>{lang === 'fr' ? 'L\'Élite vous Témoigne' : 'Our Clients Say'}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(tes => (
              <div key={tes.id} className="p-8 rounded-3xl border border-gray-100 hover:border-[#C9A227]/30 transition-all hover:bg-[#FFFAF0]/50">
                <div className="flex items-center gap-4 mb-6">
                  <img src={tes.avatar} className="w-12 h-12 rounded-full ring-2 ring-[#C9A227]/20" alt={tes.name} />
                  <div>
                    <p className="font-bold">{tes.name}</p>
                    <p className="text-xs text-gray-500">{tes.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{tes.text}"</p>
                <div className="mt-6 flex text-[#C9A227] text-sm gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://i.postimg.cc/G2jML17x/catalog-ai-1-compressed-1-Page-02.jpg')" }}></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Cinzel, serif' }}>{t.newsTitle}</h2>
          <p className="text-gray-400 text-lg mb-10">{t.newsDesc}</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder={t.emailPlaceholder} className="flex-1 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white outline-none focus:border-[#C9A227] transition-all" required />
            <button className="btn-luxury whitespace-nowrap">{t.subscribe}</button>
          </form>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0A0A0A] text-white py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-[#C9A227] mb-6 tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>LUXURY PARFUM</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-10">{t.footerDesc}</p>
          <div className="flex justify-center gap-8 mb-12">
            {['Collections', 'About', 'Cart'].map(l => <a key={l} href="#" className="text-gray-400 hover:text-white transition-all text-sm uppercase tracking-widest">{l}</a>)}
          </div>

          <div className="flex justify-center gap-6 mb-12">
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-all text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            {/* TikTok */}
            <a href="https://tiktok.com" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-black hover:text-white hover:border hover:border-white/20 transition-all text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
            </a>
            {/* Maps */}
            <a href="https://maps.google.com" target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#4285F4] hover:text-white transition-all text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </a>
          </div>
          <p className="text-gray-600 text-xs">© 2026 LUXURY PARFUM. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
        </div>
      </footer>

      {/* ===== PRODUCT MODAL ===== */}
      {selectedPerfume && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedPerfume(null)}>
          <div className="bg-white rounded-[2rem] max-w-4xl w-full overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
            <div className="md:w-1/2 h-80 md:h-auto relative">
              <img src={selectedPerfume.image_url_1} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedPerfume(null)} className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl text-xl hover:scale-110 transition-all">✕</button>
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
              <span className="text-[#C9A227] uppercase tracking-[0.2em] text-xs font-bold">{selectedPerfume.category}</span>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 mt-2" style={{ fontFamily: 'Cinzel, serif' }}>{selectedPerfume.nom}</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">{selectedPerfume.description}</p>

              <div className="mb-10">
                <p className="text-sm font-bold uppercase tracking-widest text-[#0A0A0A] mb-4">{lang === 'fr' ? 'Quantité' : 'Quantity'}</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                    <button onClick={() => setQuantity(Math.max(selectedPerfume.min_achat_ml, quantity - 5))} className="w-8 h-8 flex items-center justify-center font-bold text-lg">-</button>
                    <span className="w-12 text-center font-bold text-xl">{quantity}ml</span>
                    <button onClick={() => setQuantity(Math.min(selectedPerfume.stock_max_ml, quantity + 5))} className="w-8 h-8 flex items-center justify-center font-bold text-lg">+</button>
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-sm text-gray-500">{t.total}</p>
                    <p className="text-3xl font-bold text-[#C9A227]">{formatPrice(selectedPerfume.prix_par_ml * quantity)}</p>
                  </div>
                </div>
              </div>

              <button onClick={() => addToCart(selectedPerfume, quantity)} className="w-full btn-luxury py-5 text-lg font-bold shadow-2xl">{t.cart} +</button>

              <button
                onClick={() => {
                  const message = `Bonjour, je souhaite commander : ${selectedPerfume.nom} (${quantity}ml). Prix total : ${formatPrice(selectedPerfume.prix_par_ml * quantity)}`
                  window.open(`https://wa.me/212600000000?text=${encodeURIComponent(message)}`, '_blank')
                }}
                className="w-full mt-4 bg-[#25D366] text-white py-5 rounded-full font-bold text-lg shadow-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                {lang === 'fr' ? 'Commander sur WhatsApp' : 'Order on WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CART MODAL ===== */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex justify-end" onClick={() => setShowCart(false)}>
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-8 flex flex-col" onClick={e => e.stopPropagation()} style={{ animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-bold tracking-widest" style={{ fontFamily: 'Cinzel, serif' }}>{t.cart}</h3>
              <button onClick={() => setShowCart(false)} className="text-2xl hover:scale-110 transition-all">✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
                <p className="text-gray-400 mb-8">{t.emptyCart}</p>
                <button onClick={() => setShowCart(false)} className="btn-luxury text-sm">{t.continueShopping}</button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl group transition-all hover:bg-white hover:shadow-lg hover:ring-1 hover:ring-black/5">
                      <div className="flex-1">
                        <h4 className="font-bold text-[#0A0A0A]">{item.nom}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.quantity}ml × {formatPrice(item.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#C9A227]">{formatPrice(item.price * item.quantity)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-8 mt-6 border-t">
                  <div className="flex justify-between items-end mb-8">
                    <p className="text-gray-500">{t.total}</p>
                    <p className="text-4xl font-bold text-[#C9A227]" style={{ fontFamily: 'Cinzel, serif' }}>{formatPrice(cartTotal)}</p>
                  </div>
                  <button className="w-full btn-luxury py-5 text-lg font-bold shadow-xl mb-4">{t.checkout}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== SEARCH MODAL ===== */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4" onClick={() => setShowSearch(false)}>
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
              <h3 className="text-2xl font-bold text-white tracking-widest uppercase" style={{ fontFamily: 'Cinzel, serif' }}>{t.searchTitle}</h3>
              <button onClick={() => setShowSearch(false)} className="text-white text-3xl hover:rotate-90 transition-all duration-300">✕</button>
            </div>
            <div className="relative mb-12">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent border-b-2 border-white/20 py-6 text-2xl text-white outline-none focus:border-[#C9A227] transition-all"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <svg className="w-8 h-8 absolute right-0 top-1/2 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[50vh] overflow-y-auto pr-4">
              {filteredPerfumes.slice(0, 5).map(p => (
                <div key={p.id} onClick={() => { setSelectedPerfume(p); setShowSearch(false); }} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/10">
                  <img src={p.image_url_1} className="w-20 h-24 object-cover rounded-xl" />
                  <div className="flex-1">
                    <h4 className="text-white text-xl font-bold group-hover:text-[#C9A227] transition-all">{p.nom}</h4>
                    <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">{p.category}</p>
                  </div>
                  <p className="text-[#C9A227] font-bold text-xl">{formatPrice(p.prix_par_ml)}/ml</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes loading { 0% { left: -100%; } 100% { left: 100%; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .hero-bg { background: radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%); }
        .btn-luxury { @apply bg-[#C9A227] text-white px-8 py-4 rounded-full font-bold tracking-[0.1em] transition-all hover:bg-[#8B6914] hover:scale-105 active:scale-95 shadow-lg shadow-[#C9A227]/20; }
        .btn-outline { @apply border px-8 py-4 rounded-full font-bold tracking-[0.1em] transition-all hover:bg-white/5; }
        .glow-gold { box-shadow: 0 0 50px rgba(201, 162, 39, 0.3); }
        .floating { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .font-arabic { font-family: 'Outfit', sans-serif; }
      `}</style>
    </div>
  )
}