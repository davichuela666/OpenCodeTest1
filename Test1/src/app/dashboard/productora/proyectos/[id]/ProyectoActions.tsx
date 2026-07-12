'use client'

import { archiveProject } from '@/lib/actions/proyecto'
import { Button } from '@/components/ui/button'
import { Archive } from 'lucide-react'

export function ProyectoActions({ projectId }: { projectId: string }) {
  const handleArchive = async () => {
    if (confirm('¿Estás seguro de archivar este proyecto?')) {
      await archiveProject(projectId)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleArchive}>
      <Archive className="size-4 mr-1" />
      Archivar
    </Button>
  )
}
