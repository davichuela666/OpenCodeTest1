'use client'

// ACTUALIZACIÓN: Usamos useActionState de 'react' y useFormStatus de 'react-dom'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
// ACTUALIZACIÓN: Importaciones separadas para acción y esquema/tipo
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

// Estado inicial para la Server Action
const initialState = {
  message: null,
  errors: {},
}

// Componente para el botón de envío que muestra un spinner mientras se carga
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
  // ACTUALIZACIÓN: Usamos el hook renombrado useActionState
  const [state, formAction] = useActionState(registerUser, initialState)
  
  // Hook para manejar el formulario en el cliente
  const { register, control, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'autonomo',
    }
  })

  // Observamos el valor del rol para mostrar/ocultar el campo de especialidad
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
            {/* Rol */}
            <div className="space-y-2">
              <Label htmlFor="role">Quiero registrarme como...</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  // CORRECCIÓN FINAL: Pasamos 'name' y 'value' explícitamente para que Radix genere el input oculto correctamente.
                  <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="autonomo">Cámara Autónomo</SelectItem>
                      <SelectItem value="productora">Productora / Empresa</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
              {state?.errors?.role && <p className="text-sm text-destructive">{state.errors.role[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <Input id="first_name" {...register('first_name')} placeholder="Tu nombre" />
                {errors.first_name && <p className="text-sm text-destructive">{errors.first_name.message}</p>}
                {state?.errors?.first_name && <p className="text-sm text-destructive">{state.errors.first_name[0]}</p>}
              </div>
              {/* Apellidos */}
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellidos</Label>
                <Input id="last_name" {...register('last_name')} placeholder="Tus apellidos" />
                {errors.last_name && <p className="text-sm text-destructive">{errors.last_name.message}</p>}
                {state?.errors?.last_name && <p className="text-sm text-destructive">{state.errors.last_name[0]}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} placeholder="tu@email.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" type="tel" {...register('phone')} placeholder="+34 600 000 000" />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              {state?.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone[0]}</p>}
            </div>

            {/* Especialidad (Solo para autónomos) */}
            {selectedRole === 'autonomo' && (
              <div className="space-y-2 animate-in fade-in-50">
                <Label htmlFor="specialty">Especialidad Principal</Label>
                <Controller
                  name="specialty"
                  control={control}
                  render={({ field }) => (
                    // CORRECCIÓN FINAL: Pasamos 'name' y 'value' explícitamente.
                    <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="specialty">
                        <SelectValue placeholder="Selecciona tu especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camara">Cámara / Operador</SelectItem>
                        <SelectItem value="sonido">Técnico de Sonido</SelectItem>
                        <SelectItem value="luces">Técnico de Luces</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.specialty && <p className="text-sm text-destructive">{errors.specialty.message}</p>}
                {state?.errors?.specialty && <p className="text-sm text-destructive">{state.errors.specialty[0]}</p>}
              </div>
            )}

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" {...register('password')} placeholder="Mínimo 6 caracteres" />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
            </div>

            {/* Mensaje de error general */}
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
