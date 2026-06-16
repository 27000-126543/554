import { useState } from 'react'
import { useStore } from '@/store'
import { FileText, CheckCircle2, Clock, ArrowRight, Eye } from 'lucide-react'

const templates = [
  {
    key: 'GRI' as const,
    name: 'GRI',
    subtitle: '全球报告倡议组织',
    description: '全球报告倡议组织标准，适用全面披露',
    suitability: '适用于需要全面ESG信息披露的企业',
    icon: '🌍',
  },
  {
    key: 'TCFD' as const,
    name: 'TCFD',
    subtitle: '气候相关财务信息披露',
    description: '气候相关财务信息披露，侧重气候风险',
    suitability: '适用于面临气候风险敞口的金融与实体企业',
    icon: '🌡️',
  },
  {
    key: 'custom' as const,
    name: '自定义',
    subtitle: '企业定制模板',
    description: '根据企业需求定制模板',
    suitability: '适用于有特定披露需求的企业',
    icon: '⚙️',
  },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: '草稿', className: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' },
  pending_esg: { label: '待ESG审批', className: 'badge-warning' },
  pending_cfo: { label: '待CFO审批', className: 'badge-warning' },
  pending_ceo: { label: '待CEO审批', className: 'badge-warning' },
  published: { label: '已发布', className: 'badge-success' },
  rejected: { label: '已驳回', className: 'badge-danger' },
}

const workflowSteps = [
  { key: 'esg', label: 'ESG负责人', role: 'ESG Lead' },
  { key: 'cfo', label: 'CFO', role: 'Chief Financial Officer' },
  { key: 'ceo', label: 'CEO', role: 'Chief Executive Officer' },
]

function getWorkflowStatus(reportStatus: string) {
  if (reportStatus === 'draft') return { completed: [], current: -1 }
  if (reportStatus === 'pending_esg') return { completed: [], current: 0 }
  if (reportStatus === 'pending_cfo') return { completed: [0], current: 1 }
  if (reportStatus === 'pending_ceo') return { completed: [0, 1], current: 2 }
  if (reportStatus === 'published') return { completed: [0, 1, 2], current: -1 }
  if (reportStatus === 'rejected') return { completed: [0, 1], current: -1 }
  return { completed: [], current: -1 }
}

export default function Report() {
  const { reports } = useStore()
  const [selectedTemplate, setSelectedTemplate] = useState<'GRI' | 'TCFD' | 'custom'>('GRI')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const activeReport = reports.find((r) => r.status !== 'draft' && r.status !== 'published') || reports[1]
  const workflow = getWorkflowStatus(activeReport.status)

  const handleGenerate = () => {
    setGenerating(true)
    setGenerated(false)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
      setTimeout(() => setGenerated(false), 3000)
    }, 2000)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="section-title flex items-center gap-3">
          <FileText className="w-6 h-6 text-brand-400" />
          ESG报告生成
        </h1>
        <p className="text-slate-400 mt-1 text-sm">选择报告模板，生成ESG披露报告并管理审批流程</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full" />
          模板选择
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((t) => (
            <button
              key={t.key}
              onClick={() => setSelectedTemplate(t.key)}
              className={`glass-card-hover p-5 text-left transition-all duration-300 relative overflow-hidden group ${
                selectedTemplate === t.key
                  ? 'border-brand-400/60 shadow-lg shadow-brand-400/10 ring-1 ring-brand-400/30'
                  : ''
              }`}
            >
              {selectedTemplate === t.key && (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400/5 to-transparent pointer-events-none" />
              )}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{t.icon}</span>
                  {selectedTemplate === t.key && (
                    <CheckCircle2 className="w-5 h-5 text-brand-400" />
                  )}
                </div>
                <h3 className="text-white font-semibold text-lg">{t.name}</h3>
                <p className="text-brand-300 text-xs mt-0.5">{t.subtitle}</p>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{t.description}</p>
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-slate-500 text-xs">
                    <span className="text-brand-400/80">适用场景：</span>
                    {t.suitability}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full" />
          报告列表
        </h2>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-3.5 text-slate-400 font-medium">报告编号</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-medium">模板</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-medium">期间</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-medium">状态</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-medium">创建时间</th>
                  <th className="text-left px-5 py-3.5 text-slate-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => {
                  const sc = statusConfig[r.status]
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono text-brand-300 text-xs">{r.id}</td>
                      <td className="px-5 py-3.5 text-white font-medium">{r.template}</td>
                      <td className="px-5 py-3.5 text-slate-300">{r.period}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sc.className}`}>
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{r.createdAt}</td>
                      <td className="px-5 py-3.5">
                        <button className="text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1 text-xs">
                          <Eye className="w-3.5 h-3.5" />
                          查看
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full" />
          审批工作流
        </h2>
        <div className="glass-card p-6">
          <div className="flex items-center justify-center gap-0">
            {workflowSteps.map((step, idx) => {
              const isCompleted = workflow.completed.includes(idx)
              const isCurrent = workflow.current === idx
              const isRejected = activeReport.status === 'rejected'

              return (
                <div key={step.key} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isCompleted
                          ? 'bg-brand-500/20 border-brand-400 shadow-lg shadow-brand-400/20'
                          : isCurrent
                          ? 'bg-accent-gold/10 border-accent-gold shadow-lg shadow-accent-gold/20 animate-pulse-slow'
                          : 'bg-surface-100/50 border-white/10'
                      } ${isRejected && idx === workflow.completed.length ? 'opacity-40' : ''}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-7 h-7 text-brand-400" />
                      ) : isCurrent ? (
                        <Clock className="w-7 h-7 text-accent-gold" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-white/5" />
                      )}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${isCompleted ? 'text-brand-400' : isCurrent ? 'text-accent-gold' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-slate-600 mt-0.5">{step.role}</span>
                  </div>
                  {idx < workflowSteps.length - 1 && (
                    <div className="mx-3 flex flex-col items-center">
                      <ArrowRight
                        className={`w-5 h-5 ${
                          isCompleted ? 'text-brand-400' : 'text-slate-600'
                        }`}
                      />
                      <div
                        className={`w-16 h-0.5 mt-1 ${
                          isCompleted ? 'bg-brand-400/60' : 'bg-white/5'
                        }`}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              当前报告：<span className="text-slate-300 font-mono">{activeReport.id}</span>
              <span className="mx-2">·</span>
              模板：<span className="text-slate-300">{activeReport.template}</span>
              <span className="mx-2">·</span>
              期间：<span className="text-slate-300">{activeReport.period}</span>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[activeReport.status].className}`}>
              {statusConfig[activeReport.status].label}
            </span>
          </div>
        </div>
      </section>

      <section className="flex items-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className={`btn-primary flex items-center gap-2 text-base px-8 py-3 ${
            generating ? 'opacity-70 cursor-not-allowed' : ''
          } ${generated ? '!bg-accent-mint/20 !border-accent-mint !text-accent-mint' : ''}`}
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              生成中...
            </>
          ) : generated ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              生成成功
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              生成报告
            </>
          )}
        </button>
        <span className="text-slate-500 text-sm">
          模板：<span className="text-brand-400">{templates.find((t) => t.key === selectedTemplate)?.name}</span>
        </span>
      </section>
    </div>
  )
}
