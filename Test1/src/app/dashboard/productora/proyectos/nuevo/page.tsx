'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProject, getCompanyContacts } from '@/lib/actions/proyecto'
import { projectFormSchema, type ProjectFormData } from '@/lib/schemas/proyecto'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const activities = ['Film', 'Television', 'Streaming Platform', 'Sports', 'Events', 'Other'] as const

const initialState = { message: '', errors: {}, success: false }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Crear proyecto
    </Button>
  )
}

export default function NewProjectPage() {
  const [state, formAction] = useActionState(createProject, initialState)
  const [contacts, setContacts] = useState<{ id: string; name: string }[]>([])

  const { register, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: '',
      start_date: '',
      end_date: '',
      activity: undefined,
      status: 'Planned',
      contact_id: null,
    },
  })

  useEffect(() => {
    getCompanyContacts().then(setContacts)
  }, [])

  return (
    <div className="max-w-2xl">
      <Link href="/dashboard/productora/proyectos" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="size-4" />
        Volver a proyectos
      </Link>

      <h1 className="text-2xl font-bold mb-6">Nuevo Proyecto</h1>

      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del proyecto *</Label>
          <Input id="name" {...register('name')} placeholder="Ej: Serie Documental Amazonas" />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          {state?.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Fecha de inicio *</Label>
            <Input id="start_date" type="date" {...register('start_date')} />
            {errors.start_date && <p className="text-sm text-destructive">{errors.start_date.message}</p>}
            {state?.errors?.start_date && <p className="text-sm text-destructive">{state.errors.start_date[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Fecha de fin</Label>
            <Input id="end_date" type="date" {...register('end_date')} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activity">Actividad *</Label>
          <select
            id="activity"
            {...register('activity')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecciona una actividad</option>
            {activities.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          {errors.activity && <p className="text-sm text-destructive">{errors.activity.message}</p>}
          {state?.errors?.activity && <p className="text-sm text-destructive">{state.errors.activity[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_id">Responsable</Label>
          <select
            id="contact_id"
            {...register('contact_id')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Sin responsable asignado</option>
            {contacts.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
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
