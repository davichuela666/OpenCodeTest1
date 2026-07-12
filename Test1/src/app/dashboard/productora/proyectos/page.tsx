import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Calendar, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  Planned: 'bg-blue-500/10 text-blue-600',
  'In Progress': 'bg-green-500/10 text-green-600',
  Completed: 'bg-muted text-muted-foreground',
  Archived: 'bg-red-500/10 text-red-600',
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: freelancer } = await supabase
    .from('freelancers')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!freelancer || freelancer.role !== 'production_company') redirect('/dashboard')

  const { data: projects } = await supabase
    .from('projects')
    .select('*, contact:contact_id (id, name)')
    .eq('company_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Proyectos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects?.length || 0} proyecto{(projects?.length || 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/dashboard/productora/proyectos/nuevo">
          <Button>
            <Plus className="size-4 mr-1" />
            Nuevo proyecto
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {!projects || projects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No tienes proyectos aún</p>
            <p className="text-sm">Crea tu primer proyecto para empezar a gestionar vacantes.</p>
          </div>
        ) : (
          projects.map(project => (
            <Link
              key={project.id}
              href={`/dashboard/productora/proyectos/${project.id}`}
              className="rounded-xl border border-border bg-card p-5 card-hover block"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      statusStyles[project.status] || 'bg-muted text-muted-foreground',
                    )}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(project.start_date).toLocaleDateString()}
                      {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
                    </span>
                    <span className="flex items-center gap-1">
                      {project.activity}
                    </span>
                    {project.contact && (
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {project.contact.name}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight className="size-5 text-muted-foreground shrink-0" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
