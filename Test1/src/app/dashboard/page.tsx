import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: freelancer } = await supabase
    .from('freelancers')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (freelancer) {
    if (freelancer.role === 'freelancer') {
      redirect('/dashboard/autonomo');
    }
  }

  const { data: company } = await supabase
    .from('production_companies')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (company) {
    if (company.role === 'production_company') {
      redirect('/dashboard/productora');
    }
  }

  await supabase.auth.signOut();
  redirect('/login?error=perfil_no_encontrado');
}
