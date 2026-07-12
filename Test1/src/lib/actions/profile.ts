'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { profileSchema } from '@/lib/schemas/profile';

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'No autorizado' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const validated = profileSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: 'Error en los datos del formulario',
    };
  }

  const data = validated.data;

  const socialLinks: Record<string, string> = {};
  if (data.social_instagram) socialLinks.instagram = data.social_instagram;
  if (data.social_youtube) socialLinks.youtube = data.social_youtube;
  if (data.social_linkedin) socialLinks.linkedin = data.social_linkedin;
  if (data.social_vimeo) socialLinks.vimeo = data.social_vimeo;

  const portfolioUrls = data.portfolio_urls
    ? data.portfolio_urls.split('\n').map(u => u.trim()).filter(Boolean)
    : [];

  const experienceYears = data.experience_years ? parseInt(data.experience_years, 10) : null;
  const hourlyRate = data.hourly_rate ? parseFloat(data.hourly_rate) : null;
  const dailyRate = data.daily_rate ? parseFloat(data.daily_rate) : null;

  const { error } = await supabase
    .from('freelancers')
    .update({
      street: data.street,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code,
      country: data.country,
      bio: data.bio || null,
      experience_years: experienceYears,
      portfolio_urls: portfolioUrls.length > 0 ? portfolioUrls : null,
      social_links: Object.keys(socialLinks).length > 0 ? socialLinks : null,
      notes: data.notes || null,
      availability_status: data.availability_status,
      hourly_rate: hourlyRate,
      daily_rate: dailyRate,
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile:', error);
    return { success: false, message: 'Error al actualizar el perfil' };
  }

  revalidatePath('/dashboard/autonomo/perfil');
  return { success: true, message: 'Perfil actualizado correctamente' };
}
