import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Calendar, Euro, Users, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { VacantesList } from './VacantesList'
import { ProyectoActions } from './ProyectoActions'

const statusStyles: Record<string, string> = {
  Planned: 'bg-blue-500/10 text-blue-600',
  'In Progress': 'bg-green-500/10 text-green-600',
  Completed: 'bg-muted text-muted-foreground',
  Archived: 'bg-red-500/10 text-red-600',
}

const specialtyLabels: Record<string, string> = {
  camera: 'Cámara / Operador',
  sound: 'Técnico de Sonido',
  lighting: 'Técnico de Luces',
  other: 'Otro',
}

const vacancyStatusStyles: Record<string, string> = {
  Planned: 'bg-blue-500/10 text-blue-600',
  Assigned: 'bg-green-500/10 text-green-600',
  Archived: 'bg-red-500/10 text-red-600',
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*, contact:contact_id (id, name, email)')
    .eq('id', id)
    .eq('company_id', user.id)
    .single()

  if (!project) redirect('/dashboard/productora/proyectos')

  const { data: vacancies } = await supabase
    .from('vacancies')
    .select('*, freelancer:assigned_freelancer_id (id, first_name, last_name)')
    .eq('project_id', id)
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-8">
      <Link href="/dashboard/productora/proyectos" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Volver a proyectos
      </Link>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', statusStyles[project.status])}>
                {project.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{project.activity}</p>
          </div>
          {project.status !== 'Archived' && <ProyectoActions projectId={project.id} />}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-4" />
            {new Date(project.start_date).toLocaleDateString()}
            {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
          </span>
          {project.contact && (
            <span className="flex items-center gap-1">
              <Users className="size-4" />
              {project.contact.name}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Vacantes</h2>
          {project.status !== 'Archived' && (
            <Link href={`/dashboard/productora/proyectos/${id}/vacantes/nueva`}>
              <Button size="sm">
                <Plus className="size-4 mr-1" />
                Añadir vacante
              </Button>
            </Link>
          )}
        </div>

        {!vacancies || vacancies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border border-dashed rounded-xl">
            <p className="text-sm">No hay vacantes en este proyecto. Añade la primera.</p>
          </div>
        ) : (
          <VacantesList vacancies={vacancies} projectId={project.id} />
        )}
      </div>
    </div>
  )
}
