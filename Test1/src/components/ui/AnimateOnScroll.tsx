"use client"

import { useInView } from "react-intersection-observer"
import { cn } from "@/lib/utils"

interface AnimateOnScrollProps {
  children: React.ReactNode
  animation?: "fade-in" | "slide-up"
  delay?: number
  className?: string
}

export function AnimateOnScroll({
  children,
  animation = "fade-in",
  delay = 0,
  className,
}: AnimateOnScrollProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const animationClass = inView
    ? animation === "fade-in"
      ? "animate-fade-in"
      : "animate-slide-up"
    : "opacity-0"

  return (
    <div
      ref={ref}
      className={cn(animationClass, className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
