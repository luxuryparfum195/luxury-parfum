# 🤝 Guide Contribution - LUXURY MAGIQUE

Merci de votre intérêt à contribuer à LUXURY MAGIQUE!

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Connaissance de React/Next.js
- Connaissance de TypeScript
- Connaissance de Tailwind CSS

## 🚀 Installation

1. Fork le projet
2. Clonez votre fork:
```bash
git clone https://github.com/VOTRE_USERNAME/luxury-magique.git
cd luxury-magique
```

3. Installez les dépendances:
```bash
npm install
```

4. Créez votre branche:
```bash
git checkout -b feature/ma-nouvelle-fonctionnalité
```

## 🏗️ Structure du Projet

```
BOUTIQUE AMIR/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page principale (site client)
│   ├── admin/              # Pages admin (à venir)
│   ├── layout.tsx          # Layout global
│   └── globals.css        # Styles globaux + animations
├── components/             # Composants React
│   ├── Header.tsx         # Navigation site client
│   ├── ProductCard.tsx    # Cartes 3D avec flip animation
│   └── admin/              # Composants admin
│       └── AdminHeader.tsx
├── ui/                     # Composants shadcn/ui
│   └── button.tsx         # Button luxury
├── lib/                    # Utilitaires
│   ├── supabase.ts        # Client Supabase
│   ├── utils.ts           # Fonctions helpers
│   ├── translations.ts    # Traductions client
│   └── adminTranslations.ts # Traductions admin
├── store/                  # Zustand stores
│   ├── useStore.ts        # Store client
│   └── useAdminStore.ts   # Store admin
├── types/                  # Types TypeScript
│   └── index.ts           # Interfaces
└── public/                 # Assets statiques
```

## 🎨 Conventions de Code

### TypeScript
- Toujours utiliser des types stricts
- Définir les interfaces pour tous les composants
- Utiliser les generics quand nécessaire
- Éviter `any` autant que possible

### React
- Utiliser les composants fonctionnels avec hooks
- Utiliser `framer-motion` pour les animations
- Séparer les composants de présentation et logique
- Utiliser `Zustand` pour le state global

### Styling
- Utiliser Tailwind CSS
- Ajouter des animations dans `globals.css`
- Utiliser les couleurs customisées du `tailwind.config.ts`
- Respecter les thèmes dynamiques (FR/AR/EN)

### Conventions de Nommage

#### Fichiers
- Composants: `PascalCase.tsx`
- Utils: `camelCase.ts`
- Hooks: `camelCase.ts`
- Types: `PascalCase.ts`

#### Variables
- Composants: `PascalCase`
- Variables: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Types: `PascalCase`

#### Classes CSS
- Utiliser Tailwind autant que possible
- Pour les styles custom, utiliser kebab-case
- Préfixer avec `luxury-` pour les custom

## 🔧 Développement

### Lancer le serveur de développement
```bash
npm run dev
```

### Lancer les tests (à venir)
```bash
npm run test
```

### Lancer le linting (à venir)
```bash
npm run lint
```

### Build pour production
```bash
npm run build
```

## 📝 Commit Messages

Utilisez le format Conventional Commits:

```
feat: ajouter la modal produit
fix: corriger le bug du panier
docs: mettre à jour le README
style: formater le code
refactor: refactoriser le store Zustand
test: ajouter des tests pour ProductCard
chore: mettre à jour les dépendances
```

## 🎯 Développement de Nouvelles Fonctionnalités

1. Créez une branche depuis `main`
2. Développez la fonctionnalité
3. Ajoutez des tests si applicable
4. Mettez à jour la documentation
5. Créez un Pull Request

### Exemple: Ajouter une nouvelle page

1. Créez le fichier dans `app/`:
```typescript
// app/nouvelle-page/page.tsx
export default function NouvellePage() {
  return <div>Nouvelle page</div>
}
```

2. Ajoutez la navigation dans `components/Header.tsx`
3. Mettez à jour les traductions dans `lib/translations.ts`
4. Testez sur mobile et desktop
5. Faites un commit avec un message clair

## 🎨 Ajouter des Animations

### Utiliser Framer Motion
```typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  Contenu
</motion.div>
```

### Ajouter une animation CSS
```css
/* globals.css */
@keyframes custom-animation {
  0% { transform: translateX(0); }
  100% { transform: translateX(100px); }
}

.custom-anim {
  animation: custom-animation 2s infinite;
}
```

### Ajouter une animation au tailwind.config.ts
```typescript
animation: {
  'custom-anim': 'custom-animation 2s infinite',
},
```

## 🌍 Ajouter une Nouvelle Langue

1. Ajoutez la langue au type `Language` dans `types/index.ts`
2. Ajoutez les traductions dans `lib/translations.ts`
3. Ajoutez les couleurs du thème dans `tailwind.config.ts`
4. Mettez à jour les composants pour supporter la nouvelle langue
5. Mettez à jour la documentation

## 🐛 Signaler des Bugs

Avant de signaler un bug:

1. Vérifiez si le bug existe déjà dans les issues
2. Décrivez le bug en détail
3. Fournissez les étapes pour reproduire
4. Donnez votre environnement:
   - OS
   - Version de Node.js
   - Navigateur
   - Version du projet

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [Supabase Documentation](https://supabase.com/docs)

## 🤔 Questions?

N'hésitez pas à ouvrir une issue pour poser vos questions!

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Fait avec ❤️ pour l'excellence en haute couture**