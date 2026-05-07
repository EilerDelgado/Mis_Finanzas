import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ArrowLeftRight, PlusCircle, Tag,
  BarChart3, Shield, Settings, HelpCircle, ChevronsRight, LogOut, X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useRole } from '../../hooks/useRole'
import logo from '../../assets/inteligencia-de-negocio.png'

const NAV_MAIN = [
  { to: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions',     icon: ArrowLeftRight,  label: 'Transacciones' },
  { to: '/transactions/new', icon: PlusCircle,      label: 'Nueva Transacción' },
  { to: '/categories',       icon: Tag,             label: 'Categorías' },
  { to: '/reports',          icon: BarChart3,       label: 'Reportes' },
]

const NAV_ACCOUNT = [
  { to: '/profile',   icon: Settings,    label: 'Mi perfil' },
  { to: '/help',      icon: HelpCircle,  label: 'Ayuda', disabled: true },
]

function NavItem({ to, icon: Icon, label, collapsed, badge = 0, disabled = false, onClick }) {
  const base = `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`
  const active   = 'bg-emerald-500/15 text-emerald-400'
  const inactive = 'text-gray-400 hover:bg-white/5 hover:text-gray-200'

  return (
    <NavLink
      to={disabled ? '#' : to}
      onClick={onClick}
      className={({ isActive }) => `${base} ${isActive && !disabled ? active : inactive}`}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && badge > 0 && (
        <span className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold px-1">
          {badge}
        </span>
      )}
      {collapsed && badge > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      )}
    </NavLink>
  )
}

// Contenido interno del sidebar (reutilizado en desktop y mobile)
function SidebarContent({ collapsed, setCollapsed, onNavClick, alertCount }) {
  const { signOut, session, profile } = useAuth()
  const { isSuperadmin } = useRole()

  const displayName = profile?.display_name || session?.user?.email?.split('@')[0] || 'Usuario'
  const roleLabel   = isSuperadmin ? 'Superadmin' : 'Usuario'

  return (
  <>
    {/* Logo + perfil */}
    <div className={`flex flex-col px-3 pt-5 pb-4 border-b border-white/5 ${collapsed ? 'items-center' : ''}`}>
      <NavLink
        to="/dashboard"
        className={`flex items-center gap-2.5 mb-3 rounded-lg hover:opacity-80 transition-opacity ${collapsed ? 'justify-center' : ''}`}
      >
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg shrink-0" />
        {!collapsed && (
          <span className="text-white font-bold text-base tracking-tight">
            Mis <span className="text-emerald-400">Finanzas</span>
          </span>
        )}
      </NavLink>

      {!collapsed && (
        <div className="flex items-center gap-2 px-1">
        </div>
      )}
    </div>

    {/* Nav */}
    <nav className="flex-1 flex flex-col px-2 py-3 gap-0.5 overflow-y-auto">
        {NAV_MAIN.map(({ to, icon, label, disabled }) => (
          <NavItem
            key={to}
            to={to}
            icon={icon}
            label={label}
            collapsed={collapsed}
            disabled={disabled}
            badge={to === '/transactions' && alertCount > 0 ? alertCount : 0}
            onClick={onNavClick}
          />
        ))}

        {isSuperadmin && (
          <>
            {!collapsed
              ? <p className="mt-3 mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">Admin</p>
              : <div className="mt-2 mb-1 border-t border-white/5" />
            }
            <NavItem to="/admin" icon={Shield} label="Usuarios" collapsed={collapsed} onClick={onNavClick} />
          </>
        )}

        <div className="mt-3 mb-1 border-t border-white/5" />
        {!collapsed && (
          <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-600">Cuenta</p>
        )}
        {NAV_ACCOUNT.map(({ to, icon, label, disabled }) => (
          <NavItem key={to} to={to} icon={icon} label={label} collapsed={collapsed} disabled={disabled} onClick={onNavClick} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-white/5 flex flex-col gap-1">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-all"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>

        {/* Solo visible en desktop */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden lg:flex items-center gap-3 w-full px-3 py-2 rounded-xl text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-all"
        >
          <ChevronsRight
            size={18}
            className={`shrink-0 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
          />
          {!collapsed && <span className="text-xs">Colapsar</span>}
        </button>
      </div>
    </>
  )
}

// Hook para cerrar el sidebar mobile al cambiar de ruta
function useMobileSidebar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return { open, setOpen }
}

export function Sidebar({ alertCount = 0 }) {
  const [collapsed, setCollapsed] = useState(false)
  const { open, setOpen } = useMobileSidebar()

  return (
    <>
      {/* ── DESKTOP: sidebar fijo a la izquierda ── */}
      <aside className={`
        hidden lg:flex flex-col h-screen bg-gray-900 border-r border-white/5
        transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? 'w-16' : 'w-64'}
      `}>
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onNavClick={null}
          alertCount={alertCount}
        />
      </aside>

      {/* ── MOBILE: overlay + drawer ── */}
      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside className={`
        lg:hidden fixed top-0 left-0 z-50 h-full w-72 flex flex-col
        bg-gray-900 border-r border-white/5
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Botón cerrar dentro del drawer */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all"
        >
          <X size={18} />
        </button>

        <SidebarContent
          collapsed={false}
          setCollapsed={() => {}}
          onNavClick={() => setOpen(false)}
          alertCount={alertCount}
        />
      </aside>

      {/* Botón hamburguesa — visible solo en mobile, montado en el DOM para que Shell lo use */}
      <button
        id="mobile-menu-btn"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 shadow-sm"
        aria-label="Abrir menú"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </>
  )
}
