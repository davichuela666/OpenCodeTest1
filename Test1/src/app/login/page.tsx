'use client'

// ACTUALIZACIÓN: Usamos useActionState de 'react' y useFormStatus de 'react-dom'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
// ACTUALIZACIÓN: Importaciones separadas para acción y esquema/tipo
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
import { Loader2, CheckCircle2 } from 'lucide-react'

const initialState = {
  message: null,
  errors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Iniciar Sesión
    </Button>
  )
}

export default function LoginPage() {
  // ACTUALIZACIÓN: Usamos el hook renombrado useActionState
  const [state, formAction] = useActionState(loginUser, initialState)
  const searchParams = useSearchParams()
  const registrado = searchParams.get('registrado') === 'true'

  const { register, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Bienvenido de nuevo</CardTitle>
          <CardDescription className="text-center">
            Introduce tus credenciales para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registrado && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md flex items-center gap-2 text-green-700 dark:text-green-400 animate-in fade-in-50">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm font-medium">¡Cuenta creada con éxito! Por favor, inicia sesión.</p>
            </div>
          )}
          <form action={formAction} className="space-y-4">
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
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
