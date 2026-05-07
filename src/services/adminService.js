import { supabase } from '../lib/supabase'

/**
 * Obtiene todos los perfiles (solo superadmin, reforzado por RLS).
 */
export async function fetchAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  return { data: data ?? [], error }
}

/**
 * Activa o desactiva un usuario.
 * @param {string} userId
 * @param {boolean} active
 */
export async function setUserActive(userId, active) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ active })
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

/**
 * Cambia el rol de un usuario.
 * @param {string} userId
 * @param {'superadmin'|'user'} role
 */
export async function setUserRole(userId, role) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}
