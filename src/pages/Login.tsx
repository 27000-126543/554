import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useStore } from '@/store'

export default function Login() {
  const navigate = useNavigate()
  const login = useStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    login({
      id: 'usr-001',
      companyId: 'c1',
      companyName: '绿源科技',
      email: email || 'admin@esgpro.com',
      role: 'enterprise',
      membershipLevel: 'gold',
      industry: '信息技术',
      region: '华东',
    })
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-surface via-surface-50 to-surface">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute inset-0 bg-radial-glow" />

      <div className="absolute top-20 left-20 w-72 h-72 bg-brand-500/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-400/8 rounded-full blur-[150px] animate-pulse-slow" />

      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in">
        <div className="glass-card p-8 shadow-2xl shadow-brand-500/5">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center mb-4 shadow-lg shadow-brand-500/30 animate-glow">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              ESG Pro
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              企业可持续发展数据管理平台
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="请输入密码"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border border-white/20 bg-surface-100/80 peer-checked:bg-brand-500 peer-checked:border-brand-500 transition-all duration-200 flex items-center justify-center">
                    {remember && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  记住我
                </span>
              </label>
              <a
                href="#"
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                忘记密码?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              还没有账户？{' '}
              <a
                href="/register"
                className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
              >
                立即注册
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
