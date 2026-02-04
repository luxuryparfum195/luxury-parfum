@echo off
chcp 65001 >nul
title LUXURY MAGIQUE - Installation et Démarrage
color 0A

cls
echo.
echo ============================================
echo    🚀 LUXURY MAGIQUE - NEXT.JS
echo ============================================
echo.
echo [1/4] Vérification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé !
    echo.
    echo 💡 Installez Node.js depuis :
    echo https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js trouvé
echo.

echo [2/4] Nettoyage de l'installation précédente...
if exist node_modules (
    rmdir /s /q node_modules 2>nul
)
if exist package-lock.json (
    del package-lock.json 2>nul
)
echo ✅ Nettoyage terminé
echo.

echo [3/4] Installation des dépendances...
echo ⏳ Cela peut prendre 2-3 minutes...
echo.
npm install --legacy-peer-deps --no-audit --no-fund
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation
    echo 💡 Réessayez avec : npm install --force
    pause
    exit /b 1
)
echo ✅ Dépendances installées
echo.

echo [4/4] Démarrage du serveur Next.js...
echo ⏳ Démarrage en cours...
echo.
echo ============================================
echo 🌐 LES SITES SERONT DISPONIBLES SUR :
echo ============================================
echo 📱 Site Client : http://localhost:3000
echo ⚙️  Dashboard   : http://localhost:3000/admin
echo ============================================
echo.
echo ⏳ Démarrage dans 3 secondes...
timeout /t 3 /nobreak >nul

npm run dev

if %errorlevel% neq 0 (
    echo ❌ Erreur lors du démarrage
    pause
    exit /b 1
)

pause