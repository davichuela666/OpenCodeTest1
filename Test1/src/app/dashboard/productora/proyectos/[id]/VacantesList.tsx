'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateVacancy, deleteVacancy } from '@/lib/actions/proyecto'
import { vacancyFormSchema, type VacancyFormData } from '@/lib/schemas/proyecto'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Trash2, Euro, Calendar, UserRound, Loader2, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const specialtyLabels: Record<string, string> = {
  camera: 'Cámara / Operador',
  sound: 'Técnico de Sonido',
  lighting: 'Técnico de Luces',
  other: 'Otro',
}

const specialties = [
  { value: 'camera', label: 'Cámara / Operador' },
  { value: 'sound', label: 'Técnico de Sonido' },
  { value: 'lighting', label: 'Técnico de Luces' },
  { value: 'other', label: 'Otro' },
] as const

const statuses = ['Planned', 'Assigned', 'Archived'] as const

const vacancyStatusStyles: Record<string, string> = {
  Planned: 'bg-blue-500/10 text-blue-600',
  Assigned: 'bg-green-500/10 text-green-600',
  Archived: 'bg-red-500/10 text-red-600',
}

const initialState = { message: '', errors: {}, success: false }

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {label}
    </Button>
  )
}

function VacancyEditForm({
  vacancy,
  projectId,
  onCancel,
}: {
  vacancy: any
  projectId: string
  onCancel: () => void
}) {
  const [state, formAction] = useActionState(updateVacancy, initialState)

  const { register, formState: { errors } } = useForm<VacancyFormData>({
    resolver: zodResolver(vacancyFormSchema),
    defaultValues: {
      name: vacancy.name || '',
      specialty: vacancy.specialty || 'camera',
      rate: vacancy.rate?.toString() || '',
      start_date: vacancy.start_date || '',
      end_date: vacancy.end_date || '',
      status: vacancy.status || 'Planned',
    },
  })

  return (
    <form action={formAction} className="space-y-4 border rounded-lg p-4 bg-muted/30">
      <input type="hidden" name="id" value={vacancy.id} />
      <input type="hidden" name="project_id" value={projectId} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialty">Perfil *</Label>
          <select
            id="specialty"
            {...register('specialty')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {specialties.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {errors.specialty && <p className="text-sm text-destructive">{errors.specialty.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rate">Tarifa/hora (€) *</Label>
          <Input id="rate" type="number" step="0.01" {...register('rate')} />
          {errors.rate && <p className="text-sm text-destructive">{errors.rate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Estado *</Label>
          <select
            id="status"
            {...register('status')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {statuses.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Fecha inicio *</Label>
          <Input id="start_date" type="date" {...register('start_date')} />
          {errors.start_date && <p className="text-sm text-destructive">{errors.start_date.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">Fecha fin *</Label>
          <Input id="end_date" type="date" {...register('end_date')} />
          {errors.end_date && <p className="text-sm text-destructive">{errors.end_date.message}</p>}
        </div>
      </div>

      {state?.message && (
        <p className={cn('text-sm font-medium', state.success ? 'text-green-600' : 'text-destructive')}>
          {state.message}
        </p>
      )}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancelar</Button>
        <SubmitButton label="Guardar" />
      </div>
    </form>
  )
}

export function VacantesList({ vacancies, projectId }: { vacancies: any[]; projectId: string }) {
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleDelete = async (vacancyId: string) => {
    if (confirm('¿Estás seguro de eliminar esta vacante?')) {
      await deleteVacancy(vacancyId, projectId)
    }
  }

  return (
    <div className="space-y-3">
      {vacancies.map(v => (
        <div key={v.id} className="rounded-xl border border-border bg-card p-4">
          {editingId === v.id ? (
            <VacancyEditForm vacancy={v} projectId={projectId} onCancel={() => setEditingId(null)} />
          ) : (
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{v.name}</span>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', vacancyStatusStyles[v.status])}>
                    {v.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <UserRound className="size-3" />
                    {specialtyLabels[v.specialty] || v.specialty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Euro className="size-3" />
                    {v.rate}€/h
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(v.start_date).toLocaleDateString()} - {new Date(v.end_date).toLocaleDateString()}
                  </span>
                  {v.freelancer && (
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {v.freelancer.first_name} {v.freelancer.last_name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setEditingId(v.id)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
