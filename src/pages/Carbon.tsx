import { useState, useEffect } from 'react'
import { useStore, type CarbonEmission } from '@/store'
import { Flame, Plus, Star, TrendingDown, X, Pencil, Trash2 } from 'lucide-react'

type ScopeTab = 1 | 2 | 3

const scopeLabels: Record<ScopeTab, { label: string; sub: string }> = {
  1: { label: '范围一', sub: '直接排放' },
  2: { label: '范围二', sub: '间接排放-能源' },
  3: { label: '范围三', sub: '价值链排放' },
}

const scopeColors: Record<ScopeTab, string> = {
  1: '#E76F51',
  2: '#D4A574',
  3: '#457B9D',
}

export default function Carbon() {
  const {
    user,
    carbonEmissions,
    carbonData,
    reductionPlans,
    fetchCarbonEmissions,
    addCarbonEmission,
    updateCarbonEmission,
    deleteCarbonEmission,
  } = useStore()

  const [activeTab, setActiveTab] = useState<ScopeTab>(1)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState({
    category: '',
    value: '',
    source: 'manual' as 'manual' | 'device',
    period: '2026-Q2',
  })

  const companyId = 'c1'

  useEffect(() => {
    fetchCarbonEmissions(companyId)
  }, [fetchCarbonEmissions])

  const filteredEmissions = carbonEmissions.filter((e) => e.scope === activeTab)

  const scopeBreakdown = [
    {
      key: 1 as ScopeTab,
      label: '范围一·直接排放',
      value: carbonData.scope1,
      color: scopeColors[1],
      percent: carbonData.total > 0 ? ((carbonData.scope1 / carbonData.total) * 100).toFixed(1) : '0.0',
    },
    {
      key: 2 as ScopeTab,
      label: '范围二·能源间接',
      value: carbonData.scope2,
      color: scopeColors[2],
      percent: carbonData.total > 0 ? ((carbonData.scope2 / carbonData.total) * 100).toFixed(1) : '0.0',
    },
    {
      key: 3 as ScopeTab,
      label: '范围三·价值链',
      value: carbonData.scope3,
      color: scopeColors[3],
      percent: carbonData.total > 0 ? ((carbonData.scope3 / carbonData.total) * 100).toFixed(1) : '0.0',
    },
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

  const openAddModal = () => {
    setEditingId(null)
    setFormValues({
      category: '',
      value: '',
      source: 'manual',
      period: '2026-Q2',
    })
    setShowModal(true)
  }

  const openEditModal = (emission: CarbonEmission) => {
    setEditingId(emission.id)
    setFormValues({
      category: emission.category,
      value: String(emission.value),
      source: emission.source,
      period: emission.period,
    })
    setShowModal(true)
  }

  const handleSubmit = async () => {
    if (!formValues.category || !formValues.value) return

    try {
      if (editingId) {
        await updateCarbonEmission(editingId, {
          category: formValues.category,
          value: Number(formValues.value),
          source: formValues.source,
          period: formValues.period,
        })
      } else {
        await addCarbonEmission({
          companyId,
          scope: activeTab,
          category: formValues.category,
          value: Number(formValues.value),
          unit: 'tCO₂e',
          period: formValues.period,
          source: formValues.source,
        })
      }
      setShowModal(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这条排放记录吗？')) {
      try {
        await deleteCarbonEmission(id)
      } catch (e) {
        console.error(e)
      }
    }
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
        <button className="btn-primary flex items-center gap-2" onClick={openAddModal}>
          <Plus className="w-4 h-4" />
          录入数据
        </button>
      </div>

      <div className="glass-card p-1.5 flex gap-1">
        {([1, 2, 3] as ScopeTab[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === key
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="block">{scopeLabels[key].label}</span>
            <span className="block text-xs opacity-70 mt-0.5">{scopeLabels[key].sub}</span>
          </button>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-semibold text-white">
            {scopeLabels[activeTab].label} · {scopeLabels[activeTab].sub}
          </h3>
          <span className="text-xs text-slate-500">共 {filteredEmissions.length} 项</span>
        </div>
        <div className="overflow-x-auto">
          {filteredEmissions.length > 0 ? (
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
                {filteredEmissions.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3.5 text-white font-medium">{entry.category}</td>
                    <td className="px-6 py-3.5 text-right">
                      <span
                        className="stat-number text-lg"
                        style={{ color: scopeColors[activeTab] }}
                      >
                        {entry.value.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-300">
                      {entry.source === 'manual' ? '手动录入' : '设备对接'}
                    </td>
                    <td className="px-6 py-3.5 text-slate-400">
                      {entry.created_at ? entry.created_at.slice(0, 10) : '-'}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <button
                        onClick={() => openEditModal(entry)}
                        className="text-brand-400 hover:text-brand-300 text-xs font-medium mr-3 inline-flex items-center gap-1"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-accent-red hover:text-accent-red/80 text-xs font-medium inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center">
              <div className="text-slate-500 text-sm">暂无数据</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="section-title text-lg mb-6">碳足迹概览</h3>
          <div className="text-center mb-6">
            <span className="text-xs text-slate-400">总排放</span>
            <div className="mt-1">
              <span className="stat-number text-4xl text-white">
                {carbonData.total.toLocaleString()}
              </span>
              <span className="text-sm text-slate-500 ml-2">tCO₂e</span>
            </div>
          </div>
          <div className="space-y-4">
            {scopeBreakdown.map((item) => (
              <div
                key={item.key}
                className="cursor-pointer"
                onClick={() => setActiveTab(item.key)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-300">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-white">
                      {item.value.toLocaleString()} tCO₂e
                    </span>
                    <span className="text-xs text-slate-400 w-12 text-right">{item.percent}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: item.color,
                    }}
                  />
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
              <div key={plan.id} className="glass-card-hover p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium text-sm">{plan.name}</h4>
                  <span className={difficultyBadge[plan.difficulty]}>
                    {difficultyLabel[plan.difficulty]}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">预计减排</span>
                    <span className="text-accent-mint font-mono font-semibold text-sm">
                      {plan.expectedReduction}%
                    </span>
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
              <h3 className="section-title text-lg">
                {editingId ? '编辑碳排放数据' : '录入碳排放数据'}
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
                <label className="block text-sm text-slate-400 mb-1.5">排放类别</label>
                <input
                  className="input-field"
                  placeholder="请输入排放类别"
                  value={formValues.category}
                  onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">排放量 (tCO₂e)</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="请输入排放量"
                  value={formValues.value}
                  onChange={(e) => setFormValues({ ...formValues, value: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">数据来源</label>
                <select
                  className="input-field"
                  value={formValues.source}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      source: e.target.value as 'manual' | 'device',
                    })
                  }
                >
                  <option value="manual">手动录入</option>
                  <option value="device">设备对接</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">周期</label>
                <input
                  className="input-field"
                  placeholder="如：2026-Q2"
                  value={formValues.period}
                  onChange={(e) => setFormValues({ ...formValues, period: e.target.value })}
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
                  {editingId ? '保存修改' : '确认录入'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
