import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Obtener la sesión actual del usuario
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 2. Si no hay sesión, redirigir al login.
  // Esta es la protección básica de la ruta.
  if (!session) {
    redirect('/login');
  }

  // 3. Obtener los datos del perfil del usuario desde la base de datos.
  // Usamos el ID del usuario de la sesión para hacer la consulta.
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    // Si ocurre un error al obtener el perfil (ej: no existe),
    // cerramos la sesión por seguridad y redirigimos.
    console.error('Error al obtener el perfil del usuario:', error);
    await supabase.auth.signOut();
    redirect('/login?error=perfil_no_encontrado');
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="p-6 bg-white dark:bg-zinc-900 shadow rounded-lg border dark:border-zinc-800">
        <h2 className="text-xl font-semibold">
          Hola, <span className="text-primary">{profile.first_name} {profile.last_name}</span>
        </h2>
        <p className="text-muted-foreground mt-2">
          Bienvenido a tu panel de control. Estás registrado como{' '}
          <strong className="capitalize">{profile.role}</strong>.
        </p>
        {profile.role === 'autonomo' && profile.specialty && (
          <p className="text-muted-foreground mt-1">
            Especialidad: <strong className="capitalize">{profile.specialty}</strong>
          </p>
        )}
      </div>
    </div>
  );
}
