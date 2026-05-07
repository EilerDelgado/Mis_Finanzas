const VARIANTS = {
  primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  danger:  'bg-red-600 hover:bg-red-700 text-white',
  ghost:   'bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300',
  outline: 'border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export function Button({ children, variant = 'primary', size = 'md', disabled = false, loading = false, className = '', ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center gap-2 rounded-lg font-medium transition-colors focus:outline-none
        focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
