// Card
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 py-4 border-b border-gray-100 dark:border-white/5 ${className}`}>
      {children}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-5 py-4 ${className}`}>{children}</div>
}

// Badge
const BADGE_VARIANTS = {
  income:     'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
  expense:    'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20',
  default:    'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10',
  superadmin: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/20',
}

export function Badge({ label, variant = 'default' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${BADGE_VARIANTS[variant] ?? BADGE_VARIANTS.default}`}>
      {label}
    </span>
  )
}

// Modal
export function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-md z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
