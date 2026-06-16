import { Crown, Award, Star, ArrowUp, ArrowRight } from 'lucide-react'
import { useStore } from '@/store'

const levels = [
  { key: 'bronze', label: '铜', icon: Award, color: '#CD7F32', score: 0 },
  { key: 'silver', label: '银', icon: Award, color: '#C0C0C0', score: 60 },
  { key: 'gold', label: '金', icon: Crown, color: '#FFD700', score: 90 },
  { key: 'diamond', label: '钻石', icon: Star, color: '#B9F2FF', score: 120 },
]

const benefits = [
  { name: '优先披露', bronze: false, silver: true, gold: true, diamond: true },
  { name: '行业对标报告', bronze: false, silver: false, gold: true, diamond: true },
  { name: '专属顾问', bronze: false, silver: false, gold: false, diamond: true },
  { name: 'API接口', bronze: false, silver: false, gold: true, diamond: true },
  { name: '定制化分析', bronze: false, silver: false, gold: false, diamond: true },
]

export default function Membership() {
  const { dataCompleteness, esgScore } = useStore()
  const currentLevel = 'silver'
  const currentScore = 82
  const nextThreshold = 90

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C0C0C0]/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-[#C0C0C0]/40 mb-4 animate-glow"
            style={{ boxShadow: '0 0 30px rgba(192,192,192,0.2)' }}>
            <Award className="w-10 h-10" style={{ color: '#C0C0C0' }} />
          </div>
          <h2 className="section-title text-2xl mb-1">当前等级</h2>
          <p className="text-4xl font-display font-bold mb-2" style={{ color: '#C0C0C0' }}>
            银 Silver
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div>
              <p className="text-slate-400 text-sm">ESG 评分</p>
              <p className="stat-number text-brand-400">{esgScore.total}</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-slate-400 text-sm">等级积分</p>
              <p className="stat-number text-[#C0C0C0]">{currentScore}</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-slate-400 text-sm">数据完整度</p>
              <p className="stat-number text-accent-mint">{dataCompleteness}%</p>
            </div>
          </div>
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>数据完整度</span>
              <span>{dataCompleteness}%</span>
            </div>
            <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-1000"
                style={{ width: `${dataCompleteness}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="section-title mb-4">等级阶梯</h2>
        <div className="grid grid-cols-4 gap-4">
          {levels.map((level, idx) => {
            const isCurrent = level.key === currentLevel
            const Icon = level.icon
            return (
              <div
                key={level.key}
                className={`glass-card-hover p-5 text-center relative ${
                  isCurrent ? 'ring-1' : ''
                }`}
                style={isCurrent ? { borderColor: `${level.color}40`, boxShadow: `0 0 25px ${level.color}25` } : {}}
              >
                {isCurrent && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${level.color}20`, color: level.color, border: `1px solid ${level.color}40` }}>
                    当前
                  </div>
                )}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 ${isCurrent ? 'animate-glow' : ''}`}
                  style={{
                    backgroundColor: `${level.color}15`,
                    border: `2px solid ${level.color}${isCurrent ? '60' : '25'}`,
                    boxShadow: isCurrent ? `0 0 20px ${level.color}30` : 'none',
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: level.color }} />
                </div>
                <p className="text-lg font-semibold" style={{ color: level.color }}>{level.label}</p>
                <p className="text-xs text-slate-400 mt-1">{level.score}分起</p>
                {idx < levels.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 z-10" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="section-title mb-4">权益对比</h2>
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">权益</th>
                {levels.map(l => (
                  <th key={l.key} className="text-center px-6 py-4 text-sm font-medium" style={{ color: l.color }}>
                    {l.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {benefits.map((b, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5 text-sm text-slate-300">{b.name}</td>
                  {(['bronze', 'silver', 'gold', 'diamond'] as const).map(lv => (
                    <td key={lv} className="text-center px-6 py-3.5 text-lg">
                      {b[lv] ? (
                        <span className="text-accent-mint">✓</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="section-title mb-4">升级路径</h2>
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C0C0C015', border: '1px solid #C0C0C030' }}>
                <Award className="w-4 h-4" style={{ color: '#C0C0C0' }} />
              </div>
              <span className="text-sm text-slate-300">银</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>{currentScore}分</span>
              <ArrowUp className="w-4 h-4 text-brand-400" />
              <span className="text-[#FFD700]">金级 {nextThreshold}分</span>
            </div>
          </div>
          <div className="relative">
            <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#C0C0C0] via-brand-400 to-[#FFD700] transition-all duration-1000"
                style={{ width: `${(currentScore / nextThreshold) * 100}%` }}
              />
            </div>
            <div className="absolute top-0 h-3" style={{ left: `${(currentScore / nextThreshold) * 100}%` }}>
              <div className="w-0.5 h-full bg-white/80 -translate-x-1/2" />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>0</span>
            <span>还需 {nextThreshold - currentScore} 分升级</span>
            <span>{nextThreshold}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
