import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductoraProfileForm } from './ProductoraProfileForm'

export default async function PerfilProductoraPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: freelancer } = await supabase
    .from('freelancers')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!freelancer || freelancer.role !== 'production_company') redirect('/dashboard')

  const { data: company } = await supabase
    .from('production_companies')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Perfil de la Productora</h1>
      <ProductoraProfileForm
        freelancer={freelancer}
        company={company}
      />
    </div>
  )
}
