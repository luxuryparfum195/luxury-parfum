---
description: Guide de déploiement sur Hostinger (VPS) et configuration GitHub
---

# 🚀 Guide de déploiement : Hostinger & GitHub

Ce guide vous explique comment héberger votre site Next.js sur Hostinger (VPS) et comment lier GitHub pour des mises à jour automatiques.

## 1. Choix de l'abonnement Hostinger

Pour héberger une application Next.js (comme votre boutique), l'hébergement "Web" classique (cPanel/hPanel) ne suffit pas car il ne supporte pas Node.js de manière native et performante pour Next.js.

✅ **Ce qu'il vous faut :**
*   **VPS KVM 1** (Le moins cher, suffisant pour démarrer) ou **KVM 2**.
*   **OS à choisir lors de l'installation** : `Ubuntu 22.04 64bit with Node.js` (Hostinger propose souvent des templates pré-installés).

## 2. Lier les deux sites (Admin <-> Client)

**Oui, les deux sites sont liés.**
*   C'est le principe d'une **base de données unique**.
*   Quand vous ajoutez un parfum ou une photo dans l'Admin, l'information est enregistrée dans la base de données (Supabase ou base locale).
*   Le site Client lit cette même base de données.
*   **Résultat :** Dès que vous cliquez sur "Enregistrer" dans l'admin, le produit apparaît INSTANTANÉMENT sur le site client. Pas besoin de redéployer pour ça.

## 3. Lier GitHub à Antigravity (VS Code)

Pour que je (l'IA) puisse vous aider à "pusher" votre code, vous devez être connecté à GitHub dans votre éditeur.

1.  Dans VS Code, cliquez sur l'icône **Comptes** (le bonhomme en bas à gauche de la barre latérale).
2.  Cliquez sur **"Sign in with GitHub"**.
3.  Une fenêtre web va s'ouvrir, autorisez l'accès.

Une fois connecté, pour sauvegarder vos modifications sur GitHub à l'avenir, il suffira que je lance les commandes `git add`, `git commit`, et `git push`.

## 4. Automatiser le déploiement (GitHub Actions -> Hostinger)

C'est la partie "magique". On va configurer GitHub pour qu'à chaque fois que vous faites une mise à jour, Hostinger télécharge le nouveau code tout seul.

### Sur votre VPS Hostinger (via Terminal/SSH) :
*Vous recevrez les accès SSH par mail de Hostinger.*

1.  Connectez-vous : `ssh root@votre_ip_vps` (Mot de passe défini lors de l'achat).
2.  Installez Git, Node.js et PM2 (gestionnaire de processus) :
    ```bash
    apt update && apt upgrade -y
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt install -y nodejs git
    npm install -g pm2
    ```
3.  Clonez votre projet (la première fois seulement) :
    ```bash
    git clone https://github.com/VOTRE_PSEUDO/NOM_DU_REPO.git /var/www/boutique-amir
    ```
4.  Lancez le site :
    ```bash
    cd /var/www/boutique-amir
    npm install
    npm run build
    pm2 start npm --name "boutique-amir" -- start
    ```

### Sur GitHub (Le fichier magique) :
Je peux créer pour vous un fichier `.github/workflows/deploy.yml` qui dira à GitHub :
*"Dès qu'il y a du nouveau code, connecte-toi au VPS Hostinger et mets à jour le site."*

---

**Voulez-vous que je prépare ce fichier de configuration GitHub Actions maintenant ?**
Il me faudra juste (plus tard) que vous ajoutiez vos clés secrètes (SSH KEY, IP) dans les paramètres de votre dépôt GitHub.
