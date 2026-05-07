import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shell } from '../components/layout/Shell'
import { Button } from '../components/ui/Button'
import { Card, CardBody } from '../components/ui/index'
import { createTransaction } from '../services/transactionService'
import { fetchCategories } from '../services/categoryService'
import { useTransactions } from '../context/TransactionContext'
import { useFormPersist } from '../hooks/useFormPersist'
import { useState } from 'react'

const INPUT_CLS = 'w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors'

const INITIAL_FORM = {
  type: 'expense',
  category_id: '',
  amount: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
}

export default function NewTransaction() {
  const navigate = useNavigate()
  const { reload } = useTransactions()

  // Persiste el formulario en sessionStorage mientras el usuario navega
  const [form, setForm, clearForm] = useFormPersist('new-transaction-form', INITIAL_FORM)

  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => {
    fetchCategories({ type: form.type }).then(({ data }) => {
      setCategories(data)
      // Si la categoría guardada no pertenece al tipo actual, la limpiamos
      if (data.length > 0 && !data.find((c) => c.id === form.category_id)) {
        setForm((f) => ({ ...f, category_id: '' }))
      }
    })
  }, [form.type])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await createTransaction({ ...form, amount: parseFloat(form.amount) })
    if (error) {
      setError(error.message)
    } else {
      clearForm()   // limpia sessionStorage al guardar con éxito
      await reload()
      navigate('/transactions')
    }
    setLoading(false)
  }

  function handleCancel() {
    clearForm()
    navigate(-1)
  }

  return (
    <Shell title="Nueva transacción" subtitle="Registra un ingreso o egreso">
      <div className="max-w-lg">
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Toggle tipo */}
              <div className="flex rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
                {['expense', 'income'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors
                      ${form.type === t
                        ? t === 'income' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 bg-white dark:bg-gray-900'}`}
                  >
                    {t === 'income' ? 'Ingreso' : 'Egreso'}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Categoría</label>
                <select name="category_id" required value={form.category_id} onChange={handleChange} className={INPUT_CLS}>
                  <option value="">Seleccionar...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                    Sin categorías de tipo {form.type === 'income' ? 'ingreso' : 'egreso'}.{' '}
                    <a href="/categories" className="underline">Crear una</a>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Monto</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
                  <input
                    type="number" name="amount" required min="0" step="any"
                    value={form.amount} onChange={handleChange}
                    className={`${INPUT_CLS} pl-7`} placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Fecha</label>
                <input type="date" name="date" required value={form.date} onChange={handleChange} className={INPUT_CLS} />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Descripción <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text" name="description"
                  value={form.description} onChange={handleChange}
                  className={INPUT_CLS} placeholder="Ej: Mercado semanal"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={handleCancel} className="flex-1 justify-center">
                  Cancelar
                </Button>
                <Button type="submit" loading={loading} className="flex-1 justify-center">
                  Guardar
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </Shell>
  )
}
