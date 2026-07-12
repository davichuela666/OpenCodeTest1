import Link from 'next/link'
import { cn } from '@/lib/utils'
import { User, Calendar, Clock } from 'lucide-react'

const navItems = [
  { href: '/dashboard/autonomo/perfil', label: 'Mi Perfil', icon: User },
  { href: '/dashboard/autonomo/agenda', label: 'Agenda', icon: Calendar },
  { href: '/dashboard/autonomo/historial', label: 'Historial', icon: Clock },
]

export default function AutonomoLayout({
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
