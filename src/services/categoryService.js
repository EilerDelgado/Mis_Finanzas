import { supabase } from '../lib/supabase'

/**
 * Obtiene las categorías del usuario autenticado.
 * @param {{ type?: 'income'|'expense' }} filters
 */
export async function fetchCategories(filters = {}) {
  let query = supabase.from('categories').select('*').order('name')
  if (filters.type) query = query.eq('type', filters.type)
  const { data, error } = await query
  return { data: data ?? [], error }
}

/**
 * Crea una nueva categoría.
 * @param {{ name: string, type: 'income'|'expense' }} payload
 */
export async function createCategory(payload) {
  const { data, error } = await supabase
    .from('categories')
    .insert(payload)
    .select()
    .single()
  return { data, error }
}

/**
 * Actualiza una categoría.
 * @param {string} id
 * @param {{ name?: string, type?: string }} updates
 */
export async function updateCategory(id, updates) {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

/**
 * Elimina una categoría por ID.
 * @param {string} id
 */
export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  return { error }
}
