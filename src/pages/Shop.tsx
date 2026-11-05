import * as React from 'react'
import { LayoutGrid, List, SlidersHorizontal, Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from '@/lib/router'
import {
  PROCESS_STEPS,
  PRODUCTS,
  ROAST_LEVELS,
  money,
  type RoastLevel,
} from '@/lib/catalog'
import { BAG_TONES } from '@/lib/images'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ProductCard, QuickAdd } from '@/components/shop/ProductCard'
import { BagPlate, IntensityBeans, RoastChip, StockBar, Eyebrow } from '@/components/shop/bits'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'intensity' | 'rating'

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'rating', label: 'Best rated' },
  { id: 'price-asc', label: 'Price, low to high' },
  { id: 'price-desc', label: 'Price, high to low' },
  { id: 'intensity', label: 'Strongest first' },
]

const PROCESS_FAMILIES = [
  { id: 'washed', label: 'Washed', match: (p: string) => p.toLowerCase().includes('washed') && !p.toLowerCase().includes('natural') },
  { id: 'natural', label: 'Natural', match: (p: string) => p.toLowerCase().includes('natural') },
  { id: 'honey', label: 'Honey', match: (p: string) => p.toLowerCase().includes('honey') },
  { id: 'decaf', label: 'Decaf', match: (p: string) => p.toLowerCase().includes('decaf') },
]

/**
 * Shop screen.
 *
 * Filters are a facet list, not a form: roast level, process family, a price
 * ceiling and "in stock only", with the result count always visible and a clear
 * way back. A shop that hides its result count makes people scroll to find out
 * whether they have already seen everything.
 */
export function Shop() {
  const [roasts, setRoasts] = React.useState<RoastLevel[]>([])
  const [processes, setProcesses] = React.useState<string[]>([])
  const [maxPrice, setMaxPrice] = React.useState(6000)
  const [inStockOnly, setInStockOnly] = React.useState(false)
  const [sort, setSort] = React.useState<SortKey>('featured')
  const [view, setView] = React.useState<'grid' | 'list'>('grid')

  const toggle = <T,>(list: T[], value: T, set: (next: T[]) => void) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  const results = React.useMemo(() => {
    const filtered = PRODUCTS.filter((p) => {
      if (roasts.length > 0 && !roasts.includes(p.roast)) return false
      if (processes.length > 0) {
        const ok = processes.some((id) => {
          const family = PROCESS_FAMILIES.find((f) => f.id === id)
          return family ? family.match(p.process) : true
        })
        if (!ok) return false
      }
      if (p.basePrice > maxPrice) return false
      if (inStockOnly && p.stock <= 0) return false
      return true
    })

    switch (sort) {
      case 'price-asc':
        return [...filtered].sort((a, b) => a.basePrice - b.basePrice)
      case 'price-desc':
        return [...filtered].sort((a, b) => b.basePrice - a.basePrice)
      case 'intensity':
        return [...filtered].sort((a, b) => b.intensity - a.intensity)
      case 'rating':
        return [...filtered].sort((a, b) => b.rating - a.rating)
      default:
        return filtered
    }
  }, [roasts, processes, maxPrice, inStockOnly, sort])

  const activeCount = roasts.length + processes.length + (inStockOnly ? 1 : 0) + (maxPrice < 6000 ? 1 : 0)

  const clearAll = () => {
    setRoasts([])
    setProcesses([])
    setMaxPrice(6000)
    setInStockOnly(false)
  }

  const Facets = (
    <div className="space-y-7">
      <div>
        <p className="label text-muted-foreground">Roast level</p>
        <div className="mt-3 space-y-2.5">
          {ROAST_LEVELS.map((level) => {
            const count = PRODUCTS.filter((p) => p.roast === level.id).length
            return (
              <label key={level.id} className="flex cursor-pointer items-start gap-3">
                <Checkbox
                  checked={roasts.includes(level.id)}
                  onCheckedChange={() => toggle(roasts, level.id, setRoasts)}
                  aria-label={level.label}
                  className="mt-0.5"
                />
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2 text-sm">
                    {level.label}
                    <span className="tnum text-xs text-muted-foreground">{count}</span>
                  </span>
                  <span className="block text-xs text-muted-foreground">{level.note}</span>
                </span>
              </label>
            )
          })}
        </div>
      </div>

      <Separator />

      <div>
        <p className="label text-muted-foreground">Process</p>
        <div className="mt-3 space-y-2.5">
          {PROCESS_FAMILIES.map((family) => {
            const count = PRODUCTS.filter((p) => family.match(p.process)).length
            return (
              <label key={family.id} className="flex cursor-pointer items-center gap-3">
                <Checkbox
                  checked={processes.includes(family.id)}
                  onCheckedChange={() => toggle(processes, family.id, setProcesses)}
                  aria-label={family.label}
                  disabled={count === 0}
                />
                <span className="flex-1 text-sm">{family.label}</span>
                <span className="tnum text-xs text-muted-foreground">{count}</span>
              </label>
            )
          })}
        </div>
      </div>

      <Separator />

      <div>
        <div className="flex items-baseline justify-between">
          <p className="label text-muted-foreground">Price per 250 g</p>
          <span className="price text-xs">{money(maxPrice)}</span>
        </div>
        <Slider
          value={[maxPrice]}
          min={3000}
          max={6000}
          step={100}
          onValueChange={([v]) => setMaxPrice(v)}
          className="mt-4"
          aria-label="Maximum price"
        />
        <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
          <span>{money(3000)}</span>
          <span>{money(6000)}</span>
        </div>
      </div>

      <Separator />

      <label className="flex cursor-pointer items-center gap-3">
        <Checkbox
          checked={inStockOnly}
          onCheckedChange={(v) => setInStockOnly(v === true)}
          aria-label="In stock only"
        />
        <span className="text-sm">In stock only</span>
      </label>

      {activeCount > 0 && (
        <Button variant="ghost" size="sm" className="w-full" onClick={clearAll}>
          <X className="size-3.5" />
          Clear {activeCount} {activeCount === 1 ? 'filter' : 'filters'}
        </Button>
      )}
    </div>
  )

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Shop</span>
        </nav>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>The shelf, in full</Eyebrow>
            <h1 className="serif mt-4 text-3xl sm:text-4xl lg:text-5xl">Six coffees, six reasons</h1>
            <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-muted-foreground">
              We would rather roast six things properly than thirty things adequately. Filter it by how
              you brew — that is the only filter that matters.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="tnum font-medium text-foreground">{results.length}</span> of{' '}
            <span className="tnum">{PRODUCTS.length}</span> coffees
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-10">
          {/* facets: a sidebar on desktop, a sheet on a phone */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">{Facets}</div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="size-3.5" />
                    Filters
                    {activeCount > 0 && (
                      <Badge size="sm" className="rounded-full tnum">
                        {activeCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[19rem] overflow-y-auto p-5">
                  <SheetHeader className="mb-6 p-0">
                    <SheetTitle className="serif text-xl">Filter the shelf</SheetTitle>
                  </SheetHeader>
                  {Facets}
                </SheetContent>
              </Sheet>

              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-8 w-[11.5rem] text-xs" aria-label="Sort by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORTS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <ToggleGroup
                type="single"
                value={view}
                onValueChange={(v) => v && setView(v as 'grid' | 'list')}
                className="ml-auto hidden sm:flex"
                aria-label="View"
              >
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <LayoutGrid className="size-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="size-3.5" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {results.length === 0 ? (
              <div className="mt-10 rounded-xl border border-dashed border-border p-12 text-center">
                <p className="serif text-2xl">Nothing on the shelf matches that</p>
                <p className="mx-auto mt-2 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
                  Six coffees is a small shelf, so a narrow filter can empty it. Try widening the price
                  or dropping the process filter.
                </p>
                <Button variant="outline" className="mt-5" onClick={clearAll}>
                  Clear all filters
                </Button>
              </div>
            ) : view === 'grid' ? (
              <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <ul className="mt-8 divide-y divide-border border-y border-border">
                {results.map((product) => (
                  <li key={product.id} className="flex flex-wrap items-center gap-5 py-5">
                    <Link to={`/product/${product.slug}`} className="shrink-0">
                      <BagPlate product={product} className="h-32 w-28 rounded-md border border-border">
                        <div
                          className="absolute inset-x-3 bottom-3 rounded-sm px-2 py-1.5"
                          style={{ background: BAG_TONES[product.image] }}
                        >
                          <p className="serif text-xs text-white">{product.name}</p>
                        </div>
                      </BagPlate>
                    </Link>

                    <div className="min-w-[14rem] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          className="text-base font-medium underline-offset-4 hover:underline"
                        >
                          {product.name}
                        </Link>
                        {product.badge && (
                          <Badge size="sm" className="rounded-full">
                            <Star className="size-3" />
                            {product.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{product.blurb}</p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2">
                        <IntensityBeans level={product.intensity} showLabel />
                        <RoastChip roast={product.roast} />
                        <span className="text-xs text-muted-foreground">{product.process}</span>
                        <span className="text-xs text-muted-foreground">{product.altitude}</span>
                      </div>
                      <div className="mt-2">
                        <StockBar stock={product.stock} />
                      </div>
                    </div>

                    <div className={cn('flex items-center gap-4')}>
                      <span className="price text-base font-medium">{money(product.basePrice)}</span>
                      <QuickAdd product={product} soldOut={product.stock <= 0} />
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-12 rounded-xl border border-border bg-card/50 p-6">
              <p className="label text-muted-foreground">How the shelf works</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-3">
                {PROCESS_STEPS.map((step, i) => (
                  <div key={step.title}>
                    <p className="serif text-2xl text-muted-foreground/50">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-1.5 text-sm font-medium">{step.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
