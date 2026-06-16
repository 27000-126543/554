import { useStore } from '@/store'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Flame,
  Leaf,
  Users,
  Shield,
  Bell,
} from 'lucide-react'

function ScoreCard() {
  const { esgScore } = useStore()

  const subScores = [
    { label: '环境', value: esgScore.environmental, icon: Leaf, color: 'text-brand-400' },
    { label: '社会', value: esgScore.social, icon: Users, color: 'text-accent-gold' },
    { label: '治理', value: esgScore.governance, icon: Shield, color: 'text-accent-blue' },
  ]

  return (
    <div className="glass-card p-6">
      <h2 className="section-title mb-6">ESG 综合评分</h2>
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-[6px] border-brand-500/20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-brand-400 border-r-brand-400" style={{ transform: `rotate(${(esgScore.total / 100) * 360}deg)`, transition: 'transform 1s ease-out' }} />
              <span className="stat-number text-4xl bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
                {esgScore.total}
              </span>
            </div>
          </div>
          <span className="text-slate-400 text-sm mt-2">综合评分</span>
        </div>
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-6">
          {subScores.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <item.icon className={cn('w-4 h-4', item.color)} />
                <span className="text-slate-300 text-sm font-medium">{item.label}</span>
                <span className={cn('ml-auto font-mono text-sm font-bold', item.color)}>
                  {item.value}
                </span>
              </div>
              <div className="h-2 bg-surface-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                  style={{ width: `${item.value}%`, transition: 'width 1s ease-out' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CarbonTrend() {
  const { carbonData } = useStore()

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">碳排放趋势</h2>
        <div className="flex items-center gap-1.5 text-accent-mint text-sm">
          <TrendingDown className="w-4 h-4" />
          <span>同比下降 8.2%</span>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={carbonData.trend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradScope1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E76F51" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#E76F51" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gradScope2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A574" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#D4A574" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gradScope3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#457B9D" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#457B9D" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v: string) => v.slice(5)}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1B2838',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: 12,
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
              formatter={(value: string) => <span style={{ color: '#94a3b8' }}>{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="scope1"
              name="Scope 1 (直接排放)"
              stroke="#E76F51"
              fill="url(#gradScope1)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="scope2"
              name="Scope 2 (间接排放)"
              stroke="#D4A574"
              fill="url(#gradScope2)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="scope3"
              name="Scope 3 (价值链排放)"
              stroke="#457B9D"
              fill="url(#gradScope3)"
              stackId="1"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CircularProgress({ value, label, size = 80, strokeWidth = 6 }: {
  value: number
  label: string
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const color = value >= 70 ? '#52B788' : '#E76F51'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-mono text-sm font-bold"
            style={{ color }}
          >
            {value}%
          </span>
        </div>
      </div>
      <span className="text-slate-400 text-xs">{label}</span>
    </div>
  )
}

function DataReporting() {
  const reportingItems = [
    { label: '碳排放', value: 85 },
    { label: '环境指标', value: 72 },
    { label: '社会指标', value: 68 },
    { label: '治理指标', value: 80 },
  ]

  return (
    <div className="glass-card p-6">
      <h2 className="section-title mb-6">数据填报率</h2>
      <div className="grid grid-cols-2 gap-6 place-items-center">
        {reportingItems.map((item) => (
          <CircularProgress key={item.label} value={item.value} label={item.label} />
        ))}
      </div>
    </div>
  )
}

const priorityConfig = {
  high: { label: '紧急', className: 'badge-danger', icon: Flame },
  medium: { label: '中优', className: 'badge-warning', icon: Clock },
  low: { label: '一般', className: 'badge-success', icon: CheckCircle2 },
}

const typeIconMap = {
  fill: CheckCircle2,
  approve: Shield,
  alert: AlertTriangle,
}

function TodoList() {
  const { todos } = useStore()

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">待办事项</h2>
        <span className="text-slate-500 text-sm">{todos.length} 项待处理</span>
      </div>
      <div className="space-y-3">
        {todos.map((todo) => {
          const PriorityIcon = priorityConfig[todo.priority].icon
          const TypeIcon = typeIconMap[todo.type]
          return (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface-100/50 hover:bg-surface-200/50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <TypeIcon className="w-4 h-4 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 font-medium truncate group-hover:text-white transition-colors">
                  {todo.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-500">{todo.deadline}</span>
                </div>
              </div>
              <span className={cn('text-[10px] flex items-center gap-1', priorityConfig[todo.priority].className)}>
                <PriorityIcon className="w-3 h-3" />
                {priorityConfig[todo.priority].label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const severityConfig = {
  critical: {
    borderClass: 'border-l-accent-red',
    bgClass: 'bg-accent-red/5',
    icon: AlertTriangle,
    iconClass: 'text-accent-red',
    animate: true,
  },
  warning: {
    borderClass: 'border-l-accent-gold',
    bgClass: 'bg-accent-gold/5',
    icon: Bell,
    iconClass: 'text-accent-gold',
    animate: false,
  },
  info: {
    borderClass: 'border-l-accent-blue',
    bgClass: 'bg-accent-blue/5',
    icon: TrendingUp,
    iconClass: 'text-accent-blue',
    animate: false,
  },
}

function AlertList() {
  const { alerts } = useStore()

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">预警通知</h2>
        <span className="text-slate-500 text-sm">{alerts.length} 条预警</span>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity]
          const Icon = config.icon
          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border-l-[3px] transition-colors',
                config.borderClass,
                config.bgClass,
                config.animate && 'animate-pulse-slow'
              )}
            >
              <div className="w-7 h-7 rounded-full bg-surface-200/80 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className={cn('w-3.5 h-3.5', config.iconClass)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-200 font-medium">{alert.title}</p>
                  {alert.severity === 'critical' && (
                    <span className="badge-danger text-[10px]">严重</span>
                  )}
                  {alert.severity === 'warning' && (
                    <span className="badge-warning text-[10px]">警告</span>
                  )}
                  {alert.severity === 'info' && (
                    <span className="badge-success text-[10px]">提示</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{alert.description}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">{alert.timestamp}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, reportingRate, dataCompleteness, fetchAlerts } = useStore()

  useEffect(() => {
    fetchAlerts(user?.companyId || 'c1')
  }, [user?.companyId, fetchAlerts])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">ESG 数据管理平台</h1>
          <p className="text-slate-400 text-sm mt-1">实时监控与数据分析仪表盘</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="text-slate-400 text-xs">填报率</span>
            <span className="font-mono text-sm font-bold text-brand-400">{reportingRate}%</span>
          </div>
          <div className="glass-card px-4 py-2 flex items-center gap-2">
            <span className="text-slate-400 text-xs">完整度</span>
            <span className="font-mono text-sm font-bold text-accent-mint">{dataCompleteness}%</span>
          </div>
        </div>
      </div>

      <ScoreCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CarbonTrend />
        </div>
        <div>
          <DataReporting />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodoList />
        <AlertList />
      </div>
    </div>
  )
}
