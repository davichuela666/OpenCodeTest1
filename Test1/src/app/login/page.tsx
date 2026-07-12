'use client'

import { Suspense, useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { loginUser } from '@/lib/actions/auth'
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth'

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
import { Loader2, CheckCircle2, Camera, Building2, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const initialState: { message: string; errors?: Record<string, string[]> } = { message: '', errors: {} }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Iniciar Sesión
    </Button>
  )
}

function LoginForm({ role, onBack }: { role: 'freelancer' | 'production_company'; onBack: () => void }) {
  const [state, formAction] = useActionState(loginUser, initialState)

  const { register, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-5" />
          </button>
          <div className={cn(
            'inline-flex p-2 rounded-lg',
            role === 'freelancer' ? 'bg-primary/10' : 'bg-accent/10',
          )}>
            {role === 'freelancer'
              ? <Camera className={cn('size-5', 'text-primary')} />
              : <Building2 className={cn('size-5', 'text-accent')} />
            }
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center pt-2">
          {role === 'freelancer' ? 'Acceso Autónomos' : 'Acceso Productoras'}
        </CardTitle>
        <CardDescription className="text-center">
          {role === 'freelancer'
            ? 'Introduce tus credenciales para acceder a tu perfil de autónomo.'
            : 'Introduce las credenciales del contacto principal para acceder a tu panel.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="role" value={role} />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="tu@email.com" />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
          </div>

          {state?.message && (
            <p className="text-sm font-medium text-destructive text-center">{state.message}</p>
          )}

          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

function RoleSelector({ onSelectRole }: { onSelectRole: (role: 'freelancer' | 'production_company') => void }) {
  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Bienvenido a frilanzer</h1>
        <p className="text-muted-foreground">Selecciona cómo quieres acceder</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onSelectRole('freelancer')}
          className="group rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
            <Camera className="size-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-1">Soy Autónomo</h3>
          <p className="text-sm text-muted-foreground">
            Accede a tu perfil, agenda e historial de trabajos.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelectRole('production_company')}
          className="group rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:border-accent hover:shadow-lg hover:-translate-y-0.5"
        >
          <div className="inline-flex p-3 rounded-xl bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
            <Building2 className="size-8 text-accent" />
          </div>
          <h3 className="text-lg font-bold mb-1">Soy Productora</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona tus proyectos, vacantes y contactos.
          </p>
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link href="/registro" className="text-primary hover:underline font-medium">
          Regístrate
        </Link>
      </p>
    </div>
  )
}

function LoginPageContent() {
  const searchParams = useSearchParams()
  const registrado = searchParams.get('registrado') === 'true'
  const [selectedRole, setSelectedRole] = useState<'freelancer' | 'production_company' | null>(null)

  if (registrado && !selectedRole) {
    return (
      <div className="w-full max-w-md space-y-4">
        {registrado && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md flex items-center gap-2 text-green-700 dark:text-green-400 animate-in fade-in-50">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">¡Cuenta creada con éxito! Selecciona cómo acceder.</p>
          </div>
        )}
        <RoleSelector onSelectRole={setSelectedRole} />
      </div>
    )
  }

  if (selectedRole) {
    return <LoginForm role={selectedRole} onBack={() => setSelectedRole(null)} />
  }

  return <RoleSelector onSelectRole={setSelectedRole} />
}

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)] py-12">
      <Suspense fallback={<div className="text-center text-muted-foreground">Cargando...</div>}>
        <LoginPageContent />
      </Suspense>
    </div>
  )
}
