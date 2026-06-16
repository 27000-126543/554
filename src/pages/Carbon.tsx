import { useState } from 'react'
import { useStore } from '@/store'
import { Flame, Plus, Star, TrendingDown, X } from 'lucide-react'

type ScopeTab = 'scope1' | 'scope2' | 'scope3'

interface CarbonEntry {
  id: string
  category: string
  emission: number
  source: string
  recordedAt: string
}

const scopeData: Record<ScopeTab, { label: string; sub: string; entries: CarbonEntry[] }> = {
  scope1: {
    label: '范围一',
    sub: '直接排放',
    entries: [
      { id: 's1-1', category: '燃料燃烧', emission: 1200, source: '实测数据', recordedAt: '2026-06-10' },
      { id: 's1-2', category: '工艺过程', emission: 800, source: '计算数据', recordedAt: '2026-06-08' },
      { id: 's1-3', category: '逸散排放', emission: 450, source: '估算数据', recordedAt: '2026-06-05' },
      { id: 's1-4', category: '交通工具', emission: 180, source: '实测数据', recordedAt: '2026-06-03' },
      { id: 's1-5', category: '冷冻剂逸散', emission: 120, source: '估算数据', recordedAt: '2026-05-28' },
    ],
  },
  scope2: {
    label: '范围二',
    sub: '间接排放-能源',
    entries: [
      { id: 's2-1', category: '外购电力', emission: 890, source: '电费账单', recordedAt: '2026-06-12' },
      { id: 's2-2', category: '外购蒸汽/热力', emission: 0, source: '供应商数据', recordedAt: '2026-06-10' },
      { id: 's2-3', category: '外购冷量', emission: 0, source: '供应商数据', recordedAt: '2026-06-10' },
      { id: 's2-4', category: '外购压缩空气', emission: 35, source: '计算数据', recordedAt: '2026-06-07' },
      { id: 's2-5', category: '其他外购能源', emission: 15, source: '估算数据', recordedAt: '2026-06-05' },
    ],
  },
  scope3: {
    label: '范围三',
    sub: '价值链排放',
    entries: [
      { id: 's3-1', category: '上下游运输', emission: 1050, source: '物流数据', recordedAt: '2026-06-11' },
      { id: 's3-2', category: '采购商品', emission: 890, source: '供应商数据', recordedAt: '2026-06-09' },
      { id: 's3-3', category: '废弃物处理', emission: 160, source: '处理商数据', recordedAt: '2026-06-06' },
      { id: 's3-4', category: '员工通勤', emission: 280, source: '问卷调查', recordedAt: '2026-06-04' },
      { id: 's3-5', category: '商务差旅', emission: 190, source: '差旅系统', recordedAt: '2026-06-02' },
      { id: 's3-6', category: '产品使用阶段', emission: 230, source: '估算数据', recordedAt: '2026-05-30' },
    ],
  },
}

const scopeColors: Record<ScopeTab, string> = {
  scope1: '#E76F51',
  scope2: '#D4A574',
  scope3: '#457B9D',
}

export default function Carbon() {
  const { carbonData, reductionPlans } = useStore()
  const [activeTab, setActiveTab] = useState<ScopeTab>('scope1')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ category: '', emission: '', source: '' })

  const current = scopeData[activeTab]

  const scopeBreakdown = [
    { key: 'scope1' as ScopeTab, label: '范围一·直接排放', value: carbonData.scope1, color: scopeColors.scope1, percent: ((carbonData.scope1 / carbonData.total) * 100).toFixed(1) },
    { key: 'scope2' as ScopeTab, label: '范围二·能源间接', value: carbonData.scope2, color: scopeColors.scope2, percent: ((carbonData.scope2 / carbonData.total) * 100).toFixed(1) },
    { key: 'scope3' as ScopeTab, label: '范围三·价值链', value: carbonData.scope3, color: scopeColors.scope3, percent: ((carbonData.scope3 / carbonData.total) * 100).toFixed(1) },
  ]

  const difficultyBadge: Record<string, string> = {
    low: 'badge-success',
    medium: 'badge-warning',
    high: 'badge-danger',
  }

  const difficultyLabel: Record<string, string> = {
    low: '低难度',
    medium: '中难度',
    high: '高难度',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-600/30 flex items-center justify-center">
            <Flame className="w-5 h-5 text-accent-red" />
          </div>
          <div>
            <h1 className="section-title">碳排放管理</h1>
            <p className="text-sm text-slate-400 mt-0.5">追踪与管理组织碳足迹</p>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          录入数据
        </button>
      </div>

      <div className="glass-card p-1.5 flex gap-1">
        {(Object.keys(scopeData) as ScopeTab[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === key
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="block">{scopeData[key].label}</span>
            <span className="block text-xs opacity-70 mt-0.5">{scopeData[key].sub}</span>
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-semibold text-white">{current.label} · {current.sub}</h3>
          <span className="text-xs text-slate-500">共 {current.entries.length} 项</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-3 text-slate-400 font-medium">排放类别</th>
                <th className="text-right px-6 py-3 text-slate-400 font-medium">排放量(tCO₂e)</th>
                <th className="text-left px-6 py-3 text-slate-400 font-medium">数据来源</th>
                <th className="text-left px-6 py-3 text-slate-400 font-medium">录入时间</th>
                <th className="text-center px-6 py-3 text-slate-400 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {current.entries.map((entry) => (
                <tr key={entry.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5 text-white font-medium">{entry.category}</td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="stat-number text-lg" style={{ color: scopeColors[activeTab] }}>
                      {entry.emission.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-300">{entry.source}</td>
                  <td className="px-6 py-3.5 text-slate-400">{entry.recordedAt}</td>
                  <td className="px-6 py-3.5 text-center">
                    <button className="text-brand-400 hover:text-brand-300 text-xs font-medium mr-3">编辑</button>
                    <button className="text-accent-red hover:text-accent-red/80 text-xs font-medium">删除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="section-title text-lg mb-6">碳足迹概览</h3>
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                {scopeBreakdown.reduce<{ offset: number; elements: JSX.Element[] }>(
                  (acc, item) => {
                    const circumference = 2 * Math.PI * 70
                    const strokeLength = (parseFloat(item.percent) / 100) * circumference
                    const element = (
                      <circle
                        key={item.key}
                        cx="100"
                        cy="100"
                        r="70"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="20"
                        strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
                        strokeDashoffset={-acc.offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )
                    return { offset: acc.offset + strokeLength, elements: [...acc.elements, element] }
                  },
                  { offset: 0, elements: [] }
                ).elements}
                <circle cx="100" cy="100" r="55" fill="#1B2838" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-slate-400">总排放</span>
                <span className="stat-number text-2xl text-white">{carbonData.total.toLocaleString()}</span>
                <span className="text-xs text-slate-500">tCO₂e</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {scopeBreakdown.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-100/50 hover:bg-surface-100 transition-colors cursor-pointer"
                onClick={() => setActiveTab(item.key)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-300">{item.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-semibold text-white">{item.value.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 w-12 text-right">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="section-title text-lg">减排方案</h3>
            <TrendingDown className="w-5 h-5 text-accent-mint" />
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {reductionPlans.map((plan) => (
              <div
                key={plan.id}
                className="glass-card-hover p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium text-sm">{plan.name}</h4>
                  <span className={difficultyBadge[plan.difficulty]}>{difficultyLabel[plan.difficulty]}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">预计减排</span>
                    <span className="text-accent-mint font-mono font-semibold text-sm">{plan.expectedReduction}%</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(plan.rating)
                            ? 'text-accent-gold fill-accent-gold'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="section-title text-lg">录入碳排放数据</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">排放类别</label>
                <input
                  className="input-field"
                  placeholder="请输入排放类别"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">排放量 (tCO₂e)</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="请输入排放量"
                  value={form.emission}
                  onChange={(e) => setForm({ ...form, emission: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">数据来源</label>
                <input
                  className="input-field"
                  placeholder="请输入数据来源"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
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
