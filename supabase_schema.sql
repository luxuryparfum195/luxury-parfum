-- Table pour les paramètres du site (Site Settings)
CREATE TABLE public.site_settings (
    id SERIAL PRIMARY KEY,
    site_name TEXT DEFAULT 'LUXURY MAGIQUE',
    currency VARCHAR(4) DEFAULT 'EUR',
    contact_email TEXT,
    whatsapp_number TEXT,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    header_announcement TEXT,
    social_maps TEXT,
    social_tiktok TEXT,
    social_instagram TEXT,
    social_facebook TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertion de la configuration initiale (Row unique)
INSERT INTO public.site_settings (site_name, currency, whatsapp_number, header_announcement)
VALUES ('LUXURY MAGIQUE', 'EUR', '0000000000', 'Livraison gratuite sur toutes les commandes ce mois-ci !');

-- Sécurité (Policies)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Politique de lecture ouverte (tout le monde peut lire les paramètres comme le nom du site, whatsapp, etc.)
CREATE POLICY "Enable read access for all users" ON public.site_settings
    FOR SELECT USING (true);

-- Politique de modification restreinte aux admins (à configurer selon votre auth supa)
-- Pour l'instant, on permet la modif si on est authentifié (exemple simple)
CREATE POLICY "Enable update for authenticated users only" ON public.site_settings
    FOR UPDATE USING (auth.role() = 'authenticated');
