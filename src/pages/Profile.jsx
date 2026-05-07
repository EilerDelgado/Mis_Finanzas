import { useState } from 'react'
import { Shell } from '../components/layout/Shell'
import { Card, CardHeader, CardBody } from '../components/ui/index'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const INPUT_CLS = 'w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors'

export default function Profile() {
  const { session, profile } = useAuth() 
  const email = session?.user?.email ?? ''

  const [name, setName]         = useState(profile?.display_name ?? '')
  const [saving, setSaving]     = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  // Cambiar contraseña
  const [pwForm, setPwForm]     = useState({ current: '', next: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError]   = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  async function handleSaveName(e) {
    e.preventDefault()
    if (!name.trim()) { setError('El nombre no puede estar vacío.'); return }
    setSaving(true)
    setError('')
    setSuccess(false)

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: name.trim() })
      .eq('id', session.user.id)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      // Refresca el perfil en el contexto
      await loadProfile(session.user.id)
    }
    setSaving(false)
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)

    if (pwForm.next !== pwForm.confirm) {
      setPwError('Las contraseñas nuevas no coinciden.')
      return
    }
    if (pwForm.next.length < 6) {
      setPwError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setPwSaving(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.next })
    if (error) setPwError(error.message)
    else {
      setPwSuccess(true)
      setPwForm({ current: '', next: '', confirm: '' })
    }
    setPwSaving(false)
  }

  return (
    <Shell title="Mi perfil" subtitle="Administra tu información personal">
      <div className="max-w-lg space-y-6">

        {/* Nombre */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Información personal</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="text"
                  value={email}
                  disabled
                  className={`${INPUT_CLS} opacity-50 cursor-not-allowed`}
                />
                <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-1">El correo no se puede cambiar.</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Nombre para mostrar
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSuccess(false) }}
                  className={INPUT_CLS}
                  placeholder="Ej: Juan Pérez"
                  maxLength={50}
                />
              </div>

              {error   && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
              {success && <p className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-lg">Nombre actualizado correctamente.</p>}

              <Button type="submit" loading={saving}>
                Guardar cambios
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Contraseña */}
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Cambiar contraseña</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Nueva contraseña</label>
                <input
                  type="password"
                  value={pwForm.next}
                  onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                  className={INPUT_CLS}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Confirmar contraseña</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                  className={INPUT_CLS}
                  placeholder="••••••••"
                />
              </div>

              {pwError   && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">{pwError}</p>}
              {pwSuccess && <p className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-lg">Contraseña actualizada.</p>}

              <Button type="submit" loading={pwSaving}>
                Actualizar contraseña
              </Button>
            </form>
          </CardBody>
        </Card>

      </div>
    </Shell>
  )
}
