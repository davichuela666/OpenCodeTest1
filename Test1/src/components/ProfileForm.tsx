'use client'

import { useActionState, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormStatus } from 'react-dom'

import { profileSchema, type ProfileFormData } from '@/lib/schemas/profile'
import { updateProfile } from '@/lib/actions/profile'
import { updateFreelancerSkills } from '@/lib/actions/skills'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AddressForm } from '@/components/AddressForm'
import { SkillsSelector } from '@/components/SkillsSelector'
import { StatusBadge } from '@/components/StatusBadge'
import { Loader2, Save, CheckCircle2 } from 'lucide-react'

const initialState: { success: boolean; message: string; errors?: Record<string, string[]> } = {
  success: false, message: '', errors: {}
}

type Skill = { id: string; name: string }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      Guardar Cambios
    </Button>
  )
}

export function ProfileForm({
  profile,
  allSkills,
  profileSkillIds,
}: {
  profile: Partial<ProfileFormData> & {
    first_name?: string
    last_name?: string
    email?: string
    availability_status?: string
    social_links?: Record<string, string> | null
    portfolio_urls?: string[] | string | null
    experience_years?: number | null
    hourly_rate?: number | null
    daily_rate?: number | null
  }
  allSkills: Skill[]
  profileSkillIds: string[]
}) {
  const [state, formAction] = useActionState(updateProfile, initialState)
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(profileSkillIds)
  const [showSkillsSuccess, setShowSkillsSuccess] = useState(false)

  const { register, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      street: profile.street || '',
      city: profile.city || '',
      state: profile.state || '',
      zip_code: profile.zip_code || '',
      country: profile.country || 'España',
      bio: profile.bio || '',
      experience_years: profile.experience_years ? String(profile.experience_years) : '',
      portfolio_urls: Array.isArray(profile.portfolio_urls) ? profile.portfolio_urls.join('\n') : (profile.portfolio_urls || ''),
      social_instagram: (profile.social_links as any)?.instagram || '',
      social_youtube: (profile.social_links as any)?.youtube || '',
      social_linkedin: (profile.social_links as any)?.linkedin || '',
      social_vimeo: (profile.social_links as any)?.vimeo || '',
      notes: profile.notes || '',
      availability_status: (profile.availability_status as any) || 'available',
      hourly_rate: profile.hourly_rate ? String(profile.hourly_rate) : '',
      daily_rate: profile.daily_rate ? String(profile.daily_rate) : '',
    },
  })

  async function handleSkillsSave() {
    const formData = new FormData()
    selectedSkillIds.forEach(id => formData.append('skillIds', id))
    const result = await updateFreelancerSkills(initialState, formData)
    if (result.success) {
      setShowSkillsSuccess(true)
      setTimeout(() => setShowSkillsSuccess(false), 3000)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                {profile.first_name} {profile.last_name}
              </CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </div>
            <StatusBadge status={(profile.availability_status as string) || 'available'} />
          </div>
        </CardHeader>
      </Card>

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Información Profesional</CardTitle>
            <CardDescription>
              Completa tu perfil para que las productoras te encuentren fácilmente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="availability_status">Estado de disponibilidad</Label>
              <select
                id="availability_status"
                {...register('availability_status')}
                className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="available">Disponible</option>
                <option value="busy">Ocupado</option>
                <option value="working">Trabajando</option>
                <option value="vacation">Vacaciones</option>
              </select>
              {errors.availability_status && <p className="text-sm text-destructive">{errors.availability_status.message}</p>}
              {state?.errors?.availability_status?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Tarifa por hora (€)</Label>
                <Input id="hourly_rate" type="number" step="0.01" {...register('hourly_rate')} placeholder="Ej: 50" />
                {state?.errors?.hourly_rate?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
              </div>
              <div className="space-y-2">
                <Label htmlFor="daily_rate">Tarifa por día (€)</Label>
                <Input id="daily_rate" type="number" step="0.01" {...register('daily_rate')} placeholder="Ej: 350" />
                {state?.errors?.daily_rate?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografía / Presentación</Label>
              <Textarea id="bio" {...register('bio')} placeholder="Cuéntanos sobre ti y tu experiencia..." rows={4} />
              {state?.errors?.bio?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_years">Años de experiencia</Label>
              <Input id="experience_years" type="number" {...register('experience_years')} placeholder="Ej: 5" />
              {state?.errors?.experience_years?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio_urls">Enlaces a trabajos (uno por línea)</Label>
              <Textarea id="portfolio_urls" {...register('portfolio_urls')} placeholder="https://vimeo.com/tu-showreel&#10;https://youtube.com/tu-portfolio" rows={3} />
              {state?.errors?.portfolio_urls?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
            </div>

            <div className="space-y-3">
              <Label>Redes Sociales</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><Input placeholder="Instagram URL" {...register('social_instagram')} />{state?.errors?.social_instagram?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}</div>
                <div><Input placeholder="YouTube URL" {...register('social_youtube')} />{state?.errors?.social_youtube?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}</div>
                <div><Input placeholder="LinkedIn URL" {...register('social_linkedin')} />{state?.errors?.social_linkedin?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}</div>
                <div><Input placeholder="Vimeo URL" {...register('social_vimeo')} />{state?.errors?.social_vimeo?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}</div>
              </div>
            </div>

            <hr className="border-border" />

            <div>
              <Label className="mb-3 block">Dirección</Label>
              <AddressForm register={register} errors={errors} serverErrors={state?.errors} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas internas (solo visible para ti)</Label>
              <Textarea id="notes" {...register('notes')} placeholder="Notas personales..." rows={3} />
              {state?.errors?.notes?.map(e => <p key={e} className="text-sm text-destructive">{e}</p>)}
            </div>

            {state?.message && !state.success && (
              <p className="text-sm font-medium text-destructive text-center">{state.message}</p>
            )}

            {state?.success && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-700 dark:text-green-400">{state.message}</p>
              </div>
            )}

            <div className="flex justify-end">
              <SubmitButton />
            </div>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Habilidades</CardTitle>
          <CardDescription>
            Selecciona tus habilidades de la lista. Las seleccionadas aparecen como badges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSkillsSuccess && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900">
              <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-700 dark:text-green-400">Habilidades actualizadas correctamente</p>
            </div>
          )}
          <SkillsSelector
            skills={allSkills}
            selectedIds={selectedSkillIds}
            onChange={setSelectedSkillIds}
          />
          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={handleSkillsSave} variant="outline" className="gap-2">
              <Save className="size-4" />
              Guardar Habilidades
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
