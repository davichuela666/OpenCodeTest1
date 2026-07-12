'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAvailability(freelancerId: string, year: number, month: number) {
  const supabase = await createClient()

  const startDate = new Date(Date.UTC(year, month, 1)).toISOString().split('T')[0]
  const endDate = new Date(Date.UTC(year, month + 1, 0)).toISOString().split('T')[0]

  const { data } = await supabase
    .from('availability_slots')
    .select('date, type, note')
    .eq('freelancer_id', freelancerId)
    .gte('date', startDate)
    .lte('date', endDate)

  return data || []
}

export async function toggleDayAvailability(date: string, currentType: string | null) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false }

  const nextType = currentType === 'available' ? 'unavailable' : 'available'

  const { error } = await supabase
    .from('availability_slots')
    .upsert(
      { freelancer_id: user.id, date, type: nextType },
      { onConflict: 'freelancer_id, date' }
    )

  if (error) return { success: false }

  revalidatePath('/dashboard/autonomo/agenda')
  return { success: true, type: nextType }
}

export async function setAvailabilityRange(startDate: string, endDate: string, type: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false }

  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0])
  }

  const { error } = await supabase
    .from('availability_slots')
    .upsert(
      dates.map(date => ({ freelancer_id: user.id, date, type })),
      { onConflict: 'freelancer_id, date' }
    )

  if (error) return { success: false }

  revalidatePath('/dashboard/autonomo/agenda')
  return { success: true }
}
