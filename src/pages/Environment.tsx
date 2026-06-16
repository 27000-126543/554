import { useState } from 'react'
import { useStore } from '@/store'
import { Zap, Droplets, Trash2, TrendingUp, TrendingDown, AlertTriangle, Plus, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'

interface MetricCard {
  key: 'energy' | 'water' | 'waste'
  label: string
  value: number
  unit: string
  icon: React.ReactNode
  benchmark: number
  exceeding: boolean
  trend: number
}

export default function Environment() {
  const { environmentalData } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [dataType, setDataType] = useState<'energy' | 'water' | 'waste'>('energy')
  const [form, setForm] = useState({ value: '', period: '' })

  const metrics: MetricCard[] = [
    {
      key: 'energy',
      label: '能耗',
      value: environmentalData.energy,
      unit: 'kWh',
      icon: <Zap className="w-6 h-6" />,
      benchmark: environmentalData.energyBenchmark,
      exceeding: environmentalData.energyExceeding,
      trend: 3.2,
    },
    {
      key: 'water',
      label: '水耗',
      value: environmentalData.water,
      unit: '吨',
      icon: <Droplets className="w-6 h-6" />,
      benchmark: environmentalData.waterBenchmark,
      exceeding: environmentalData.waterExceeding,
      trend: 1.8,
    },
    {
      key: 'waste',
      label: '废弃物',
      value: environmentalData.waste,
      unit: '吨',
      icon: <Trash2 className="w-6 h-6" />,
      benchmark: environmentalData.wasteBenchmark,
      exceeding: environmentalData.wasteExceeding,
      trend: 2.5,
    },
  ]

  const chartData = [
    { name: '能耗', company: environmentalData.energy, benchmark: environmentalData.energyBenchmark, exceeding: environmentalData.energyExceeding },
    { name: '水耗', company: environmentalData.water, benchmark: environmentalData.waterBenchmark, exceeding: environmentalData.waterExceeding },
    { name: '废弃物', company: environmentalData.waste, benchmark: environmentalData.wasteBenchmark, exceeding: environmentalData.wasteExceeding },
  ]

  const metricColor: Record<string, string> = {
    energy: '#D4A574',
    water: '#457B9D',
    waste: '#E76F51',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-600/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent-gold" />
          </div>
          <div>
            <h1 className="section-title">环境指标</h1>
            <p className="text-sm text-slate-400 mt-0.5">能耗、水耗与废弃物监测</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const diff = ((metric.value - metric.benchmark) / metric.benchmark * 100).toFixed(1)
          return (
            <div key={metric.key} className="glass-card-hover p-5 relative overflow-hidden group">
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-opacity group-hover:opacity-20"
                style={{ backgroundColor: metricColor[metric.key] }}
              />
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${metricColor[metric.key]}20`, color: metricColor[metric.key] }}
                >
                  {metric.icon}
                </div>
                {metric.exceeding ? (
                  <div className="flex items-center gap-1 text-accent-red">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-xs font-medium">超标</span>
                  </div>
                ) : (
                  <span className="badge-success">达标</span>
                )}
              </div>
              <div className="mb-1">
                <span className="stat-number text-white">{metric.value.toLocaleString()}</span>
                <span className="text-sm text-slate-400 ml-2">{metric.unit}</span>
              </div>
              <div className="text-xs text-slate-500 mb-3">{metric.label}</div>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  {metric.trend > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 text-accent-red" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-accent-mint" />
                  )}
                  <span className={`text-xs font-medium ${metric.trend > 0 ? 'text-accent-red' : 'text-accent-mint'}`}>
                    {metric.trend > 0 ? '+' : ''}{metric.trend}%
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  行业基准 <span className="font-mono text-slate-300">{metric.benchmark.toLocaleString()}</span>
                  {metric.exceeding && (
                    <span className="text-accent-red ml-1">+{diff}%</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="glass-card p-6">
        <h3 className="section-title text-lg mb-6">行业对标</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={8} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 13 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1B2838',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  color: '#e2e8f0',
                }}
                labelStyle={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}
                formatter={(value: number, name: string) => [value.toLocaleString(), name === 'company' ? '公司值' : '行业基准']}
              />
              <Legend
                formatter={(value: string) => (value === 'company' ? '公司值' : '行业基准')}
                wrapperStyle={{ color: '#94a3b8', fontSize: 13 }}
              />
              <Bar dataKey="company" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.exceeding ? '#E76F51' : '#52B788'}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
              <Bar dataKey="benchmark" fill="#2D6A4F" fillOpacity={0.4} radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-accent-red/85" />
            <span className="text-xs text-slate-400">超标指标</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-accent-mint/85" />
            <span className="text-xs text-slate-400">达标指标</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-brand-500/40" />
            <span className="text-xs text-slate-400">行业基准</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="section-title text-lg">数据录入</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              className="glass-card-hover p-4 flex items-center gap-3 text-left"
              onClick={() => {
                setDataType(metric.key)
                setForm({ value: '', period: '' })
                setShowModal(true)
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${metricColor[metric.key]}20`, color: metricColor[metric.key] }}
              >
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-white font-medium">录入{metric.label}数据</div>
                <div className="text-xs text-slate-500 mt-0.5">当前 {metric.value.toLocaleString()} {metric.unit}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="section-title text-lg">
                录入{metrics.find((m) => m.key === dataType)?.label}数据
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">数值</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder={`请输入${metrics.find((m) => m.key === dataType)?.label}数值`}
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">统计周期</label>
                <input
                  className="input-field"
                  placeholder="如：2026-Q2"
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button className="btn-secondary flex-1" onClick={() => setShowModal(false)}>取消</button>
                <button className="btn-primary flex-1" onClick={() => setShowModal(false)}>确认录入</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
