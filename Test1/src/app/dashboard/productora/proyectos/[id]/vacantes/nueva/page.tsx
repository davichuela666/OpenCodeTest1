'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createVacancy } from '@/lib/actions/proyecto'
import { vacancyFormSchema, type VacancyFormData } from '@/lib/schemas/proyecto'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const specialties = [
  { value: 'camera', label: 'Cámara / Operador' },
  { value: 'sound', label: 'Técnico de Sonido' },
  { value: 'lighting', label: 'Técnico de Luces' },
  { value: 'other', label: 'Otro' },
] as const

const statuses = ['Planned', 'Assigned', 'Archived'] as const

const initialState = { message: '', errors: {}, success: false }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Crear vacante
    </Button>
  )
}

export default function NewVacancyPage() {
  const params = useParams()
  const projectId = params.id as string

  const [state, formAction] = useActionState(createVacancy, initialState)

  const { register, formState: { errors } } = useForm<VacancyFormData>({
    resolver: zodResolver(vacancyFormSchema),
    defaultValues: {
      name: '',
      specialty: 'camera',
      rate: '',
      start_date: '',
      end_date: '',
      status: 'Planned',
    },
  })

  return (
    <div className="max-w-2xl">
      <Link
        href={`/dashboard/productora/proyectos/${projectId}`}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="size-4" />
        Volver al proyecto
      </Link>

      <h1 className="text-2xl font-bold mb-6">Nueva Vacante</h1>

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="project_id" value={projectId} />

        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la vacante *</Label>
          <Input id="name" {...register('name')} placeholder="Ej: Cámara Principal" />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          {state?.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialty">Perfil requerido *</Label>
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
          {state?.errors?.specialty && <p className="text-sm text-destructive">{state.errors.specialty[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate">Tarifa por hora (€) *</Label>
          <Input id="rate" type="number" step="0.01" {...register('rate')} placeholder="25.00" />
          {errors.rate && <p className="text-sm text-destructive">{errors.rate.message}</p>}
          {state?.errors?.rate && <p className="text-sm text-destructive">{state.errors.rate[0]}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Fecha de inicio *</Label>
            <Input id="start_date" type="date" {...register('start_date')} />
            {errors.start_date && <p className="text-sm text-destructive">{errors.start_date.message}</p>}
            {state?.errors?.start_date && <p className="text-sm text-destructive">{state.errors.start_date[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Fecha de fin *</Label>
            <Input id="end_date" type="date" {...register('end_date')} />
            {errors.end_date && <p className="text-sm text-destructive">{errors.end_date.message}</p>}
            {state?.errors?.end_date && <p className="text-sm text-destructive">{state.errors.end_date[0]}</p>}
          </div>
        </div>

        <input type="hidden" {...register('status')} value="Planned" />

        {state?.message && (
          <p className="text-sm font-medium text-destructive text-center">{state.message}</p>
        )}

        <SubmitButton />
      </form>
    </div>
  )
}
