#!/bin/bash

echo "=========================================="
echo "  LUXURY MAGIQUE - Installation"
echo "=========================================="
echo ""

# Check Node.js
echo "[1/5] Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js n'est pas installé. Installez-le depuis https://nodejs.org"
    exit 1
fi
node --version

# Install dependencies
echo ""
echo "[2/5] Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Erreur lors de l'installation des dépendances"
    exit 1
fi

# Create .env.local
echo ""
echo "[3/5] Création du fichier .env.local..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "Fichier .env.local créé avec succès"
else
    echo "Le fichier .env.local existe déjà"
fi

# Show Supabase instructions
echo ""
echo "[4/5] Configuration de Supabase..."
echo ""
echo "IMPORTANT: Assurez-vous d'avoir:"
echo "1. Un compte Supabase: https://supabase.com"
echo "2. Créez une table 'parfums' avec la structure suivante:"
echo ""
echo "CREATE TABLE parfums ("
echo "  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,"
echo "  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),"
echo "  nom TEXT NOT NULL,"
echo "  description TEXT,"
echo "  prix_par_ml NUMERIC NOT NULL,"
echo "  image_url_1 TEXT NOT NULL,"
echo "  image_url_2 TEXT,"
echo "  stock_max_ml INTEGER NOT NULL,"
echo "  min_achat_ml INTEGER NOT NULL,"
echo "  notes_olfactives TEXT[]"
echo ");"
echo ""
echo "ALTER TABLE parfums ENABLE ROW LEVEL SECURITY;"
echo ""
echo "CREATE POLICY \"Public read access\""
echo "ON parfums FOR SELECT TO public USING (true);"
echo ""

echo "[5/5] Lancement du serveur..."
echo ""
echo "=========================================="
echo "  Installation terminée!"
echo "=========================================="
echo ""
echo "Pour lancer le projet, exécutez:"
echo "  npm run dev"
echo ""
echo "Puis ouvrez votre navigateur sur:"
echo "  http://localhost:3000"
echo ""