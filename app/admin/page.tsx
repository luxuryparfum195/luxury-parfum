'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Settings as SettingsIcon,
  LogOut,
  TrendingUp,
  Users,
  DollarSign,
  Search,
  CheckCircle2,
  Image as ImageIcon,
  X,
  Trash2,
  Edit2
} from 'lucide-react'


// Mock Data
const categories = ['Homme', 'Femme', 'Unisexe']
const occasionsList = ['Mariage', 'Réunion', 'Sortie', 'Travail', 'Soirée', 'Quotidien']

const initialPerfumes = [
  {
    id: '1',
    nom: 'Nuit de Diamant',
    categorie: 'Oriental',
    prix: 250,
    statut: 'Disponible',
    image: 'https://i.postimg.cc/fR3gxpyw/catalog-ai-1-compressed-1-Page-01.jpg',
    ventes: 42,
    revenu: 105000
  },
  {
    id: '2',
    nom: 'Or Noir',
    categorie: 'Boisé',
    prix: 300,
    statut: 'Disponible',
    image: 'https://i.postimg.cc/SNX0mD82/catalog-ai-1-compressed-1-Page-04.jpg',
    ventes: 31,
    revenu: 93000
  },
  {
    id: '3',
    nom: 'Éclat Doré',
    categorie: 'Frais',
    prix: 280,
    statut: 'Disponible',
    image: 'https://i.postimg.cc/WbqyBtLt/catalog-ai-1-compressed-1-Page-05.jpg',
    ventes: 26,
    revenu: 72800
  }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, products, add, settings
  const [language, setLanguage] = useState('Français')
  const [perfumes, setPerfumes] = useState(initialPerfumes)
  const [showLangMenu, setShowLangMenu] = useState(false)

  // Form states
  const [form, setForm] = useState({
    nom: '',
    categorie: 'Unisexe',
    photos: [] as string[],
    occasions: '',
    prix: '',
    reduction: '0',
    description: ''
  })

  // Settings states

  // Login state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' })
  const [loginError, setLoginError] = useState('')

  // Settings states
  const [settings, setSettings] = useState({
    siteName: 'LUXURY PARFUM',
    currency: 'EUR',
    contactEmail: 'contact@luxuryparfum.fr',
    maintenanceMode: false,
    headerAnnouncement: 'Livraison gratuite sur toutes les commandes ce mois-ci !',
    whatsapp: '',
    socials: {
      maps: '',
      tiktok: '',
      instagram: '',
      facebook: ''
    }
  })

  // auth session
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setIsAuthenticated(true)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    // Tentative de connexion Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.user.includes('@') ? loginForm.user : `${loginForm.user}@luxuryparfum.fr`,
      password: loginForm.pass
    })

    if (error) {
      // Fallback temporaire pour le dev
      if (loginForm.user === 'Amir2026' && loginForm.pass === 'Amir2026') {
        setIsAuthenticated(true)
      } else {
        setLoginError(error.message === 'Invalid login credentials' ? 'Identifiants incorrects' : error.message)
      }
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
  }

  const stats = [
    { title: 'Ventes Totales', value: '1,280 €', icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { title: 'Nouveaux Clients', value: '+12', icon: Users, color: 'bg-blue-50 text-blue-600' },
    { title: 'Top Produit', value: 'Nuit de Diamant', icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
    { title: 'Stock Critique', value: '3', icon: Package, color: 'bg-red-50 text-red-600' },
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setForm({ ...form, photos: [...form.photos, event.target.result as string] })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index: number) => {
    const newPhotos = [...form.photos]
    newPhotos.splice(index, 1)
    setForm({ ...form, photos: newPhotos })
  }

  const handleSaveProduct = () => {
    alert('Produit sauvegardé !')
    setActiveTab('products')
  }

  const renderSidebar = () => (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 p-6 flex flex-col z-50">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-bold tracking-widest text-luxury-gold" style={{ fontFamily: 'Cinzel, serif' }}>LUXURY</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'products', label: 'Produits', icon: Package },
          { id: 'add', label: 'Ajouter', icon: PlusCircle },
          { id: 'settings', label: 'Paramètres', icon: SettingsIcon },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
              ? 'bg-black text-white shadow-lg'
              : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Déconnexion
      </button>
    </div>
  )

  const renderHeader = () => (
    <header className="fixed top-0 left-64 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 px-8 flex items-center justify-between">
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-luxury-gold transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-gray-800">Amir</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Administrateur</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-luxury-gold flex items-center justify-center text-white font-bold">A</div>
      </div>
    </header>
  )

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-green-500 text-xs font-bold">+12%</span>
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
          <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Ventes Récentes</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl overflow-hidden">
                    <img src={initialPerfumes[i - 1].image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Vente #{1024 + i}</p>
                    <p className="text-xs text-gray-400">{initialPerfumes[i - 1].nom}</p>
                  </div>
                </div>
                <p className="font-bold text-luxury-gold">250 €</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 text-center">
          <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Stock Global</h3>
          <div className="relative w-40 h-40 mx-auto mb-6">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="text-gray-100" strokeDasharray="100, 100" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" />
              <path className="text-luxury-gold" strokeDasharray="75, 100" strokeWidth="3" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="currentColor" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">75%</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Capacité</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-6">Le stock est à un niveau optimal pour cette saison.</p>
          <button className="w-full py-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-200 transition-all">Gérer l'inventaire</button>
        </div>
      </div>
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Produit</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Catégorie</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Prix</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Statut</th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {perfumes.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={p.image} className="w-12 h-12 rounded-xl object-cover" />
                    <p className="font-bold text-gray-800">{p.nom}</p>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-gray-500">{p.categorie}</td>
                <td className="px-8 py-6 font-bold text-gray-800">{p.prix} €</td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full">
                    {p.statut}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-luxury-gold transition-all"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderAddProduct = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>Informations Générales</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nom du parfum</label>
                <input
                  type="text"
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Catégorie</label>
                  <select
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                    value={form.categorie}
                    onChange={e => setForm({ ...form, categorie: e.target.value })}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Prix (€)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                    value={form.prix}
                    onChange={e => setForm({ ...form, prix: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-luxury-gold" style={{ fontFamily: 'Cinzel, serif' }}>Médias</h3>
            <div className="space-y-4">
              <div
                className="w-full aspect-[3/4] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-luxury-gold transition-all overflow-hidden relative group"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {form.photos[0] ? (
                  <img src={form.photos[0]} className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ajouter une photo</p>
                  </>
                )}
                <input type="file" id="image-upload" hidden onChange={handleImageUpload} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {form.photos.map((img, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                    <img src={img} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                      className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProduct}
            className="w-full bg-black text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-luxury-gold transition-all flex items-center justify-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            Publier
          </button>
        </div>
      </div>
    </div>
  )


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl w-full max-w-md space-y-8 text-center animate-in fade-in zoom-in duration-500">
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-luxury-gold mb-2" style={{ fontFamily: 'Cinzel, serif' }}>LUXURY</h1>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Administration</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Utilisateur</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                value={loginForm.user}
                onChange={e => setLoginForm({ ...loginForm, user: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Mot de passe</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                value={loginForm.pass}
                onChange={e => setLoginForm({ ...loginForm, pass: e.target.value })}
              />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-luxury-gold transition-all">
              Connexion
            </button>
          </form>
        </div>
      </div>
    )
  }



  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'products': return renderProducts()
      case 'add': return renderAddProduct()
      case 'settings': return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-10">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>Configuration du Site</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Nom de la Boutique</label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Devise par défaut</label>
                  <select
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-luxury-gold transition-all cursor-pointer"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="FCFA">CFA (FCFA)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Social & Contact Section */}
            <div className="space-y-6 pt-6 border-t border-gray-50">
              <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>Contact & Réseaux</h3>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Numéro WhatsApp (Commande)</label>
                <div className="flex gap-2">
                  <span className="flex items-center justify-center w-12 bg-green-100 text-green-600 rounded-xl">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Ex: 212600000000"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Google Maps URL</label>
                  <input
                    type="text"
                    placeholder="https://maps.google.com/..."
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                    value={settings.socials.maps}
                    onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, maps: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Instagram URL</label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                    value={settings.socials.instagram}
                    onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, instagram: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">TikTok URL</label>
                  <input
                    type="text"
                    placeholder="https://tiktok.com/..."
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                    value={settings.socials.tiktok}
                    onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, tiktok: e.target.value } })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Facebook URL</label>
                  <input
                    type="text"
                    placeholder="https://facebook.com/..."
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                    value={settings.socials.facebook}
                    onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, facebook: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-50">
              <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>Maintenance & Annonces</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div>
                  <p className="font-bold text-sm text-gray-800">Mode Maintenance</p>
                  <p className="text-xs text-gray-400">Rendre le site inaccessible aux clients.</p>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  className={`w-14 h-8 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-orange-500' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Annonce d'en-tête</label>
                <input
                  type="text"
                  className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-luxury-gold transition-all"
                  value={settings.headerAnnouncement}
                  onChange={(e) => setSettings({ ...settings, headerAnnouncement: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                onClick={() => alert('Paramètres sauvegardés avec succès !')}
                className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-luxury-gold transition-all shadow-xl uppercase tracking-widest text-xs"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )
      default: return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-800">
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <div className="ml-64 pt-20">
        {renderHeader()}

        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-luxury-gold uppercase">
                  {activeTab === 'dashboard' ? 'Overview' : activeTab === 'products' ? 'Inventory' : 'Action'}
                </h2>
                <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>
                  {activeTab === 'dashboard' ? 'Tableau de bord' : activeTab === 'products' ? 'Gestion des produits' : activeTab === 'add' ? 'Nouveau parfum' : 'Paramètres'}
                </h1>
              </div>
              <div className="text-right text-[10px] text-gray-300 uppercase tracking-widest font-bold">
                Mise à jour: 24h
              </div>
            </div>

            {renderCurrentTab()}
          </div>
        </main>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:wght@300;400;600&family=Outfit:wght@300;400;600;700&display=swap');
        
        body {
          font-family: 'Outfit', sans-serif;
        }

        .font-display {
          font-family: 'Cinzel', serif;
        }

        .text-luxury-gold {
          color: #C9A227;
        }

        .bg-luxury-gold {
          background-color: #C9A227;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}