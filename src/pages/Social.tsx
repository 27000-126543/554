import { Users, Heart, ShieldCheck } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useStore } from '@/store'

const safetyTrend = [
  { month: '1月', incidents: 3 },
  { month: '2月', incidents: 2 },
  { month: '3月', incidents: 4 },
  { month: '4月', incidents: 1 },
  { month: '5月', incidents: 2 },
  { month: '6月', incidents: 1 },
]

const safetyMetrics = [
  { 指标: '工伤率', 数值: '0.12%', 单位: '%', 录入时间: '2026-06-15' },
  { 指标: '年度培训时长', 数值: '48', 单位: 'h', 录入时间: '2026-06-10' },
  { 指标: '员工满意度', 数值: '82', 单位: '%', 录入时间: '2026-06-01' },
  { 指标: '安全事故数', 数值: '13', 单位: '件', 录入时间: '2026-06-15' },
  { 指标: '职业健康体检率', 数值: '96', 单位: '%', 录入时间: '2026-05-28' },
]

const communityProjects = [
  { name: '乡村教育扶持计划', status: '进行中', budget: '¥35万' },
  { name: '绿色社区共建项目', status: '已完成', budget: '¥28万' },
  { name: '困难家庭帮扶行动', status: '进行中', budget: '¥22万' },
  { name: '青少年科技启蒙计划', status: '筹备中', budget: '¥18万' },
  { name: '老年人关怀服务', status: '进行中', budget: '¥15万' },
  { name: '灾区紧急援助基金', status: '已完成', budget: '¥10万' },
]

const complaints = [
  { id: 'CP-001', 产品: '工业传感器X200', 投诉类型: '质量缺陷', 投诉日期: '2026-06-12', 状态: '处理中' },
  { id: 'CP-002', 产品: '智能控制器V3', 投诉类型: '功能异常', 投诉日期: '2026-06-08', 状态: '已解决' },
  { id: 'CP-003', 产品: '环境监测仪E100', 投诉类型: '交付延迟', 投诉日期: '2026-05-30', 状态: '已解决' },
  { id: 'CP-004', 产品: '工业传感器X200', 投诉类型: '售后服务', 投诉日期: '2026-05-22', 状态: '已解决' },
  { id: 'CP-005', 产品: '数据采集模块D50', 投诉类型: '质量缺陷', 投诉日期: '2026-05-15', 状态: '处理中' },
]

export default function Social() {
  const { esgScore } = useStore()

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">社会指标</h1>
          <p className="text-slate-400 text-sm mt-1">Social Indicators — S维度得分 {esgScore.social}</p>
        </div>
        <button className="btn-primary">录入数据</button>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-brand-400" />
          <h2 className="section-title text-lg">员工安全</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card-hover p-4">
                <p className="text-slate-400 text-xs mb-1">工伤率</p>
                <p className="stat-number text-brand-400">0.12<span className="text-lg">%</span></p>
              </div>
              <div className="glass-card-hover p-4">
                <p className="text-slate-400 text-xs mb-1">年度培训时长</p>
                <p className="stat-number text-accent-mint">48<span className="text-lg">h</span></p>
              </div>
              <div className="glass-card-hover p-4">
                <p className="text-slate-400 text-xs mb-1">员工满意度</p>
                <p className="stat-number text-accent-gold">82<span className="text-lg">%</span></p>
              </div>
            </div>
            <div className="glass-card p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-3">月度安全事故趋势</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={safetyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Tooltip
                    contentStyle={{ background: '#1B2838', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="incidents" stroke="#52B788" strokeWidth={2} dot={{ fill: '#52B788', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3">员工安全数据明细</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">指标</th>
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">数值</th>
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">单位</th>
                    <th className="text-left py-2 px-3 text-slate-400 font-medium">录入时间</th>
                  </tr>
                </thead>
                <tbody>
                  {safetyMetrics.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-3 text-slate-200">{row.指标}</td>
                      <td className="py-2.5 px-3 text-brand-400 font-mono">{row.数值}</td>
                      <td className="py-2.5 px-3 text-slate-400">{row.单位}</td>
                      <td className="py-2.5 px-3 text-slate-500 text-xs">{row.录入时间}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-accent-gold" />
          <h2 className="section-title text-lg">社区贡献</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="glass-card-hover p-4">
            <p className="text-slate-400 text-xs mb-1">公益投入</p>
            <p className="stat-number text-accent-gold">¥128<span className="text-lg">万</span></p>
          </div>
          <div className="glass-card-hover p-4">
            <p className="text-slate-400 text-xs mb-1">志愿服务</p>
            <p className="stat-number text-brand-400">2,400<span className="text-lg">h</span></p>
          </div>
          <div className="glass-card-hover p-4">
            <p className="text-slate-400 text-xs mb-1">社区项目</p>
            <p className="stat-number text-accent-mint">12<span className="text-lg">个</span></p>
          </div>
        </div>
        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">社区项目列表</h3>
          <div className="space-y-2">
            {communityProjects.map((project, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-400" />
                  <span className="text-slate-200 text-sm">{project.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm">{project.budget}</span>
                  <span className={
                    project.status === '已完成' ? 'badge-success' :
                    project.status === '进行中' ? 'badge-warning' : 'badge-danger'
                  }>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-accent-mint" />
          <h2 className="section-title text-lg">产品责任</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="glass-card-hover p-4">
            <p className="text-slate-400 text-xs mb-1">产品召回率</p>
            <p className="stat-number text-brand-400">0.03<span className="text-lg">%</span></p>
          </div>
          <div className="glass-card-hover p-4">
            <p className="text-slate-400 text-xs mb-1">客户投诉</p>
            <p className="stat-number text-accent-red">156<span className="text-lg">件</span></p>
          </div>
          <div className="glass-card-hover p-4">
            <p className="text-slate-400 text-xs mb-1">质量认证</p>
            <p className="stat-number text-accent-mint text-xl">ISO 9001/14001</p>
          </div>
        </div>
        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-slate-300 mb-3">近期投诉记录</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">编号</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">产品</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">投诉类型</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">投诉日期</th>
                  <th className="text-left py-2 px-3 text-slate-400 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-xs">{row.id}</td>
                    <td className="py-2.5 px-3 text-slate-200">{row.产品}</td>
                    <td className="py-2.5 px-3 text-slate-300">{row.投诉类型}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-xs">{row.投诉日期}</td>
                    <td className="py-2.5 px-3">
                      <span className={row.状态 === '处理中' ? 'badge-warning' : 'badge-success'}>
                        {row.状态}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
