# 🚀 Installation Rapide - LUXURY MAGIQUE

## 1️⃣ Prérequis

- **Node.js 18+** - [Télécharger ici](https://nodejs.org)
- **Un compte Supabase** - [Créer gratuitement](https://supabase.com)

## 2️⃣ Installation (Windows)

Double-cliquez sur `install.bat` et suivez les instructions

## 3️⃣ Installation (Mac/Linux)

```bash
# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Lancer le serveur
npm run dev
```

## 4️⃣ Configuration Supabase

### Option A: Utiliser les clés par défaut
Les clés sont déjà configurées dans `.env.example`!

### Option B: Utiliser votre propre Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans "SQL Editor" et exécutez:

```sql
CREATE TABLE parfums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nom TEXT NOT NULL,
  description TEXT,
  prix_par_ml NUMERIC NOT NULL,
  image_url_1 TEXT NOT NULL,
  image_url_2 TEXT,
  stock_max_ml INTEGER NOT NULL,
  min_achat_ml INTEGER NOT NULL,
  notes_olfactives TEXT[]
);

ALTER TABLE parfums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" 
ON parfums FOR SELECT TO public USING (true);
```

4. Copiez votre URL et clé Anon depuis "Project Settings" > "API"
5. Mettez à jour `.env.local` avec vos clés

## 5️⃣ Lancer le site

```bash
npm run dev
```

Ouvrez http://localhost:3000

## 🎯 Structure du Projet

```
BOUTIQUE AMIR/
├── app/                    # Pages Next.js
│   ├── page.tsx           # Site client
│   ├── admin/              # Dashboard admin (à créer)
│   └── globals.css        # Styles globaux
├── components/             # Composants React
│   ├── Header.tsx         # Navigation client
│   ├── admin/              # Composants admin
│   │   └── AdminHeader.tsx
│   └── ProductCard.tsx    # Cartes produits
├── ui/                     # Shadcn/ui components
│   └── button.tsx         # Button luxury
├── lib/                    # Utilitaires
│   ├── supabase.ts        # Client Supabase
│   ├── utils.ts           # Helpers
│   └── translations.ts    # Traductions
├── store/                  # Zustand stores
│   ├── useStore.ts        # Store client
│   └── useAdminStore.ts   # Store admin
└── public/                 # Assets statiques
```

## 📱 Fonctionnalités

### Site Client
- ✅ 3 thèmes dynamiques (FR/AR/EN)
- ✅ Animations 3D puissantes
- ✅ Panier dynamique
- ✅ Modal produit avec slider
- ✅ Navigation SPA fluide

### Site Admin (à créer)
- ⏳ Dashboard avec stats
- ⏳ CRUD parfums
- ⏳ Gestion commandes
- ⏳ Analytics

## 🎨 Personnalisation

### Changer les couleurs
Modifiez `tailwind.config.ts`:
```typescript
colors: {
  luxury: {
    gold: { /* couleurs or */ },
    black: { /* couleurs noir */ },
    cream: { /* couleurs crème */ },
  }
}
```

### Ajouter des animations
Voir `components/ProductCard.tsx` et `app/globals.css`

### Modifier les traductions
Éditez `lib/translations.ts`

## 🐛 Résolution de Problèmes

### Erreur "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erreur Supabase
- Vérifiez les variables d'environnement dans `.env.local`
- Vérifiez que la table `parfums` existe dans Supabase

### Animations lentes
- Désactivez les animations dans `tailwind.config.ts`

## 📞 Support

Pour l'aide:
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Framer Motion](https://www.framer.com/motion)

---

**Développé avec ❤️ pour l'excellence**