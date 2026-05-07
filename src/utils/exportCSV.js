/**
 * Convierte un array de objetos a CSV y dispara la descarga.
 * @param {Array<Object>} rows
 * @param {string} filename
 */
export function exportCSV(rows, filename = 'export.csv') {
  if (!rows || rows.length === 0) return

  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? ''
          const str = String(val).replace(/"/g, '""')
          return `"${str}"`
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Prepara las transacciones para exportar (aplana categoría anidada).
 * @param {Array} transactions
 * @returns {Array}
 */
export function prepareTransactionsForExport(transactions = []) {
  return transactions.map((t) => ({
    id: t.id,
    fecha: t.date,
    tipo: t.type,
    categoria: t.categories?.name ?? '',
    monto: t.amount,
    descripcion: t.description ?? '',
  }))
}
