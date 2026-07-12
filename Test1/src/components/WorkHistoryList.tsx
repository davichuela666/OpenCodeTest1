'use client'

import { useState } from 'react'
import { RatingStars } from '@/components/RatingStars'
import { ReviewCard } from '@/components/ReviewCard'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addFreelancerReview } from '@/lib/actions/work-history'
import { Star, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

type WorkItem = {
  id: string
  job_title: string
  description: string | null
  start_date: string
  end_date: string | null
  status: string
  client_rating: number | null
  client_review: string | null
  freelancer_rating: number | null
  freelancer_review: string | null
  client_name?: string | null
  created_at: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: 'Completado', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  in_progress: { label: 'En curso', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

function RatingForm({ workId, onComplete }: { workId: string; onComplete: () => void }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (rating === 0) return
    setSubmitting(true)
    const result = await addFreelancerReview(workId, rating, review)
    setSubmitting(false)
    if (result.success) {
      setDone(true)
      onComplete()
    } else {
      setError(result.message || 'Error al guardar')
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <CheckCircle2 className="size-4" />
        Valoración enviada
      </div>
    )
  }

  return (
    <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
      <p className="text-sm font-medium">Valora a la productora</p>
      <div className="flex items-center gap-2">
        <RatingStars rating={rating} max={5} size="md" interactive onChange={setRating} />
        <span className="text-xs text-muted-foreground">{rating > 0 ? `${rating}/5` : 'Selecciona'}</span>
      </div>
      <Textarea
        placeholder="Escribe un comentario sobre tu experiencia (opcional)"
        value={review}
        onChange={e => setReview(e.target.value)}
        rows={2}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={handleSubmit} disabled={rating === 0 || submitting}>
          {submitting ? <Loader2 className="size-3.5 animate-spin mr-1" /> : null}
          Enviar Valoración
        </Button>
      </div>
    </div>
  )
}

function calculateStats(items: WorkItem[]) {
  const completed = items.filter(i => i.status === 'completed')
  const ratings = completed.map(i => i.client_rating).filter((r): r is number => r !== null)
  const avg = ratings.length > 0
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length)
    : null
  return { total: completed.length, average: avg }
}

export function WorkHistoryList({ items }: { items: WorkItem[] }) {
  const [workItems, setWorkItems] = useState(items)
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null)

  const stats = calculateStats(workItems)

  function handleRatingComplete(workId: string) {
    setShowReviewForm(null)
  }

  if (workItems.length === 0) {
    return (
      <AnimateOnScroll animation="fade-in">
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="size-12 mx-auto mb-3 opacity-50" />
          <p className="font-medium">No hay trabajos en tu historial</p>
          <p className="text-sm">Los trabajos completados aparecerán aquí.</p>
        </div>
      </AnimateOnScroll>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <AnimateOnScroll animation="fade-in" delay={100}>
          <div className="rounded-xl border border-border bg-card p-4 text-center h-full">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground mt-1">Trabajos completados</p>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fade-in" delay={200}>
          <div className="rounded-xl border border-border bg-card p-4 text-center h-full">
            <div className="flex justify-center">
              <RatingStars rating={stats.average ? Math.round(stats.average) : 0} size="md" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.average ? `${stats.average.toFixed(1)} / 5` : 'Sin valoraciones'}
            </p>
          </div>
        </AnimateOnScroll>
      </div>

      <div className="space-y-4">
        {workItems.map((item, index) => {
          const status = statusConfig[item.status] || statusConfig.completed
          return (
            <AnimateOnScroll key={item.id} animation="slide-up" delay={300 + index * 100}>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{item.job_title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(item.start_date)} – {item.end_date ? formatDate(item.end_date) : 'Presente'}
                    </p>
                  </div>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', status.className)}>
                    {status.label}
                  </span>
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                )}

                {item.status === 'completed' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <ReviewCard
                      label="Valoración de la productora"
                      rating={item.client_rating}
                      review={item.client_review}
                      align="left"
                    />
                    <div>
                      {item.freelancer_rating ? (
                        <ReviewCard
                          label="Tu valoración"
                          rating={item.freelancer_rating}
                          review={item.freelancer_review}
                          align="right"
                        />
                      ) : showReviewForm === item.id ? (
                        <RatingForm workId={item.id} onComplete={() => handleRatingComplete(item.id)} />
                      ) : (
                        <div className="rounded-lg border border-dashed border-border p-3 text-center">
                          <p className="text-xs text-muted-foreground">Tu valoración</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2 gap-1"
                            onClick={() => setShowReviewForm(item.id)}
                          >
                            <Star className="size-3.5" />
                            Valorar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          )
        })}
      </div>
    </div>
  )
}
