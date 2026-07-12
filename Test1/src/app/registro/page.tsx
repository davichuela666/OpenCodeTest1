'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { registerUser } from '@/lib/actions/auth'
import { registerSchema, type RegisterFormData } from '@/lib/schemas/auth'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

const initialState: { message: string; errors?: Record<string, string[]> } = { message: '', errors: {} }

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Registrarse
    </Button>
  )
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, initialState)
  
  const { register, control, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'freelancer',
    }
  })

  const selectedRole = watch('role')

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)] py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear una cuenta</CardTitle>
          <CardDescription className="text-center">
            Introduce tus datos para registrarte en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Quiero registrarme como...</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freelancer">Cámara Autónomo</SelectItem>
                      <SelectItem value="production_company">Productora / Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
              {state?.errors?.role && <p className="text-sm text-destructive">{state.errors.role[0]}</p>}
            </div>

            {selectedRole === 'freelancer' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nombre</Label>
                  <Input id="first_name" {...register('first_name')} placeholder="Tu nombre" />
                  {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
                  {state?.errors?.first_name && <p className="text-sm text-destructive">{state.errors.first_name[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Apellidos</Label>
                  <Input id="last_name" {...register('last_name')} placeholder="Tus apellidos" />
                  {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
                  {state?.errors?.last_name && <p className="text-sm text-destructive">{state.errors.last_name[0]}</p>}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nombre de la Productora</Label>
                  <Input id="first_name" {...register('first_name')} placeholder="Nombre de la empresa" />
                  {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
                  {state?.errors?.first_name && <p className="text-sm text-destructive">{state.errors.first_name[0]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_id">CIF</Label>
                  <Input id="tax_id" {...register('tax_id')} placeholder="B-12345678" />
                  {errors.tax_id && <p className="text-sm text-destructive">{errors.tax_id.message}</p>}
                  {state?.errors?.tax_id && <p className="text-sm text-destructive">{state.errors.tax_id[0]}</p>}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} placeholder="tu@email.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" type="tel" {...register('phone')} placeholder="+34 600 000 000" />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              {state?.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone[0]}</p>}
            </div>

            {selectedRole === 'production_company' && (
              <div className="space-y-2 animate-in fade-in-50">
                <Label htmlFor="contact_name">Nombre del Contacto Principal</Label>
                <Input id="contact_name" {...register('contact_name')} placeholder="Nombre de la persona de contacto" />
                {errors.contact_name && <p className="text-sm text-destructive">{errors.contact_name.message}</p>}
                {state?.errors?.contact_name && <p className="text-sm text-destructive">{state.errors.contact_name[0]}</p>}
              </div>
            )}

            {selectedRole === 'freelancer' && (
              <div className="space-y-2 animate-in fade-in-50">
                <Label htmlFor="specialty">Especialidad Principal</Label>
                <Controller
                  name="specialty"
                  control={control}
                  render={({ field }) => (
                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="specialty">
                        <SelectValue placeholder="Selecciona tu especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camera">Cámara / Operador</SelectItem>
                        <SelectItem value="sound">Técnico de Sonido</SelectItem>
                        <SelectItem value="lighting">Técnico de Luces</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.specialty && <p className="text-sm text-destructive">{errors.specialty.message}</p>}
                {state?.errors?.specialty && <p className="text-sm text-destructive">{state.errors.specialty[0]}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" {...register('password')} placeholder="Mínimo 6 caracteres" />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
            </div>

            {state?.message && (
              <p className="text-sm font-medium text-destructive text-center">{state.message}</p>
            )}

            <SubmitButton />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
