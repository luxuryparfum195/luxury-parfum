@echo off
echo ==========================================
echo   LUXURY MAGIQUE - Installation Rapide
echo ==========================================
echo.

echo [1/3] Installation d'Express...
npm install express
if %errorlevel% neq 0 (
    echo ERROR: Erreur lors de l'installation d'Express
    pause
    exit /b 1
)

echo.
echo [2/3] Installation des dépendances...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Erreur lors de l'installation
    pause
    exit /b 1
)

echo.
echo [3/3] Lancement du serveur...
echo.
echo ==========================================
echo   LUXURY MAGIQUE est prêt !
echo ==========================================
echo.
echo 🚀 Serveur démarré...
echo 📱 Site client sera disponible dans quelques secondes
echo ⚙️  Dashboard admin sera disponible dans quelques secondes
echo.
echo Attendez l'apparition des liens ci-dessous...
echo.

node server.js