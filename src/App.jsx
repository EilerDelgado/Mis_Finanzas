import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { TransactionProvider } from './context/TransactionContext'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import NewTransaction from './pages/NewTransaction'
import Categories from './pages/Categories'
import AdminUsers from './pages/admin/AdminUsers'
import Reports from './pages/Reports'
import Register from './pages/Register'
import Profile from './pages/Profile'

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center text-gray-400 text-sm transition-colors">
      Cargando...
    </div>
  )
  if (!session) return <Navigate to="/login" replace />
  return <TransactionProvider>{children}</TransactionProvider>
}

function PublicRoute({ children }) {
  const { session, loading } = useAuth()
  if (loading) return null
  if (session) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login"             element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register"          element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/profile"           element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dashboard"         element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/transactions"      element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/transactions/new"  element={<ProtectedRoute><NewTransaction /></ProtectedRoute>} />
            <Route path="/categories"        element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/admin"             element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
            <Route path="/reports"           element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="*"                  element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
