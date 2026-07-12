'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSkills() {
  const supabase = await createClient();
  const { data } = await supabase.from('skills').select('id, name').order('name');
  return data || [];
}

export async function updateFreelancerSkills(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'No autorizado' };
  }

  const skillIdsRaw = formData.getAll('skillIds');
  const skillIds = skillIdsRaw.filter(id => typeof id === 'string' && id.length > 0);

  await supabase.from('freelancer_skills').delete().eq('freelancer_id', user.id);

  if (skillIds.length > 0) {
    const { error } = await supabase.from('freelancer_skills').insert(
      skillIds.map(skillId => ({ freelancer_id: user.id, skill_id: skillId }))
    );

    if (error) {
      console.error('Error updating skills:', error);
      return { success: false, message: 'Error al actualizar habilidades' };
    }
  }

  revalidatePath('/dashboard/autonomo/perfil');
  return { success: true, message: 'Habilidades actualizadas correctamente' };
}
