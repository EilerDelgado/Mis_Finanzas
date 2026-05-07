import { useMemo, useState } from 'react'
import { Download } from 'lucide-react'
import { Shell } from '../components/layout/Shell'
import { Card, CardHeader, CardBody } from '../components/ui/index'
import { Button } from '../components/ui/Button'
import { useTransactions } from '../context/TransactionContext'
import { calcMonthlyTrend, calcByCategory, calcSummary, formatCurrency } from '../utils/calculations'
import { exportCSV, prepareTransactionsForExport } from '../utils/exportCSV'

const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

// ─── Barra horizontal CSS pura ────────────────────────────────────────────────
function BarRow({ label, income, expense, maxValue }) {
  const incPct  = maxValue > 0 ? Math.round((income  / maxValue) * 100) : 0
  const expPct  = maxValue > 0 ? Math.round((expense / maxValue) * 100) : 0
  const balance = income - expense
  const positive = balance >= 0

  return (
    <div className="grid grid-cols-[56px_1fr_80px] items-center gap-3 py-2">
      <span className="text-xs text-gray-500 dark:text-gray-400 text-right">{label}</span>
      <div className="flex flex-col gap-1">
        {/* Barra ingreso */}
        <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${incPct}%` }}
          />
        </div>
        {/* Barra egreso */}
        <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-400 rounded-full transition-all duration-500"
            style={{ width: `${expPct}%` }}
          />
        </div>
      </div>
      <span className={`text-xs font-semibold tabular-nums text-right ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
        {positive ? '+' : ''}{formatCurrency(balance)}
      </span>
    </div>
  )
}

// ─── Reports ──────────────────────────────────────────────────────────────────
export default function Reports() {
  const { transactions } = useTransactions()
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)

  const yearOptions = useMemo(() => {
    const years = new Set(transactions.map((t) => parseInt(t.date.slice(0, 4))))
    years.add(currentYear)
    return [...years].sort((a, b) => b - a)
  }, [transactions, currentYear])

  const yearTx = useMemo(
    () => transactions.filter((t) => t.date.startsWith(String(year))),
    [transactions, year]
  )

  const monthly = useMemo(() => calcMonthlyTrend(yearTx), [yearTx])
  const byCategory = useMemo(() => calcByCategory(yearTx), [yearTx])
  const { totalIncome, totalExpense, balance } = calcSummary(yearTx)

  // Rellenar los 12 meses aunque no haya datos
  const monthlyFull = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const key = `${year}-${String(i + 1).padStart(2, '0')}`
      const found = monthly.find((m) => m.month === key)
      return { label: MONTHS_ES[i], income: found?.income ?? 0, expense: found?.expense ?? 0 }
    })
  }, [monthly, year])

  const maxValue = Math.max(...monthlyFull.map((m) => Math.max(m.income, m.expense)), 1)

  const incomeCategories  = byCategory.filter((c) => c.type === 'income')
  const expenseCategories = byCategory.filter((c) => c.type === 'expense')
  const maxCatIncome  = incomeCategories[0]?.total  ?? 1
  const maxCatExpense = expenseCategories[0]?.total ?? 1

  function handleExport() {
    exportCSV(prepareTransactionsForExport(yearTx), `reporte-${year}.csv`)
  }

  return (
    <Shell title="Reportes" subtitle={`Análisis financiero ${year}`}>
      <div className="space-y-6">

        {/* Selector año + export */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-lg p-1">
            {yearOptions.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${year === y
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}
              >
                {y}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download size={14} /> Exportar {year}
          </Button>
        </div>

        {/* Resumen anual */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Ingresos', value: totalIncome, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Egresos',  value: totalExpense, color: 'text-red-500 dark:text-red-400' },
            { label: 'Balance',  value: balance, color: balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400' },
          ].map(({ label, value, color }) => (
            <Card key={label} className="p-5">
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">{label}</p>
              <p className={`text-2xl font-bold tabular-nums ${color}`}>{formatCurrency(value)}</p>
            </Card>
          ))}
        </div>

        {/* Gráfica mensual */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Ingresos vs egresos por mes</h2>
              <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Ingreso</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Egreso</span>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {monthlyFull.every((m) => m.income === 0 && m.expense === 0) ? (
              <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">Sin movimientos en {year}</p>
            ) : (
              <div>
                {monthlyFull.map((m) => (
                  <BarRow key={m.label} {...m} maxValue={maxValue} />
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Breakdown por categoría */}
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { title: 'Categorías de ingreso', items: incomeCategories, max: maxCatIncome, color: 'bg-emerald-500' },
            { title: 'Categorías de egreso',  items: expenseCategories, max: maxCatExpense, color: 'bg-red-400' },
          ].map(({ title, items, max, color }) => (
            <Card key={title}>
              <CardHeader>
                <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
              </CardHeader>
              <CardBody>
                {items.length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-gray-600 py-4 text-center">Sin datos</p>
                ) : (
                  <div className="space-y-3">
                    {items.map((cat) => {
                      const pct = Math.round((cat.total / max) * 100)
                      return (
                        <div key={cat.categoryId}>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-700 dark:text-gray-300">{cat.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">{formatCurrency(cat.total)}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

      </div>
    </Shell>
  )
}
