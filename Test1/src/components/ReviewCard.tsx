import { RatingStars } from '@/components/RatingStars'
import { cn } from '@/lib/utils'

type Review = {
  label: string
  rating: number | null
  review: string | null
  align?: 'left' | 'right'
}

export function ReviewCard({ label, rating, review, align = 'left' }: Review) {
  if (!rating && !review) {
    return (
      <div className={cn(
        'rounded-lg border border-dashed border-border p-3 text-center',
        align === 'right' && 'text-right'
      )}>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xs text-muted-foreground/50 italic mt-1">Sin valorar</p>
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-lg border border-border bg-card p-3',
      align === 'right' && 'text-right'
    )}>
      <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
      {rating && (
        <div className={cn('flex', align === 'right' ? 'justify-end' : 'justify-start')}>
          <RatingStars rating={rating} size="sm" />
        </div>
      )}
      {review && (
        <p className="text-sm mt-1.5 leading-relaxed text-foreground/80">
          &ldquo;{review}&rdquo;
        </p>
      )}
    </div>
  )
}
