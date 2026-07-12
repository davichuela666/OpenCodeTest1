import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WorkHistoryList } from '@/components/WorkHistoryList'
import { getWorkHistory } from '@/lib/actions/work-history'

export default async function HistorialPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/dashboard')

  const workHistory = await getWorkHistory(profile.id)

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Historial de Trabajos</h1>
      <p className="text-muted-foreground mb-8">
        Revisa tus trabajos completados y gestiona tus valoraciones.
      </p>
      <WorkHistoryList items={workHistory} />
    </div>
  )
}
