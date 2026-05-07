import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { fetchTransactions } from '../services/transactionService'
import { useAuth } from './AuthContext'

const TransactionContext = createContext(null)

export function TransactionProvider({ children }) {
  const { session } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reload = useCallback(async (activeFilters = filters) => {
    if (!session) return
    setLoading(true)
    setError(null)
    const { data, error } = await fetchTransactions(activeFilters)
    if (error) setError(error.message)
    else setTransactions(data)
    setLoading(false)
  }, [session, filters])

  useEffect(() => {
    reload()
  }, [session])

  function applyFilters(newFilters) {
    setFilters(newFilters)
    reload(newFilters)
  }

  return (
    <TransactionContext.Provider value={{ transactions, loading, error, reload, applyFilters, filters }}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error('useTransactions must be used inside TransactionProvider')
  return ctx
}
