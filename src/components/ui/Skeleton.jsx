/**
 * Bloque de skeleton animado.
 * Uso: <Skeleton className="h-4 w-32" />
 */
export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-white/5 ${className}`} />
  )
}

// Skeleton de una StatsCard completa
export function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-36 mb-2" />
      <Skeleton className="h-3 w-28" />
    </div>
  )
}

// Skeleton de una fila de transacción
export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 px-1">
      <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-2.5 w-24" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  )
}

// Skeleton de tabla completa
export function TableSkeleton({ rows = 6 }) {
  return (
    <div className="divide-y divide-gray-50 dark:divide-white/3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-3 flex-1 max-w-[180px]" />
          <Skeleton className="h-4 w-24 ml-auto" />
        </div>
      ))}
    </div>
  )
}

// Skeleton del banner de saldo
export function BalanceBannerSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  )
}
