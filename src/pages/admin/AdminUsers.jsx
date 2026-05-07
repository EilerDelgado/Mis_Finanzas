import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shell } from '../../components/layout/Shell'
import { Card, CardBody, Badge } from '../../components/ui/index'
import { Button } from '../../components/ui/Button'
import { fetchAllProfiles, setUserActive, setUserRole } from '../../services/adminService'
import { useRole } from '../../hooks/useRole'

export default function AdminUsers() {
  const { isSuperadmin } = useRole()
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSuperadmin) { navigate('/dashboard'); return }
    fetchAllProfiles().then(({ data }) => {
      setProfiles(data)
      setLoading(false)
    })
  }, [isSuperadmin])

  async function toggleActive(user) {
    await setUserActive(user.id, !user.active)
    setProfiles((ps) => ps.map((p) => p.id === user.id ? { ...p, active: !p.active } : p))
  }

  async function toggleRole(user) {
    const newRole = user.role === 'superadmin' ? 'user' : 'superadmin'
    await setUserRole(user.id, newRole)
    setProfiles((ps) => ps.map((p) => p.id === user.id ? { ...p, role: newRole } : p))
  }

  return (
    <Shell title="Administración" subtitle={`${profiles.length} usuarios registrados`}>
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">Cargando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    {['ID', 'Rol', 'Estado', 'Acciones'].map((h, i) => (
                      <th key={h} className={`px-5 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide ${i === 3 ? 'text-right' : 'text-left'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/3">
                  {profiles.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3 text-gray-400 dark:text-gray-500 font-mono text-xs">
                        {p.id.slice(0, 8)}…
                      </td>
                      <td className="px-5 py-3">
                        <Badge label={p.role} variant={p.role === 'superadmin' ? 'superadmin' : 'default'} />
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${p.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-600'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.active ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                          {p.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => toggleRole(p)}>
                            {p.role === 'superadmin' ? 'Hacer usuario' : 'Hacer admin'}
                          </Button>
                          <Button size="sm" variant={p.active ? 'danger' : 'primary'} onClick={() => toggleActive(p)}>
                            {p.active ? 'Desactivar' : 'Activar'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </Shell>
  )
}
