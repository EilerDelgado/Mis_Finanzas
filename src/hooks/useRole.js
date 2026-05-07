import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/constants'

export function useRole() {
  const { profile } = useAuth()
  const role = profile?.role ?? null

  return {
    role,
    isSuperadmin: role === ROLES.SUPERADMIN,
    isUser: role === ROLES.USER,
    isActive: profile?.active ?? false,
  }
}
