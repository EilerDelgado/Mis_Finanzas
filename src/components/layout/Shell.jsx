import { Bell, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Footer } from './Footer'

export function Shell({ children, title, subtitle, alertCount = 0 }) {
  const { session, profile } = useAuth()
  const { dark, toggle } = useTheme()
  const displayName = profile?.display_name || session?.user?.email?.split('@')[0] || 'Usuario'

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors duration-200">
      <Sidebar alertCount={alertCount} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="shrink-0 h-16 pl-14 lg:pl-6 pr-4 lg:pr-6 flex items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/5 transition-colors">
          <div>
            {title && (
              <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-none">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
              <Bell size={16} />
              {alertCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {/* Avatar → lleva a perfil */}
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all"
            >
              {displayName[0].toUpperCase()}
            </Link>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 py-2 px-4 lg:px-6 flex items-center justify-center bg-white dark:bg-gray-900/50 border-t border-gray-200 dark:border-white/5 transition-colors">
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            © 2026 <span className="font-medium text-gray-600 dark:text-gray-400">My Finanzas</span> • CodEiler Software
          </p>
        </footer>
      </div>
    </div>
  )
}
