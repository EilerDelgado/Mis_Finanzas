import { supabase } from '../lib/supabase'

/**
 * Devuelve resumen mensual de ingresos y egresos para el usuario activo.
 * Agrupa por mes dentro del año dado.
 * @param {number} year
 * @returns {Promise<{ data: Array, error: object|null }>}
 */
export async function fetchMonthlySummary(year) {
  const from = `${year}-01-01`
  const to = `${year}-12-31`

  const { data, error } = await supabase
    .from('transactions')
    .select('date, type, amount')
    .gte('date', from)
    .lte('date', to)

  return { data: data ?? [], error }
}

/**
 * Devuelve el total global por usuario (solo superadmin).
 * Uso interno de AdminMetrics.
 */
export async function fetchGlobalMetrics() {
  const { data, error } = await supabase
    .from('transactions')
    .select('created_by, type, amount')

  return { data: data ?? [], error }
}
