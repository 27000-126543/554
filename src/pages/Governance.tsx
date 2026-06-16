import { AlertTriangle, FileText, Upload, Clock, CheckCircle2, UserCheck, Gavel } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useStore } from '@/store'

const genderData = [
  { name: '男性', value: 65 },
  { name: '女性', value: 35 },
]

const ageData = [
  { name: '30-40岁', value: 25 },
  { name: '40-50岁', value: 45 },
  { name: '50岁以上', value: 30 },
]

const backgroundData = [
  { name: '金融', value: 30 },
  { name: '技术', value: 25 },
  { name: '法律', value: 20 },
  { name: '管理', value: 25 },
]

const PIE_COLORS_TWO = ['#52B788', '#1B4332']
const PIE_COLORS_THREE = ['#52B788', '#2D6A4F', '#D4A574']
const PIE_COLORS_FOUR = ['#52B788', '#2D6A4F', '#D4A574', '#457B9D']

const complianceEvents = [
  { date: '2026-06-10', title: '环保法规更新合规审查', description: '新版《企业环境信息披露管理办法》生效，完成合规差距评估', severity: 'warning' as const },
  { date: '2026-05-28', title: '碳排放报告提交截止', description: '按期完成2025年度碳排放报告向主管部门提交', severity: 'success' as const },
  { date: '2026-04-15', title: '劳动用工合规违规事件', description: '子公司加班制度不符合当地法规，已启动整改程序', severity: 'danger' as const },
  { date: '2026-03-20', title: '反垄断合规培训完成', description: '全体高管及销售团队完成年度反垄断合规培训', severity: 'success' as const },
  { date: '2026-02-08', title: '数据隐私法规合规审计', description: '个人信息保护法合规审计发现2项待整改事项', severity: 'warning' as const },
]

const policyDocuments = [
  { name: '反腐败合规手册 v3.2', uploadDate: '2026-05-15', status: '生效中' },
  { name: '商业道德行为准则', uploadDate: '2026-03-22', status: '生效中' },
  { name: '礼品与招待政策', uploadDate: '2026-01-10', status: '更新中' },
  { name: '利益冲突申报指南', uploadDate: '2025-11-28', status: '生效中' },
  { name: '供应商廉洁协议模板', uploadDate: '2025-09-15', status: '生效中' },
]

const trainingRecords = [
  { name: '张伟', department: '财务部', course: '反腐败合规培训', date: '2026-06-01', status: '已完成' },
  { name: '李明', department: '采购部', course: '商业道德培训', date: '2026-05-28', status: '已完成' },
  { name: '王芳', department: '销售部', course: '反垄断合规培训', date: '2026-05-20', status: '已完成' },
  { name: '陈刚', department: '法务部', course: '数据隐私合规', date: '2026-05-15', status: '进行中' },
  { name: '赵丽', department: '人力资源部', course: '劳动法合规培训', date: '2026-05-10', status: '未完成' },
]

const renderPieLabel = ({ name, percent }: { name: string; percent: number }) =>
  `${name} ${(percent * 100).toFixed(0)}%`

export default function Governance() {
  const { esgScore } = useStore()

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">治理指标</h1>
          <p className="text-slate-400 text-sm mt-1">Governance Indicators — G维度得分 {esgScore.governance}</p>
        </div>
        <button className="btn-primary">录入数据</button>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-5 h-5 text-brand-400" />
          <h2 className="section-title text-lg">董事会多元化</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="glass-card p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2 text-center">性别分布</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={renderPieLabel} labelLine={{ stroke: '#94a3b8' }}>
                  {genderData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS_TWO[i]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1B2838', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2 text-center">年龄分布</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={ageData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={renderPieLabel} labelLine={{ stroke: '#94a3b8' }}>
                  {ageData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS_THREE[i]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1B2838', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2 text-center">专业背景</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={backgroundData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={renderPieLabel} labelLine={{ stroke: '#94a3b8' }}>
                  {backgroundData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS_FOUR[i]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1B2838', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Gavel className="w-5 h-5 text-accent-gold" />
          <h2 className="section-title text-lg">合规事件</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="glass-card-hover p-4">
            <p className="text-slate-400 text-xs mb-1">违规事件</p>
            <p className="stat-number text-accent-red">2<span className="text-lg">件</span></p>
          </div>
          <div className="glass-card-hover p-4">
            <p className="text-slate-400 text-xs mb-1">罚款金额</p>
            <p className="stat-number text-accent-gold">¥50<span className="text-lg">万</span></p>
          </div>
          <div className="glass-card-hover p-4">
            <p className="text-slate-400 text-xs mb-1">诉讼案件</p>
            <p className="stat-number text-accent-red">1<span className="text-lg">件</span></p>
          </div>
        </div>
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-slate-300 mb-4">合规事件时间线</h3>
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-brand-600/40" />
            <div className="space-y-4">
              {complianceEvents.map((event, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="mt-1.5 w-[15px] h-[15px] rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                    style={{
                      borderColor:
                        event.severity === 'danger' ? '#E76F51' :
                        event.severity === 'warning' ? '#D4A574' : '#52B788',
                      background: '#0D1B2A',
                    }}
                  >
                    <div className="w-[7px] h-[7px] rounded-full"
                      style={{
                        backgroundColor:
                          event.severity === 'danger' ? '#E76F51' :
                          event.severity === 'warning' ? '#D4A574' : '#52B788',
                      }}
                    />
                  </div>
                  <div className="flex-1 glass-card-hover p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-200 font-medium text-sm">{event.title}</span>
                      <span className={
                        event.severity === 'danger' ? 'badge-danger' :
                        event.severity === 'warning' ? 'badge-warning' : 'badge-success'
                      }>
                        {event.severity === 'danger' ? '严重' : event.severity === 'warning' ? '警告' : '正常'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mb-1">{event.description}</p>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{event.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-accent-mint" />
          <h2 className="section-title text-lg">反腐败政策</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-300">政策文件</h3>
              <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                上传文件
              </button>
            </div>
            <div className="space-y-2">
              {policyDocuments.map((doc, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-200 text-sm">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 text-xs">{doc.uploadDate}</span>
                    <span className={doc.status === '更新中' ? 'badge-warning' : 'badge-success'}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="glass-card p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">培训记录</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-2 text-slate-400 font-medium">姓名</th>
                      <th className="text-left py-2 px-2 text-slate-400 font-medium">部门</th>
                      <th className="text-left py-2 px-2 text-slate-400 font-medium">课程</th>
                      <th className="text-left py-2 px-2 text-slate-400 font-medium">日期</th>
                      <th className="text-left py-2 px-2 text-slate-400 font-medium">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainingRecords.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-2 px-2 text-slate-200">{row.name}</td>
                        <td className="py-2 px-2 text-slate-400 text-xs">{row.department}</td>
                        <td className="py-2 px-2 text-slate-300 text-xs">{row.course}</td>
                        <td className="py-2 px-2 text-slate-500 text-xs">{row.date}</td>
                        <td className="py-2 px-2">
                          <span className={
                            row.status === '已完成' ? 'badge-success' :
                            row.status === '进行中' ? 'badge-warning' : 'badge-danger'
                          }>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="glass-card-hover p-4">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-accent-gold" />
                <h3 className="text-sm font-medium text-slate-300">举报机制状态</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-100/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">举报渠道</p>
                  <p className="text-slate-200 text-sm font-medium">热线 / 邮箱 / 在线平台</p>
                </div>
                <div className="bg-surface-100/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">年度举报数</p>
                  <p className="stat-number text-accent-gold text-xl">8<span className="text-sm">件</span></p>
                </div>
                <div className="bg-surface-100/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">处理完成率</p>
                  <p className="stat-number text-accent-mint text-xl">100<span className="text-sm">%</span></p>
                </div>
                <div className="bg-surface-100/50 rounded-lg p-3">
                  <p className="text-slate-400 text-xs mb-1">保密保护</p>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-accent-mint" />
                    <span className="text-accent-mint text-sm font-medium">已启用</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
