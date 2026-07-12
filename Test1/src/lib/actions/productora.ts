'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { companyProfileSchema, contactFormSchema } from '@/lib/schemas/productora';

export async function updateCompanyProfile(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'No autorizado' };

  const rawData = Object.fromEntries(formData.entries());
  const activities = formData.getAll('activities');
  const validated = companyProfileSchema.safeParse({ ...rawData, activities });

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Error en los datos del formulario',
    };
  }

  const data = validated.data;

  const { error: profileError } = await supabase
    .from('freelancers')
    .update({ first_name: data.first_name })
    .eq('id', user.id);

  if (profileError) {
    return { success: false, message: 'Error al actualizar el perfil' };
  }

  const { error: companyError } = await supabase
    .from('production_companies')
    .update({ tax_id: data.tax_id, activities: data.activities })
    .eq('id', user.id);

  if (companyError) {
    return { success: false, message: 'Error al actualizar los datos de la productora' };
  }

  revalidatePath('/dashboard/productora/perfil');
  return { success: true, message: 'Perfil actualizado correctamente' };
}

export async function createContact(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'No autorizado' };

  const rawData = Object.fromEntries(formData.entries());
  const validated = contactFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Error en los datos del formulario',
    };
  }

  const data = validated.data;

  const { error } = await supabase
    .from('contacts')
    .insert({
      company_id: user.id,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      office_hours_start: data.office_hours_start || null,
      office_hours_end: data.office_hours_end || null,
      type: data.type,
    });

  if (error) {
    return { success: false, message: 'Error al crear el contacto' };
  }

  revalidatePath('/dashboard/productora/contactos');
  return { success: true, message: 'Contacto creado correctamente' };
}

export async function updateContact(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'No autorizado' };

  const contactoId = formData.get('id') as string;
  if (!contactoId) return { success: false, message: 'ID de contacto no proporcionado' };

  const rawData = Object.fromEntries(formData.entries());
  const validated = contactFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Error en los datos del formulario',
    };
  }

  const data = validated.data;

  const { error } = await supabase
    .from('contacts')
    .update({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      office_hours_start: data.office_hours_start || null,
      office_hours_end: data.office_hours_end || null,
      type: data.type,
    })
    .eq('id', contactoId)
    .eq('company_id', user.id);

  if (error) {
    return { success: false, message: 'Error al actualizar el contacto' };
  }

  revalidatePath('/dashboard/productora/contactos');
  return { success: true, message: 'Contacto actualizado correctamente' };
}

export async function deleteContact(contactoId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'No autorizado' };

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', contactoId)
    .eq('company_id', user.id);

  if (error) {
    return { success: false, message: 'Error al eliminar el contacto' };
  }

  revalidatePath('/dashboard/productora/contactos');
  return { success: true, message: 'Contacto eliminado correctamente' };
}
