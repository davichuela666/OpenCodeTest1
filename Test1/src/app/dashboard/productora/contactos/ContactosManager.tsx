'use client'

import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createContact, updateContact, deleteContact } from '@/lib/actions/productora'
import { contactFormSchema, type ContactFormData } from '@/lib/schemas/productora'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Pencil, Trash2, Plus, UserRound, Mail, Phone, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const tipos = ['Primary', 'Secondary', 'Other'] as const

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

function ContactForm({
  action,
  initialData,
  onCancel,
}: {
  action: (prev: any, form: FormData) => any
  initialData?: any
  onCancel?: () => void
}) {
  const [state, formAction] = useActionState(action, initialState)

  const { register, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      office_hours_start: initialData?.office_hours_start || '',
      office_hours_end: initialData?.office_hours_end || '',
      type: initialData?.type || 'Secondary',
    },
  })

  return (
    <form action={formAction} className="space-y-4 border rounded-lg p-4 bg-muted/30">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" {...register('name')} placeholder="Nombre del contacto" />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register('email')} placeholder="email@ejemplo.com" />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" {...register('phone')} placeholder="+34 600 000 000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <select
            id="type"
            {...register('type')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {tipos.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="office_hours_start">Horario atención (inicio)</Label>
          <Input id="office_hours_start" type="time" {...register('office_hours_start')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="office_hours_end">Horario atención (fin)</Label>
          <Input id="office_hours_end" type="time" {...register('office_hours_end')} />
        </div>
      </div>

      {state?.message && (
        <p className={cn('text-sm font-medium', state.success ? 'text-green-600' : 'text-destructive')}>
          {state.message}
        </p>
      )}

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <SubmitButton label={initialData?.id ? 'Actualizar' : 'Añadir contacto'} />
      </div>
    </form>
  )
}

export function ContactosManager({ contacts }: { contacts: any[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este contacto?')) {
      await deleteContact(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {contacts.length} contacto{contacts.length !== 1 ? 's' : ''} registrado{contacts.length !== 1 ? 's' : ''}
        </p>
        <Button onClick={() => { setShowForm(true); setEditingId(null) }} size="sm">
          <Plus className="size-4 mr-1" />
          Añadir contacto
        </Button>
      </div>

      {showForm && (
        <ContactForm
          action={createContact}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="space-y-3">
        {contacts.map(contact => (
          <div key={contact.id} className="rounded-lg border border-border bg-card p-4">
            {editingId === contact.id ? (
              <ContactForm
                action={updateContact}
                initialData={contact}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserRound className="size-4 text-primary" />
                    <span className="font-medium">{contact.name}</span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      contact.type === 'Primary'
                        ? 'bg-primary/10 text-primary'
                        : contact.type === 'Secondary'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-accent/10 text-accent',
                    )}>
                      {contact.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="size-3" />
                      {contact.email}
                    </span>
                    {contact.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" />
                        {contact.phone}
                      </span>
                    )}
                    {contact.office_hours_start && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {contact.office_hours_start?.slice(0, 5)} - {contact.office_hours_end?.slice(0, 5)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => setEditingId(contact.id)}>
                    <Pencil className="size-4" />
                  </Button>
                  {contact.type !== 'Primary' && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(contact.id)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
