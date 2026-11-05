import * as React from 'react'
import { cn } from '@/lib/utils'
import { useInView } from '@/components/site/useInView'

/**
 * Scroll reveal — mask-reveal-up from the animate-text catalog.
 * spec: 760ms · y 30px · blur 6px · cubic-bezier(0.22, 1, 0.36, 1)
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'p' | 'span' | 'header' | 'article'
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const Component = Tag as React.ElementType
  return (
    <Component
      ref={ref}
      className={cn('reveal', inView && 'is-in', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  )
}

/** Character variant, 16ms per character — for headlines that deserve the type. */
export function RevealText({
  text,
  className,
  as: Tag = 'span',
  stagger = 16,
}: {
  text: string
  className?: string
  as?: 'span' | 'h1' | 'h2' | 'h3'
  stagger?: number
}) {
  const { ref, inView } = useInView<HTMLSpanElement>()
  const chars = React.useMemo(() => [...text], [text])
  const Component = Tag as React.ElementType
  return (
    <Component
      ref={ref}
      className={cn('reveal-line', inView && 'is-in', className)}
      style={{ ['--stagger' as string]: `${stagger}ms` }}
      aria-label={text}
    >
      {chars.map((ch, i) => (
        <span key={i} className="ch" style={{ ['--i' as string]: i }} aria-hidden="true">
          {ch}
        </span>
      ))}
    </Component>
  )
}
