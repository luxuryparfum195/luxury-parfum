export const metadata = {
  title: 'LUXURY MAGIQUE - Admin Dashboard',
  description: 'Tableau de bord administration',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {children}
    </div>
  )
}