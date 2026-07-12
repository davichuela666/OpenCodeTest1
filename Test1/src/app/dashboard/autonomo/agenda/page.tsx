import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar'

export default async function AgendaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('freelancers')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/dashboard')

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Mi Agenda de Disponibilidad</h1>
      <p className="text-muted-foreground mb-8">
        Gestiona tu disponibilidad marcando días como disponibles, no disponibles o tentativos.
      </p>
      <div className="p-6 rounded-xl border border-border bg-card">
        <AvailabilityCalendar profileId={profile.id} />
      </div>
    </div>
  )
}
