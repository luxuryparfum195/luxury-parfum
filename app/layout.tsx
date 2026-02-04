import './globals.css'

export const metadata = {
  title: 'LUXURY MAGIQUE | Parfums Haute Couture',
  description: 'Découvrez notre collection exclusive de parfums de luxe. Créations artisanales pour les âmes raffinées. Achetez au millilitre.',
  keywords: 'parfums, luxe, haute couture, fragrance, parfumerie, oud, rose, ambre',
  openGraph: {
    title: 'LUXURY MAGIQUE | Parfums Haute Couture',
    description: 'Créations exclusives de parfums haute couture',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}