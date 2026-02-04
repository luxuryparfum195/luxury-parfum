-- ============================================
-- 🚀 LUXURY PARFUM - SCHEMA COMPLET SUPABASE
-- ============================================
-- Exécutez ce fichier ENTIER dans Supabase SQL Editor
-- Il va créer ou mettre à jour toutes les tables nécessaires
-- ============================================

-- ============================================
-- 1. TABLE DES PARFUMS (PRODUITS)
-- ============================================
CREATE TABLE IF NOT EXISTS public.parfums (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT NOT NULL,
    description TEXT,
    prix_eur DECIMAL(10,2) NOT NULL DEFAULT 0,
    categorie TEXT DEFAULT 'Unisexe',
    notes_olfactives TEXT[] DEFAULT '{}',
    occasions TEXT[] DEFAULT '{}',
    image_url_1 TEXT,
    image_url_2 TEXT,
    image_url_3 TEXT,
    stock_ml INTEGER DEFAULT 100,
    min_achat_ml INTEGER DEFAULT 5,
    max_achat_ml INTEGER DEFAULT 100,
    est_disponible BOOLEAN DEFAULT TRUE,
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_parfums_categorie ON public.parfums(categorie);
CREATE INDEX IF NOT EXISTS idx_parfums_disponible ON public.parfums(est_disponible);

-- ============================================
-- 2. TABLE DES PARAMÈTRES DU SITE
-- ============================================
DROP TABLE IF EXISTS public.site_settings CASCADE;
CREATE TABLE public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_name TEXT DEFAULT 'LUXURY PARFUM',
    currency TEXT DEFAULT 'EUR',
    contact_email TEXT,
    whatsapp_number TEXT,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    header_announcement TEXT,
    social_maps TEXT,
    social_tiktok TEXT,
    social_instagram TEXT,
    social_facebook TEXT,
    taux_usd DECIMAL(10,4) DEFAULT 1.08,
    taux_fcfa DECIMAL(10,4) DEFAULT 655.957,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

-- ============================================
-- 3. TABLE DES ADMINS
-- ============================================
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nom TEXT,
    role TEXT DEFAULT 'admin',
    est_actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 4. TABLE DES COMMANDES (pour le futur)
-- ============================================
CREATE TABLE IF NOT EXISTS public.commandes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_nom TEXT,
    client_telephone TEXT,
    client_adresse TEXT,
    items JSONB NOT NULL DEFAULT '[]',
    total_eur DECIMAL(10,2) DEFAULT 0,
    devise_utilisee TEXT DEFAULT 'EUR',
    statut TEXT DEFAULT 'en_attente',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 5. POLITIQUES DE SÉCURITÉ (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.parfums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Parfums visibles par tous" ON public.parfums;
DROP POLICY IF EXISTS "Parfums modifiables par admins" ON public.parfums;
DROP POLICY IF EXISTS "Parfums insert par admins" ON public.parfums;
DROP POLICY IF EXISTS "Parfums delete par admins" ON public.parfums;
DROP POLICY IF EXISTS "Settings visibles par tous" ON public.site_settings;
DROP POLICY IF EXISTS "Settings modifiables par admins" ON public.site_settings;
DROP POLICY IF EXISTS "Admins visibles par admins" ON public.admins;
DROP POLICY IF EXISTS "Commandes par admins" ON public.commandes;

-- PARFUMS : Lecture publique, modification par admins authentifiés
CREATE POLICY "Parfums visibles par tous" ON public.parfums
    FOR SELECT USING (true);

CREATE POLICY "Parfums modifiables par admins" ON public.parfums
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Parfums insert par admins" ON public.parfums
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Parfums delete par admins" ON public.parfums
    FOR DELETE USING (auth.role() = 'authenticated');

-- SETTINGS : Lecture publique, modification par admins
CREATE POLICY "Settings visibles par tous" ON public.site_settings
    FOR SELECT USING (true);

CREATE POLICY "Settings modifiables par admins" ON public.site_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- ADMINS : Visible uniquement par admins
CREATE POLICY "Admins visibles par admins" ON public.admins
    FOR ALL USING (auth.role() = 'authenticated');

-- COMMANDES : Accessible par admins
CREATE POLICY "Commandes par admins" ON public.commandes
    FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 6. INSERTION DES DONNÉES INITIALES
-- ============================================

-- Paramètres du site
INSERT INTO public.site_settings (id, site_name, currency, whatsapp_number, header_announcement)
VALUES (1, 'LUXURY PARFUM', 'EUR', '212600000000', 'Livraison gratuite sur toutes les commandes ce mois-ci !')
ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    updated_at = now();

-- Parfums de démonstration (seulement si la table est vide)
INSERT INTO public.parfums (nom, description, prix_eur, categorie, notes_olfactives, occasions, image_url_1, image_url_2, stock_ml, min_achat_ml, max_achat_ml, est_disponible)
SELECT * FROM (VALUES
    ('Nuit de Diamant', 'Un parfum mystérieux aux notes de bois de santal et de rose bulgare, créé pour les âmes élégantes.', 2.50, 'Oriental', ARRAY['Rose', 'Santal', 'Vanille', 'Musk'], ARRAY['Mariage', 'Soirée'], 'https://i.postimg.cc/fR3gxpyw/catalog-ai-1-compressed-1-Page-01.jpg', 'https://i.postimg.cc/SNX0mD82/catalog-ai-1-compressed-1-Page-04.jpg', 100, 5, 100, true),
    ('Or Noir', 'L''essence de l''Orient avec oud et ambre, une signature olfactive inoubliable.', 3.00, 'Boisé', ARRAY['Oud', 'Ambre', 'Musk', 'Épices'], ARRAY['Réunion', 'Travail', 'Soirée'], 'https://i.postimg.cc/SNX0mD82/catalog-ai-1-compressed-1-Page-04.jpg', 'https://i.postimg.cc/WbqyBtLt/catalog-ai-1-compressed-1-Page-05.jpg', 80, 5, 100, true),
    ('Éclat Doré', 'Fraîcheur citrus et fleurs blanches, un parfum lumineux et raffiné.', 2.00, 'Frais', ARRAY['Citron', 'Jasmin', 'Muguet', 'Bergamote'], ARRAY['Quotidien', 'Sortie', 'Travail'], 'https://i.postimg.cc/WbqyBtLt/catalog-ai-1-compressed-1-Page-05.jpg', 'https://i.postimg.cc/VsVTZnhx/catalog-ai-1-compressed-1-Page-06.jpg', 120, 5, 100, true),
    ('Velours Royal', 'Un mélange royal de rose de Damas et de patchouli, symbole de sophistication.', 3.50, 'Floral', ARRAY['Rose de Damas', 'Patchouli', 'Iris', 'Oud'], ARRAY['Mariage', 'Soirée'], 'https://i.postimg.cc/VsVTZnhx/catalog-ai-1-compressed-1-Page-06.jpg', 'https://i.postimg.cc/1zsYVHgF/catalog-ai-1-compressed-1-Page-21.jpg', 60, 5, 100, true),
    ('Mystère Céleste', 'Notes célestes de jasmin et ylang-ylang, un voyage sensoriel unique.', 2.80, 'Oriental', ARRAY['Jasmin', 'Ylang-Ylang', 'Benjoin', 'Musc Blanc'], ARRAY['Sortie', 'Réunion'], 'https://i.postimg.cc/1zsYVHgF/catalog-ai-1-compressed-1-Page-21.jpg', 'https://i.postimg.cc/SN8hWgKd/catalog-ai-1-compressed-1-Page-22.jpg', 90, 5, 100, true),
    ('Ambre Éternel', 'Un parfum intemporel aux notes chaudes et envoûtantes.', 2.70, 'Ambré', ARRAY['Ambre', 'Vanille', 'Tonka', 'Cèdre'], ARRAY['Quotidien', 'Travail'], 'https://i.postimg.cc/SN8hWgKd/catalog-ai-1-compressed-1-Page-22.jpg', 'https://i.postimg.cc/Dzf33FPP/catalog-ai-1-compressed-1-Page-23.jpg', 110, 5, 100, true)
) AS v(nom, description, prix_eur, categorie, notes_olfactives, occasions, image_url_1, image_url_2, stock_ml, min_achat_ml, max_achat_ml, est_disponible)
WHERE NOT EXISTS (SELECT 1 FROM public.parfums LIMIT 1);

-- ============================================
-- 7. FONCTION DE MISE À JOUR AUTOMATIQUE
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_parfums_updated_at ON public.parfums;
CREATE TRIGGER update_parfums_updated_at
    BEFORE UPDATE ON public.parfums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_commandes_updated_at ON public.commandes;
CREATE TRIGGER update_commandes_updated_at
    BEFORE UPDATE ON public.commandes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ✅ TERMINÉ !
-- ============================================
-- Maintenant, créez un utilisateur admin dans Supabase :
-- 1. Allez dans Authentication > Users
-- 2. Cliquez "Add user" > "Create new user"
-- 3. Email: admin@luxuryparfum.fr (ou votre email)
-- 4. Password: votre mot de passe sécurisé
-- 5. Cochez "Auto Confirm User"
-- ============================================
