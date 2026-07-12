'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

export function RatingStars({
  rating,
  max = 5,
  size = 'sm',
  interactive = false,
  onChange,
}: {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
}) {
  const sizeClass = size === 'sm' ? 'size-3.5' : size === 'md' ? 'size-4' : 'size-5'

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const filled = i < rating
        const half = !filled && i < rating + 0.5

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={cn(
              'transition-colors',
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizeClass,
                'transition-all',
                filled
                  ? 'fill-yellow-500 text-yellow-500'
                  : half
                    ? 'fill-yellow-500/50 text-yellow-500'
                    : 'fill-none text-muted-foreground/30'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
