import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { Bell, Settings, ChevronRight } from 'lucide-react'

const breadcrumbMap: Record<string, string> = {
  '/dashboard': '仪表盘',
  '/carbon': '碳排放管理',
  '/carbon/footprint': '碳足迹报告',
  '/carbon/reduction': '减排方案推荐',
  '/environment': '环境指标',
  '/environment/benchmark': '行业对标',
  '/social': '社会指标',
  '/governance': '治理指标',
  '/report': 'ESG报告生成器',
  '/report/approval': '审批工作流',
  '/audit': '第三方审计',
  '/membership': '会员体系',
  '/admin': '管理员看板',
  '/prediction': '数据预测',
  '/export': '报表导出',
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, alerts } = useStore()

  const pathSegments = location.pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((_, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/')
    return { path, label: breadcrumbMap[path] || pathSegments[index] }
  })

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
      <nav className="flex items-center gap-1.5 text-sm">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-slate-500 hover:text-white transition-colors"
        >
          首页
        </button>
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            {index === breadcrumbs.length - 1 ? (
              <span className="text-white font-medium">{crumb.label}</span>
            ) : (
              <button
                onClick={() => navigate(crumb.path)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                {crumb.label}
              </button>
            )}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          {alerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full animate-pulse" />
          )}
        </button>
        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
          <Settings className="w-[18px] h-[18px]" />
        </button>
        {user && (
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold/70 flex items-center justify-center text-[10px] font-bold text-surface">
              {user.companyName.charAt(0)}
            </div>
            <span className="text-sm font-medium text-white">{user.companyName}</span>
          </div>
        )}
      </div>
    </header>
  )
}
