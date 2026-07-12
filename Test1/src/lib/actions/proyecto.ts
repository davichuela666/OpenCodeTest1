'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { projectFormSchema, vacancyFormSchema } from '@/lib/schemas/proyecto';

export async function getCompanyContacts() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('contacts')
    .select('id, name, email, type')
    .eq('company_id', user.id)
    .order('name', { ascending: true });

  return data || [];
}

export async function createProject(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'No autorizado' };

  const contactId = formData.get('contact_id') as string | null;

  const rawData = Object.fromEntries(formData.entries());
  const validated = projectFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Error en los datos del formulario',
    };
  }

  const data = validated.data;

  const { error } = await supabase
    .from('projects')
    .insert({
      company_id: user.id,
      name: data.name,
      start_date: data.start_date,
      end_date: data.end_date || null,
      activity: data.activity,
      status: data.status,
      contact_id: contactId || null,
    });

  if (error) {
    return { success: false, message: 'Error al crear el proyecto' };
  }

  revalidatePath('/dashboard/productora/proyectos');
  redirect('/dashboard/productora/proyectos');
}

export async function updateProject(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'No autorizado' };

  const projectId = formData.get('id') as string;
  if (!projectId) return { success: false, message: 'ID de proyecto no proporcionado' };

  const contactId = formData.get('contact_id') as string | null;

  const rawData = Object.fromEntries(formData.entries());
  const validated = projectFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Error en los datos del formulario',
    };
  }

  const data = validated.data;

  const { error } = await supabase
    .from('projects')
    .update({
      name: data.name,
      start_date: data.start_date,
      end_date: data.end_date || null,
      activity: data.activity,
      status: data.status,
      contact_id: contactId || null,
    })
    .eq('id', projectId)
    .eq('company_id', user.id);

  if (error) {
    return { success: false, message: 'Error al actualizar el proyecto' };
  }

  revalidatePath('/dashboard/productora/proyectos');
  revalidatePath(`/dashboard/productora/proyectos/${projectId}`);
  return { success: true, message: 'Proyecto actualizado correctamente' };
}

export async function archiveProject(projectId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'No autorizado' };

  const { error } = await supabase
    .from('projects')
    .update({ status: 'Archived' })
    .eq('id', projectId)
    .eq('company_id', user.id);

  if (error) {
    return { success: false, message: 'Error al archivar el proyecto' };
  }

  revalidatePath('/dashboard/productora/proyectos');
  return { success: true, message: 'Proyecto archivado correctamente' };
}

export async function createVacancy(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'No autorizado' };

  const projectId = formData.get('project_id') as string;
  if (!projectId) return { success: false, message: 'ID de proyecto no proporcionado' };

  const assignedFreelancerId = formData.get('assigned_freelancer_id') as string | null;

  const rawData = Object.fromEntries(formData.entries());
  const validated = vacancyFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Error en los datos del formulario',
    };
  }

  const data = validated.data;

  const { error } = await supabase
    .from('vacancies')
    .insert({
      project_id: projectId,
      name: data.name,
      specialty: data.specialty,
      rate: parseFloat(data.rate),
      start_date: data.start_date,
      end_date: data.end_date,
      status: data.status,
      assigned_freelancer_id: assignedFreelancerId || null,
    });

  if (error) {
    return { success: false, message: 'Error al crear la vacante' };
  }

  revalidatePath(`/dashboard/productora/proyectos/${projectId}`);
  redirect(`/dashboard/productora/proyectos/${projectId}`);
}

export async function updateVacancy(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'No autorizado' };

  const vacanteId = formData.get('id') as string;
  if (!vacanteId) return { success: false, message: 'ID de vacante no proporcionado' };

  const projectId = formData.get('project_id') as string;

  const assignedFreelancerId = formData.get('assigned_freelancer_id') as string | null;

  const rawData = Object.fromEntries(formData.entries());
  const validated = vacancyFormSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Error en los datos del formulario',
    };
  }

  const data = validated.data;

  const { error } = await supabase
    .from('vacancies')
    .update({
      name: data.name,
      specialty: data.specialty,
      rate: parseFloat(data.rate),
      start_date: data.start_date,
      end_date: data.end_date,
      status: data.status,
      assigned_freelancer_id: assignedFreelancerId || null,
    })
    .eq('id', vacanteId);

  if (error) {
    return { success: false, message: 'Error al actualizar la vacante' };
  }

  revalidatePath(`/dashboard/productora/proyectos/${projectId}`);
  return { success: true, message: 'Vacante actualizada correctamente' };
}

export async function deleteVacancy(vacanteId: string, projectId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'No autorizado' };

  const { error } = await supabase
    .from('vacancies')
    .delete()
    .eq('id', vacanteId);

  if (error) {
    return { success: false, message: 'Error al eliminar la vacante' };
  }

  revalidatePath(`/dashboard/productora/proyectos/${projectId}`);
  return { success: true, message: 'Vacante eliminada correctamente' };
}
