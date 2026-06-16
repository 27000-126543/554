import { useState, useEffect } from 'react'
import { useStore, type Report as ReportType } from '@/store'
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  X,
  Send,
  AlertTriangle,
  Loader2,
  Sparkles,
  UserCheck,
} from 'lucide-react'

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

const periods = ['2025-Q4', '2026-Q1', '2026-Q2', '2026-Q3']

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: '草稿', className: 'bg-slate-500/10 text-slate-400 border border-slate-500/20' },
  pending_esg: { label: '待ESG负责人审批', className: 'badge-warning' },
  pending_cfo: { label: '待CFO审批', className: 'badge-warning' },
  pending_ceo: { label: '待CEO审批', className: 'badge-warning' },
  published: { label: '已发布', className: 'badge-success' },
  rejected: { label: '已驳回', className: 'badge-danger' },
}

const workflowSteps = [
  { key: 'esg', label: 'ESG负责人', role: 'esg_lead', icon: UserCheck },
  { key: 'cfo', label: 'CFO', role: 'cfo', icon: UserCheck },
  { key: 'ceo', label: 'CEO', role: 'ceo', icon: UserCheck },
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

function getApprovalRole(status: string): 'esg_lead' | 'cfo' | 'ceo' {
  if (status === 'pending_esg') return 'esg_lead'
  if (status === 'pending_cfo') return 'cfo'
  if (status === 'pending_ceo') return 'ceo'
  return 'esg_lead'
}

const roleLabels: Record<string, string> = {
  esg_lead: 'ESG负责人',
  cfo: 'CFO',
  ceo: 'CEO',
  auditor: '审计师',
  admin: '管理员',
}

export default function Report() {
  const {
    user,
    reports,
    approvalLogs,
    fetchReports,
    createReport,
    approveReport,
    fetchApprovalLogs,
  } = useStore()

  const companyId = user?.companyId || 'c1'
  const [selectedTemplate, setSelectedTemplate] = useState<'GRI' | 'TCFD' | 'custom'>('GRI')
  const [selectedPeriod, setSelectedPeriod] = useState('2026-Q2')
  const [generating, setGenerating] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalComment, setApprovalComment] = useState('')
  const [submittingApproval, setSubmittingApproval] = useState(false)

  useEffect(() => {
    fetchReports(companyId)
  }, [companyId, fetchReports])

  useEffect(() => {
    if (selectedReport) {
      fetchApprovalLogs(selectedReport.id)
    }
  }, [selectedReport, fetchApprovalLogs])

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      await createReport({
        companyId: 'c1',
        template: selectedTemplate,
        period: selectedPeriod,
      })
      showNotification(`报告生成成功！模板: ${selectedTemplate}, 期间: ${selectedPeriod}`)
    } catch (e) {
      showNotification('报告生成失败，请重试', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleViewDetail = (report: ReportType) => {
    setSelectedReport(report)
    setShowDetailModal(true)
  }

  const handleOpenApproval = async (report: ReportType) => {
    setSelectedReport(report)
    setShowApprovalModal(true)
    setApprovalComment('')
  }

  const handleApprove = async (action: 'approve' | 'reject') => {
    if (!selectedReport) return
    if (action === 'reject' && !approvalComment.trim()) {
      showNotification('驳回需要填写原因', 'error')
      return
    }

    setSubmittingApproval(true)
    try {
      await approveReport({
        reportId: selectedReport.id,
        approverId: user?.id || 'u-current',
        role: getApprovalRole(selectedReport.status),
        action,
        comment: approvalComment.trim() || undefined,
      })
      showNotification(action === 'approve' ? '审批通过成功' : '已驳回报告', 'success')
      setShowApprovalModal(false)
      setApprovalComment('')
    } catch (e) {
      showNotification('操作失败，请重试', 'error')
    } finally {
      setSubmittingApproval(false)
    }
  }

  const rejectionLog = selectedReport
    ? approvalLogs
        .filter((l) => l.report_id === selectedReport.id && l.action === 'reject')
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
    : null

  const renderApprovalWorkflow = (report: ReportType) => {
    const workflow = getWorkflowStatus(report.status)
    return (
      <div className="glass-card p-6">
        <div className="flex items-center justify-center gap-0">
          {workflowSteps.map((step, idx) => {
            const isCompleted = workflow.completed.includes(idx)
            const isCurrent = workflow.current === idx
            const isRejected = report.status === 'rejected'

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
                  <span
                    className={`mt-2 text-sm font-medium ${
                      isCompleted
                        ? 'text-brand-400'
                        : isCurrent
                        ? 'text-accent-gold'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <div className="mx-3 flex flex-col items-center">
                    <ArrowRight
                      className={`w-5 h-5 ${isCompleted ? 'text-brand-400' : 'text-slate-600'}`}
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
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in relative">
      {showToast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg animate-slide-up ${
            toastType === 'success'
              ? 'bg-brand-500/10 border-brand-400/30 text-brand-300'
              : 'bg-accent-red/10 border-accent-red/30 text-accent-red'
          }`}
        >
          {toastType === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="section-title flex items-center gap-3">
          <FileText className="w-6 h-6 text-brand-400" />
          ESG报告生成
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          选择报告模板，生成ESG披露报告并管理审批流程
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full" />
          模板与周期选择
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="glass-card p-5 flex flex-col">
            <label className="text-slate-400 text-xs mb-2">报告期间</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field mb-auto"
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>已选模板:</span>
                  <span className="text-brand-400 font-medium">{selectedTemplate}</span>
                </div>
                <div className="flex justify-between">
                  <span>已选期间:</span>
                  <span className="text-brand-400 font-medium">{selectedPeriod}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className={`btn-primary flex items-center gap-2 text-base px-8 py-3 ${
            generating ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              生成报告
            </>
          )}
        </button>
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
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                      暂无报告数据
                    </td>
                  </tr>
                ) : (
                  reports.map((r) => {
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
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sc.className}`}
                          >
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                          {r.created_at.slice(0, 10)}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleViewDetail(r)}
                              className="text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1 text-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              查看详情
                            </button>
                            <button
                              onClick={() => handleOpenApproval(r)}
                              className={`transition-colors flex items-center gap-1 text-xs ${
                                r.status === 'draft'
                                  ? 'text-accent-gold hover:text-accent-gold/80'
                                  : r.status.startsWith('pending')
                                  ? 'text-accent-gold hover:text-accent-gold/80'
                                  : 'text-slate-500 hover:text-slate-400'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {r.status === 'draft'
                                ? '发起审批'
                                : r.status.startsWith('pending')
                                ? '审批'
                                : '查看审批'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-400" />
                报告详情
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <p className="text-slate-500 text-xs mb-1">报告编号</p>
                  <p className="font-mono text-brand-300">{selectedReport.id}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-slate-500 text-xs mb-1">状态</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedReport.status].className}`}
                  >
                    {statusConfig[selectedReport.status].label}
                  </span>
                </div>
                <div className="glass-card p-4">
                  <p className="text-slate-500 text-xs mb-1">模板</p>
                  <p className="text-white font-medium">{selectedReport.template}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-slate-500 text-xs mb-1">报告期间</p>
                  <p className="text-white font-medium">{selectedReport.period}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-slate-500 text-xs mb-1">创建时间</p>
                  <p className="font-mono text-slate-300 text-sm">
                    {selectedReport.created_at.slice(0, 10)}
                  </p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-slate-500 text-xs mb-1">发布时间</p>
                  <p className="font-mono text-slate-300 text-sm">
                    {selectedReport.published_at?.slice(0, 10) || '—'}
                  </p>
                </div>
              </div>

              {selectedReport.status === 'rejected' && rejectionLog && (
                <div className="p-4 rounded-xl bg-accent-red/10 border border-accent-red/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-accent-red" />
                    <span className="text-accent-red font-medium text-sm">驳回原因</span>
                  </div>
                  <p className="text-slate-300 text-sm">{rejectionLog.comment}</p>
                  <p className="text-slate-500 text-xs mt-2">
                    驳回人: {roleLabels[rejectionLog.role] || rejectionLog.role} ·{' '}
                    {rejectionLog.created_at.slice(0, 10)}
                  </p>
                </div>
              )}

              {selectedReport.status === 'published' && (
                <div className="p-4 rounded-xl bg-accent-mint/10 border border-accent-mint/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-mint" />
                    <span className="text-accent-mint font-medium text-sm">报告已发布</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    发布时间: {selectedReport.published_at?.slice(0, 10)}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-slate-300 font-medium text-sm mb-3">审批工作流</h4>
                {renderApprovalWorkflow(selectedReport)}
              </div>
            </div>
            <div className="p-5 border-t border-white/5 flex justify-end">
              <button onClick={() => setShowDetailModal(false)} className="btn-secondary">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {showApprovalModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-3xl max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-400" />
                审批工作流
              </h3>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500">
                      报告: <span className="font-mono text-brand-300">{selectedReport.id}</span>
                    </span>
                    <span className="text-slate-500">
                      模板: <span className="text-white">{selectedReport.template}</span>
                    </span>
                    <span className="text-slate-500">
                      期间: <span className="text-white">{selectedReport.period}</span>
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedReport.status].className}`}
                  >
                    {statusConfig[selectedReport.status].label}
                  </span>
                </div>
              </div>

              {renderApprovalWorkflow(selectedReport)}

              {selectedReport.status === 'rejected' && rejectionLog && (
                <div className="p-4 rounded-xl bg-accent-red/10 border border-accent-red/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-accent-red" />
                    <span className="text-accent-red font-medium text-sm">驳回原因</span>
                  </div>
                  <p className="text-slate-300 text-sm">{rejectionLog.comment}</p>
                  <p className="text-slate-500 text-xs mt-2">
                    驳回人: {roleLabels[rejectionLog.role] || rejectionLog.role} ·{' '}
                    {rejectionLog.created_at.slice(0, 10)}
                  </p>
                </div>
              )}

              {selectedReport.status === 'published' && (
                <div className="p-4 rounded-xl bg-accent-mint/10 border border-accent-mint/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-mint" />
                    <span className="text-accent-mint font-medium text-sm">报告已发布</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    发布时间: {selectedReport.published_at?.slice(0, 10)}
                  </p>
                </div>
              )}

              {(selectedReport.status === 'draft' ||
                selectedReport.status === 'pending_esg' ||
                selectedReport.status === 'pending_cfo' ||
                selectedReport.status === 'pending_ceo') && (
                <div className="glass-card p-5">
                  <h4 className="text-slate-300 font-medium text-sm mb-4">
                    {selectedReport.status === 'draft' ? '发起审批' : '审批操作'}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-xs mb-2 block">审批意见</label>
                      <textarea
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        placeholder={
                          selectedReport.status === 'draft'
                            ? '请输入发起审批说明（可选）...'
                            : selectedReport.status.startsWith('pending')
                            ? '请输入审批意见（驳回时必填）...'
                            : '请输入审批意见...'
                        }
                        rows={3}
                        className="input-field resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      {selectedReport.status !== 'draft' && (
                        <button
                          onClick={() => handleApprove('reject')}
                          disabled={submittingApproval}
                          className="btn-danger flex items-center gap-2"
                        >
                          {submittingApproval ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                          驳回
                        </button>
                      )}
                      <button
                        onClick={() => handleApprove('approve')}
                        disabled={submittingApproval}
                        className="btn-primary flex items-center gap-2"
                      >
                        {submittingApproval ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : selectedReport.status === 'draft' ? (
                          <Send className="w-4 h-4" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {selectedReport.status === 'draft' ? '发起审批' : '通过'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-slate-300 font-medium text-sm mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-400" />
                  审批记录
                </h4>
                <div className="space-y-2">
                  {approvalLogs.filter((l) => l.report_id === selectedReport.id).length === 0 ? (
                    <div className="glass-card p-6 text-center text-slate-500 text-sm">
                      暂无审批记录
                    </div>
                  ) : (
                    approvalLogs
                      .filter((l) => l.report_id === selectedReport.id)
                      .sort((a, b) => b.created_at.localeCompare(a.created_at))
                      .map((log) => (
                        <div
                          key={log.id}
                          className="glass-card p-4 flex items-start gap-3"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              log.action === 'approve'
                                ? 'bg-accent-mint/10'
                                : 'bg-accent-red/10'
                            }`}
                          >
                            {log.action === 'approve' ? (
                              <CheckCircle2 className="w-4 h-4 text-accent-mint" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-accent-red" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-white font-medium">
                                {roleLabels[log.role] || log.role}
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                  log.action === 'approve'
                                    ? 'badge-success'
                                    : 'badge-danger'
                                }`}
                              >
                                {log.action === 'approve' ? '通过' : '驳回'}
                              </span>
                              <span className="text-slate-500 text-xs ml-auto font-mono">
                                {log.created_at.slice(0, 16).replace('T', ' ')}
                              </span>
                            </div>
                            {log.comment && (
                              <p className="text-slate-400 text-sm mt-1">{log.comment}</p>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-white/5 flex justify-end">
              <button onClick={() => setShowApprovalModal(false)} className="btn-secondary">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
