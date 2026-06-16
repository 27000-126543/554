import { useState } from 'react'
import { useStore } from '@/store'
import { Shield, Clock, CheckCircle2, AlertCircle, Search, MessageSquare, Send, Eye } from 'lucide-react'

const modules = ['碳排放', '环境指标', '社会指标', '治理指标'] as const
type ModuleKey = (typeof modules)[number]

const moduleData: Record<ModuleKey, { columns: string[]; rows: string[][] }> = {
  碳排放: {
    columns: ['范围', '排放量(tCO₂e)', '基准值', '同比变化', '数据来源'],
    rows: [
      ['Scope 1', '1,250', '1,380', '-9.4%', '企业台账'],
      ['Scope 2', '890', '980', '-9.2%', '电力发票'],
      ['Scope 3', '2,100', '2,350', '-10.6%', '供应商数据'],
      ['合计', '4,240', '4,710', '-10.0%', '汇总计算'],
    ],
  },
  环境指标: {
    columns: ['指标', '当期值', '基准值', '是否超标', '单位'],
    rows: [
      ['能源消耗', '45,200', '42,000', '是', 'kWh'],
      ['水资源消耗', '12,800', '12,000', '是', '吨'],
      ['废弃物产生', '3,200', '3,000', '是', '吨'],
    ],
  },
  社会指标: {
    columns: ['指标', '数值', '上年同期', '变化', '备注'],
    rows: [
      ['员工总数', '1,256', '1,180', '+6.4%', '含新收购子公司'],
      ['安全事故率', '0.12%', '0.18%', '-33.3%', '低于行业均值'],
      ['培训时长/人', '48h', '42h', '+14.3%', '超过年度目标'],
      ['女性管理层占比', '32%', '28%', '+4pp', '持续改善'],
    ],
  },
  治理指标: {
    columns: ['指标', '数值', '合规要求', '状态', '备注'],
    rows: [
      ['独立董事占比', '40%', '≥33%', '合规', '4/10席'],
      ['董事会会议次数', '12', '≥4', '合规', '2025年度'],
      ['反腐败培训覆盖率', '98%', '100%', '接近合规', '2人缺席'],
      ['举报案件处理率', '100%', '100%', '合规', '3起全部结案'],
    ],
  },
}

const overviewCards = [
  { label: '审计状态', value: '进行中', icon: Clock, accent: 'text-accent-gold' },
  { label: '审计机构', value: '德勤可持续服务', icon: Shield, accent: 'text-brand-400' },
  { label: '开始日期', value: '2026-05-01', icon: Clock, accent: 'text-accent-blue' },
  { label: '已审模块', value: '3/4', icon: CheckCircle2, accent: 'text-accent-mint' },
]

export default function Audit() {
  const { auditFindings } = useStore()
  const [activeModule, setActiveModule] = useState<ModuleKey>('碳排放')
  const [opinion, setOpinion] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleOpinionSubmit = () => {
    if (!opinion.trim()) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setOpinion('')
    }, 3000)
  }

  const compliantCount = auditFindings.filter((f) => f.status === 'compliant').length
  const nonCompliantCount = auditFindings.filter((f) => f.status === 'non_compliant').length

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title flex items-center gap-3">
          <Shield className="w-6 h-6 text-brand-400" />
          第三方审计
        </h1>
        <p className="text-slate-400 mt-1 text-sm">审计数据调阅、审计发现管理及审计意见提交</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full" />
          审计概览
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {overviewCards.map((card) => (
            <div key={card.label} className="glass-card p-5 group hover:border-brand-400/20 transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`w-4 h-4 ${card.accent}`} />
                <span className="text-slate-500 text-xs">{card.label}</span>
              </div>
              <p className={`stat-number text-xl ${card.accent}`}>{card.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full" />
          数据调阅
        </h2>
        <div className="glass-card overflow-hidden">
          <div className="flex border-b border-white/5">
            {modules.map((m) => (
              <button
                key={m}
                onClick={() => setActiveModule(m)}
                className={`px-5 py-3 text-sm font-medium transition-all duration-200 relative ${
                  activeModule === m
                    ? 'text-brand-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  {m}
                </span>
                {activeModule === m && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {moduleData[activeModule].columns.map((col) => (
                    <th key={col} className="text-left px-5 py-3 text-slate-400 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {moduleData[activeModule].rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className={`px-5 py-3 ${ci === 0 ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                        {cell === '是' ? (
                          <span className="text-accent-red text-xs font-medium">超标</span>
                        ) : cell === '合规' ? (
                          <span className="text-accent-mint text-xs font-medium">合规</span>
                        ) : cell === '接近合规' ? (
                          <span className="text-accent-gold text-xs font-medium">接近合规</span>
                        ) : cell.startsWith('-') ? (
                          <span className="text-accent-mint text-xs">{cell}</span>
                        ) : cell.startsWith('+') ? (
                          <span className="text-accent-gold text-xs">{cell}</span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-slate-600 text-xs flex items-center gap-1.5">
              <Eye className="w-3 h-3" />
              只读模式 · 审计调阅数据
            </span>
            <span className="text-slate-600 text-xs">
              共 {moduleData[activeModule].rows.length} 条记录
            </span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full" />
          审计发现
          <span className="text-xs text-slate-500 font-normal ml-2">
            合规 {compliantCount} · 不合规 {nonCompliantCount}
          </span>
        </h2>
        <div className="space-y-3">
          {auditFindings.map((finding) => (
            <div
              key={finding.id}
              className="glass-card-hover p-4 flex items-start gap-4"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  finding.status === 'compliant'
                    ? 'bg-accent-mint/10'
                    : 'bg-accent-red/10'
                }`}
              >
                {finding.status === 'compliant' ? (
                  <CheckCircle2 className="w-5 h-5 text-accent-mint" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-accent-red" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium text-sm">{finding.module}</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      finding.status === 'compliant' ? 'badge-success' : 'badge-danger'
                    }`}
                  >
                    {finding.status === 'compliant' ? '合规' : '不合规'}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{finding.comment}</p>
              </div>
              <span className="text-slate-600 text-[10px] font-mono flex-shrink-0">{finding.id}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full" />
          审计意见
        </h2>
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-brand-400" />
            <span className="text-slate-400 text-sm">请撰写审计意见</span>
          </div>
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            placeholder="请输入审计意见..."
            rows={4}
            className="input-field resize-none mb-4"
          />
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-xs">
              {opinion.length} 字
            </span>
            <button
              onClick={handleOpinionSubmit}
              disabled={!opinion.trim() || submitted}
              className={`flex items-center gap-2 ${
                submitted ? 'badge-success cursor-default' : 'btn-primary'
              } ${!opinion.trim() && !submitted ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  提交成功
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  提交意见
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
