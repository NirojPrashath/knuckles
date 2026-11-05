import * as React from 'react'
import { ArrowRight, Check, Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2, Truck, X } from 'lucide-react'
import { Link } from '@/lib/router'
import { cn } from '@/lib/utils'
import { BAG_SIZES, DELIVERY, FAQS, GRINDS, PRODUCTS, money } from '@/lib/catalog'
import { BAG_TONES } from '@/lib/images'
import { linePrice, useCart } from '@/lib/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BagPlate, IntensityBeans } from '@/components/shop/bits'
import { CompactCard } from '@/components/shop/ProductCard'
import { Reveal } from '@/components/site/Reveal'

/**
 * Full-bag view.
 *
 * A cart page earns its keep by answering three questions a drawer cannot: what
 * exactly is in here, what else should be, and what will it cost to get it. So it
 * carries the coupon box with real validation, the delivery zone with real ETAs,
 * and a "pairs with" rail instead of empty white space.
 */
export function Cart() {
  const { lines, totals, setQty, remove, coupon, setCoupon, zone, setZone, pricing, priced } = useCart()
  const [code, setCode] = React.useState('')
  const [codeError, setCodeError] = React.useState<string | null>(null)
  const [codeApplied, setCodeApplied] = React.useState<string | null>(null)

  /*
   * Applying a code is now just: tell the server about it. We cannot validate
   * it here — we do not have the list, which is the whole point of F-01 being
   * fixed. The cart re-quotes, and the outcome below is whatever the server
   * decided. Note we never learn WHY a code was refused: unknown, expired,
   * basket too small and not-entitled all come back identical, so this box
   * cannot be used to discover which codes exist.
   */
  const applyCode = (e: React.FormEvent) => {
    e.preventDefault()
    const key = code.trim().toUpperCase()
    if (key.length === 0) {
      setCodeError('Type a code first')
      return
    }
    setCodeError(null)
    setCoupon(key)
    setCode('')
  }

  const couponAccepted = priced && totals.discount > 0
  const couponRefused = priced && !!coupon && totals.discount === 0

  if (lines.length === 0) {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[720px] px-5 text-center sm:px-8">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-muted">
            <ShoppingBag className="size-6 text-muted-foreground" />
          </span>
          <h1 className="serif mt-6 text-3xl sm:text-4xl">Your bag is empty</h1>
          <p className="mx-auto mt-3 max-w-[44ch] text-sm leading-relaxed text-muted-foreground">
            Nothing in it. If you are not sure where to start, the Nuwara Eliya is the one we hand to
            people who say they do not really know coffee.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/shop">
                Shop the six coffees
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/subscribe">Subscribe instead</Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-3 text-left sm:grid-cols-3">
            {PRODUCTS.slice(0, 3).map((p) => (
              <CompactCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Your bag</span>
        </nav>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h1 className="serif text-3xl sm:text-4xl">Your bag</h1>
          <p className="text-sm text-muted-foreground">
            <span className="tnum font-medium text-foreground">{totals.count}</span>{' '}
            {totals.count === 1 ? 'item' : 'items'} · roasted Tuesday and Friday
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-12">
          {/* ------------------------------------------------------------- lines */}
          <div className="min-w-0">
            <ul className="divide-y divide-border border-y border-border">
              {lines.map((line) => {
                const product = PRODUCTS.find((p) => p.id === line.productId)
                if (!product) return null
                const size = BAG_SIZES.find((s) => s.grams === line.grams)
                const grind = GRINDS.find((g) => g.id === line.grind)
                return (
                  <li key={line.key} className="flex flex-wrap gap-5 py-5">
                    <Link to={`/product/${product.slug}`} className="shrink-0">
                      <BagPlate product={product} className="h-36 w-32 rounded-lg border border-border">
                        <div className="absolute inset-x-3 bottom-3 rounded-sm px-2 py-1.5" style={{ background: BAG_TONES[product.image] }}>
                          <p className="serif text-sm text-white">{product.name}</p>
                        </div>
                      </BagPlate>
                    </Link>

                    <div className="min-w-[15rem] flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            to={`/product/${product.slug}`}
                            className="text-base font-medium underline-offset-4 hover:underline"
                          >
                            {product.name}
                          </Link>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {size?.label} · {grind?.label} · {product.roast} roast
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.key)}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        <IntensityBeans level={product.intensity} />
                        <span className="text-xs text-muted-foreground">{product.notes.join(' · ')}</span>
                      </div>

                      <p className="mt-2 text-xs text-muted-foreground">
                        {product.stock > 0 ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Check className="size-3.5 text-emerald-600" />
                            Reserved for the next roast
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5">
                            <X className="size-3.5" />
                            Sold out — this line will be removed
                          </span>
                        )}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            type="button"
                            onClick={() => setQty(line.key, line.qty - 1)}
                            aria-label="Decrease quantity"
                            className="grid size-8 place-items-center rounded-l-full transition-colors hover:bg-accent"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="tnum w-9 text-center text-sm font-medium">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(line.key, line.qty + 1)}
                            aria-label="Increase quantity"
                            className="grid size-8 place-items-center rounded-r-full transition-colors hover:bg-accent"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="price text-base font-medium">
                            {money(linePrice(product, line.grams, line.qty))}
                          </p>
                          <p className="price text-[11px] text-muted-foreground">
                            {money(linePrice(product, line.grams, 1))} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/shop">Continue shopping</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Bags are packed on the roast day, so an order placed on Wednesday ships Friday.
              </p>
            </div>

            {/* pairs with */}
            <div className="mt-10">
              <p className="label text-muted-foreground">Add a bag for the weekend</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {PRODUCTS.filter((p) => !lines.some((l) => l.productId === p.id) && p.stock > 0)
                  .slice(0, 2)
                  .map((p) => (
                    <CompactCard key={p.id} product={p} />
                  ))}
              </div>
            </div>

            <div className="mt-10 rounded-xl border border-border bg-card/50 p-5">
              <p className="label text-muted-foreground">Before you order</p>
              <dl className="mt-3.5 grid gap-4 sm:grid-cols-2">
                {FAQS.slice(0, 4).map((item) => (
                  <div key={item.q}>
                    <dt className="text-sm font-medium">{item.q}</dt>
                    <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* ----------------------------------------------------------- summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Card>
              <CardContent className="p-5 sm:p-6">
                <h2 className="serif text-xl">Order summary</h2>

                {/* free delivery meter */}
                <div className="mt-4">
                  {totals.freeShippingGap > 0 ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        <span className="price font-medium text-foreground">{money(totals.freeShippingGap)}</span>{' '}
                        more for free Colombo delivery
                      </p>
                      <Progress
                        value={Math.min(100, ((totals.subtotal - totals.discount) / 12000) * 100)}
                        className="mt-2 h-1.5"
                      />
                    </>
                  ) : (
                    <p className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
                      <Truck className="size-3.5" />
                      Free delivery unlocked
                    </p>
                  )}
                </div>

                <Separator className="my-5" />

                {/* coupon */}
                <form onSubmit={applyCode} className="space-y-2">
                  <label className="label text-muted-foreground" htmlFor="coupon">
                    Discount code
                  </label>
                  {coupon ? (
                    <div
                      className={
                        couponAccepted
                          ? 'flex items-center justify-between gap-2 rounded-lg border border-emerald-600/40 bg-emerald-600/5 px-3 py-2.5'
                          : 'flex items-center justify-between gap-2 rounded-lg border border-amber-600/40 bg-amber-600/5 px-3 py-2.5'
                      }
                    >
                      <span className="inline-flex items-center gap-2 text-xs">
                        <Tag className={couponAccepted ? 'size-3.5 text-emerald-700' : 'size-3.5 text-amber-700'} />
                        <span className="font-mono font-medium">{coupon}</span>
                        <span className="text-muted-foreground">
                          {pricing
                            ? 'checking with the server…'
                            : couponRefused
                              ? (totals.couponNote ?? 'not valid for this order')
                              : (totals.couponNote ?? codeApplied)}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCoupon(null)
                          setCodeApplied(null)
                        }}
                        className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                        aria-label="Remove discount code"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <Input
                          id="coupon"
                          value={code}
                          onChange={(e) => {
                            setCode(e.target.value)
                            setCodeError(null)
                          }}
                          placeholder="ROAST10"
                          aria-invalid={!!codeError}
                          className="h-10 font-mono uppercase"
                        />
                        <Button type="submit" variant="outline" className="shrink-0">
                          Apply
                        </Button>
                      </div>
                      {codeError ? (
                        <p role="alert" className="text-xs text-destructive">
                          {codeError}
                        </p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">
                          First order? <span className="font-mono">ROAST10</span> takes 10% off.
                        </p>
                      )}
                    </>
                  )}
                </form>

                <Separator className="my-5" />

                {/* delivery zone */}
                <label className="label text-muted-foreground" htmlFor="zone">
                  Deliver to
                </label>
                <Select value={zone} onValueChange={(v) => setZone(v as keyof typeof DELIVERY)}>
                  <SelectTrigger id="zone" className="mt-2 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DELIVERY).map(([id, z]) => (
                      <SelectItem key={id} value={id}>
                        <span className="flex flex-col">
                          <span>{z.label}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {z.eta} · {z.fee === 0 ? 'free' : money(z.fee)}
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Separator className="my-5" />

                <dl className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="price">{money(totals.subtotal)}</dd>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <dt>Discount</dt>
                      <dd className="price">−{money(totals.discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="price">{totals.shipping === 0 ? 'Free' : money(totals.shipping)}</dd>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex items-baseline justify-between">
                    <dt className="font-medium">Total</dt>
                    <dd className="price text-xl font-medium">{money(totals.total)}</dd>
                  </div>
                </dl>

                {/* Where the number came from. Worth stating out loud, because
                    it is the whole difference between this build and the last. */}
                <p className="mt-3 inline-flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                  <ShieldCheck
                    className={cn('mt-px size-3.5 shrink-0', priced ? 'text-emerald-600' : 'text-muted-foreground')}
                  />
                  <span>
                    {pricing
                      ? 'Pricing with the server…'
                      : priced
                        ? 'Priced by the server. Editing anything on this page changes the label, not the bill.'
                        : 'Estimate only — the server has not priced this basket yet.'}
                  </span>
                </p>

                <Button size="lg" className="mt-5 w-full" asChild>
                  <Link to="/checkout">
                    Checkout
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>

                <ul className="mt-4 space-y-2 text-[11px] text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3" />
                    Roast date printed on every bag
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3" />
                    30-day taste guarantee on opened bags
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3" />
                    Pay by card, bank transfer or cash in Colombo
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Reveal delay={60}>
              <div className="mt-4 rounded-xl border border-border bg-card/50 p-4">
                <p className="label text-muted-foreground">Subscriber note</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Buying two bags of the same coffee every month? A{' '}
                  <Link to="/subscribe" className="text-foreground underline underline-offset-4">
                    fortnightly subscription
                  </Link>{' '}
                  is 5% cheaper and comes with free delivery every time.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  )
}
