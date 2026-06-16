import { useState, useEffect } from 'react'
import { useStore } from '@/store'
import {
  Zap,
  Droplets,
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  X,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts'

type MetricType = 'energy' | 'water' | 'waste'

const metricDefaults: Record<
  MetricType,
  { label: string; fallback: number; unit: string; benchmark: number; subcategory: string }
> = {
  energy: { label: '能耗', fallback: 45200, unit: 'kWh', benchmark: 42000, subcategory: '电力' },
  water: { label: '水耗', fallback: 12800, unit: '吨', benchmark: 12000, subcategory: '用水量' },
  waste: { label: '废弃物', fallback: 3200, unit: '吨', benchmark: 3000, subcategory: '固废' },
}

const metricColors: Record<MetricType, string> = {
  energy: '#D4A574',
  water: '#457B9D',
  waste: '#E76F51',
}

const metricIcons: Record<MetricType, React.ReactNode> = {
  energy: <Zap className="w-6 h-6" />,
  water: <Droplets className="w-6 h-6" />,
  waste: <Trash2 className="w-6 h-6" />,
}

export default function Environment() {
  const { user, envMetrics, fetchEnvMetrics, addEnvMetric } = useStore()

  const [showModal, setShowModal] = useState(false)
  const [dataType, setDataType] = useState<MetricType>('energy')
  const [formValues, setFormValues] = useState({
    subcategory: '',
    value: '',
    unit: '',
    period: '2026-06',
    benchmark_value: '',
  })

  const companyId = 'c1'

  useEffect(() => {
    fetchEnvMetrics(companyId)
  }, [fetchEnvMetrics])

  const sumByType = (type: MetricType) => {
    const metrics = envMetrics.filter((m) => m.type === type)
    if (metrics.length === 0) return metricDefaults[type].fallback
    return metrics.reduce((sum, m) => sum + m.value, 0)
  }

  const energyValue = sumByType('energy')
  const waterValue = sumByType('water')
  const wasteValue = sumByType('waste')

  const metricsData = [
    {
      key: 'energy' as MetricType,
      ...metricDefaults.energy,
      value: energyValue,
      exceeding: energyValue > metricDefaults.energy.benchmark,
    },
    {
      key: 'water' as MetricType,
      ...metricDefaults.water,
      value: waterValue,
      exceeding: waterValue > metricDefaults.water.benchmark,
    },
    {
      key: 'waste' as MetricType,
      ...metricDefaults.waste,
      value: wasteValue,
      exceeding: wasteValue > metricDefaults.waste.benchmark,
    },
  ]

  const chartData = [
    {
      name: '能耗',
      company: energyValue,
      benchmark: metricDefaults.energy.benchmark,
      unit: 'kWh',
      exceeding: energyValue > metricDefaults.energy.benchmark,
    },
    {
      name: '水耗',
      company: waterValue,
      benchmark: metricDefaults.water.benchmark,
      unit: '吨',
      exceeding: waterValue > metricDefaults.water.benchmark,
    },
    {
      name: '废弃物',
      company: wasteValue,
      benchmark: metricDefaults.waste.benchmark,
      unit: '吨',
      exceeding: wasteValue > metricDefaults.waste.benchmark,
    },
  ]

  const openModal = (type: MetricType) => {
    setDataType(type)
    setFormValues({
      subcategory: metricDefaults[type].subcategory,
      value: '',
      unit: metricDefaults[type].unit,
      period: '2026-06',
      benchmark_value: String(metricDefaults[type].benchmark),
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!formValues.value) return

    try {
      await addEnvMetric({
        companyId,
        type: dataType,
        subcategory: formValues.subcategory,
        value: Number(formValues.value),
        unit: formValues.unit,
        period: formValues.period,
        benchmark_value: Number(formValues.benchmark_value) || null,
      })
      setShowModal(false)
    } catch (e) {
      console.error(e)
    }
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
        {metricsData.map((metric) => {
          const diff = ((metric.value - metric.benchmark) / metric.benchmark) * 100
          const diffStr = diff.toFixed(1)
          return (
            <div
              key={metric.key}
              className="glass-card-hover p-5 relative overflow-hidden group"
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-opacity group-hover:opacity-20"
                style={{ backgroundColor: metricColors[metric.key] }}
              />
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${metricColors[metric.key]}20`,
                    color: metricColors[metric.key],
                  }}
                >
                  {metricIcons[metric.key]}
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
                  {metric.exceeding ? (
                    <>
                      <TrendingUp className="w-3.5 h-3.5 text-accent-red" />
                      <span className="text-xs font-medium text-accent-red">+{diffStr}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3.5 h-3.5 text-accent-mint" />
                      <span className="text-xs font-medium text-accent-mint">{diffStr}%</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-400">
                  行业基准{' '}
                  <span className="font-mono text-slate-300">
                    {metric.benchmark.toLocaleString()}
                  </span>
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
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
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
                tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v))}
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
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  name === 'company' ? '公司值' : '行业基准',
                ]}
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
              <Bar
                dataKey="benchmark"
                fill="#2D6A4F"
                fillOpacity={0.4}
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
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
          {metricsData.map((metric) => (
            <button
              key={metric.key}
              className="glass-card-hover p-4 flex items-center gap-3 text-left"
              onClick={() => openModal(metric.key)}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: `${metricColors[metric.key]}20`,
                  color: metricColors[metric.key],
                }}
              >
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-white font-medium">
                  录入{metric.label}数据
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  当前 {metric.value.toLocaleString()} {metric.unit}
                </div>
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
                录入{metricDefaults[dataType].label}数据
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">子类别</label>
                <input
                  className="input-field"
                  placeholder="请输入子类别"
                  value={formValues.subcategory}
                  onChange={(e) =>
                    setFormValues({ ...formValues, subcategory: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">数值</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder={`请输入${metricDefaults[dataType].label}数值`}
                  value={formValues.value}
                  onChange={(e) => setFormValues({ ...formValues, value: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">单位</label>
                <input
                  className="input-field bg-white/[0.02] text-slate-400"
                  value={formValues.unit}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">统计周期</label>
                <input
                  className="input-field"
                  placeholder="如：2026-06"
                  value={formValues.period}
                  onChange={(e) => setFormValues({ ...formValues, period: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">基准值</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="请输入基准值"
                  value={formValues.benchmark_value}
                  onChange={(e) =>
                    setFormValues({ ...formValues, benchmark_value: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  className="btn-secondary flex-1"
                  onClick={() => setShowModal(false)}
                >
                  取消
                </button>
                <button className="btn-primary flex-1" onClick={handleSubmit}>
                  确认录入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
