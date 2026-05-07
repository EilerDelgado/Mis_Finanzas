import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet, TrendingUp, TrendingDown, Activity,
  ArrowRight, PlusCircle,
} from 'lucide-react'
import { Shell } from '../components/layout/Shell'
import { Card, CardHeader, CardBody, Badge } from '../components/ui/index'
import { StatsCardSkeleton, TransactionRowSkeleton } from '../components/ui/Skeleton'
import { useTransactions } from '../context/TransactionContext'
import { useAuth } from '../context/AuthContext'
import {
  calcSummary,
  calcByCategory,
  calcPercentChange,
  getCurrentAndPrevMonth,
  relativeDate,
  formatCurrency,
} from '../utils/calculations'

// ─── RecentActivity ───────────────────────────────────────────────────────────
function RecentActivity({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="opacity-30">
          <rect x="10" y="20" width="52" height="36" rx="6" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-600"/>
          <path d="M10 30h52" stroke="currentColor" strokeWidth="2" className="text-gray-400 dark:text-gray-600"/>
          <rect x="20" y="40" width="14" height="3" rx="1.5" fill="currentColor" className="text-gray-300 dark:text-gray-700"/>
          <rect x="20" y="46" width="20" height="3" rx="1.5" fill="currentColor" className="text-gray-300 dark:text-gray-700"/>
        </svg>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sin transacciones aún</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">Registra tu primer ingreso o egreso</p>
        </div>
        <Link
          to="/transactions/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
        >
          <PlusCircle size={15} /> Registrar transacción
        </Link>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-50 dark:divide-white/5">
      {transactions.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 py-3 px-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 dark:hover:bg-white/8 transition-colors cursor-pointer"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold
            ${t.type === 'income'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400'
            }`}
          >
            {(t.categories?.name ?? '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {t.description || t.categories?.name || 'Sin descripción'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {t.categories?.name} · {relativeDate(t.date)}
            </p>
          </div>
          <span className={`text-sm font-semibold tabular-nums shrink-0 ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── CategoryBreakdown ────────────────────────────────────────────────────────
function CategoryBreakdown({ transactions }) {
  const expenses = useMemo(
    () => calcByCategory(transactions.filter((t) => t.type === 'expense')).slice(0, 3),
    [transactions]
  )
  const maxTotal = expenses[0]?.total ?? 1

  if (expenses.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-600">Sin egresos registrados</p>
        <Link to="/categories" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline mt-1 inline-block">
          Crear categoría →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map((cat, i) => {
        const pct = Math.round((cat.total / maxTotal) * 100)
        const colors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400']
        return (
          <div key={cat.categoryId}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">{formatCurrency(cat.total)}</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${colors[i]}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── ActiveCategories ─────────────────────────────────────────────────────────
function ActiveCategories({ transactions }) {
  const counts = useMemo(() => {
    const map = {}
    for (const t of transactions) {
      const key = t.category_id
      if (!map[key]) map[key] = { name: t.categories?.name ?? '—', type: t.type, count: 0 }
      map[key].count++
    }
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 6)
  }, [transactions])

  if (counts.length === 0) {
    return <p className="text-xs text-gray-400 dark:text-gray-600 py-2">Sin actividad.</p>
  }

  return (
    <div className="space-y-2">
      {counts.map((c) => (
        <div key={c.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge label={c.type === 'income' ? 'I' : 'E'} variant={c.type} />
            <span className="text-xs text-gray-700 dark:text-gray-300">{c.name}</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">{c.count} mov.</span>
        </div>
      ))}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { transactions, loading } = useTransactions()
  const { session, profile } = useAuth()
  const userName = profile?.display_name || session?.user?.email?.split('@')[0] || 'Usuario'

  const { current, previous } = getCurrentAndPrevMonth()

  const currentMonthTx = transactions.filter((t) => t.date.startsWith(current))
  const prevMonthTx    = transactions.filter((t) => t.date.startsWith(previous))

  const curr = calcSummary(currentMonthTx)
  const prev = calcSummary(prevMonthTx)
  const all  = calcSummary(transactions)

  const recent = [...transactions].slice(0, 5)

  const stats = [
    {
      label: 'Balance Total',
      value: all.balance,
      icon: Wallet,
      accent: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
      change: calcPercentChange(curr.balance, prev.balance),
    },
    {
      label: 'Ingresos del mes',
      value: curr.totalIncome,
      icon: TrendingUp,
      accent: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
      change: calcPercentChange(curr.totalIncome, prev.totalIncome),
    },
    {
      label: 'Egresos del mes',
      value: curr.totalExpense,
      icon: TrendingDown,
      accent: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-500 dark:text-red-400' },
      change: calcPercentChange(curr.totalExpense, prev.totalExpense),
    },
    {
      label: 'Transacciones',
      value: currentMonthTx.length,
      icon: Activity,
      accent: { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400' },
      change: calcPercentChange(currentMonthTx.length, prevMonthTx.length),
      isCount: true,
    },
  ]

  return (
    <Shell
      title={`¡Hola, ${userName}!`}
      subtitle="Aquí está el resumen de tus finanzas"
    >
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => <StatsCardSkeleton key={i} />)}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-white/5 p-5 space-y-1">
              {[1,2,3,4,5].map((i) => <TransactionRowSkeleton key={i} />)}
            </div>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-white/5 p-5 space-y-3">
                {[1,2,3].map((i) => <div key={i} className="animate-pulse h-4 bg-gray-100 dark:bg-white/5 rounded" />)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {s.label}
                  </span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.accent.bg}`}>
                    <s.icon size={17} className={s.accent.text} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums leading-none">
                  {s.isCount ? s.value : formatCurrency(s.value)}
                </p>
                <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${s.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                  {s.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  <span>{Math.abs(s.change)}% vs mes anterior</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Main content */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Actividad reciente</h2>
                    <Link
                      to="/transactions"
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Ver todas <ArrowRight size={12} />
                    </Link>
                  </div>
                </CardHeader>
                <CardBody>
                  <RecentActivity transactions={recent} />
                </CardBody>
              </Card>
            </div>

            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Top egresos</h2>
                </CardHeader>
                <CardBody>
                  <CategoryBreakdown transactions={transactions} />
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Categorías activas</h2>
                </CardHeader>
                <CardBody>
                  <ActiveCategories transactions={transactions} />
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      )}
    </Shell>
  )
}
