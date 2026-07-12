'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { ProfileFormData } from '@/lib/schemas/profile'

export function AddressForm({
  register,
  errors,
  serverErrors,
}: {
  register: UseFormRegister<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  serverErrors?: Record<string, string[]>
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2 space-y-2">
        <Label htmlFor="street">Calle y número</Label>
        <Input id="street" {...register('street')} placeholder="Calle Principal, 123" />
        {errors.street && <p className="text-sm text-destructive">{errors.street.message}</p>}
        {serverErrors?.street?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">Ciudad</Label>
        <Input id="city" {...register('city')} placeholder="Madrid" />
        {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
        {serverErrors?.city?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">Provincia</Label>
        <Input id="state" {...register('state')} placeholder="Madrid" />
        {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
        {serverErrors?.state?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
      </div>
      <div className="space-y-2">
        <Label htmlFor="zip_code">Código Postal</Label>
        <Input id="zip_code" {...register('zip_code')} placeholder="28001" />
        {errors.zip_code && <p className="text-sm text-destructive">{errors.zip_code.message}</p>}
        {serverErrors?.zip_code?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">País</Label>
        <Input id="country" {...register('country')} placeholder="España" />
        {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
        {serverErrors?.country?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
      </div>
    </div>
  )
}
