import { create } from 'zustand'
import type { User } from './types'

export interface ESGScore {
  total: number
  environmental: number
  social: number
  governance: number
}

export interface CarbonEmission {
  id: string
  company_id: string
  scope: 1 | 2 | 3
  category: string
  value: number
  unit: string
  period: string
  source: 'manual' | 'device'
  created_at: string
}

export interface EnvironmentalMetric {
  id: string
  company_id: string
  type: 'energy' | 'water' | 'waste'
  subcategory: string
  value: number
  unit: string
  period: string
  benchmark_value: number | null
  is_exceeding: number
  created_at: string
}

export interface Report {
  id: string
  company_id: string
  template: 'GRI' | 'TCFD' | 'custom'
  status: 'draft' | 'pending_esg' | 'pending_cfo' | 'pending_ceo' | 'published' | 'rejected'
  period: string
  data: string | null
  created_at: string
  published_at: string | null
}

export interface ApprovalLog {
  id: string
  report_id: string
  approver_id: string
  role: string
  action: 'approve' | 'reject'
  comment: string | null
  created_at: string
}

export interface TodoItem {
  id: string
  title: string
  type: 'fill' | 'approve' | 'alert'
  deadline: string
  priority: 'high' | 'medium' | 'low'
}

export interface AlertItem {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: string
}

export interface ReductionPlan {
  id: string
  name: string
  expectedReduction: number
  difficulty: 'low' | 'medium' | 'high'
  rating: number
  description: string
}

export interface CompanyScore {
  companyId: string
  companyName: string
  industry: string
  region: string
  esgScore: number
  reportingRate: number
  reportStatus: string
  auditStatus: string
  membershipLevel: string
}

export interface AuditFinding {
  id: string
  module: string
  status: 'compliant' | 'non_compliant'
  comment: string
}

export interface AuditSession {
  id: string
  company_id: string
  auditor_id: string
  status: 'in_progress' | 'completed'
  opinion: string | null
  findings: string | null
  start_date: string
  end_date: string | null
}

const BASE_URL = '/api'

async function apiCall<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE_URL + path, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error || '请求失败')
  return json.data as T
}

const DEFAULT_COMPANY_ID = 'c1'

export function getEffectiveCompanyId(user: User | null): string {
  return user?.companyId || DEFAULT_COMPANY_ID
}

export interface AppState {
  user: User | null
  isAuthenticated: boolean
  sidebarCollapsed: boolean
  esgScore: ESGScore
  carbonData: {
    scope1: number
    scope2: number
    scope3: number
    total: number
    trend: Array<{ month: string; scope1: number; scope2: number; scope3: number }>
  }
  carbonEmissions: CarbonEmission[]
  envMetrics: EnvironmentalMetric[]
  reports: Report[]
  approvalLogs: ApprovalLog[]
  todos: TodoItem[]
  alerts: AlertItem[]
  reductionPlans: ReductionPlan[]
  companyScores: CompanyScore[]
  auditFindings: AuditFinding[]
  auditSession: AuditSession | null
  reportingRate: number
  dataCompleteness: number

  login: (user: User) => void
  logout: () => void
  toggleSidebar: () => void

  fetchCarbonEmissions: (companyId: string) => Promise<void>
  addCarbonEmission: (payload: { companyId: string; scope: 1 | 2 | 3; category: string; value: number; unit: string; period: string; source: 'manual' | 'device' }) => Promise<void>
  updateCarbonEmission: (id: string, payload: Partial<CarbonEmission>) => Promise<void>
  deleteCarbonEmission: (id: string) => Promise<void>
  recalcCarbonTotals: () => void

  fetchEnvMetrics: (companyId: string) => Promise<void>
  addEnvMetric: (payload: { companyId: string; type: EnvironmentalMetric['type']; subcategory: string; value: number; unit: string; period: string; benchmark_value: number | null }) => Promise<void>

  fetchReports: (companyId: string) => Promise<void>
  createReport: (payload: { companyId: string; template: Report['template']; period: string }) => Promise<void>
  approveReport: (payload: { reportId: string; approverId: string; role: string; action: 'approve' | 'reject'; comment?: string }) => Promise<void>
  fetchApprovalLogs: (reportId: string) => Promise<void>

  fetchAuditSession: (companyId: string) => Promise<void>
  submitAuditOpinion: (sessionId: string | null, opinion: string, findings: AuditFinding[], extras?: { companyId?: string; auditorId?: string }) => Promise<void>

  fetchAlerts: (companyId: string) => Promise<void>
  addAlert: (payload: { companyId: string; title: string; description: string; severity: AlertItem['severity'] }) => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  sidebarCollapsed: false,
  esgScore: { total: 72, environmental: 78, social: 65, governance: 73 },
  carbonData: {
    scope1: 1250,
    scope2: 890,
    scope3: 2100,
    total: 4240,
    trend: [
      { month: '2025-07', scope1: 1380, scope2: 980, scope3: 2350 },
      { month: '2025-08', scope1: 1350, scope2: 960, scope3: 2300 },
      { month: '2025-09', scope1: 1320, scope2: 940, scope3: 2260 },
      { month: '2025-10', scope1: 1300, scope2: 920, scope3: 2220 },
      { month: '2025-11', scope1: 1280, scope2: 910, scope3: 2180 },
      { month: '2025-12', scope1: 1260, scope2: 900, scope3: 2150 },
      { month: '2026-01', scope1: 1250, scope2: 890, scope3: 2100 },
      { month: '2026-02', scope1: 1240, scope2: 880, scope3: 2080 },
      { month: '2026-03', scope1: 1230, scope2: 870, scope3: 2050 },
      { month: '2026-04', scope1: 1220, scope2: 860, scope3: 2030 },
      { month: '2026-05', scope1: 1210, scope2: 850, scope3: 2010 },
      { month: '2026-06', scope1: 1250, scope2: 890, scope3: 2100 },
    ],
  },
  carbonEmissions: [],
  envMetrics: [],
  reports: [],
  approvalLogs: [],
  todos: [
    { id: 't1', title: '完成Q2碳排放数据录入', type: 'fill', deadline: '2026-06-30', priority: 'high' },
    { id: 't2', title: '审核Q1 ESG报告', type: 'approve', deadline: '2026-06-20', priority: 'high' },
    { id: 't3', title: '更新水耗基准值', type: 'fill', deadline: '2026-07-01', priority: 'medium' },
    { id: 't4', title: '提交董事会多元化数据', type: 'fill', deadline: '2026-07-05', priority: 'low' },
  ],
  alerts: [],
  reductionPlans: [
    { id: 'rp1', name: '清洁能源替代方案', expectedReduction: 15, difficulty: 'medium', rating: 4.5, description: '将30%电力切换至可再生能源，预计减少碳排放630吨CO₂e' },
    { id: 'rp2', name: '供应链绿色优化', expectedReduction: 12, difficulty: 'high', rating: 4, description: '优选低碳供应商，缩短物流链路，预计减少碳排放508吨CO₂e' },
    { id: 'rp3', name: '生产工艺节能改造', expectedReduction: 8, difficulty: 'low', rating: 3.5, description: '升级设备能效标准，优化生产流程，预计减少碳排放339吨CO₂e' },
    { id: 'rp4', name: '废弃物资源化利用', expectedReduction: 5, difficulty: 'low', rating: 3, description: '提升废料回收率至85%，预计减少碳排放212吨CO₂e' },
  ],
  companyScores: [
    { companyId: 'c1', companyName: '绿源科技', industry: '信息技术', region: '华东', esgScore: 85, reportingRate: 92, reportStatus: '已发布', auditStatus: '已通过', membershipLevel: 'diamond' },
    { companyId: 'c2', companyName: '恒达制造', industry: '制造业', region: '华南', esgScore: 78, reportingRate: 85, reportStatus: '审批中', auditStatus: '进行中', membershipLevel: 'gold' },
    { companyId: 'c3', companyName: '昌盟能源', industry: '能源', region: '华北', esgScore: 72, reportingRate: 78, reportStatus: '草稿', auditStatus: '未开始', membershipLevel: 'silver' },
    { companyId: 'c4', companyName: '惠通物流', industry: '物流', region: '西南', esgScore: 68, reportingRate: 70, reportStatus: '草稿', auditStatus: '未开始', membershipLevel: 'silver' },
    { companyId: 'c5', companyName: '鼎新材料', industry: '化工', region: '华东', esgScore: 62, reportingRate: 55, reportStatus: '未创建', auditStatus: '未开始', membershipLevel: 'bronze' },
    { companyId: 'c6', companyName: '远航贸易', industry: '贸易', region: '华南', esgScore: 58, reportingRate: 48, reportStatus: '未创建', auditStatus: '未开始', membershipLevel: 'bronze' },
  ],
  auditFindings: [
    { id: 'af1', module: '碳排放', status: 'compliant', comment: '数据完整，计算方法符合标准' },
    { id: 'af2', module: '环境指标', status: 'non_compliant', comment: '水耗数据缺失3个月记录' },
    { id: 'af3', module: '社会指标', status: 'compliant', comment: '员工安全数据记录完整' },
    { id: 'af4', module: '治理指标', status: 'compliant', comment: '董事会结构信息完整' },
  ],
  auditSession: null,
  reportingRate: 76,
  dataCompleteness: 82,

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  recalcCarbonTotals: () => {
    const { carbonEmissions } = get()
    let s1 = 0, s2 = 0, s3 = 0
    for (const e of carbonEmissions) {
      if (e.scope === 1) s1 += e.value
      else if (e.scope === 2) s2 += e.value
      else if (e.scope === 3) s3 += e.value
    }
    if (carbonEmissions.length === 0) return
    set((state) => ({
      carbonData: {
        ...state.carbonData,
        scope1: s1,
        scope2: s2,
        scope3: s3,
        total: s1 + s2 + s3,
      },
    }))
  },

  fetchCarbonEmissions: async (companyId) => {
    try {
      const data = await apiCall<CarbonEmission[]>(`/carbon/${companyId}`)
      set({ carbonEmissions: data })
      get().recalcCarbonTotals()
    } catch (e) {
      console.warn('fetch carbon failed', e)
    }
  },

  addCarbonEmission: async (payload) => {
    try {
      const data = await apiCall<{ id: string }>('/carbon', {
        method: 'POST',
        body: JSON.stringify({
          companyId: payload.companyId,
          scope: payload.scope,
          category: payload.category,
          value: payload.value,
          unit: payload.unit,
          period: payload.period,
          source: payload.source,
        }),
      })
      const newEmission: CarbonEmission = {
        id: data.id,
        company_id: payload.companyId,
        scope: payload.scope,
        category: payload.category,
        value: payload.value,
        unit: payload.unit,
        period: payload.period,
        source: payload.source,
        created_at: new Date().toISOString(),
      }
      set((state) => ({ carbonEmissions: [...state.carbonEmissions, newEmission] }))
      get().recalcCarbonTotals()
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  updateCarbonEmission: async (id, payload) => {
    try {
      await apiCall(`/carbon/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      set((state) => ({
        carbonEmissions: state.carbonEmissions.map((e) =>
          e.id === id ? { ...e, ...payload } : e
        ),
      }))
      get().recalcCarbonTotals()
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  deleteCarbonEmission: async (id) => {
    try {
      await apiCall(`/carbon/${id}`, { method: 'DELETE' })
      set((state) => ({
        carbonEmissions: state.carbonEmissions.filter((e) => e.id !== id),
      }))
      get().recalcCarbonTotals()
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  fetchEnvMetrics: async (companyId) => {
    try {
      const data = await apiCall<EnvironmentalMetric[]>(`/environment/${companyId}`)
      set({ envMetrics: data })
    } catch (e) {
      console.warn('fetch env metrics failed', e)
    }
  },

  addEnvMetric: async (payload) => {
    try {
      const isExceeding = payload.benchmark_value ? payload.value > payload.benchmark_value : false
      await apiCall('/environment', {
        method: 'POST',
        body: JSON.stringify({
          companyId: payload.companyId,
          type: payload.type,
          subcategory: payload.subcategory,
          value: payload.value,
          unit: payload.unit,
          period: payload.period,
          benchmarkValue: payload.benchmark_value,
        }),
      })
      const newMetric: EnvironmentalMetric = {
        id: Math.random().toString(36).slice(2, 10),
        company_id: payload.companyId,
        type: payload.type,
        subcategory: payload.subcategory,
        value: payload.value,
        unit: payload.unit,
        period: payload.period,
        benchmark_value: payload.benchmark_value ?? null,
        is_exceeding: isExceeding ? 1 : 0,
        created_at: new Date().toISOString(),
      }
      set((state) => ({
        envMetrics: [
          ...state.envMetrics.filter((m) => !(m.type === payload.type && m.period === payload.period)),
          newMetric,
        ],
      }))
      if (isExceeding) {
        const typeName = payload.type === 'energy' ? '能耗' : payload.type === 'water' ? '水耗' : '废弃物'
        const pct = payload.benchmark_value
          ? (((payload.value - payload.benchmark_value) / payload.benchmark_value) * 100).toFixed(1)
          : '0'
        await get().addAlert({
          companyId: payload.companyId,
          title: `${typeName}超标预警`,
          description: `${typeName}${payload.value}${payload.unit}，超出行业基准${pct}%`,
          severity: 'critical',
        })
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  fetchReports: async (companyId) => {
    try {
      const data = await apiCall<Report[]>(`/report/${companyId}`)
      set({ reports: data })
    } catch (e) {
      console.warn('fetch reports failed', e)
    }
  },

  createReport: async (payload) => {
    try {
      const data = await apiCall<{ id: string; status: Report['status'] }>('/report', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      const newReport: Report = {
        id: data.id,
        company_id: payload.companyId,
        template: payload.template,
        status: 'draft',
        period: payload.period,
        data: null,
        created_at: new Date().toISOString().slice(0, 10),
        published_at: null,
      }
      set((state) => ({ reports: [newReport, ...state.reports] }))
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  approveReport: async (payload) => {
    try {
      const data = await apiCall<{ id: string; status: Report['status'] }>(`/report/${payload.reportId}/approve`, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      set((state) => ({
        reports: state.reports.map((r) =>
          r.id === payload.reportId
            ? { ...r, status: data.status, published_at: data.status === 'published' ? new Date().toISOString().slice(0, 10) : r.published_at }
            : r
        ),
      }))
      const newLog: ApprovalLog = {
        id: Math.random().toString(36).slice(2, 10),
        report_id: payload.reportId,
        approver_id: payload.approverId,
        role: payload.role,
        action: payload.action,
        comment: payload.comment || null,
        created_at: new Date().toISOString(),
      }
      set((state) => ({ approvalLogs: [...state.approvalLogs, newLog] }))
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  fetchApprovalLogs: async (reportId) => {
    try {
      const data = await apiCall<ApprovalLog[]>(`/report/${reportId}/approvals`)
      set((state) => ({
        approvalLogs: [
          ...state.approvalLogs.filter((l) => l.report_id !== reportId),
          ...data,
        ],
      }))
    } catch (e) {
      console.warn(e)
    }
  },

  fetchAuditSession: async (companyId) => {
    try {
      const data = await apiCall<AuditSession[]>(`/audit/company/${companyId}`)
      if (data.length > 0) {
        const latest = data.sort((a, b) => (b.start_date || '').localeCompare(a.start_date || ''))[0]
        set({ auditSession: latest })
        if (latest.findings) {
          try {
            set({ auditFindings: JSON.parse(latest.findings) })
          } catch {}
        }
      } else {
        set({ auditSession: null })
      }
    } catch (e) {
      console.warn('fetch audit session failed', e)
    }
  },

  submitAuditOpinion: async (sessionId, opinion, findings, extras) => {
    try {
      const data = await apiCall<{ id: string }>(`/audit/${sessionId || 'stub'}/opinion`, {
        method: 'POST',
        body: JSON.stringify({
          opinion,
          findings,
          companyId: extras?.companyId || DEFAULT_COMPANY_ID,
          auditorId: extras?.auditorId || 'u4',
        }),
      })
      set((state) => ({
        auditSession: {
          id: data.id,
          company_id: extras?.companyId || state.auditSession?.company_id || DEFAULT_COMPANY_ID,
          auditor_id: extras?.auditorId || state.auditSession?.auditor_id || 'u4',
          status: 'completed',
          opinion,
          findings: JSON.stringify(findings),
          start_date: state.auditSession?.start_date || new Date().toISOString(),
          end_date: new Date().toISOString(),
        },
        auditFindings: findings,
      }))
    } catch (e) {
      console.error(e)
      throw e
    }
  },

  fetchAlerts: async (companyId) => {
    try {
      const data = await apiCall<AlertItem[]>(`/alert/${companyId}`)
      if (data.length > 0) {
        set({ alerts: data })
      }
    } catch (e) {
      console.warn('fetch alerts failed', e)
    }
  },

  addAlert: async (payload) => {
    try {
      await apiCall('/alert', {
        method: 'POST',
        body: JSON.stringify({
          companyId: payload.companyId,
          title: payload.title,
          description: payload.description,
          severity: payload.severity,
        }),
      })
    } catch (e) {
      console.warn('persist alert failed, using in-memory only', e)
    }
    const newAlert: AlertItem = {
      id: Math.random().toString(36).slice(2, 10),
      title: payload.title,
      description: payload.description,
      severity: payload.severity,
      timestamp: new Date().toISOString().slice(0, 10),
    }
    set((state) => ({ alerts: [newAlert, ...state.alerts] }))
  },
}))
