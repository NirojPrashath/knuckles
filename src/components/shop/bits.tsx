import * as React from 'react'
import { cn } from '@/lib/utils'
import { MAX_INTENSITY, money, type Product, type RoastLevel } from '@/lib/catalog'
import { BAG_IMAGES, BAG_TONES } from '@/lib/images'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/* ---------------------------------------------------------------- roast beans */

/**
 * Intensity as beans, 1–5, filled left to right. We print this on the bag and on
 * every card, because "how strong is it" is the only question a customer cannot
 * answer from a photo of a paper bag.
 */
export function IntensityBeans({
  level,
  className,
  showLabel = false,
}: {
  level: number
  className?: string
  showLabel?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn('inline-flex items-center gap-1.5', className)} aria-label={`Intensity ${level} of ${MAX_INTENSITY}`}>
          <span className="flex items-center gap-[3px]">
            {Array.from({ length: MAX_INTENSITY }, (_, i) => (
              <Bean key={i} filled={i < level} />
            ))}
          </span>
          {showLabel && (
            <span className="label text-muted-foreground">{level}/{MAX_INTENSITY}</span>
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent>Intensity {level} of {MAX_INTENSITY} — how forceful the cup is</TooltipContent>
    </Tooltip>
  )
}

/** A single coffee bean: two lobes, drawn rather than iconified so it stays crisp at 8px. */
function Bean({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 10 14" className="h-3 w-[9px]" aria-hidden="true">
      <ellipse
        cx="5"
        cy="7"
        rx="4.4"
        ry="6.4"
        fill={filled ? 'var(--foreground)' : 'transparent'}
        stroke={filled ? 'var(--foreground)' : 'var(--border)'}
        strokeWidth="1"
      />
      <path
        d="M5 1.2 C3.4 4.4 6.6 9.6 5 12.8"
        fill="none"
        stroke={filled ? 'var(--background)' : 'var(--border)'}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity={filled ? 0.75 : 1}
      />
    </svg>
  )
}

/* ----------------------------------------------------------------- roast chip */

const ROAST_TONE: Record<RoastLevel, string> = {
  light: '#c9a677',
  medium: '#a3703f',
  dark: '#4a3527',
}

export function RoastChip({ roast, className }: { roast: RoastLevel; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
      <span
        className="size-2.5 rounded-full ring-1 ring-inset ring-black/10"
        style={{ background: ROAST_TONE[roast] }}
        aria-hidden="true"
      />
      {roast} roast
    </span>
  )
}

/* ---------------------------------------------------------------- stock level */

/**
 * Stock as a fill line. Above 12 bags we say nothing — a healthy shop should not
 * fidget. Below that, scarcity is real information, so it is stated plainly.
 */
export function StockBar({ stock, className }: { stock: number; className?: string }) {
  if (stock <= 0) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
        <span className="size-1.5 rounded-full bg-muted-foreground/60" />
        Sold out — next roast Friday
      </span>
    )
  }
  if (stock > 12) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
        <span className="size-1.5 rounded-full bg-emerald-600" />
        In stock · ships in a day
      </span>
    )
  }
  return (
    <span className={cn('inline-flex flex-col gap-1.5', className)}>
      <span className="inline-flex items-center gap-1.5 text-xs">
        <span className="size-1.5 rounded-full bg-amber-600" />
        Only <span className="tnum font-medium">{stock}</span> bags of this roast left
      </span>
      <span className="block h-[3px] w-24 overflow-hidden rounded-full bg-muted">
        <span
          className="stock-draw block h-full rounded-full bg-amber-600"
          style={{ width: `${Math.max(8, (stock / 24) * 100)}%` }}
        />
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------ bag plate */

/**
 * The bag photo with the label rendered as live type over the printed band.
 * Six photographs, one layout — the same way a roaster prints six labels on one
 * stock bag, and it means the coffee's name is selectable text, not pixels.
 */
export function BagPlate({
  product,
  className,
  tone = 'photo',
  children,
}: {
  product: Product
  className?: string
  /** `photo` keeps the studio backdrop; `flat` uses the bag's own band colour */
  tone?: 'photo' | 'flat'
  children?: React.ReactNode
}) {
  const src = BAG_IMAGES[product.image] ?? BAG_IMAGES.charcoal
  const band = BAG_TONES[product.image] ?? '#2b2b2b'

  return (
    <div className={cn('relative overflow-hidden bg-[#f4f1ea]', className)}>
      {tone === 'photo' ? (
        <img src={src} alt={`${product.name} bag`} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="h-full w-full" style={{ background: band }} />
      )}
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ price row */

export function PriceTag({
  amount,
  compareAt,
  size = 'md',
  className,
}: {
  amount: number
  compareAt?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const scale = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-base' : 'text-sm'
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span className={cn('price font-medium', scale)}>{money(amount)}</span>
      {compareAt !== undefined && compareAt > amount && (
        <span className="price text-xs text-muted-foreground line-through">{money(compareAt)}</span>
      )}
    </span>
  )
}

/* ---------------------------------------------------------------- rating strip */

export function RatingStrip({
  rating,
  reviews,
  className,
}: {
  rating: number
  reviews: number
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-xs text-muted-foreground', className)}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} viewBox="0 0 12 12" className="size-3">
            <path
              d="M6 1.2l1.5 3.1 3.4.5-2.5 2.4.6 3.4L6 9l-3 1.6.6-3.4L1.1 4.8l3.4-.5z"
              fill={i < Math.round(rating) ? 'var(--foreground)' : 'transparent'}
              stroke="var(--border)"
              strokeWidth="0.8"
            />
          </svg>
        ))}
      </span>
      <span className="tnum">{rating.toFixed(1)}</span>
      <span aria-hidden="true">·</span>
      <span className="tnum">{reviews} reviews</span>
    </span>
  )
}

/* --------------------------------------------------------------------- badges */

export function BadgeLine({ product, className }: { product: Product; className?: string }) {
  const items: string[] = []
  if (product.badge) items.push(product.badge)
  if (product.roast === 'light' && product.process.includes('Natural')) items.push('Filter only')
  if (product.stock <= 12 && product.stock > 0) items.push('Low stock')

  if (items.length === 0) return null
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {items.map((item, i) => (
        <Badge key={item} variant={i === 0 ? 'default' : 'outline'} size="sm" className="rounded-full">
          {item}
        </Badge>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------- typography */

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('label flex items-center gap-2.5 text-muted-foreground', className)}>
      <span className="h-px w-5 bg-border" aria-hidden="true" />
      {children}
    </p>
  )
}

/** roastery date line — every bag, every card, printed for real */
export function RoastDate({ value, className }: { value: string; className?: string }) {
  const d = new Date(value)
  const formatted = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return (
    <span className={cn('label text-muted-foreground', className)}>
      Roasted {formatted}
    </span>
  )
}
