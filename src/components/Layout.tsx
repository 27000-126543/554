import { Outlet, Navigate } from 'react-router-dom'
import { useStore } from '@/store'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function Layout() {
  const { isAuthenticated, sidebarCollapsed } = useStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-[68px]' : 'ml-[240px]'}`}>
        <Header />
        <main className="p-6 bg-grid-pattern min-h-[calc(100vh-3.5rem)]">
          <div className="bg-radial-glow min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
