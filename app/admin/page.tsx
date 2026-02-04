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
  Edit2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

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
  image_url_3: string
  stock_ml: number
  min_achat_ml: number
  max_achat_ml: number
  est_disponible: boolean
  created_at: string
}

interface SiteSettings {
  id: number
  site_name: string
  currency: string
  whatsapp_number: string
  header_announcement: string
  social_maps: string
  social_tiktok: string
  social_instagram: string
  social_facebook: string
  taux_usd: number
  taux_fcfa: number
  maintenance_mode: boolean
}

// Constantes
const categories = ['Homme', 'Femme', 'Unisexe', 'Oriental', 'Boisé', 'Frais', 'Floral', 'Ambré']
const occasionsList = ['Mariage', 'Réunion', 'Sortie', 'Travail', 'Soirée', 'Quotidien']

export default function AdminDashboard() {
  // Navigation
  const [activeTab, setActiveTab] = useState('dashboard')

  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Data
  const [parfums, setParfums] = useState<Parfum[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [editingParfum, setEditingParfum] = useState<Parfum | null>(null)

  // Form pour nouveau/edit parfum
  const [form, setForm] = useState({
    nom: '',
    description: '',
    prix_eur: '',
    categorie: 'Unisexe',
    notes_olfactives: [] as string[],
    occasions: [] as string[],
    image_url_1: '',
    image_url_2: '',
    image_url_3: '',
    stock_ml: '100',
    min_achat_ml: '5',
    max_achat_ml: '100',
    est_disponible: true
  })

  const [noteInput, setNoteInput] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  // ============================================
  // AUTH - Vérification session
  // ============================================
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setIsAuthenticated(true)
          await loadData()
        }
      } catch (error) {
        console.error('Erreur session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session)
      if (session) {
        await loadData()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // ============================================
  // DATA - Chargement des données
  // ============================================
  const loadData = async () => {
    await Promise.all([loadParfums(), loadSettings()])
  }

  const loadParfums = async () => {
    const { data, error } = await supabase
      .from('parfums')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur chargement parfums:', error)
      return
    }
    setParfums(data || [])
  }

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Erreur chargement settings:', error)
      return
    }
    if (data) setSettings(data)
  }

  // ============================================
  // AUTH - Login/Logout
  // ============================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      })

      if (error) {
        if (error.message.includes('Invalid login')) {
          setLoginError('Email ou mot de passe incorrect')
        } else {
          setLoginError(error.message)
        }
      }
    } catch (error) {
      setLoginError('Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setParfums([])
    setSettings(null)
  }

  // ============================================
  // PARFUMS - CRUD
  // ============================================
  const resetForm = () => {
    setForm({
      nom: '',
      description: '',
      prix_eur: '',
      categorie: 'Unisexe',
      notes_olfactives: [],
      occasions: [],
      image_url_1: '',
      image_url_2: '',
      image_url_3: '',
      stock_ml: '100',
      min_achat_ml: '5',
      max_achat_ml: '100',
      est_disponible: true
    })
    setEditingParfum(null)
    setNoteInput('')
  }

  const handleEditParfum = (parfum: Parfum) => {
    setEditingParfum(parfum)
    setForm({
      nom: parfum.nom,
      description: parfum.description || '',
      prix_eur: parfum.prix_eur.toString(),
      categorie: parfum.categorie,
      notes_olfactives: parfum.notes_olfactives || [],
      occasions: parfum.occasions || [],
      image_url_1: parfum.image_url_1 || '',
      image_url_2: parfum.image_url_2 || '',
      image_url_3: parfum.image_url_3 || '',
      stock_ml: parfum.stock_ml.toString(),
      min_achat_ml: parfum.min_achat_ml.toString(),
      max_achat_ml: parfum.max_achat_ml.toString(),
      est_disponible: parfum.est_disponible
    })
    setActiveTab('add')
  }

  const handleSaveParfum = async () => {
    if (!form.nom || !form.prix_eur) {
      setSaveMessage('Veuillez remplir le nom et le prix')
      return
    }

    const parfumData = {
      nom: form.nom,
      description: form.description,
      prix_eur: parseFloat(form.prix_eur),
      categorie: form.categorie,
      notes_olfactives: form.notes_olfactives,
      occasions: form.occasions,
      image_url_1: form.image_url_1,
      image_url_2: form.image_url_2,
      image_url_3: form.image_url_3,
      stock_ml: parseInt(form.stock_ml) || 100,
      min_achat_ml: parseInt(form.min_achat_ml) || 5,
      max_achat_ml: parseInt(form.max_achat_ml) || 100,
      est_disponible: form.est_disponible
    }

    try {
      if (editingParfum) {
        // UPDATE
        const { error } = await supabase
          .from('parfums')
          .update(parfumData)
          .eq('id', editingParfum.id)

        if (error) throw error
        setSaveMessage('Parfum mis à jour avec succès !')
      } else {
        // INSERT
        const { error } = await supabase
          .from('parfums')
          .insert([parfumData])

        if (error) throw error
        setSaveMessage('Parfum ajouté avec succès !')
      }

      await loadParfums()
      setTimeout(() => {
        resetForm()
        setActiveTab('products')
        setSaveMessage('')
      }, 1500)
    } catch (error: any) {
      setSaveMessage(`Erreur: ${error.message}`)
    }
  }

  const handleDeleteParfum = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce parfum ?')) return

    try {
      const { error } = await supabase
        .from('parfums')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadParfums()
    } catch (error: any) {
      alert(`Erreur: ${error.message}`)
    }
  }

  const toggleDisponibilite = async (parfum: Parfum) => {
    try {
      const { error } = await supabase
        .from('parfums')
        .update({ est_disponible: !parfum.est_disponible })
        .eq('id', parfum.id)

      if (error) throw error
      await loadParfums()
    } catch (error: any) {
      alert(`Erreur: ${error.message}`)
    }
  }

  // ============================================
  // SETTINGS - Save
  // ============================================
  const handleSaveSettings = async () => {
    if (!settings) return

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 1,
          ...settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      setSaveMessage('Paramètres sauvegardés !')
      setTimeout(() => setSaveMessage(''), 2000)
    } catch (error: any) {
      setSaveMessage(`Erreur: ${error.message}`)
    }
  }

  // ============================================
  // HELPERS
  // ============================================
  const formatPrice = (priceEur: number, currency: string = 'EUR') => {
    const rates = {
      EUR: 1,
      USD: settings?.taux_usd || 1.08,
      FCFA: settings?.taux_fcfa || 655.957
    }
    const converted = priceEur * (rates[currency as keyof typeof rates] || 1)

    if (currency === 'FCFA') {
      return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(converted) + ' FCFA'
    }
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(converted)
  }

  const addNote = () => {
    if (noteInput.trim() && !form.notes_olfactives.includes(noteInput.trim())) {
      setForm({ ...form, notes_olfactives: [...form.notes_olfactives, noteInput.trim()] })
      setNoteInput('')
    }
  }

  const removeNote = (note: string) => {
    setForm({ ...form, notes_olfactives: form.notes_olfactives.filter(n => n !== note) })
  }

  const toggleOccasion = (occasion: string) => {
    if (form.occasions.includes(occasion)) {
      setForm({ ...form, occasions: form.occasions.filter(o => o !== occasion) })
    } else {
      setForm({ ...form, occasions: [...form.occasions, occasion] })
    }
  }

  // ============================================
  // STATS
  // ============================================
  const stats = [
    { title: 'Total Parfums', value: parfums.length.toString(), icon: Package, color: 'bg-blue-50 text-blue-600' },
    { title: 'Disponibles', value: parfums.filter(p => p.est_disponible).length.toString(), icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
    { title: 'Stock Faible (<30ml)', value: parfums.filter(p => p.stock_ml < 30).length.toString(), icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
    { title: 'Rupture (0ml)', value: parfums.filter(p => p.stock_ml === 0).length.toString(), icon: X, color: 'bg-red-50 text-red-600' },
  ]

  // ============================================
  // RENDER - Loading
  // ============================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER - Login
  // ============================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl w-full max-w-md space-y-8 shadow-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-widest text-[#C9A227] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>LUXURY</h1>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">Administration</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
              <input
                type="email"
                placeholder="admin@luxuryparfum.fr"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all pr-12"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:shadow-xl hover:shadow-[#C9A227]/20 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400">
            Créez un compte admin dans Supabase Authentication
          </p>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER - Sidebar
  // ============================================
  const renderSidebar = () => (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 p-6 flex flex-col z-50 shadow-xl">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-bold tracking-widest text-[#C9A227]" style={{ fontFamily: 'Cinzel, serif' }}>LUXURY</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'products', label: 'Produits', icon: Package },
          { id: 'add', label: editingParfum ? 'Modifier' : 'Ajouter', icon: PlusCircle },
          { id: 'settings', label: 'Paramètres', icon: SettingsIcon },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'add' && activeTab !== 'add') resetForm()
              setActiveTab(item.id)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
                ? 'bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-white shadow-lg'
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

  // ============================================
  // RENDER - Dashboard
  // ============================================
  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'Cinzel, serif' }}>Derniers Parfums</h3>
        <div className="space-y-4">
          {parfums.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
              <div className="flex items-center gap-4">
                <img src={p.image_url_1 || 'https://via.placeholder.com/48'} className="w-12 h-12 rounded-xl object-cover" alt={p.nom} />
                <div>
                  <p className="font-bold text-gray-800">{p.nom}</p>
                  <p className="text-xs text-gray-400">{p.categorie} • Stock: {p.stock_ml}ml</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#C9A227]">{formatPrice(p.prix_eur)}/ml</p>
                <p className="text-xs text-gray-400">
                  ≈ {formatPrice(p.prix_eur, 'USD')} • {formatPrice(p.prix_eur, 'FCFA')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER - Products List
  // ============================================
  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-500">{parfums.length} parfum(s) au total</p>
        <button
          onClick={() => { resetForm(); setActiveTab('add') }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Nouveau Parfum
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Produit</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Prix (EUR/USD/FCFA)</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Stock</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Statut</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {parfums.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={p.image_url_1 || 'https://via.placeholder.com/48'} className="w-14 h-14 rounded-xl object-cover" alt={p.nom} />
                      <div>
                        <p className="font-bold text-gray-800">{p.nom}</p>
                        <p className="text-xs text-gray-400">{p.categorie}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#C9A227]">{formatPrice(p.prix_eur)}/ml</p>
                    <p className="text-xs text-gray-400">{formatPrice(p.prix_eur, 'USD')} • {formatPrice(p.prix_eur, 'FCFA')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${p.stock_ml === 0 ? 'bg-red-100 text-red-600' :
                        p.stock_ml < 30 ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                      }`}>
                      {p.stock_ml} ml
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleDisponibilite(p)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${p.est_disponible
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                      {p.est_disponible ? 'Disponible' : 'Indisponible'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditParfum(p)}
                        className="p-2 text-gray-400 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded-lg transition-all"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteParfum(p.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {parfums.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Aucun parfum dans la base de données</p>
            <button
              onClick={() => setActiveTab('add')}
              className="text-[#C9A227] font-bold hover:underline"
            >
              Ajouter votre premier parfum
            </button>
          </div>
        )}
      </div>
    </div>
  )

  // ============================================
  // RENDER - Add/Edit Product
  // ============================================
  const renderAddProduct = () => (
    <div className="max-w-5xl mx-auto space-y-8">
      {saveMessage && (
        <div className={`p-4 rounded-xl text-center font-bold ${saveMessage.includes('Erreur') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold" style={{ fontFamily: 'Cinzel, serif' }}>
              {editingParfum ? 'Modifier le Parfum' : 'Nouveau Parfum'}
            </h3>

            {/* Nom */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Nom du parfum *</label>
              <input
                type="text"
                placeholder="Ex: Nuit de Diamant"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
              />
            </div>

            {/* Prix et Catégorie */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Prix par ml (EUR) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="2.50"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                  value={form.prix_eur}
                  onChange={e => setForm({ ...form, prix_eur: e.target.value })}
                />
                {form.prix_eur && (
                  <p className="text-xs text-gray-400">
                    ≈ {formatPrice(parseFloat(form.prix_eur) || 0, 'USD')} • {formatPrice(parseFloat(form.prix_eur) || 0, 'FCFA')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Catégorie</label>
                <select
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all cursor-pointer"
                  value={form.categorie}
                  onChange={e => setForm({ ...form, categorie: e.target.value })}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Stock */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Stock (ml)</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                  value={form.stock_ml}
                  onChange={e => setForm({ ...form, stock_ml: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Min achat (ml)</label>
                <input
                  type="number"
                  placeholder="5"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                  value={form.min_achat_ml}
                  onChange={e => setForm({ ...form, min_achat_ml: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Max achat (ml)</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                  value={form.max_achat_ml}
                  onChange={e => setForm({ ...form, max_achat_ml: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Description</label>
              <textarea
                rows={4}
                placeholder="Décrivez ce parfum..."
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all resize-none"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Notes olfactives */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Notes olfactives</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Rose, Oud, Vanille..."
                  className="flex-1 px-5 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addNote())}
                />
                <button
                  type="button"
                  onClick={addNote}
                  className="px-4 py-3 bg-[#C9A227] text-white rounded-xl font-bold hover:bg-[#8B6914] transition-all"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.notes_olfactives.map(note => (
                  <span key={note} className="flex items-center gap-2 px-3 py-1.5 bg-[#C9A227]/10 text-[#C9A227] rounded-full text-sm font-medium">
                    {note}
                    <button onClick={() => removeNote(note)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Occasions</label>
              <div className="flex flex-wrap gap-2">
                {occasionsList.map(occ => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => toggleOccasion(occ)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${form.occasions.includes(occ)
                        ? 'bg-[#C9A227] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Colonne latérale - Images */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-[#C9A227]" style={{ fontFamily: 'Cinzel, serif' }}>Images</h3>

            {/* Image 1 Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Image principale</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-[#C9A227] transition-all text-center cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return

                    const fileExt = file.name.split('.').pop()
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                    const filePath = `${fileName}`

                    try {
                      // Upload to Supabase Storage
                      const { error: uploadError } = await supabase.storage
                        .from('parfums')
                        .upload(filePath, file)

                      if (uploadError) throw uploadError

                      // Get Public URL
                      const { data: { publicUrl } } = supabase.storage
                        .from('parfums')
                        .getPublicUrl(filePath)

                      setForm({ ...form, image_url_1: publicUrl })
                    } catch (error: any) {
                      alert('Erreur upload: ' + error.message)
                    }
                  }}
                />
                {form.image_url_1 ? (
                  <div className="relative h-40 w-full">
                    <img src={form.image_url_1} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity rounded-lg">
                      Changer l'image
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Cliquez pour téléverser une image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 2MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Disponibilité */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="font-bold text-sm text-gray-800">Disponible à la vente</p>
                <p className="text-xs text-gray-400">Afficher sur le site client</p>
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, est_disponible: !form.est_disponible })}
                className={`w-14 h-8 rounded-full transition-all relative ${form.est_disponible ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow ${form.est_disponible ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveParfum}
              className="w-full bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-white py-5 rounded-2xl font-bold uppercase tracking-[0.15em] shadow-xl hover:shadow-2xl hover:shadow-[#C9A227]/30 transition-all flex items-center justify-center gap-3"
            >
              <Save className="w-5 h-5" />
              {editingParfum ? 'Mettre à jour' : 'Publier'}
            </button>

            {editingParfum && (
              <button
                onClick={resetForm}
                className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER - Settings
  // ============================================
  const renderSettings = () => (
    <div className="max-w-3xl mx-auto space-y-8">
      {saveMessage && (
        <div className={`p-4 rounded-xl text-center font-bold ${saveMessage.includes('Erreur') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
          {saveMessage}
        </div>
      )}

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-10">
        {/* Configuration générale */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>Configuration du Site</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Nom de la Boutique</label>
              <input
                type="text"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                value={settings?.site_name || ''}
                onChange={e => setSettings(s => s ? { ...s, site_name: e.target.value } : s)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Devise par défaut</label>
              <select
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all cursor-pointer"
                value={settings?.currency || 'EUR'}
                onChange={e => setSettings(s => s ? { ...s, currency: e.target.value } : s)}
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="FCFA">FCFA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Taux de change */}
        <div className="space-y-6 pt-6 border-t border-gray-100">
          <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>Taux de Change</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">1 EUR = ? USD</label>
              <input
                type="number"
                step="0.0001"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                value={settings?.taux_usd || 1.08}
                onChange={e => setSettings(s => s ? { ...s, taux_usd: parseFloat(e.target.value) } : s)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">1 EUR = ? FCFA</label>
              <input
                type="number"
                step="0.001"
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                value={settings?.taux_fcfa || 655.957}
                onChange={e => setSettings(s => s ? { ...s, taux_fcfa: parseFloat(e.target.value) } : s)}
              />
            </div>
          </div>
        </div>

        {/* Contact & Réseaux */}
        <div className="space-y-6 pt-6 border-t border-gray-100">
          <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>Contact & Réseaux</h3>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">WhatsApp (pour commandes)</label>
            <input
              type="text"
              placeholder="212600000000"
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
              value={settings?.whatsapp_number || ''}
              onChange={e => setSettings(s => s ? { ...s, whatsapp_number: e.target.value } : s)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Instagram</label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                value={settings?.social_instagram || ''}
                onChange={e => setSettings(s => s ? { ...s, social_instagram: e.target.value } : s)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Facebook</label>
              <input
                type="url"
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                value={settings?.social_facebook || ''}
                onChange={e => setSettings(s => s ? { ...s, social_facebook: e.target.value } : s)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">TikTok</label>
              <input
                type="url"
                placeholder="https://tiktok.com/..."
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                value={settings?.social_tiktok || ''}
                onChange={e => setSettings(s => s ? { ...s, social_tiktok: e.target.value } : s)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Google Maps</label>
              <input
                type="url"
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
                value={settings?.social_maps || ''}
                onChange={e => setSettings(s => s ? { ...s, social_maps: e.target.value } : s)}
              />
            </div>
          </div>
        </div>

        {/* Annonce */}
        <div className="space-y-6 pt-6 border-t border-gray-100">
          <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>Annonce en-tête</h3>
          <input
            type="text"
            placeholder="Ex: Livraison gratuite ce mois-ci !"
            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#C9A227] outline-none transition-all"
            value={settings?.header_announcement || ''}
            onChange={e => setSettings(s => s ? { ...s, header_announcement: e.target.value } : s)}
          />

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
              <p className="font-bold text-sm text-gray-800">Mode Maintenance</p>
              <p className="text-xs text-gray-400">Rendre le site inaccessible aux clients</p>
            </div>
            <button
              onClick={() => setSettings(s => s ? { ...s, maintenance_mode: !s.maintenance_mode } : s)}
              className={`w-14 h-8 rounded-full transition-all relative ${settings?.maintenance_mode ? 'bg-orange-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow ${settings?.maintenance_mode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <div className="pt-6 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-3 bg-gradient-to-r from-[#C9A227] to-[#8B6914] text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-[#C9A227]/20 transition-all uppercase tracking-widest text-xs"
          >
            <Save className="w-5 h-5" />
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER - Main
  // ============================================
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {renderSidebar()}

      <div className="ml-64">
        {/* Header */}
        <header className="sticky top-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-[#C9A227] uppercase">
              {activeTab === 'dashboard' ? 'Vue d\'ensemble' :
                activeTab === 'products' ? 'Inventaire' :
                  activeTab === 'add' ? (editingParfum ? 'Modification' : 'Création') : 'Configuration'}
            </h2>
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Cinzel, serif' }}>
              {activeTab === 'dashboard' ? 'Tableau de bord' :
                activeTab === 'products' ? 'Gestion des produits' :
                  activeTab === 'add' ? (editingParfum ? `Modifier: ${editingParfum.nom}` : 'Nouveau parfum') : 'Paramètres'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Admin</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Connecté</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A227] to-[#8B6914] flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'add' && renderAddProduct()}
          {activeTab === 'settings' && renderSettings()}
        </main>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Outfit', sans-serif; }
      `}</style>
    </div>
  )
}