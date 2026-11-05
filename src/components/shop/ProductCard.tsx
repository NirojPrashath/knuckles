import * as React from 'react'
import { Check, Plus, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from '@/lib/router'
import { BAG_SIZES, GRINDS, money, type Product } from '@/lib/catalog'
import { BAG_TONES } from '@/lib/images'
import { useCart, linePrice } from '@/lib/cart'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NumberInput } from '@/components/ui/number-input'
import {
  BagPlate,
  BadgeLine,
  IntensityBeans,
  RatingStrip,
  RoastChip,
  StockBar,
} from '@/components/shop/bits'

/**
 * Product card.
 *
 * The order of information is deliberate: name and origin first (what it is),
 * then intensity and roast (how it drinks), then the flavour notes drawn as a
 * printed band (why you would pick it), then price and the roast date (when it
 * was made). Quick-add never leaves the grid — a size and a grind, then it is
 * in the bag, because that is the whole decision.
 */
export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock <= 0
  const band = BAG_TONES[product.image] ?? '#2b2b2b'

  return (
    <article className="group relative flex flex-col">
      <Link
        to={`/product/${product.slug}`}
        className="lift relative block overflow-hidden rounded-lg border border-border bg-card"
      >
        <BagPlate product={product} className="aspect-[4/5] w-full">
          <div className="absolute left-3 top-3">
            <BadgeLine product={product} />
          </div>

          {/* the printed label band, in the bag's own colour, with live type */}
          <div className="absolute inset-x-3 bottom-3">
            <div
              className="band px-3 py-2.5"
              style={{ background: band }}
            >
              <p className="label text-white/70">{product.region}</p>
              <p className="serif mt-0.5 text-lg text-white">{product.name}</p>
              <p className="mt-1 text-[11px] leading-snug text-white/85">
                {product.notes.join(' · ')}
              </p>
            </div>
          </div>
        </BagPlate>
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium leading-tight">
            <Link to={`/product/${product.slug}`} className="hover:underline underline-offset-4">
              {product.name}
            </Link>
          </h3>
          <span className="price shrink-0 text-sm font-medium">
            {money(product.basePrice)}
            <span className="ml-1 text-[11px] font-normal text-muted-foreground">/ 250 g</span>
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{product.blurb}</p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <IntensityBeans level={product.intensity} />
          <RoastChip roast={product.roast} />
          <span className="text-xs text-muted-foreground">{product.process.split(',')[0]}</span>
        </div>

        <div className="mt-2.5">
          <RatingStrip rating={product.rating} reviews={product.reviews} />
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <StockBar stock={product.stock} />
          <QuickAdd product={product} soldOut={soldOut} />
        </div>
      </div>
    </article>
  )
}

/**
 * Quick add: a popover, not a trip to the product page. Size chips + grind select
 * + quantity, and the price updates as you build the line so there is never a
 * surprise in the bag.
 */
export function QuickAdd({ product, soldOut }: { product: Product; soldOut: boolean }) {
  const { add } = useCart()
  const [open, setOpen] = React.useState(false)
  const [grams, setGrams] = React.useState(250)
  const [grind, setGrind] = React.useState('whole')
  const [qty, setQty] = React.useState(1)
  const [justAdded, setJustAdded] = React.useState(false)

  const addToBag = () => {
    add(product.id, grams, grind, qty)
    setOpen(false)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1600)
  }

  if (soldOut) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="shrink-0">
            Notify me
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-4">
          <p className="serif text-base">Back in stock Friday</p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {product.name} sells out most months. Leave an email and we will write once, when the
            next batch cools — not before.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="you@email.lk"
              aria-label="Email for the restock alert"
              className="h-9 min-w-0 flex-1 rounded-[6px] border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            />
            <Button size="sm" className="shrink-0" onClick={() => setOpen(false)}>
              Notify
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={justAdded ? 'secondary' : 'default'}
          size="sm"
          className="shrink-0"
          aria-label={`Add ${product.name} to bag`}
        >
          {justAdded ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
          {justAdded ? 'Added' : 'Add'}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[19rem] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="serif text-base leading-tight">{product.name}</p>
            <p className="label mt-1 text-muted-foreground">{product.region}</p>
          </div>
          <span
            className="size-8 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
            style={{ background: BAG_TONES[product.image] }}
            aria-hidden="true"
          />
        </div>

        <fieldset className="mt-4">
          <legend className="label text-muted-foreground">Bag size</legend>
          <div className="mt-2 flex gap-1.5">
            {BAG_SIZES.map((size) => (
              <button
                key={size.grams}
                type="button"
                onClick={() => setGrams(size.grams)}
                data-selected={grams === size.grams}
                className="chip flex-1 justify-center"
              >
                {size.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-3.5">
          <label className="label text-muted-foreground" htmlFor={`grind-${product.id}`}>
            Grind
          </label>
          <Select value={grind} onValueChange={setGrind}>
            <SelectTrigger id={`grind-${product.id}`} className="mt-1.5 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GRINDS.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3.5 flex items-end justify-between gap-3">
          <div>
            <span className="label text-muted-foreground">Quantity</span>
            <NumberInput
              value={qty}
              onChange={setQty}
              min={1}
              max={9}
              className="mt-1.5 h-9 w-28"
            />
          </div>
          <div className="text-right">
            <span className="label text-muted-foreground">Line total</span>
            <p className="price mt-1 text-lg font-medium">{money(linePrice(product, grams, qty))}</p>
          </div>
        </div>

        <Button className="mt-4 w-full" onClick={addToBag}>
          <ShoppingBag className="size-4" />
          Add to bag
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Free delivery over {money(12000)} · roast date on the bag
        </p>
      </PopoverContent>
    </Popover>
  )
}

/**
 * A quieter card for the "pairs with" and subscription rails: no quick-add, less
 * furniture, so it never competes with the primary grid.
 */
export function CompactCard({ product, className }: { product: Product; className?: string }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className={cn('lift group flex items-center gap-3 rounded-lg border border-border bg-card p-2.5', className)}
    >
      <BagPlate product={product} className="size-16 shrink-0 rounded-md">
        <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: BAG_TONES[product.image] }} />
      </BagPlate>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">{product.notes.slice(0, 2).join(' · ')}</p>
        <p className="price mt-0.5 text-xs">{money(product.basePrice)} / 250 g</p>
      </div>
    </Link>
  )
}
