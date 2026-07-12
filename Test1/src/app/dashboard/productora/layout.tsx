import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Building2, CalendarCheck, NotebookText, UserRound } from 'lucide-react'

const navItems = [
  { href: '/dashboard/productora/perfil', label: 'Mi Perfil', icon: Building2 },
  { href: '/dashboard/productora/proyectos', label: 'Proyectos', icon: NotebookText },
  { href: '/dashboard/productora/contactos', label: 'Contactos', icon: UserRound },
]

export default function ProductoraLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-8">
      <nav className="mb-8 flex items-center gap-1 rounded-lg border border-border bg-card p-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              'text-muted-foreground hover:text-foreground hover:bg-muted',
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  )
}
