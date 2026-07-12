import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ContactosManager } from './ContactosManager'

export default async function ContactosPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: freelancer } = await supabase
    .from('freelancers')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!freelancer || freelancer.role !== 'production_company') redirect('/dashboard')

  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .eq('company_id', user.id)
    .order('created_at', { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestión de Contactos</h1>
      <ContactosManager contacts={contacts || []} />
    </div>
  )
}
