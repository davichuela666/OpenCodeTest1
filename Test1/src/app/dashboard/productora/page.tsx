import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Building2, NotebookText, ArrowRight, Users, Briefcase } from 'lucide-react'
import Link from 'next/link'

export default async function ProductoraDashboardPage() {
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

  const { count: activeProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', user.id)
    .in('status', ['Planned', 'In Progress'])

  const { count: totalContacts } = await supabase
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', user.id)

  const quickLinks = [
    { href: '/dashboard/productora/perfil', label: 'Mi Perfil', desc: 'Gestiona los datos de tu empresa', icon: Building2, color: 'from-blue-500/10 to-blue-600/5', iconColor: 'text-primary' },
    { href: '/dashboard/productora/proyectos', label: 'Proyectos', desc: 'Crea y gestiona tus proyectos', icon: NotebookText, color: 'from-orange-500/10 to-orange-600/5', iconColor: 'text-accent' },
    { href: '/dashboard/productora/contactos', label: 'Contactos', desc: 'Administra tus contactos', icon: Users, color: 'from-green-500/10 to-green-600/5', iconColor: 'text-[oklch(0.55_0.2_160)]' },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-primary tracking-wide uppercase">Panel de control</p>
            <h1 className="text-3xl font-bold mt-1">
              <span className="text-primary">{freelancer.first_name}</span>
            </h1>
            {company?.tax_id && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                <Briefcase className="size-4" />
                CIF: {company.tax_id}
              </p>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-2xl font-bold text-primary/20 select-none">
            <span className="text-4xl font-black">f</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-border bg-card p-6 card-hover"
            >
              <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${link.color} mb-4`}>
                <link.icon className={`size-6 ${link.iconColor}`} />
              </div>
              <p className="font-semibold text-base">{link.label}</p>
              <p className="text-sm text-muted-foreground mt-1.5">{link.desc}</p>
              <div className="flex items-center gap-1 text-xs font-medium text-primary mt-3">
                Ir <ArrowRight className="size-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-4">Tus estadísticas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-3xl font-black text-primary">{activeProjects ?? 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Proyectos activos</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-3xl font-black text-accent">{totalContacts ?? 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Contactos registrados</p>
          </div>
        </div>
      </div>
    </div>
  )
}
