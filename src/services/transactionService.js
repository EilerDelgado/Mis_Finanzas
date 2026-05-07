import { supabase } from '../lib/supabase'

/**
 * Obtiene las transacciones del usuario autenticado.
 * Si se pasan filtros, se aplican al query.
 * @param {{ type?: string, categoryId?: string, dateFrom?: string, dateTo?: string }} filters
 * @returns {Promise<{ data: Array, error: object|null }>}
 */
export async function fetchTransactions(filters = {}) {
  let query = supabase
    .from('transactions')
    .select('*, categories(name, type)')
    .order('date', { ascending: false })

  if (filters.type) query = query.eq('type', filters.type)
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId)
  if (filters.dateFrom) query = query.gte('date', filters.dateFrom)
  if (filters.dateTo) query = query.lte('date', filters.dateTo)

  const { data, error } = await query
  return { data: data ?? [], error }
}

/**
 * Crea una transacción para el usuario autenticado.
 * @param {{ category_id: string, amount: number, description: string, date: string, type: string }} payload
 */
export async function createTransaction(payload) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(payload)
    .select()
    .single()
  return { data, error }
}

/**
 * Actualiza una transacción existente.
 * @param {string} id
 * @param {object} updates
 */
export async function updateTransaction(id, updates) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

/**
 * Elimina una transacción por ID.
 * @param {string} id
 */
export async function deleteTransaction(id) {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  return { error }
}
