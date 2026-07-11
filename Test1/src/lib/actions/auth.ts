'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
// Importamos los esquemas y tipos desde el archivo compartido
import { registerSchema, loginSchema } from '@/lib/schemas/auth';

// --- REGISTRO ---

export async function registerUser(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // Extraer y validar los datos del FormData
  const rawData = Object.fromEntries(formData.entries());
  
  // Manejo manual de los campos que pueden no estar presentes o necesitar conversión
  const validatedFields = registerSchema.safeParse({
    ...rawData,
    // Aseguramos que specialty sea undefined si no se envía (para productoras)
    specialty: rawData.specialty || undefined,
  });

  // Si la validación falla, devolver los errores
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error en los datos del formulario. Por favor, revísalos.',
    };
  }

  const { email, password, role, first_name, last_name, phone, specialty } = validatedFields.data;

  try {
    // Llamar a la API de Supabase para registrar el usuario.
    // Pasamos los datos del perfil como metadatos para que el trigger SQL los use.
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          first_name,
          last_name,
          phone,
          // Solo pasamos la especialidad si el rol es autónomo
          specialty: role === 'autonomo' ? specialty : null,
        },
      },
    });

    if (error) {
      console.error('Error de Supabase Auth:', JSON.stringify(error, null, 2));
      return {
        message: error?.message || 'Error al crear la cuenta. Es posible que el email ya esté en uso.',
      };
    }

    // Si todo va bien, redirigir a una página de confirmación o login.
    // Para este flujo inicial, redirigimos al login.
  } catch (error) {
    console.error('Error inesperado en el registro:', error);
    return {
      message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
    };
  }

  // Redirección fuera del bloque try/catch para que Next.js la maneje correctamente
  redirect('/login?registrado=true');
}

// --- LOGIN ---

export async function loginUser(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // Extraer y validar los datos del FormData
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Por seguridad, no especificamos si el error es por email o password incorrecto
      return {
        message: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.',
      };
    }
  } catch (error) {
    console.error('Error inesperado en el login:', error);
    return {
      message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
    };
  }

  // Redirección al dashboard en caso de éxito
  redirect('/dashboard');
}
