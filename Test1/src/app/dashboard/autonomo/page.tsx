import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Clock, Star, User, ArrowRight, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default async function AutonomoDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('freelancers')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/dashboard')

  const { count: completedJobs } = await supabase
    .from('work_history')
    .select('*', { count: 'exact', head: true })
    .eq('freelancer_id', user.id)
    .eq('status', 'completed')

  const { count: activeJobs } = await supabase
    .from('work_history')
    .select('*', { count: 'exact', head: true })
    .eq('freelancer_id', user.id)
    .eq('status', 'in_progress')

  const quickLinks = [
    { href: '/dashboard/autonomo/perfil', label: 'Mi Perfil', desc: 'Gestiona tu información profesional', icon: User, color: 'from-blue-500/10 to-blue-600/5', iconColor: 'text-primary' },
    { href: '/dashboard/autonomo/agenda', label: 'Agenda', desc: 'Organiza tus citas y eventos', icon: Calendar, color: 'from-orange-500/10 to-orange-600/5', iconColor: 'text-accent' },
    { href: '/dashboard/autonomo/historial', label: 'Historial', desc: 'Revisa tus trabajos realizados', icon: Clock, color: 'from-green-500/10 to-green-600/5', iconColor: 'text-[oklch(0.55_0.2_160)]' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-6 md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-primary tracking-wide uppercase">Panel de control</p>
            <h1 className="text-3xl font-bold mt-1">
              Hola, <span className="text-primary">{profile.first_name}</span>
              {profile.last_name ? <> {profile.last_name}</> : null}
            </h1>
            {profile.specialty && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                <GraduationCap className="size-4" />
                {profile.specialty}
              </p>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-2xl font-bold text-primary/20 select-none">
            <span className="text-4xl font-black">f</span>
          </div>
        </div>
      </div>

      {/* Quick navigation */}
      <div>
        <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-4">Acceso rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link-card rounded-xl border border-border bg-card p-6 card-hover"
            >
              <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${link.color} mb-4`}>
                <link.icon className={`size-6 ${link.iconColor}`} />
              </div>
              <p className="font-semibold text-base">{link.label}</p>
              <p className="text-sm text-muted-foreground mt-1.5">{link.desc}</p>
              <div className="flex items-center gap-1 text-xs font-medium text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                Ir <ArrowRight className="size-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-4">Tus estadísticas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card rounded-xl border border-border bg-card p-6">
            <p className="text-3xl font-black text-primary">{completedJobs ?? 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Trabajos completados</p>
          </div>
          <div className="stat-card rounded-xl border border-border bg-card p-6">
            <p className="text-3xl font-black text-accent">{activeJobs ?? 0}</p>
            <p className="text-sm text-muted-foreground mt-1">Trabajos en curso</p>
          </div>
          <div className="stat-card rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-1.5 mb-2">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="size-5 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Valoración general</p>
          </div>
        </div>
      </div>
    </div>
  )
}
