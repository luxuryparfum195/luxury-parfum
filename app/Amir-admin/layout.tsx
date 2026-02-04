export const metadata = {
  title: 'AMIR ADMIN - Luxury Parfum Dashboard',
  description: 'Panneau d\'administration - Gestion des parfums de luxe',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gradient-to-br from-[#FAFAFA] to-[#F0F0F0] min-h-screen">
      {children}
    </div>
  )
}