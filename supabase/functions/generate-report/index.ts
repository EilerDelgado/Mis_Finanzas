// supabase/functions/generate-report/index.ts
// Invocación: POST /functions/v1/generate-report
// Body: { year: number }
// Header: Authorization: Bearer <jwt>

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { year } = await req.json()
  const from = `${year}-01-01`
  const to = `${year}-12-31`

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('date, type, amount, categories(name)')
    .gte('date', from)
    .lte('date', to)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  // Agrupar por mes
  const monthly: Record<string, { income: number; expense: number }> = {}
  for (const t of transactions) {
    const month = t.date.slice(0, 7)
    if (!monthly[month]) monthly[month] = { income: 0, expense: 0 }
    if (t.type === 'income') monthly[month].income += t.amount
    else monthly[month].expense += t.amount
  }

  const report = Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { income, expense }]) => ({
      month,
      income,
      expense,
      balance: income - expense,
    }))

  return new Response(JSON.stringify({ year, report }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
