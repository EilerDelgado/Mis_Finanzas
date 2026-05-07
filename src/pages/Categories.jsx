import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { Shell } from '../components/layout/Shell'
import { Card, CardHeader, CardBody, Badge, Modal } from '../components/ui/index'
import { Button } from '../components/ui/Button'
import {
  fetchCategories, createCategory, updateCategory, deleteCategory,
} from '../services/categoryService'

const INPUT_CLS = 'w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors'
const EMPTY_FORM = { name: '', type: 'expense' }

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const { data } = await fetchCategories()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditing(null)
    setError('')
    setModalOpen(true)
  }

  function openEdit(cat) {
    setForm({ name: cat.name, type: cat.type })
    setEditing(cat.id)
    setError('')
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('El nombre es requerido.'); return }
    setSaving(true)
    setError('')
    const { error } = editing
      ? await updateCategory(editing, form)
      : await createCategory(form)
    if (error) setError(error.message)
    else { setModalOpen(false); await load() }
    setSaving(false)
  }

  async function handleDelete(id) {
    await deleteCategory(id)
    await load()
  }

  const income  = categories.filter((c) => c.type === 'income')
  const expense = categories.filter((c) => c.type === 'expense')

  return (
    <Shell title="Categorías" subtitle="Organiza tus ingresos y egresos">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button size="sm" onClick={openCreate}>
            <Plus size={14} /> Nueva categoría
          </Button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Cargando...</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {[{ label: 'Ingresos', items: income, type: 'income' }, { label: 'Egresos', items: expense, type: 'expense' }].map(({ label, items, type }) => (
              <Card key={type}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge label={label} variant={type} />
                      <span className="text-xs text-gray-400 dark:text-gray-500">{items.length} categorías</span>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {items.length === 0 ? (
                    <div className="py-4 text-center">
                      <p className="text-xs text-gray-400 dark:text-gray-600">Sin categorías</p>
                      <button onClick={openCreate} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline mt-1">
                        + Crear una
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50 dark:divide-white/5">
                      {items.map((cat) => (
                        <div key={cat.id} className="flex items-center justify-between py-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg px-1 transition-colors">
                          <span className="text-sm text-gray-800 dark:text-gray-200">{cat.name}</span>
                          <div className="flex gap-1.5">
                            <button onClick={() => openEdit(cat)} className="p-1 text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded">
                              <Pencil size={13} />
                            </button>
                            <button onClick={() => handleDelete(cat.id)} className="p-1 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar categoría' : 'Nueva categoría'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={INPUT_CLS}
              placeholder="Ej: Arriendo, Salario..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Tipo</label>
            <div className="flex rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
              {['expense', 'income'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`flex-1 py-2 text-sm font-medium transition-colors
                    ${form.type === t
                      ? t === 'income' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                  {t === 'income' ? 'Ingreso' : 'Egreso'}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-2 pt-1">
            <Button variant="ghost" onClick={() => setModalOpen(false)} className="flex-1 justify-center">Cancelar</Button>
            <Button loading={saving} onClick={handleSave} className="flex-1 justify-center">Guardar</Button>
          </div>
        </div>
      </Modal>
    </Shell>
  )
}
