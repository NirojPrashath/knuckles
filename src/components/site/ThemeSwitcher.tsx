import * as React from 'react'
import { Check, Palette, Shuffle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { THEMES, type ThemeId } from '@/lib/theme'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/**
 * Live design-direction switcher, with the same panel-reveal contract the rest
 * of the site uses (open 400ms · y 80px). Useful here as a decision tool: the
 * chosen direction is one of these five, and you can feel the difference.
 */
export function ThemeSwitcher({ theme, onTheme }: { theme: ThemeId; onTheme: (id: ThemeId) => void }) {
  const [open, setOpen] = React.useState(false)
  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0]

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2 sm:bottom-5 sm:right-5 print:hidden">
      <div className="t-panel-scope">
        <div
          className="t-panel-slide w-[18.5rem] rounded-xl border border-border bg-popover/95 p-3 shadow-2xl backdrop-blur-xl"
          data-open={open}
        >
          <div className="mb-2 flex items-center gap-2 px-1">
            <Palette className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Retail system</span>
          </div>
          <div className="grid gap-1" role="radiogroup" aria-label="Retail system">
            {THEMES.map((t) => (
              <ThemeRow key={t.id} entry={t} selected={t.id === theme} onSelect={onTheme} />
            ))}
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="mt-2 w-full"
            onClick={() => {
              const pool = THEMES.filter((t) => t.id !== theme)
              onTheme(pool[Math.floor(Math.random() * pool.length)].id)
            }}
          >
            <Shuffle className="size-3.5" />
            Surprise me
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-full border border-border bg-card/90 py-2 pl-2.5 pr-4 text-xs font-medium shadow-xl backdrop-blur-xl transition-colors hover:bg-accent"
      >
        <span
          className="size-5 rounded-full ring-1 ring-inset ring-white/20"
          style={{ background: active.swatch }}
          aria-hidden="true"
        />
        <span className="text-foreground">{active.label}</span>
        <span className="text-muted-foreground">{open ? '▾' : '▴'}</span>
      </button>
    </div>
  )
}

function ThemeRow({
  entry,
  selected,
  onSelect,
}: {
  entry: (typeof THEMES)[number]
  selected: boolean
  onSelect: (id: ThemeId) => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onSelect(entry.id)}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors',
            selected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/60',
          )}
        >
          <span
            className="size-4 shrink-0 rounded-full ring-1 ring-inset ring-white/20"
            style={{ background: entry.swatch }}
            aria-hidden="true"
          />
          <span className="flex-1 truncate font-medium">{entry.label}</span>
          {selected && <Check className="size-3.5 text-primary" />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">{entry.vibe}</TooltipContent>
    </Tooltip>
  )
}
