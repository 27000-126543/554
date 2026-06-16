import { useState } from 'react'
import { FileDown, Download, CheckCircle2, Loader2 } from 'lucide-react'
import { useStore } from '@/store'

const periods = [
  { label: '月度', value: 'monthly' },
  { label: '季度', value: 'quarterly' },
  { label: '年度', value: 'yearly' },
]

const modules = [
  { label: '碳排放', key: 'carbon' },
  { label: '环境指标', key: 'environmental' },
  { label: '社会指标', key: 'social' },
  { label: '治理指标', key: 'governance' },
  { label: '综合评分', key: 'overall' },
]

const previewHeaders = ['企业名称', 'ESG评分', '碳排放趋势', '审计通过率', '用户满意度']

export default function ExportPage() {
  const { esgScore } = useStore()
  const [period, setPeriod] = useState('quarterly')
  const [startDate, setStartDate] = useState('2026-04-01')
  const [endDate, setEndDate] = useState('2026-06-30')
  const [selectedModules, setSelectedModules] = useState<Record<string, boolean>>({
    carbon: true,
    environmental: true,
    social: true,
    governance: true,
    overall: true,
  })
  const [exportState, setExportState] = useState<'idle' | 'loading' | 'success'>('idle')

  const toggleModule = (key: string) => {
    setSelectedModules(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleExport = () => {
    setExportState('loading')
    setTimeout(() => {
      setExportState('success')
      setTimeout(() => setExportState('idle'), 3000)
    }, 2000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="section-title mb-6 flex items-center gap-2">
            <FileDown className="w-5 h-5 text-brand-400" />
            导出配置
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">报告周期</label>
              <div className="flex gap-2">
                {periods.map(p => (
                  <button
                    key={p.value}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      period === p.value
                        ? 'bg-brand-500/20 text-brand-400 border border-brand-400/40'
                        : 'bg-surface-100/80 text-slate-400 border border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setPeriod(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">开始日期</label>
                <input
                  type="date"
                  className="input-field"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">结束日期</label>
                <input
                  type="date"
                  className="input-field"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-3">导出模块</label>
              <div className="space-y-2.5">
                {modules.map(m => (
                  <label
                    key={m.key}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/[0.02]"
                  >
                    <div
                      className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedModules[m.key]
                          ? 'bg-brand-500 border-brand-400'
                          : 'border-white/20 bg-transparent'
                      }`}
                      style={{ width: 18, height: 18 }}
                      onClick={() => toggleModule(m.key)}
                    >
                      {selectedModules[m.key] && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span className="text-sm text-slate-300">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="section-title mb-6">报告预览</h2>
          <div className="rounded-lg border border-white/5 overflow-hidden">
            <div className="bg-surface-100/60 px-5 py-3 border-b border-white/5">
              <p className="text-sm text-slate-400">
                ESG数据报告 · {startDate} 至 {endDate}
              </p>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {previewHeaders.map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-brand-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: '绿源科技', score: 85, trend: '↓ 3.2%', audit: '92%', satisfaction: '4.5/5' },
                  { name: '恒达制造', score: 78, trend: '↓ 1.8%', audit: '85%', satisfaction: '4.2/5' },
                  { name: '昌盟能源', score: 72, trend: '↑ 0.5%', audit: '78%', satisfaction: '3.8/5' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3 text-sm text-slate-200">{row.name}</td>
                    <td className="px-5 py-3 text-sm font-mono text-accent-mint">{row.score}</td>
                    <td className="px-5 py-3 text-sm font-mono text-accent-mint">{row.trend}</td>
                    <td className="px-5 py-3 text-sm font-mono">{row.audit}</td>
                    <td className="px-5 py-3 text-sm font-mono">{row.satisfaction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-surface-100/40 px-5 py-3 text-center">
              <span className="text-xs text-slate-500">... 共 6 家企业数据</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 rounded-lg bg-surface-100/60 p-4 border border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>当前ESG综合评分</span>
                <span className="text-brand-400 font-mono">{esgScore.total}/100</span>
              </div>
              <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                  style={{ width: `${esgScore.total}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between glass-card p-6">
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 text-brand-400" />
          <div>
            <p className="text-sm font-medium text-slate-200">准备导出报告</p>
            <p className="text-xs text-slate-400">
              已选 {Object.values(selectedModules).filter(Boolean).length} 个模块 · {periods.find(p => p.value === period)?.label}报告
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {exportState === 'success' && (
            <div className="flex items-center gap-2 text-accent-mint text-sm animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>导出成功！</span>
            </div>
          )}
          <button
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleExport}
            disabled={exportState === 'loading'}
          >
            {exportState === 'loading' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>导出报告</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
