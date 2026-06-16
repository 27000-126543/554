import { useState } from 'react'
import { Download, FileDown, CheckCircle2, Loader2, Calendar, BarChart3 } from 'lucide-react'
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

const previewHeaders = ['企业名称', 'ESG评分', '碳排放总量(tCO₂e)', '审计通过率', '用户满意度']

function formatDateYYYYMMDD(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export default function ExportPage() {
  const { esgScore, carbonData, companyScores } = useStore()
  const [period, setPeriod] = useState('monthly')
  const [startDate, setStartDate] = useState('2026-06-01')
  const [endDate, setEndDate] = useState('2026-06-16')
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'carbon',
    'environmental',
    'social',
    'governance',
    'overall',
  ])
  const [exportState, setExportState] = useState<'idle' | 'loading' | 'success'>('idle')

  const toggleModule = (key: string) => {
    setSelectedModules(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const handleExport = () => {
    setExportState('loading')

    setTimeout(() => {
      const today = new Date()
      const todayStr = formatDateYYYYMMDD(today)
      const periodLabel = periods.find(p => p.value === period)?.label || '月度'

      const mainCompany = companyScores.find(c => c.companyName === '绿源科技')
      const otherCompanies = companyScores.filter(c => c.companyName !== '绿源科技')
      const orderedCompanies = mainCompany ? [mainCompany, ...otherCompanies] : companyScores

      let csv = '\ufeff'
      csv += '企业名称,ESG评分,碳排放总量(tCO₂e),范围一排放,范围二排放,范围三排放,审计通过率(%),用户满意度(%)\n'

      let totalESG = 0
      let totalCarbon = 0
      let totalScope1 = 0
      let totalScope2 = 0
      let totalScope3 = 0
      let auditSum = 0
      let satisfactionSum = 0
      let count = 0

      orderedCompanies.forEach((company, idx) => {
        let scope1: number, scope2: number, scope3: number, carbonTotal: number
        let auditRate: number, satisfaction: number

        if (company.companyName === '绿源科技') {
          scope1 = carbonData.scope1
          scope2 = carbonData.scope2
          scope3 = carbonData.scope3
          carbonTotal = carbonData.total
          auditRate = 75
          satisfaction = 88
        } else {
          const base = company.esgScore
          const seed1 = company.companyName.charCodeAt(0) + idx * 7
          const seed2 = company.companyName.charCodeAt(company.companyName.length - 1) + idx * 11
          const seed3 = idx * 13 + base

          scope1 = Math.round(base * 12 + pseudoRandom(seed1) * 500)
          scope2 = Math.round(base * 8 + pseudoRandom(seed2) * 400)
          scope3 = Math.round(base * 18 + pseudoRandom(seed3) * 800)
          carbonTotal = scope1 + scope2 + scope3
          auditRate = Math.round(50 + pseudoRandom(seed1 + 3) * 45)
          satisfaction = Math.round(60 + pseudoRandom(seed2 + 5) * 35)
        }

        totalESG += company.esgScore
        totalCarbon += carbonTotal
        totalScope1 += scope1
        totalScope2 += scope2
        totalScope3 += scope3
        auditSum += auditRate
        satisfactionSum += satisfaction
        count++

        csv += `${company.companyName},${company.esgScore},${carbonTotal},${scope1},${scope2},${scope3},${auditRate},${satisfaction}\n`
      })

      const avgESG = count > 0 ? Math.round(totalESG / count) : 0
      const avgAudit = count > 0 ? Math.round(auditSum / count) : 0
      const avgSatisfaction = count > 0 ? Math.round(satisfactionSum / count) : 0

      csv += `合计/平均,${avgESG},${totalCarbon},${totalScope1},${totalScope2},${totalScope3},${avgAudit},${avgSatisfaction}\n`
      csv += '\n'
      csv += '月度碳排放趋势\n'
      csv += '月份,范围一,范围二,范围三,总量\n'

      carbonData.trend.forEach(t => {
        const monthTotal = t.scope1 + t.scope2 + t.scope3
        csv += `${t.month},${t.scope1},${t.scope2},${t.scope3},${monthTotal}\n`
      })

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ESG运营报表_${periodLabel}_${todayStr}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportState('success')
      setTimeout(() => setExportState('idle'), 3000)
    }, 1200)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title flex items-center gap-2">
          <FileDown className="w-6 h-6 text-brand-400" />
          月度ESG运营报表导出
        </h1>
      </div>

      <div className="glass-card p-6">
        <h2 className="section-title mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-400" />
          导出配置
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-slate-400 mb-2">周期选择</label>
            <div className="flex gap-2">
              {periods.map(p => (
                <button
                  key={p.value}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    period === p.value
                      ? 'bg-brand-600 text-white border border-brand-500'
                      : 'bg-transparent text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-200'
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
            <label className="block text-sm text-slate-400 mb-3">模块勾选</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {modules.map(m => (
                <label
                  key={m.key}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/[0.02] border border-white/5"
                >
                  <div
                    className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedModules.includes(m.key)
                        ? 'bg-brand-500 border-brand-400'
                        : 'border-white/20 bg-transparent'
                    }`}
                    style={{ width: 18, height: 18 }}
                    onClick={() => toggleModule(m.key)}
                  >
                    {selectedModules.includes(m.key) && (
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
        <h2 className="section-title mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-400" />
          报表预览
        </h2>
        <div className="rounded-lg border border-white/5 overflow-hidden">
          <div className="bg-surface-100/60 px-5 py-3 border-b border-white/5">
            <p className="text-sm text-slate-400">
              ESG数据报告 · {startDate} 至 {endDate}
            </p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-brand-600/30 border-b border-white/5">
                {previewHeaders.map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium text-brand-300 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5">
                <td className="px-5 py-3 text-sm text-slate-200">绿源科技</td>
                <td className="px-5 py-3 text-sm font-mono text-brand-400 stat-number">{esgScore.total}</td>
                <td className="px-5 py-3 text-sm font-mono text-slate-200 stat-number">{carbonData.total.toLocaleString()}</td>
                <td className="px-5 py-3 text-sm font-mono">
                  <span className="badge-success">75%</span>
                </td>
                <td className="px-5 py-3 text-sm font-mono">
                  <span className="badge-warning">88%</span>
                </td>
              </tr>
              {companyScores.filter(c => c.companyName !== '绿源科技').slice(0, 2).map((c, i) => {
                const seed = i + c.esgScore
                const carbTotal = Math.round(c.esgScore * 38 + pseudoRandom(seed) * 1500)
                const audit = Math.round(55 + pseudoRandom(seed + 1) * 35)
                const sat = Math.round(65 + pseudoRandom(seed + 2) * 25)
                return (
                  <tr key={c.companyId} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3 text-sm text-slate-200">{c.companyName}</td>
                    <td className="px-5 py-3 text-sm font-mono text-slate-300">{c.esgScore}</td>
                    <td className="px-5 py-3 text-sm font-mono text-slate-300">{carbTotal.toLocaleString()}</td>
                    <td className="px-5 py-3 text-sm font-mono">
                      <span className={audit >= 80 ? 'badge-success' : audit >= 60 ? 'badge-warning' : 'badge-danger'}>{audit}%</span>
                    </td>
                    <td className="px-5 py-3 text-sm font-mono">
                      <span className={sat >= 80 ? 'badge-success' : sat >= 70 ? 'badge-warning' : 'badge-danger'}>{sat}%</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="bg-surface-100/40 px-5 py-3 text-center">
            <span className="text-xs text-slate-500">... 共 {companyScores.length} 家企业数据</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-surface-100/60 p-4 border border-white/5">
            <p className="text-xs text-slate-400 mb-1">当前ESG综合评分</p>
            <p className="text-2xl font-bold text-brand-400 stat-number">{esgScore.total}<span className="text-sm text-slate-500 ml-1">/100</span></p>
          </div>
          <div className="rounded-lg bg-surface-100/60 p-4 border border-white/5">
            <p className="text-xs text-slate-400 mb-1">碳排放总量</p>
            <p className="text-2xl font-bold text-accent-mint stat-number">{carbonData.total.toLocaleString()}<span className="text-sm text-slate-500 ml-1">tCO₂e</span></p>
          </div>
          <div className="rounded-lg bg-surface-100/60 p-4 border border-white/5">
            <p className="text-xs text-slate-400 mb-1">已选模块</p>
            <p className="text-2xl font-bold text-accent-gold stat-number">{selectedModules.length}<span className="text-sm text-slate-500 ml-1">/ {modules.length}</span></p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between glass-card p-6">
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5 text-brand-400" />
          <div>
            <p className="text-sm font-medium text-slate-200">准备导出报告</p>
            <p className="text-xs text-slate-400">
              已选 {selectedModules.length} 个模块 · {periods.find(p => p.value === period)?.label}报告
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {exportState === 'success' && (
            <div className="flex items-center gap-2 badge-success animate-fade-in px-4 py-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>报表导出成功</span>
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
                <span>正在生成...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>导出报表 Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
