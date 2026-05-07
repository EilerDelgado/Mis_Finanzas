import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import logo from '../assets/inteligencia-de-negocio.png' 

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) setError('Credenciales inválidas. Intenta de nuevo.')
    else navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg shrink-0" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Mis <span className="text-emerald-400">Finanzas</span>
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Control de finanzas personales</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button type="submit" loading={loading} className="w-full justify-center mt-2">
            Ingresar
          </Button>

          <p className="text-center text-xs text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-emerald-400 hover:underline">Regístrate</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
