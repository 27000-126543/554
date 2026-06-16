import { create } from 'zustand'

interface User {
  id: string
  companyName: string
  email: string
  role: 'enterprise' | 'esg_lead' | 'cfo' | 'ceo' | 'auditor' | 'admin'
  membershipLevel: 'bronze' | 'silver' | 'gold' | 'diamond'
  industry: string
  region: string
}

interface ESGScore {
  total: number
  environmental: number
  social: number
  governance: number
}

interface CarbonData {
  scope1: number
  scope2: number
  scope3: number
  total: number
  trend: Array<{ month: string; scope1: number; scope2: number; scope3: number }>
}

interface EnvironmentalData {
  energy: number
  water: number
  waste: number
  energyBenchmark: number
  waterBenchmark: number
  wasteBenchmark: number
  energyExceeding: boolean
  waterExceeding: boolean
  wasteExceeding: boolean
}

interface Report {
  id: string
  template: 'GRI' | 'TCFD' | 'custom'
  status: 'draft' | 'pending_esg' | 'pending_cfo' | 'pending_ceo' | 'published' | 'rejected'
  period: string
  createdAt: string
}

interface TodoItem {
  id: string
  title: string
  type: 'fill' | 'approve' | 'alert'
  deadline: string
  priority: 'high' | 'medium' | 'low'
}

interface AlertItem {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: string
}

interface ReductionPlan {
  id: string
  name: string
  expectedReduction: number
  difficulty: 'low' | 'medium' | 'high'
  rating: number
  description: string
}

interface CompanyScore {
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

interface AuditFinding {
  id: string
  module: string
  status: 'compliant' | 'non_compliant'
  comment: string
}

interface AppState {
  user: User | null
  isAuthenticated: boolean
  sidebarCollapsed: boolean
  esgScore: ESGScore
  carbonData: CarbonData
  environmentalData: EnvironmentalData
  reports: Report[]
  todos: TodoItem[]
  alerts: AlertItem[]
  reductionPlans: ReductionPlan[]
  companyScores: CompanyScore[]
  auditFindings: AuditFinding[]
  reportingRate: number
  dataCompleteness: number

  login: (user: User) => void
  logout: () => void
  toggleSidebar: () => void
  setEsgScore: (score: ESGScore) => void
  setCarbonData: (data: CarbonData) => void
  setEnvironmentalData: (data: EnvironmentalData) => void
  setReports: (reports: Report[]) => void
  setTodos: (todos: TodoItem[]) => void
  setAlerts: (alerts: AlertItem[]) => void
  setCompanyScores: (scores: CompanyScore[]) => void
}

export type {
  User,
  ESGScore,
  CarbonData,
  EnvironmentalData,
  Report,
  TodoItem,
  AlertItem,
  ReductionPlan,
  CompanyScore,
  AuditFinding,
}

export const useStore = create<AppState>((set) => ({
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
  environmentalData: {
    energy: 45200,
    water: 12800,
    waste: 3200,
    energyBenchmark: 42000,
    waterBenchmark: 12000,
    wasteBenchmark: 3000,
    energyExceeding: true,
    waterExceeding: true,
    wasteExceeding: true,
  },
  reports: [
    { id: 'rpt-001', template: 'GRI', status: 'published', period: '2025-Q4', createdAt: '2026-01-15' },
    { id: 'rpt-002', template: 'TCFD', status: 'pending_ceo', period: '2026-Q1', createdAt: '2026-04-20' },
    { id: 'rpt-003', template: 'GRI', status: 'draft', period: '2026-Q2', createdAt: '2026-06-10' },
  ],
  todos: [
    { id: 't1', title: '完成Q2碳排放数据录入', type: 'fill', deadline: '2026-06-30', priority: 'high' },
    { id: 't2', title: '审核Q1 ESG报告', type: 'approve', deadline: '2026-06-20', priority: 'high' },
    { id: 't3', title: '更新水耗基准值', type: 'fill', deadline: '2026-07-01', priority: 'medium' },
    { id: 't4', title: '提交董事会多元化数据', type: 'fill', deadline: '2026-07-05', priority: 'low' },
  ],
  alerts: [
    { id: 'a1', title: '能耗超标预警', description: '本月能耗45,200kWh，超出行业基准7.6%', severity: 'critical', timestamp: '2026-06-15' },
    { id: 'a2', title: '水耗接近上限', description: '水耗12,800吨，超出基准6.7%', severity: 'warning', timestamp: '2026-06-14' },
    { id: 'a3', title: 'Q1报告审批到期', description: 'TCFD报告待CEO审批，距截止日5天', severity: 'warning', timestamp: '2026-06-15' },
  ],
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
  reportingRate: 76,
  dataCompleteness: 82,

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setEsgScore: (score) => set({ esgScore: score }),
  setCarbonData: (data) => set({ carbonData: data }),
  setEnvironmentalData: (data) => set({ environmentalData: data }),
  setReports: (reports) => set({ reports }),
  setTodos: (todos) => set({ todos }),
  setAlerts: (alerts) => set({ alerts }),
  setCompanyScores: (scores) => set({ companyScores: scores }),
}))
