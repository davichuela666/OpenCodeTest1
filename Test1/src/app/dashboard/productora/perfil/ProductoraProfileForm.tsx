'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateCompanyProfile } from '@/lib/actions/productora'
import { companyProfileSchema, type CompanyProfileFormData } from '@/lib/schemas/productora'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const activities = ['Film', 'Television', 'Streaming Platform', 'Sports', 'Events', 'Other'] as const

const initialState = { message: '', errors: {}, success: false }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Guardar cambios
    </Button>
  )
}

export function ProductoraProfileForm({
  freelancer,
  company,
}: {
  freelancer: any
  company: any
}) {
  const [state, formAction] = useActionState(updateCompanyProfile, initialState)

  const { register, watch, setValue, formState: { errors } } = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      first_name: freelancer.first_name || '',
      tax_id: company?.tax_id || '',
      activities: company?.activities ?? [],
    } as any,
  })

  const selectedActivities = (watch('activities') || []) as string[]

  const toggleActivity = (act: string) => {
    if (selectedActivities.includes(act)) {
      setValue('activities', selectedActivities.filter((a) => a !== act) as any)
    } else {
      setValue('activities', [...selectedActivities, act] as any)
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="first_name">Nombre de la Productora</Label>
        <Input id="first_name" {...register('first_name')} />
        {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
        {state?.errors?.first_name && <p className="text-sm text-destructive">{state.errors.first_name[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tax_id">CIF</Label>
        <Input id="tax_id" {...register('tax_id')} />
        {errors.tax_id && <p className="text-sm text-destructive">{errors.tax_id.message}</p>}
        {state?.errors?.tax_id && <p className="text-sm text-destructive">{state.errors.tax_id[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label>Actividades</Label>
        {selectedActivities.map(act => (
          <input key={act} type="hidden" name="activities" value={act} />
        ))}
        <div className="grid grid-cols-2 gap-2">
          {activities.map(act => (
            <button
              key={act}
              type="button"
              onClick={() => toggleActivity(act)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors text-left',
                selectedActivities.includes(act)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50',
              )}
            >
              <div className={cn(
                'size-4 rounded border flex items-center justify-center transition-colors',
                selectedActivities.includes(act)
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-muted-foreground',
              )}>
                {selectedActivities.includes(act) && <Check className="size-3" />}
              </div>
              {act}
            </button>
          ))}
        </div>
        {errors.activities && <p className="text-sm text-destructive">{errors.activities.message}</p>}
        {state?.errors?.activities && <p className="text-sm text-destructive">{state.errors.activities[0]}</p>}
      </div>

      {state?.message && (
        <p className={cn(
          'text-sm font-medium text-center',
          state.success ? 'text-green-600' : 'text-destructive',
        )}>
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}
