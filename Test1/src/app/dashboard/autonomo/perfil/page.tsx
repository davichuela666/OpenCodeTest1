import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/ProfileForm'

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('freelancers')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/dashboard')

  const { data: allSkills } = await supabase
    .from('skills')
    .select('id, name')
    .order('name')

  const { data: profileSkills } = await supabase
    .from('freelancer_skills')
    .select('skill_id')
    .eq('freelancer_id', user.id)

  const profileSkillIds = (profileSkills || []).map(ps => ps.skill_id)

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil Profesional</h1>
      <ProfileForm
        profile={profile}
        allSkills={allSkills || []}
        profileSkillIds={profileSkillIds}
      />
    </div>
  )
}
