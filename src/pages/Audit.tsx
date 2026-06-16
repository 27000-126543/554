import { useState, useEffect } from 'react'
import { useStore, type AuditFinding } from '@/store'
import {
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  MessageSquare,
  Send,
  Eye,
  X,
  Pencil,
  Plus,
  Loader2,
  Building2,
  Calendar,
  CheckCheck,
} from 'lucide-react'

const modules = ['碳排放', '环境指标', '社会指标', '治理指标'] as const
type ModuleKey = (typeof modules)[number]

const moduleData: Record<ModuleKey, { columns: string[]; rows: Array<Record<string, string>>; problemCheck?: (row: Record<string, string>) => boolean }> = {
  碳排放: {
    columns: ['类别', '排放量', '来源'],
    rows: [
      { 类别: '燃料燃烧', 排放量: '1,200 tCO₂e', 来源: '手动录入' },
      { 类别: '外购电力', 排放量: '890 tCO₂e', 来源: '设备对接' },
      { 类别: '工业生产', 排放量: '350 tCO₂e', 来源: '手动录入' },
      { 类别: '交通运输', 排放量: '560 tCO₂e', 来源: '设备对接' },
      { 类别: '废弃物处理', 排放量: '980 tCO₂e', 来源: '第三方数据' },
    ],
    problemCheck: (row) => parseFloat(row['排放量'].replace(/[^0-9.]/g, '')) > 900,
  },
  环境指标: {
    columns: ['指标', '当期值', '基准值', '单位'],
    rows: [
      { 指标: '能源消耗', 当期值: '45,200', 基准值: '42,000', 单位: 'kWh' },
      { 指标: '水资源消耗', 当期值: '12,800', 基准值: '12,000', 单位: '吨' },
      { 指标: '废弃物产生', 当期值: '2,800', 基准值: '3,000', 单位: '吨' },
      { 指标: '废水排放', 当期值: '5,200', 基准值: '5,000', 单位: '吨' },
      { 指标: '废气排放', 当期值: '1,800', 基准值: '2,000', 单位: '吨' },
    ],
    problemCheck: (row) => {
      const cur = parseFloat(row['当期值'].replace(/,/g, ''))
      const bench = parseFloat(row['基准值'].replace(/,/g, ''))
      return cur > bench
    },
  },
  社会指标: {
    columns: ['指标', '数值', '基准/要求', '备注'],
    rows: [
      { 指标: '员工总数', 数值: '1,256', '基准/要求': '—', 备注: '含新收购子公司' },
      { 指标: '安全事故率', 数值: '0.28%', '基准/要求': '<0.2%', 备注: '高于行业均值' },
      { 指标: '培训时长/人', 数值: '48h', '基准/要求': '≥40h', 备注: '超过年度目标' },
      { 指标: '女性管理层占比', 数值: '32%', '基准/要求': '≥30%', 备注: '持续改善' },
      { 指标: '员工满意度', 数值: '72%', '基准/要求': '≥75%', 备注: '未达预期目标' },
    ],
    problemCheck: (row) => {
      if (row['指标'] === '安全事故率') return parseFloat(row['数值']) > 0.2
      if (row['指标'] === '员工满意度') return parseFloat(row['数值']) < 75
      return false
    },
  },
  治理指标: {
    columns: ['指标', '数值', '合规要求', '备注'],
    rows: [
      { 指标: '独立董事占比', 数值: '40%', 合规要求: '≥33%', 备注: '4/10席' },
      { 指标: '董事会会议次数', 数值: '12', 合规要求: '≥4', 备注: '2025年度' },
      { 指标: '反腐败培训覆盖率', 数值: '92%', 合规要求: '100%', 备注: '8人缺席' },
      { 指标: '举报案件处理率', 数值: '100%', 合规要求: '100%', 备注: '3起全部结案' },
      { 指标: 'ESG委员会设立', 数值: '已设立', 合规要求: '必须设立', 备注: '正常运作' },
    ],
    problemCheck: (row) => {
      if (row['指标'] === '反腐败培训覆盖率') return parseFloat(row['数值']) < 100
      return false
    },
  },
}

export default function Audit() {
  const {
    user,
    auditSession,
    auditFindings: storeFindings,
    fetchAuditSession,
    submitAuditOpinion,
  } = useStore()

  const companyId = user?.companyId || 'c1'
  const [activeModule, setActiveModule] = useState<ModuleKey>('碳排放')
  const [localFindings, setLocalFindings] = useState<AuditFinding[]>([])
  const [opinion, setOpinion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [editingFinding, setEditingFinding] = useState<AuditFinding | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newFinding, setNewFinding] = useState<{ module: string; status: AuditFinding['status']; comment: string }>({
    module: '碳排放',
    status: 'compliant',
    comment: '',
  })
  const [localSession, setLocalSession] = useState<{ id: string } | null>(null)

  useEffect(() => {
    fetchAuditSession(companyId)
  }, [companyId, fetchAuditSession])

  useEffect(() => {
    setLocalFindings(storeFindings)
  }, [storeFindings])

  useEffect(() => {
    if (auditSession?.opinion) {
      setOpinion(auditSession.opinion)
    }
  }, [auditSession?.opinion])

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  const effectiveSession = auditSession || localSession

  const compliantCount = localFindings.filter((f) => f.status === 'compliant').length
  const nonCompliantCount = localFindings.filter((f) => f.status === 'non_compliant').length
  const auditedCount = compliantCount + nonCompliantCount

  const handleSubmitOpinion = async () => {
    if (!opinion.trim()) {
      showNotification('请填写审计意见', 'error')
      return
    }

    setSubmitting(true)
    try {
      let sessionId = effectiveSession?.id
      if (!sessionId) {
        sessionId = 'audit-local'
        setLocalSession({ id: sessionId })
      }

      await submitAuditOpinion(effectiveSession?.id || null, opinion.trim(), localFindings, {
        companyId,
        auditorId: user?.id || 'u4',
      })
      showNotification('审计意见提交成功')
    } catch (e) {
      showNotification('提交失败，请重试', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenEdit = (finding: AuditFinding) => {
    setEditingFinding({ ...finding })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    if (!editingFinding) return
    setLocalFindings((prev) =>
      prev.map((f) => (f.id === editingFinding.id ? editingFinding : f))
    )
    setShowEditModal(false)
    setEditingFinding(null)
    showNotification('修改已保存')
  }

  const handleAddFinding = () => {
    if (!newFinding.comment.trim()) {
      showNotification('请填写审计发现说明', 'error')
      return
    }
    const finding: AuditFinding = {
      id: 'af-' + Math.random().toString(36).slice(2, 8),
      module: newFinding.module,
      status: newFinding.status,
      comment: newFinding.comment,
    }
    setLocalFindings((prev) => [...prev, finding])
    setShowAddModal(false)
    setNewFinding({ module: '碳排放', status: 'compliant', comment: '' })
    showNotification('审计发现项已添加')
  }

  const statusText = auditSession?.status
  const statusBadge =
    statusText === 'in_progress' ? (
      <span className="badge-warning">进行中</span>
    ) : statusText === 'completed' ? (
      <span className="badge-success">已完成</span>
    ) : (
      <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
        未启动
      </span>
    )

  const isCompleted = auditSession?.status === 'completed'

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
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

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
          <div className="glass-card p-5 group hover:border-brand-400/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Clock className={`w-4 h-4 ${auditSession?.status === 'completed' ? 'text-accent-mint' : auditSession?.status === 'in_progress' ? 'text-accent-gold' : 'text-slate-500'}`} />
              <span className="text-slate-500 text-xs">审计状态</span>
            </div>
            <div className="mt-1">{statusBadge}</div>
          </div>
          <div className="glass-card p-5 group hover:border-brand-400/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-brand-400" />
              <span className="text-slate-500 text-xs">审计机构</span>
            </div>
            <p className="stat-number text-xl text-brand-400">德勤可持续服务</p>
          </div>
          <div className="glass-card p-5 group hover:border-brand-400/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-accent-blue" />
              <span className="text-slate-500 text-xs">开始日期</span>
            </div>
            <p className="stat-number text-xl text-accent-blue">
              {auditSession?.start_date?.slice(0, 10) || '2026-05-01'}
            </p>
          </div>
          <div className="glass-card p-5 group hover:border-brand-400/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <CheckCheck className="w-4 h-4 text-accent-mint" />
              <span className="text-slate-500 text-xs">已审模块</span>
            </div>
            <p className="stat-number text-xl text-accent-mint">
              {Math.min(auditedCount, 4)} / 4
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full" />
          数据调阅
        </h2>
        <div className="glass-card overflow-hidden">
          <div className="flex border-b border-white/5 overflow-x-auto">
            {modules.map((m) => (
              <button
                key={m}
                onClick={() => setActiveModule(m)}
                className={`px-5 py-3 text-sm font-medium transition-all duration-200 relative whitespace-nowrap ${
                  activeModule === m ? 'text-brand-400' : 'text-slate-400 hover:text-slate-300'
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
                {moduleData[activeModule].rows.map((row, ri) => {
                  const isProblem = moduleData[activeModule].problemCheck?.(row)
                  return (
                    <tr
                      key={ri}
                      className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                        isProblem ? 'bg-accent-red/[0.03]' : 'bg-accent-mint/[0.02]'
                      }`}
                    >
                      {moduleData[activeModule].columns.map((col, ci) => (
                        <td
                          key={ci}
                          className={`px-5 py-3 ${
                            ci === 0 ? 'text-slate-200 font-medium' : 'text-slate-400'
                          } ${isProblem ? '!text-accent-red' : ''}`}
                        >
                          <div className="flex items-center gap-2">
                            {isProblem && ci === 0 && (
                              <AlertCircle className="w-3.5 h-3.5 text-accent-red flex-shrink-0" />
                            )}
                            {!isProblem && ci === 0 && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-accent-mint flex-shrink-0" />
                            )}
                            {row[col]}
                          </div>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-slate-600 text-xs flex items-center gap-1.5">
              <Eye className="w-3 h-3" />
              只读模式 · 审计调阅数据
            </span>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-accent-mint">
                <CheckCircle2 className="w-3 h-3" />
                正常
              </span>
              <span className="flex items-center gap-1.5 text-accent-red">
                <AlertCircle className="w-3 h-3" />
                异常/超标
              </span>
            </div>
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
          {!isCompleted && (
            <button
              onClick={() => setShowAddModal(true)}
              className="ml-auto text-xs btn-secondary py-1.5 px-3 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              添加发现项
            </button>
          )}
        </h2>
        <div className="space-y-3">
          {localFindings.length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-500 text-sm">
              暂无审计发现项
            </div>
          ) : (
            localFindings.map((finding) => (
              <div
                key={finding.id}
                className={`glass-card-hover p-4 flex items-start gap-4 relative overflow-hidden ${
                  finding.status === 'compliant'
                    ? 'border-l-4 border-l-accent-mint'
                    : 'border-l-4 border-l-accent-red'
                }`}
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
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-slate-600 text-[10px] font-mono">{finding.id}</span>
                  {!isCompleted && (
                    <button
                      onClick={() => handleOpenEdit(finding)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full" />
          审计意见
        </h2>
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-400" />
              <span className="text-slate-400 text-sm">
                {isCompleted ? '最终审计意见' : '请撰写审计意见'}
              </span>
            </div>
            {isCompleted && auditSession?.end_date && (
              <span className="text-slate-500 text-xs font-mono">
                提交时间: {auditSession.end_date.slice(0, 16).replace('T', ' ')}
              </span>
            )}
          </div>
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            placeholder="请输入审计意见，包括总体评价、发现问题摘要、整改建议等..."
            rows={5}
            readOnly={isCompleted}
            className={`input-field resize-none mb-4 ${
              isCompleted ? 'opacity-80 cursor-not-allowed' : ''
            }`}
          />
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-xs">{opinion.length} 字</span>
            {!isCompleted && (
              <button
                onClick={handleSubmitOpinion}
                disabled={submitting || !opinion.trim()}
                className={`flex items-center gap-2 btn-primary ${
                  (!opinion.trim() || submitting) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    提交审计意见
                  </>
                )}
              </button>
            )}
            {isCompleted && (
              <span className="badge-success">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                审计已完成
              </span>
            )}
          </div>
        </div>
      </section>

      {showEditModal && editingFinding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-brand-400" />
                编辑审计发现
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingFinding(null)
                }}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-2 block">模块</label>
                <select
                  value={editingFinding.module}
                  onChange={(e) =>
                    setEditingFinding({ ...editingFinding, module: e.target.value })
                  }
                  className="input-field"
                >
                  {modules.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-2 block">状态</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingFinding({ ...editingFinding, status: 'compliant' })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      editingFinding.status === 'compliant'
                        ? 'bg-accent-mint/10 border-accent-mint/50 text-accent-mint'
                        : 'border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    合规
                  </button>
                  <button
                    onClick={() =>
                      setEditingFinding({ ...editingFinding, status: 'non_compliant' })
                    }
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      editingFinding.status === 'non_compliant'
                        ? 'bg-accent-red/10 border-accent-red/50 text-accent-red'
                        : 'border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    不合规
                  </button>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-2 block">说明</label>
                <textarea
                  value={editingFinding.comment}
                  onChange={(e) =>
                    setEditingFinding({ ...editingFinding, comment: e.target.value })
                  }
                  placeholder="请输入审计发现说明..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>
            <div className="p-5 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingFinding(null)
                }}
                className="btn-secondary"
              >
                取消
              </button>
              <button onClick={handleSaveEdit} className="btn-primary">
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-400" />
                添加审计发现
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewFinding({ module: '碳排放', status: 'compliant', comment: '' })
                }}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-slate-400 text-xs mb-2 block">模块</label>
                <select
                  value={newFinding.module}
                  onChange={(e) => setNewFinding({ ...newFinding, module: e.target.value })}
                  className="input-field"
                >
                  {modules.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-2 block">状态</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewFinding({ ...newFinding, status: 'compliant' })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      newFinding.status === 'compliant'
                        ? 'bg-accent-mint/10 border-accent-mint/50 text-accent-mint'
                        : 'border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    合规
                  </button>
                  <button
                    onClick={() => setNewFinding({ ...newFinding, status: 'non_compliant' })}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      newFinding.status === 'non_compliant'
                        ? 'bg-accent-red/10 border-accent-red/50 text-accent-red'
                        : 'border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    不合规
                  </button>
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-2 block">说明</label>
                <textarea
                  value={newFinding.comment}
                  onChange={(e) => setNewFinding({ ...newFinding, comment: e.target.value })}
                  placeholder="请输入审计发现说明..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
            </div>
            <div className="p-5 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setNewFinding({ module: '碳排放', status: 'compliant', comment: '' })
                }}
                className="btn-secondary"
              >
                取消
              </button>
              <button onClick={handleAddFinding} className="btn-primary">
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
