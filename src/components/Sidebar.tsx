import { NavLink, useLocation } from 'react-router-dom'
import { useStore } from '@/store'
import {
  LayoutDashboard,
  Flame,
  Leaf,
  Users,
  Shield,
  FileText,
  Search,
  Crown,
  BarChart3,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: '仪表盘' },
  { path: '/carbon', icon: Flame, label: '碳排放' },
  { path: '/environment', icon: Leaf, label: '环境指标' },
  { path: '/social', icon: Users, label: '社会指标' },
  { path: '/governance', icon: Shield, label: '治理指标' },
  { path: '/report', icon: FileText, label: 'ESG报告' },
  { path: '/audit', icon: Search, label: '第三方审计' },
  { path: '/membership', icon: Crown, label: '会员体系' },
  { path: '/admin', icon: BarChart3, label: '管理员看板' },
  { path: '/prediction', icon: TrendingUp, label: '数据预测' },
  { path: '/export', icon: Download, label: '报表导出' },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, user } = useStore()
  const location = useLocation()

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-[68px]' : 'w-[240px]'}
        bg-surface-50/95 backdrop-blur-xl border-r border-white/5`}
    >
      <div className={`flex items-center h-16 px-4 border-b border-white/5 ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-white tracking-tight">ESG Pro</span>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-brand-500/20 text-brand-400 shadow-sm shadow-brand-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
                ${sidebarCollapsed ? 'justify-center' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-brand-400' : ''}`} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-white/5 p-3">
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold/70 flex items-center justify-center text-xs font-bold text-surface">
              {user.companyName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.companyName}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-accent-red hover:bg-accent-red/5 transition-all w-full
            ${sidebarCollapsed ? 'justify-center' : ''}`}
          title={sidebarCollapsed ? '退出登录' : undefined}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!sidebarCollapsed && <span>退出登录</span>}
        </button>
      </div>
    </aside>
  )
}
