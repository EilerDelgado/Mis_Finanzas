import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'

export default function Register() {
  const { signUp } = useAuth()
  const navigate   = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [done, setDone]       = useState(false)  // Supabase envía email de confirmación

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    const { data, error } = await signUp(form.email, form.password)

    if (error) {
      setError(error.message)
    } else if (data?.user?.identities?.length === 0) {
      // Supabase devuelve esto cuando el email ya existe pero no está confirmado
      setError('Este correo ya está registrado.')
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Revisa tu correo</h2>
          <p className="text-sm text-gray-400">
            Te enviamos un enlace de confirmación a <span className="text-gray-200">{form.email}</span>.
            Haz clic en él para activar tu cuenta.
          </p>
          <Link to="/login" className="inline-block text-sm text-emerald-400 hover:underline">
            Ir al login →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#10b981"/>
            <path d="M8 22 L12 16 L16 19 L20 12 L24 15" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="24" cy="15" r="2" fill="white"/>
          </svg>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Finance<span className="text-emerald-400">Track</span>
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Crea tu cuenta gratis</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Correo electrónico</label>
            <input
              type="email" name="email" required
              value={form.email} onChange={handleChange}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Contraseña</label>
            <input
              type="password" name="password" required
              value={form.password} onChange={handleChange}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirmar contraseña</label>
            <input
              type="password" name="confirm" required
              value={form.confirm} onChange={handleChange}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full justify-center mt-2">
            Crear cuenta
          </Button>

          <p className="text-center text-xs text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-emerald-400 hover:underline">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
