import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Mail, Lock, Building2, Eye, EyeOff } from 'lucide-react'

const industries = ['信息技术', '制造业', '能源', '物流', '化工', '贸易', '金融', '其他']
const scales = [
  { value: 'large', label: '大型企业(>5000人)' },
  { value: 'medium', label: '中型企业(500-5000人)' },
  { value: 'small', label: '小型企业(<500人)' },
]

export default function Register() {
  const navigate = useNavigate()
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [scale, setScale] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    if (password.length < 6) {
      setError('密码长度至少6位')
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-surface via-surface-50 to-surface py-10">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute inset-0 bg-radial-glow" />

      <div className="absolute top-10 right-32 w-80 h-80 bg-brand-500/8 rounded-full blur-[130px] animate-pulse-slow" />
      <div className="absolute bottom-10 left-20 w-72 h-72 bg-brand-400/10 rounded-full blur-[120px] animate-pulse-slow" />

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
        <div className="glass-card p-8 shadow-2xl shadow-brand-500/5">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center mb-4 shadow-lg shadow-brand-500/30 animate-glow">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              ESG Pro
            </h1>
            <p className="text-sm text-slate-400 mt-1">创建企业账户</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 tracking-wide">
                企业名称
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="请输入企业名称"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 tracking-wide">
                  所属行业
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="input-field appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled className="bg-surface-100 text-slate-500">
                    选择行业
                  </option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind} className="bg-surface-100 text-slate-200">
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 tracking-wide">
                  企业规模
                </label>
                <select
                  value={scale}
                  onChange={(e) => setScale(e.target.value)}
                  className="input-field appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled className="bg-surface-100 text-slate-500">
                    选择规模
                  </option>
                  {scales.map((s) => (
                    <option key={s.value} value={s.value} className="bg-surface-100 text-slate-200">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 tracking-wide">
                邮箱地址
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 tracking-wide">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="至少6位密码"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 tracking-wide">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-accent-red bg-accent-red/10 border border-accent-red/20 rounded-lg px-3 py-2 animate-slide-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                '注册'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              已有账户？{' '}
              <a
                href="/login"
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                立即登录
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-slate-600">
            © 2026 ESG Pro · 企业可持续发展管理平台
          </p>
        </div>
      </div>
    </div>
  )
}
