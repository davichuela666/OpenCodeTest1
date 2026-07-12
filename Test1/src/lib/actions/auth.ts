'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { registerSchema, loginSchema } from '@/lib/schemas/auth';

export async function registerUser(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = registerSchema.safeParse({
    ...rawData,
    specialty: rawData.specialty || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error en los datos del formulario. Por favor, revísalos.',
    };
  }

  const { email, password, role, first_name, last_name, phone, specialty, tax_id, contact_name } = validatedFields.data;

  try {
    const metadata: Record<string, string | null> = {
      role,
      first_name,
      last_name: last_name || null,
      phone,
      specialty: role === 'freelancer' ? (specialty || null) : null,
    };

    if (role === 'production_company') {
      metadata.tax_id = tax_id || null;
      metadata.contact_name = contact_name || null;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });

    if (error) {
      console.error('Error de Supabase Auth:', JSON.stringify(error, null, 2));
      return {
        message: error?.message || 'Error al crear la cuenta. Es posible que el email ya esté en uso.',
      };
    }
  } catch (error) {
    console.error('Error inesperado en el registro:', error);
    return {
      message: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
    };
  }

  redirect('/login?registrado=true');
}

export async function loginUser(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error en los datos del formulario. Por favor, revísalos.',
    };
  }

  const { email, password, role } = validatedFields.data;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
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

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('freelancers')
    .select('role')
    .eq('id', user?.id)
    .single();

  if (!profile || profile.role !== role) {
    await supabase.auth.signOut();
    return {
      message: role === 'production_company'
        ? 'Esta cuenta no está registrada como productora.'
        : 'Esta cuenta no está registrada como autónomo.',
    };
  }

  if (profile.role === 'production_company') {
    redirect('/dashboard/productora');
  }
  redirect('/dashboard/autonomo');
}
