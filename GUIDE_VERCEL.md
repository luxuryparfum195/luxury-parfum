# 🚀 Guide de Déploiement sur Vercel - LUXURY PARFUM

## ✅ Pré-requis
- Un compte Vercel (gratuit) : https://vercel.com/signup
- Un compte GitHub (gratuit) : https://github.com/signup
- Votre nom de domaine acheté sur Vercel

---

## 📋 Étape 1 : Préparer le projet pour GitHub

### 1.1 Créer un compte GitHub si ce n'est pas déjà fait
Allez sur https://github.com et créez un compte gratuit.

### 1.2 Installer Git (si pas déjà fait)
Téléchargez Git ici : https://git-scm.com/download/win

### 1.3 Pousser votre code sur GitHub
Ouvrez PowerShell dans le dossier du projet et exécutez :

```powershell
# Initialiser Git (déjà fait si .git existe)
git init

# Ajouter tous les fichiers
git add .

# Créer un commit
git commit -m "Initial commit - Luxury Parfum"

# Créer un nouveau repo sur GitHub, puis :
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/luxury-parfum.git
git push -u origin main
```

---

## 📋 Étape 2 : Déployer sur Vercel

### 2.1 Connecter GitHub à Vercel
1. Allez sur https://vercel.com/login
2. Cliquez sur "Continue with GitHub"
3. Autorisez Vercel à accéder à vos repositories

### 2.2 Importer le projet
1. Cliquez sur "Add New..." → "Project"
2. Sélectionnez votre repository "luxury-parfum"
3. Cliquez sur "Import"

### 2.3 Configurer les variables d'environnement
**TRÈS IMPORTANT !** Avant de déployer, ajoutez vos variables :

1. Dans la section "Environment Variables", cliquez sur "Add"
2. Ajoutez ces variables :

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ktwcpeibhoirynskkhpw.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (votre clé complète) |
| `NEXT_PUBLIC_APP_URL` | `https://votre-domaine.com` |

### 2.4 Déployer
1. Cliquez sur "Deploy"
2. Attendez que le build se termine (2-3 minutes)
3. Votre site sera accessible sur une URL temporaire type : `luxury-parfum-xxx.vercel.app`

---

## 📋 Étape 3 : Configurer votre nom de domaine

### 3.1 Ajouter le domaine à votre projet
1. Allez dans votre projet Vercel
2. Cliquez sur "Settings" → "Domains"
3. Entrez votre nom de domaine acheté
4. Cliquez sur "Add"

### 3.2 Si vous avez acheté le domaine SUR Vercel
✅ La configuration DNS est automatique ! Votre site sera disponible immédiatement.

### 3.3 Si vous avez acheté le domaine AILLEURS (ex: OVH, Hostinger, GoDaddy)
Vous devez configurer les DNS manuellement :

1. Vercel vous donnera des enregistrements DNS à ajouter
2. Allez dans le panneau de contrôle de votre registrar
3. Ajoutez les enregistrements (type A ou CNAME selon ce que Vercel demande)

**Exemple typique :**
- Type: `A` | Name: `@` | Value: `76.76.21.21`
- Type: `CNAME` | Name: `www` | Value: `cname.vercel-dns.com`

---

## ✅ Vérifications après déploiement

1. **Page principale** : `https://votre-domaine.com/` - Doit afficher la boutique
2. **Page admin** : `https://votre-domaine.com/admin` - Doit afficher le login admin
3. **Test mobile** : Vérifiez sur votre téléphone

---

## 🔧 En cas de problème

### Le build échoue ?
- Vérifiez les logs dans Vercel
- Assurez-vous que toutes les variables d'environnement sont configurées

### Le site affiche une erreur ?
- Vérifiez que les variables Supabase sont correctes
- Essayez de faire un "Redeploy" avec "Clear Build Cache"

### Les images ne s'affichent pas ?
- Les images sont hébergées sur `postimg.cc`, elles devraient fonctionner

---

## 📞 Informations de connexion Admin

- **URL Admin** : `https://votre-domaine.com/admin`
- **Utilisateur** : `Amir2026`
- **Mot de passe** : `Amir2026`

> ⚠️ Changez ces identifiants après le déploiement en production !

---

## 🎉 Félicitations !

Votre boutique de parfums de luxe est maintenant en ligne ! 🚀

---

*Dernière mise à jour : 4 Février 2026*
