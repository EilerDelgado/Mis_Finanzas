import { TRANSACTION_TYPES, CURRENCY } from './constants'

/**
 * Retorna YYYY-MM del mes actual y del mes anterior.
 */
export function getCurrentAndPrevMonth() {
  const now = new Date()
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previous = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`
  return { current, previous }
}

/**
 * Calcula variación porcentual entre dos valores.
 * @returns {number} positivo = subió, negativo = bajó
 */
export function calcPercentChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

/**
 * Fecha relativa en español: "hace 2 días", "hoy", etc.
 * @param {string} dateStr YYYY-MM-DD
 */
export function relativeDate(dateStr) {
  const now = new Date()
  const date = new Date(dateStr + 'T00:00:00')
  const diff = Math.floor((now - date) / 86400000)
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  if (diff < 7) return `Hace ${diff} días`
  if (diff < 30) return `Hace ${Math.floor(diff / 7)} sem.`
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
}

/**
 * Suma ingresos y egresos de un array de transacciones.
 * @param {Array} transactions
 * @returns {{ totalIncome: number, totalExpense: number, balance: number }}
 */
export function calcSummary(transactions = []) {
  const totalIncome = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0)

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  }
}

/**
 * Agrupa transacciones por categoría y devuelve totales.
 * @param {Array} transactions
 * @returns {Array<{ categoryId: string, name: string, total: number, type: string }>}
 */
export function calcByCategory(transactions = []) {
  const map = {}
  for (const t of transactions) {
    const key = t.category_id
    if (!map[key]) {
      map[key] = {
        categoryId: t.category_id,
        name: t.categories?.name ?? 'Sin categoría',
        type: t.type,
        total: 0,
      }
    }
    map[key].total += t.amount
  }
  return Object.values(map).sort((a, b) => b.total - a.total)
}

/**
 * Agrupa transacciones por mes (YYYY-MM) y devuelve { month, income, expense }.
 * @param {Array} transactions
 * @returns {Array}
 */
export function calcMonthlyTrend(transactions = []) {
  const map = {}
  for (const t of transactions) {
    const month = t.date.slice(0, 7) // YYYY-MM
    if (!map[month]) map[month] = { month, income: 0, expense: 0 }
    if (t.type === TRANSACTION_TYPES.INCOME) map[month].income += t.amount
    else map[month].expense += t.amount
  }
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month))
}

/**
 * Formatea un número como moneda COP.
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: CURRENCY.CURRENCY,
    minimumFractionDigits: 0,
  }).format(amount)
}
