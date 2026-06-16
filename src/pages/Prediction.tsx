import { TrendingUp, Lightbulb } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

const historicalData = [
  { month: '2025-07', carbon: 4100, energy: 44000, water: 12500 },
  { month: '2025-08', carbon: 4050, energy: 44200, water: 12550 },
  { month: '2025-09', carbon: 4000, energy: 44500, water: 12600 },
  { month: '2025-10', carbon: 3960, energy: 44700, water: 12620 },
  { month: '2025-11', carbon: 3920, energy: 44800, water: 12650 },
  { month: '2025-12', carbon: 3880, energy: 45000, water: 12680 },
  { month: '2026-01', carbon: 3850, energy: 45100, water: 12700 },
  { month: '2026-02', carbon: 3820, energy: 45150, water: 12730 },
  { month: '2026-03', carbon: 3800, energy: 45200, water: 12750 },
  { month: '2026-04', carbon: 3780, energy: 45250, water: 12780 },
  { month: '2026-05', carbon: 3750, energy: 45300, water: 12800 },
  { month: '2026-06', carbon: 3720, energy: 45350, water: 12800 },
]

const predictedData = [
  { month: '2026-07', carbon: 3680, carbonHigh: 3720, carbonLow: 3640, energy: 45800, energyHigh: 46200, energyLow: 45400, water: 12800, waterHigh: 12900, waterLow: 12700 },
  { month: '2026-08', carbon: 3540, carbonHigh: 3620, carbonLow: 3460, energy: 46200, energyHigh: 46800, energyLow: 45600, water: 12820, waterHigh: 12950, waterLow: 12700 },
  { month: '2026-09', carbon: 3530, carbonHigh: 3650, carbonLow: 3410, energy: 46600, energyHigh: 47400, energyLow: 45800, water: 12810, waterHigh: 13000, waterLow: 12620 },
]

const chartData = [...historicalData.map(d => ({ ...d, type: 'historical' })), ...predictedData.map(d => ({ ...d, type: 'predicted' }))]

const metrics = [
  { key: 'carbon', name: '碳排放 (tCO₂e)', color: '#52B788', trend: '-5%', trendDown: true },
  { key: 'energy', name: '能耗 (kWh)', color: '#D4A574', trend: '+2%', trendDown: false },
  { key: 'water', name: '水耗 (吨)', color: '#457B9D', trend: '持平', trendDown: null },
]

const suggestions = [
  {
    title: '加强范围三供应链数据收集',
    priority: '高',
    priorityClass: 'badge-danger',
    description: '当前范围三数据覆盖率仅45%，建议优先完善上下游供应商碳排放数据，可提升ESG评分3-5分。',
    icon: '🔗',
  },
  {
    title: '补充社区贡献量化指标',
    priority: '中',
    priorityClass: 'badge-warning',
    description: '社会维度中社区贡献数据缺乏量化支撑，建议建立社区投入-产出追踪体系，增强报告可信度。',
    icon: '🏘️',
  },
  {
    title: '更新董事会技能矩阵',
    priority: '低',
    priorityClass: 'badge-success',
    description: '治理维度中董事会技能矩阵数据超过一年未更新，建议在下次董事会会议后同步刷新。',
    icon: '📊',
  },
]

export default function Prediction() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="section-title mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-400" />
          热点指标预测
        </h2>
        <div className="grid gap-6">
          {metrics.map(m => (
            <div key={m.key} className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-300">{m.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">下季度预测趋势</span>
                  <span className={`text-sm font-semibold font-mono ${
                    m.trendDown === true ? 'text-accent-mint' : m.trendDown === false ? 'text-accent-red' : 'text-slate-300'
                  }`}>
                    {m.trend}
                  </span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id={`gradient-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={m.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id={`ci-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={m.color} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={m.color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                      tickLine={false}
                      width={60}
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
                    {m.key === 'carbon' && (
                      <>
                        <Area
                          type="monotone"
                          dataKey="carbonHigh"
                          stroke="none"
                          fill={`url(#ci-${m.key})`}
                          dot={false}
                        />
                        <Area
                          type="monotone"
                          dataKey="carbonLow"
                          stroke="none"
                          fill="#0D1B2A"
                          dot={false}
                        />
                      </>
                    )}
                    <Area
                      type="monotone"
                      dataKey={m.key}
                      stroke={m.color}
                      strokeWidth={2}
                      fill={`url(#gradient-${m.key})`}
                      dot={(props: any) => {
                        const { cx, cy, payload } = props
                        if (payload?.type === 'predicted') return null
                        return <circle key={props.index} cx={cx} cy={cy} r={2.5} fill={m.color} stroke="none" />
                      }}
                      activeDot={{ r: 4, fill: m.color }}

                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 rounded" style={{ backgroundColor: m.color }} /> 历史数据
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 rounded border-t border-dashed" style={{ borderColor: m.color }} /> 预测数据
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-3 rounded-sm opacity-30" style={{ backgroundColor: m.color }} /> 置信区间
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="section-title mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent-gold" />
          收集建议
        </h2>
        <div className="space-y-4">
          {suggestions.map((s, i) => (
            <div key={i} className="glass-card-hover p-5 flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-lg">
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-medium text-slate-200">{s.title}</h3>
                  <span className={`${s.priorityClass}`}>{s.priority}优先级</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
