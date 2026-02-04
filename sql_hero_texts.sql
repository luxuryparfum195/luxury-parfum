-- =====================================================
-- SQL POUR LES TEXTES DU HERO MULTILINGUES
-- Exécutez ce code dans Supabase SQL Editor
-- =====================================================

-- Table pour les textes du hero (page d'accueil)
CREATE TABLE IF NOT EXISTS hero_texts (
  id SERIAL PRIMARY KEY,
  language VARCHAR(5) NOT NULL CHECK (language IN ('fr', 'en', 'ar')),
  subtitle TEXT NOT NULL DEFAULT '',
  title_line1 TEXT NOT NULL DEFAULT '',
  title_highlight TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  button_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(language)
);

-- Activer RLS
ALTER TABLE hero_texts ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Public hero_texts access" ON hero_texts
  FOR SELECT USING (true);

-- Politique de modification pour utilisateurs authentifiés
CREATE POLICY "Admin hero_texts update" ON hero_texts
  FOR ALL USING (auth.role() = 'authenticated');

-- Insérer les textes par défaut pour chaque langue
INSERT INTO hero_texts (language, subtitle, title_line1, title_highlight, description, button_text)
VALUES 
  ('fr', 'Parfums Haute Couture', 'L''Art de la', 'Séduction', 'Découvrez notre collection exclusive de parfums de luxe. Chaque fragrance est une œuvre d''art olfactive créée pour les âmes raffinées.', 'Découvrir la Collection'),
  ('en', 'Haute Couture Perfumes', 'The Art of', 'Seduction', 'Discover our exclusive collection of luxury perfumes. Each fragrance is an olfactory work of art created for refined souls.', 'Discover Collection'),
  ('ar', 'عطور الهوت كوتور', 'فن', 'الإغراء', 'اكتشف مجموعتنا الحصرية من العطور الفاخرة. كل عطر هو عمل فني عطري مصنوع للأرواح الراقية.', 'اكتشف المجموعة')
ON CONFLICT (language) DO NOTHING;

-- Ajouter des colonnes pour les images du hero dans site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS hero_bg_image TEXT DEFAULT 'https://i.postimg.cc/G2jML17x/catalog-ai-1-compressed-1-Page-02.jpg',
ADD COLUMN IF NOT EXISTS hero_perfume_1 TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS hero_perfume_2 TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS hero_perfume_3 TEXT DEFAULT '';

-- Vérification
SELECT * FROM hero_texts;
