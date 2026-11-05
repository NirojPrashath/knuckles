import * as React from 'react'
import { ArrowRight, CalendarClock, Check, RefreshCw, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from '@/lib/router'
import { BAG_SIZES, PRODUCTS, SUBSCRIPTION_PLANS, money } from '@/lib/catalog'
import { BAG_TONES } from '@/lib/images'
import { useCart, linePrice } from '@/lib/cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BagPlate, IntensityBeans } from '@/components/shop/bits'

/**
 * Subscription box builder.
 *
 * A subscription's price is the thing people want to know before they commit, so
 * the maths is live: pick a coffee, a bag, a quantity and a cadence and the
 * per-delivery and per-month cost updates as you go. Nothing is hidden behind a
 * "from LKR X" that turns out to mean 250 g monthly.
 */
export function BoxBuilder({ defaultPlan = 'fortnightly' }: { defaultPlan?: string }) {
  const { add, openDrawer } = useCart()
  const [planId, setPlanId] = React.useState(defaultPlan)
  const [productId, setProductId] = React.useState(PRODUCTS[0].id)
  const [grams, setGrams] = React.useState(250)
  const [qty, setQty] = React.useState(1)

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId) ?? SUBSCRIPTION_PLANS[1]
  const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0]

  const list = linePrice(product, grams, 1) * qty
  const paid = Math.round((list * (1 - plan.discount)) / 10) * 10
  const saved = list - paid
  const deliveriesPerMonth = plan.id === 'weekly' ? 4 : plan.id === 'fortnightly' ? 2 : 1

  const subscribe = () => {
    add(product.id, grams, 'whole', qty)
    openDrawer()
  }

  return (
    <div className="grid gap-6 rounded-xl border border-border bg-card p-5 lg:grid-cols-[1.15fr_1fr] lg:p-7">
      <div>
        {/* the coffee */}
        <p className="label text-muted-foreground">1 · Choose the coffee</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {PRODUCTS.map((p) => {
            const soldOut = p.stock <= 0
            return (
              <button
                key={p.id}
                type="button"
                disabled={soldOut}
                onClick={() => setProductId(p.id)}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-2.5 text-left transition-colors',
                  soldOut && 'cursor-not-allowed opacity-50',
                  productId === p.id
                    ? 'border-foreground bg-accent'
                    : 'border-border hover:border-foreground/30',
                )}
              >
                <BagPlate product={p} className="size-10 shrink-0 rounded">
                  <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: BAG_TONES[p.image] }} />
                </BagPlate>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="mt-0.5 flex items-center gap-2">
                    <IntensityBeans level={p.intensity} />
                    {soldOut && <span className="text-[10px] text-muted-foreground">out</span>}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {/* the bag and the quantity */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="label text-muted-foreground">2 · Bag size</p>
            <div className="mt-3 flex gap-1.5">
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
          </div>
          <div>
            <p className="label text-muted-foreground">Bags per delivery</p>
            <div className="mt-3 flex gap-1.5">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQty(n)}
                  data-selected={qty === n}
                  className="chip flex-1 justify-center"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* the cadence */}
        <p className="mt-6 label text-muted-foreground">3 · How often</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlanId(p.id)}
              className={cn(
                'rounded-lg border p-3 text-left transition-colors',
                planId === p.id ? 'border-foreground bg-accent' : 'border-border hover:border-foreground/30',
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{p.name}</span>
                {p.discount > 0 && (
                  <Badge size="sm" className="rounded-full">
                    −{Math.round(p.discount * 100)}%
                  </Badge>
                )}
              </span>
              <span className="mt-1 block text-[11px] text-muted-foreground">{p.cadence}</span>
            </button>
          ))}
        </div>
      </div>

      {/* the receipt */}
      <div className="flex flex-col rounded-lg border border-border bg-background p-5">
        <p className="label text-muted-foreground">Your subscription</p>
        <div className="mt-4 flex items-start gap-3">
          <BagPlate product={product} className="size-20 shrink-0 rounded-md">
            <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: BAG_TONES[product.image] }} />
          </BagPlate>
          <div className="min-w-0">
            <p className="serif text-lg leading-tight">{product.name}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {qty} × {BAG_SIZES.find((s) => s.grams === grams)?.label} · {plan.cadence.toLowerCase()}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">{product.notes.join(' · ')}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">One-off price</dt>
            <dd className="price text-muted-foreground line-through">{money(list)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subscriber price</dt>
            <dd className="price font-medium">
              {money(paid)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">/ delivery</span>
            </dd>
          </div>
          {saved > 0 && (
            <div className="flex justify-between text-emerald-700">
              <dt>You save</dt>
              <dd className="price">{money(saved)} per delivery</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Roughly</dt>
            <dd className="price">{money(paid * deliveriesPerMonth)} / month</dd>
          </div>
        </dl>

        <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
          <li className="flex gap-2">
            <Truck className="mt-0.5 size-3.5 shrink-0" />
            Free delivery on every delivery, islandwide
          </li>
          <li className="flex gap-2">
            <RefreshCw className="mt-0.5 size-3.5 shrink-0" />
            Pause, skip or swap the coffee from the email link — no phone call
          </li>
          <li className="flex gap-2">
            <CalendarClock className="mt-0.5 size-3.5 shrink-0" />
            Roasted the Monday before each delivery
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 size-3.5 shrink-0" />
            Cancel any time, and keep the discount on the bag already on its way
          </li>
        </ul>

        <div className="mt-5 grid gap-2">
          <Button size="lg" onClick={subscribe}>
            Start this subscription
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/subscribe">See how subscriptions work</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
