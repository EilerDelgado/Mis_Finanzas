import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Download, Trash2 } from 'lucide-react'
import { Shell } from '../components/layout/Shell'
import { useTransactions } from '../context/TransactionContext'
import { Card, CardBody, Badge } from '../components/ui/index'
import { TableSkeleton } from '../components/ui/Skeleton'
import { Button } from '../components/ui/Button'
import { deleteTransaction } from '../services/transactionService'
import { exportCSV, prepareTransactionsForExport } from '../utils/exportCSV'
import { formatCurrency, relativeDate } from '../utils/calculations'

const INPUT_CLS = 'w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors'

export default function Transactions() {
  const { transactions, loading, reload, applyFilters, filters } = useTransactions()
  const [deleting, setDeleting] = useState(null)

  async function handleDelete(id) {
    setDeleting(id)
    await deleteTransaction(id)
    await reload()
    setDeleting(null)
  }

  function handleExport() {
    exportCSV(prepareTransactionsForExport(transactions), 'transacciones.csv')
  }

  function handleFilterChange(key, value) {
    const next = { ...filters, [key]: value || undefined }
    applyFilters(next)
  }

  return (
    <Shell title="Transacciones" subtitle={`${transactions.length} registros`}>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {/* Filtro tipo */}
            <div className="flex rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-gray-900">
              {['', 'income', 'expense'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange('type', type)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors
                    ${(filters.type ?? '') === type
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                >
                  {type === '' ? 'Todos' : type === 'income' ? 'Ingresos' : 'Egresos'}
                </button>
              ))}
            </div>

            {/* Desde */}
            <input
              type="date"
              value={filters.dateFrom ?? ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className={`${INPUT_CLS} w-auto`}
            />

            {/* Hasta */}
            <input
              type="date"
              value={filters.dateTo ?? ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className={`${INPUT_CLS} w-auto`}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download size={14} /> Exportar
            </Button>
            <Link to="/transactions/new">
              <Button size="sm">
                <Plus size={14} /> Nueva
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabla */}
        <Card>
          <CardBody className="p-0">
            {loading ? (
              <TableSkeleton rows={8} />
            ) : transactions.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <p className="text-sm text-gray-400 dark:text-gray-500">Sin transacciones para los filtros seleccionados.</p>
                <Link to="/transactions/new" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                  + Registrar nueva
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5">
                      {['Fecha', 'Categoría', 'Descripción', 'Monto', ''].map((h) => (
                        <th key={h} className={`px-5 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide ${h === 'Monto' || h === '' ? 'text-right' : 'text-left'}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/3">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {relativeDate(t.date)}
                        </td>
                        <td className="px-5 py-3">
                          <Badge label={t.categories?.name ?? '—'} variant={t.type} />
                        </td>
                        <td className="px-5 py-3 text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                          {t.description || '—'}
                        </td>
                        <td className={`px-5 py-3 text-right font-semibold tabular-nums ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                          {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => handleDelete(t.id)}
                            disabled={deleting === t.id}
                            className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-40"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </Shell>
  )
}
