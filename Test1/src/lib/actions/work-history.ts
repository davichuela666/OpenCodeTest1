'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getWorkHistory(freelancerId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('work_history')
    .select('*')
    .eq('freelancer_id', freelancerId)
    .order('created_at', { ascending: false })

  return data || []
}

export async function addFreelancerReview(
  workId: string,
  rating: number,
  review: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, message: 'No autorizado' }

  const { error } = await supabase
    .from('work_history')
    .update({
      freelancer_rating: rating,
      freelancer_review: review || null,
    })
    .eq('id', workId)
    .eq('freelancer_id', user.id)

  if (error) {
    return { success: false, message: 'Error al guardar la valoración' }
  }

  revalidatePath('/dashboard/autonomo/historial')
  return { success: true, message: 'Valoración guardada correctamente' }
}
