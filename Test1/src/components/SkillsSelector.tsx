'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

type Skill = {
  id: string
  name: string
}

export function SkillsSelector({
  skills,
  selectedIds,
  onChange,
  error,
}: {
  skills: Skill[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  error?: string
}) {
  function toggleSkill(skillId: string) {
    if (selectedIds.includes(skillId)) {
      onChange(selectedIds.filter(id => id !== skillId))
    } else {
      onChange([...selectedIds, skillId])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {selectedIds.map(id => {
          const skill = skills.find(s => s.id === id)
          if (!skill) return null
          return (
            <Badge key={id} variant="secondary" className="gap-1 pr-1">
              {skill.name}
              <button
                type="button"
                onClick={() => toggleSkill(id)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-muted transition-colors"
              >
                <X className="size-3" />
              </button>
            </Badge>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.filter(s => !selectedIds.includes(s.id)).map(skill => (
          <button
            key={skill.id}
            type="button"
            onClick={() => toggleSkill(skill.id)}
            className={cn(
              'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
              'hover:border-primary hover:text-primary',
              'border-input text-muted-foreground'
            )}
          >
            + {skill.name}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
