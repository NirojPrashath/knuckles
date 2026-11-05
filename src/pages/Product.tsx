import * as React from 'react'
import {
  ArrowRight,
  Check,
  ChevronRight,
  Info,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from '@/lib/router'
import {
  BAG_SIZES,
  GRINDS,
  PRODUCTS,
  REVIEWS,
  SUBSCRIPTION_PLANS,
  money,
  type Product as ProductType,
} from '@/lib/catalog'
import { BAG_TONES } from '@/lib/images'
import { linePrice, useCart } from '@/lib/cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { NumberInput } from '@/components/ui/number-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  BagPlate,
  IntensityBeans,
  RatingStrip,
  RoastChip,
  RoastDate,
  StockBar,
} from '@/components/shop/bits'
import { CompactCard } from '@/components/shop/ProductCard'
import { Reveal } from '@/components/site/Reveal'

export function Product({ slug }: { slug: string }) {
  const product = PRODUCTS.find((p) => p.slug === slug)

  if (!product) {
    return (
      <section className="py-20">
        <div className="mx-auto w-full max-w-[640px] px-5 text-center sm:px-8">
          <p className="label text-muted-foreground">404</p>
          <h1 className="serif mt-4 text-3xl sm:text-4xl">That coffee is not on our shelf</h1>
          <p className="mx-auto mt-3 max-w-[44ch] text-sm leading-relaxed text-muted-foreground">
            We roast six, and <span className="font-mono text-xs">{slug}</span> is not one of them. It
            may have sold out and been retired for the season.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/shop">See all six coffees</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Back to the roastery</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {PRODUCTS.slice(0, 3).map((p) => (
              <CompactCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return <ProductDetail product={product} />
}

function ProductDetail({ product }: { product: ProductType }) {
  const { add, openDrawer } = useCart()
  const [grams, setGrams] = React.useState(250)
  const [grind, setGrind] = React.useState(product.roast === 'dark' ? 'espresso' : 'filter')
  const [qty, setQty] = React.useState(1)
  const [subscribe, setSubscribe] = React.useState(false)
  const [cadence, setCadence] = React.useState('fortnightly')
  const [added, setAdded] = React.useState(false)
  const [reviewFilter, setReviewFilter] = React.useState<number | null>(null)

  const soldOut = product.stock <= 0
  const list = linePrice(product, grams, qty)
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === cadence) ?? SUBSCRIPTION_PLANS[1]
  const price = subscribe ? Math.round((list * (1 - plan.discount)) / 10) * 10 : list
  const band = BAG_TONES[product.image] ?? '#2b2b2b'
  const pairs = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 2)
  const reviews = REVIEWS.filter((r) => reviewFilter === null || r.rating === reviewFilter)

  const addToBag = (thenCheckout = false) => {
    add(product.id, grams, grind, qty)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
    if (!thenCheckout) openDrawer()
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* ---------------------------------------------------------- gallery */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <BagPlate product={product} className="grain relative aspect-[4/5] w-full rounded-xl border border-border">
                <div className="absolute left-4 top-4 flex flex-col gap-1.5">
                  {product.badge && <Badge className="rounded-full">{product.badge}</Badge>}
                  <Badge variant="outline" className="rounded-full bg-background/80">
                    {product.roast} roast
                  </Badge>
                </div>
                <div className="absolute inset-x-5 bottom-5">
                  <div className="band px-4 py-3.5" style={{ background: band }}>
                    <p className="label text-white/75">{product.origin} · {product.altitude}</p>
                    <p className="serif mt-1 text-2xl text-white">{product.name}</p>
                    <p className="mt-1.5 text-xs text-white/85">
                      {product.notes.join(' · ')} · {product.process}
                    </p>
                    <p className="label mt-2 text-white/60">
                      Roasted {new Date(product.roastedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </BagPlate>
            </Reveal>

            {/* the four facts a serious buyer checks, as a strip rather than prose */}
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-border p-5 sm:grid-cols-4">
              {[
                { k: 'Altitude', v: product.altitude },
                { k: 'Process', v: product.process.split(',')[0] },
                { k: 'Varietal', v: product.varietal },
                { k: 'Roasted', v: new Date(product.roastedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) },
              ].map((fact) => (
                <div key={fact.k}>
                  <dt className="label text-muted-foreground">{fact.k}</dt>
                  <dd className="mt-1 text-sm">{fact.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ------------------------------------------------------------- buy box */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="label text-muted-foreground">{product.origin} · {product.region}</p>
                <h1 className="serif mt-3 text-3xl sm:text-4xl lg:text-5xl">{product.name}</h1>
              </div>
              <Badge variant="outline" size="lg" className="rounded-full">
                <Star className="size-3" />
                {product.rating.toFixed(1)} · {product.reviews} reviews
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              <IntensityBeans level={product.intensity} showLabel />
              <RoastChip roast={product.roast} />
              <RoastDate value={product.roastedOn} />
            </div>

            <p className="mt-5 max-w-[54ch] text-sm leading-relaxed text-muted-foreground">
              {product.blurb}
            </p>

            <ul className="mt-4 flex flex-wrap gap-2">
              {product.notes.map((note) => (
                <li key={note}>
                  <Badge variant="secondary" className="rounded-full">
                    {note}
                  </Badge>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <StockBar stock={product.stock} />
            </div>

            <Separator className="my-6" />

            {/* size */}
            <div className="flex items-baseline justify-between">
              <p className="label text-muted-foreground">Bag size</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground underline-offset-4 hover:underline">
                    <Info className="size-3" />
                    Which lasts how long?
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[16rem]">
                  250 g is about 16 filter cups or 12 flat whites. A kilo is roughly a month for two
                  people who drink two coffees a day.
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {BAG_SIZES.map((size) => (
                <button
                  key={size.grams}
                  type="button"
                  onClick={() => setGrams(size.grams)}
                  className={cn(
                    'rounded-lg border p-3 text-left transition-colors',
                    grams === size.grams ? 'border-foreground bg-accent' : 'border-border hover:border-foreground/30',
                  )}
                >
                  <span className="block text-sm font-medium">{size.label}</span>
                  <span className="price mt-0.5 block text-xs text-muted-foreground">
                    {money(linePrice(product, size.grams, 1))}
                  </span>
                </button>
              ))}
            </div>

            {/* grind */}
            <div className="mt-6">
              <p className="label text-muted-foreground">Grind</p>
              <Select value={grind} onValueChange={setGrind}>
                <SelectTrigger className="mt-3 h-10" aria-label="Grind">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRINDS.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      <span className="flex flex-col">
                        <span>{g.label}</span>
                        <span className="text-[11px] text-muted-foreground">{g.hint}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-muted-foreground">
                {GRINDS.find((g) => g.id === grind)?.hint}
              </p>
            </div>

            {/* subscription toggle — the honest version: same form, different price */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox
                    checked={subscribe}
                    onCheckedChange={(v) => setSubscribe(v === true)}
                    className="mt-0.5"
                    aria-label="Subscribe and save"
                  />
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">Subscribe &amp; save</span>
                      <Badge size="sm" className="rounded-full">
                        <RefreshCw className="size-3" />
                        free delivery
                      </Badge>
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Same bag, on a schedule you set. Pause or cancel from any email.
                    </span>
                  </span>
                </label>

                <div
                  className={cn(
                    'grid gap-2 overflow-hidden transition-all duration-200',
                    subscribe ? 'mt-3 max-h-20 opacity-100' : 'max-h-0 opacity-0',
                  )}
                >
                  <Select value={cadence} onValueChange={setCadence} disabled={!subscribe}>
                    <SelectTrigger className="h-9" aria-label="Delivery cadence">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBSCRIPTION_PLANS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} — {p.discount > 0 ? `${Math.round(p.discount * 100)}% off` : 'no discount'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* quantity + add */}
            <div className="mt-6 flex flex-wrap items-end gap-4">
              <div>
                <span className="label text-muted-foreground">Quantity</span>
                <NumberInput value={qty} onChange={setQty} min={1} max={9} className="mt-2 h-10 w-32" />
              </div>
              <div className="flex-1">
                <span className="label text-muted-foreground">Total</span>
                <p className="price mt-1 text-2xl font-medium">
                  {money(price)}
                  {subscribe && (
                    <span className="ml-2 text-xs font-normal text-muted-foreground line-through">
                      {money(list)}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-[1.4fr_1fr]">
              <Button size="lg" disabled={soldOut} onClick={() => addToBag(true)}>
                {soldOut ? (
                  'Sold out — restocks Friday'
                ) : added ? (
                  <>
                    <Check className="size-4" />
                    Added to bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="size-4" />
                    {subscribe ? 'Subscribe now' : 'Add to bag'}
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" disabled={soldOut} onClick={() => addToBag(false)}>
                Add &amp; keep shopping
              </Button>
            </div>

            {soldOut && (
              <p className="mt-3 text-xs text-muted-foreground">
                The next Hatton batch is on the Friday schedule. Subscribers get the restock email an
                hour before it goes live.
              </p>
            )}

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { icon: <Truck className="size-3.5" />, text: 'Ships the day it cools, roast date printed' },
                { icon: <Package className="size-3.5" />, text: 'One-way valve bag, sealed at the roastery' },
                { icon: <ShieldCheck className="size-3.5" />, text: '30-day taste guarantee, opened bag included' },
                { icon: <RefreshCw className="size-3.5" />, text: 'Free delivery in Colombo over ' + money(12000) },
              ].map((row) => (
                <li key={row.text} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <span className="mt-0.5 shrink-0">{row.icon}</span>
                  {row.text}
                </li>
              ))}
            </ul>

            {/* ------------------------------------------------------- detail tabs */}
            <Accordion type="single" collapsible defaultValue="story" className="mt-8">
              <AccordionItem value="story" className="border-t border-border">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="text-sm font-medium">Where this coffee comes from</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {product.story}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="brew" className="border-t border-border">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="text-sm font-medium">How to brew it</span>
                </AccordionTrigger>
                <AccordionContent>
                  <dl className="space-y-3">
                    {product.brew.map((row) => (
                      <div key={row.label} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                        <dt className="text-muted-foreground">{row.label}</dt>
                        <dd className="font-mono text-xs">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  {product.recipe && (
                    <div className="mt-4 rounded-lg border border-border bg-card p-4">
                      <p className="label text-muted-foreground">Espresso recipe we publish</p>
                      <div className="mt-2.5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                          { k: 'Dose', v: product.recipe.dose },
                          { k: 'Yield', v: product.recipe.yield },
                          { k: 'Time', v: product.recipe.time },
                          { k: 'Temp', v: product.recipe.temp },
                        ].map((cell) => (
                          <div key={cell.k}>
                            <p className="label text-muted-foreground">{cell.k}</p>
                            <p className="price mt-0.5 text-sm">{cell.v}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        Roast date moves the recipe. If your first shot runs sour, grind finer before you
                        blame the coffee.
                      </p>
                    </div>
                  )}
                  <Button variant="ghost" size="sm" className="mt-3 -ml-2" asChild>
                    <Link to="/brew">
                      Full brew guides
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="delivery" className="border-t border-border">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="text-sm font-medium">Delivery and returns</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  Colombo 1–15 is free over {money(12000)} and usually lands next morning. Suburbs are{' '}
                  {money(450)} in 1–2 days, the rest of the island {money(750)} in 2–3. Pickup at the
                  roastery counter is ready within two hours, Tuesday to Sunday. If the coffee is not for
                  you, tell us within 30 days and we replace or refund it — we do not ask for the bag back.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* ------------------------------------------------------------- reviews */}
        <div className="mt-16 border-t border-border pt-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="serif text-2xl sm:text-3xl">Reviews for {product.name}</h2>
              <RatingStrip rating={product.rating} reviews={product.reviews} className="mt-2" />
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter reviews by rating">
              <button
                type="button"
                onClick={() => setReviewFilter(null)}
                data-selected={reviewFilter === null}
                className="chip"
              >
                All
              </button>
              {[5, 4].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReviewFilter(r)}
                  data-selected={reviewFilter === r}
                  className="chip"
                >
                  {r} star · {REVIEWS.filter((x) => x.rating === r).length}
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <li key={review.name} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{review.name}</span>
                  <span className="text-xs text-muted-foreground">{review.city}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={i < review.rating ? 'size-1.5 rounded-full bg-foreground' : 'size-1.5 rounded-full bg-border'}
                      />
                    ))}
                  </span>
                  <span className="label text-muted-foreground">Verified order</span>
                </div>
                <p className="mt-3 text-sm font-medium">{review.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{review.body}</p>
                <p className="label mt-3 text-muted-foreground">On {review.product}</p>
              </li>
            ))}
          </ul>

          {reviews.length === 0 && (
            <p className="mt-6 text-sm text-muted-foreground">
              No {reviewFilter}-star reviews of this coffee yet. That is a real answer, not a bug.
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------- pairs with */}
        <div className="mt-14 border-t border-border pt-10">
          <h2 className="serif text-2xl">Often bought with</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pairs.map((p) => (
              <CompactCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
