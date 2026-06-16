import { useState, useMemo } from 'react'
import { Filter, BarChart3 } from 'lucide-react'
import { useStore } from '@/store'

const levelColors: Record<string, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  diamond: '#B9F2FF',
}

const levelLabels: Record<string, string> = {
  bronze: '铜',
  silver: '银',
  gold: '金',
  diamond: '钻石',
}

export default function Admin() {
  const { companyScores } = useStore()
  const [industryFilter, setIndustryFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')

  const industries = useMemo(() => [...new Set(companyScores.map(c => c.industry))], [companyScores])
  const regions = useMemo(() => [...new Set(companyScores.map(c => c.region))], [companyScores])

  const filtered = useMemo(() => {
    return companyScores.filter(c => {
      if (industryFilter && c.industry !== industryFilter) return false
      if (regionFilter && c.region !== regionFilter) return false
      if (levelFilter && c.membershipLevel !== levelFilter) return false
      return true
    })
  }, [companyScores, industryFilter, regionFilter, levelFilter])

  const stats = useMemo(() => {
    const data = filtered.length ? filtered : companyScores
    const total = data.length
    const avgScore = data.reduce((s, c) => s + c.esgScore, 0) / total
    const avgRate = data.reduce((s, c) => s + c.reportingRate, 0) / total
    const passRate = data.filter(c => c.auditStatus === '已通过').length / total * 100
    return { total, avgScore: avgScore.toFixed(1), avgRate: avgRate.toFixed(1), passRate: passRate.toFixed(0) }
  }, [filtered, companyScores])

  const getHeatColor = (rate: number) => {
    if (rate >= 80) return 'bg-accent-mint/60 border-accent-mint/30'
    if (rate >= 60) return 'bg-accent-gold/50 border-accent-gold/30'
    return 'bg-accent-red/50 border-accent-red/30'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-brand-400" />
          <select className="input-field w-auto min-w-[140px]" value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}>
            <option value="">全部行业</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select className="input-field w-auto min-w-[140px]" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
            <option value="">全部区域</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select className="input-field w-auto min-w-[140px]" value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
            <option value="">全部等级</option>
            <option value="bronze">铜</option>
            <option value="silver">银</option>
            <option value="gold">金</option>
            <option value="diamond">钻石</option>
          </select>
          {(industryFilter || regionFilter || levelFilter) && (
            <button
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              onClick={() => { setIndustryFilter(''); setRegionFilter(''); setLevelFilter('') }}
            >
              清除筛选
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '企业总数', value: stats.total, suffix: '', icon: BarChart3, color: 'text-brand-400' },
          { label: '平均ESG评分', value: stats.avgScore, suffix: '', icon: BarChart3, color: 'text-accent-mint' },
          { label: '平均填报率', value: stats.avgRate, suffix: '%', icon: BarChart3, color: 'text-accent-gold' },
          { label: '审计通过率', value: stats.passRate, suffix: '%', icon: BarChart3, color: 'text-accent-blue' },
        ].map(s => (
          <div key={s.label} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-sm text-slate-400">{s.label}</span>
            </div>
            <p className={`stat-number ${s.color}`}>
              {s.value}<span className="text-lg">{s.suffix}</span>
            </p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="section-title mb-4">企业评分排行</h2>
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['企业名称', '行业', '区域', 'ESG评分', '填报率', '报告状态', '审计状态', '等级'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered
                .sort((a, b) => b.esgScore - a.esgScore)
                .map(c => (
                <tr key={c.companyId} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm text-slate-200 font-medium">{c.companyName}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{c.industry}</td>
                  <td className="px-5 py-3 text-sm text-slate-400">{c.region}</td>
                  <td className="px-5 py-3">
                    <span className={`font-mono font-semibold ${c.esgScore >= 80 ? 'text-accent-mint' : c.esgScore >= 60 ? 'text-accent-gold' : 'text-accent-red'}`}>
                      {c.esgScore}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-sm font-mono ${c.reportingRate >= 80 ? 'text-accent-mint' : c.reportingRate >= 60 ? 'text-accent-gold' : 'text-accent-red'}`}>
                      {c.reportingRate}%
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      c.reportStatus === '已发布' ? 'bg-accent-mint/10 text-accent-mint border-accent-mint/20' :
                      c.reportStatus === '审批中' ? 'bg-accent-gold/10 text-accent-gold border-accent-gold/20' :
                      'bg-surface-100 text-slate-400 border-white/10'
                    }`}>
                      {c.reportStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      c.auditStatus === '已通过' ? 'badge-success' :
                      c.auditStatus === '进行中' ? 'badge-warning' :
                      'bg-surface-100 text-slate-400 border-white/10'
                    }`}>
                      {c.auditStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: `${levelColors[c.membershipLevel]}15`,
                        color: levelColors[c.membershipLevel],
                        border: `1px solid ${levelColors[c.membershipLevel]}30`,
                      }}
                    >
                      {levelLabels[c.membershipLevel]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="section-title mb-4">填报率热力图</h2>
        <div className="glass-card p-6">
          <div className="flex items-center gap-6 mb-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-accent-mint/60 border border-accent-mint/30" /> ≥80%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-accent-gold/50 border border-accent-gold/30" /> 60-80%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-accent-red/50 border border-accent-red/30" /> &lt;60%
            </span>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(companyScores.length, 6)}, 1fr)` }}>
            {companyScores.map(c => (
              <div
                key={c.companyId}
                className={`rounded-lg p-4 border text-center transition-all duration-200 hover:scale-105 cursor-default ${getHeatColor(c.reportingRate)}`}
              >
                <p className="text-sm font-medium text-white/90 mb-1">{c.companyName}</p>
                <p className="font-mono text-lg font-bold text-white">{c.reportingRate}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
