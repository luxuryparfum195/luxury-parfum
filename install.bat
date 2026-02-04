@echo off
echo ==========================================
echo   LUXURY MAGIQUE - Installation
echo ==========================================
echo.

echo [1/5] Verification de Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js n'est pas installe. Installez-le d'abord depuis https://nodejs.org
    pause
    exit /b 1
)

echo [2/5] Installation des dependances...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Erreur lors de l'installation des dependances
    pause
    exit /b 1
)

echo.
echo [3/5] Creation du fichier .env.local...
if not exist .env.local (
    copy .env.example .env.local
    echo Fichier .env.local cree avec succes
) else (
    echo Le fichier .env.local existe deja
)

echo.
echo [4/5] Configuration de Supabase...
echo.
echo IMPORTANT: Assurez-vous d'avoir:
echo 1. Un compte Supabase: https://supabase.com
echo 2. Cree une table 'parfums' avec la structure suivante:
echo.
echo CREATE TABLE parfums (
echo   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
echo   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
echo   nom TEXT NOT NULL,
echo   description TEXT,
echo   prix_par_ml NUMERIC NOT NULL,
echo   image_url_1 TEXT NOT NULL,
echo   image_url_2 TEXT,
echo   stock_max_ml INTEGER NOT NULL,
echo   min_achat_ml INTEGER NOT NULL,
echo   notes_olfactives TEXT[]
echo );
echo.
echo ALTER TABLE parfums ENABLE ROW LEVEL SECURITY;
echo.
echo CREATE POLICY "Public read access" 
echo ON parfums FOR SELECT TO public USING (true);
echo.

echo [5/5] Lancement du serveur...
echo.
echo ==========================================
echo   Installation terminee!
echo ==========================================
echo.
echo Pour lancer le projet, executez:
echo   npm run dev
echo.
echo Puis ouvrez votre navigateur sur:
echo   http://localhost:3000
echo.
pause