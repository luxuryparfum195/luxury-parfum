export interface Perfume {
  id: string
  created_at: string
  nom: string
  description: string
  prix_par_ml: number
  image_url_1: string
  image_url_2?: string
  stock_max_ml: number
  min_achat_ml: number
  notes_olfactives: string[]
}

export interface CartItem {
  id: string
  nom: string
  image_url_1: string
  quantity: number
  totalPrice: string
}

export type Language = 'fr' | 'ar' | 'en'

export interface Translations {
  [key: string]: {
    heroTitle: string
    heroSubtitle: string
    exploreCollections: string
    collections: string
    cart: string
    emptyCart: string
    continueShopping: string
    remove: string
    total: string
    checkout: string
    addToCart: string
    quantity: string
    olfactoryNotes: string
    alternateView: string
    footerText: string
  }
}