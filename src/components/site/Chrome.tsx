import * as React from 'react'
import {
  ArrowRight,
  Bean,
  Check,
  Coffee,
  Instagram,
  MapPin,
  Menu,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  Truck,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link, useRoute } from '@/lib/router'
import { BRAND, DELIVERY, PRODUCTS, money } from '@/lib/catalog'
import { BAG_TONES } from '@/lib/images'
import { linePrice, useCart } from '@/lib/cart'
import { AccountMenu } from '@/components/site/AccountMenu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useSound } from '@/components/ui/sound-provider'
import { BagPlate, IntensityBeans } from '@/components/shop/bits'

/* =============================================================== announcement */

function AnnouncementBar() {
  return (
    <div className="border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex h-9 w-full max-w-[1240px] items-center gap-3 px-5 text-[12px] sm:px-8">
        <Truck className="size-3.5 shrink-0" />
        <span className="truncate">
          {BRAND.hours.split('·')[0].trim()} · free delivery in Colombo over {money(12000)}
        </span>
        <span className="ml-auto hidden items-center gap-1.5 lg:inline-flex">
          <Coffee className="size-3.5" />
          Roasting today · ships 15:00
        </span>
      </div>
    </div>
  )
}

/* ==================================================================== search */

/** Search over name, origin, notes and process — a shop search that only looks at
 * names makes you type the answer you are trying to find. */
function SearchPanel({
  onNavigate,
  autoFocus = false,
}: {
  onNavigate?: () => void
  /** focus only when the panel actually becomes visible — an always-mounted
   *  autoFocus input would steal focus and scroll the page on load */
  autoFocus?: boolean
}) {
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])
  const q = query.trim().toLowerCase()

  const results = React.useMemo(() => {
    if (q.length < 1) return []
    return PRODUCTS.filter((p) =>
      [p.name, p.origin, p.region, p.process, p.roast, ...p.notes, p.blurb]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [q])

  const blank = q.length === 0

  return (
    <div className="w-[min(92vw,26rem)] p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “chocolate”, “honey”, “espresso”…"
          aria-label="Search the shop"
          className="h-10 pl-9"
        />
      </div>

      {blank && (
        <div className="mt-3">
          <p className="label text-muted-foreground">Common searches</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['espresso', 'filter', 'decaf', 'chocolate', 'light roast', '1 kg'].map((term) => (
              <button key={term} type="button" className="chip" onClick={() => setQuery(term)}>
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {!blank && results.length === 0 && (
        <div className="mt-4 rounded-lg border border-dashed border-border p-4 text-center">
          <p className="text-sm font-medium">Nothing matches “{query}”</p>
          <p className="mt-1 text-xs text-muted-foreground">
            We roast six coffees, so this happens. Try a flavour instead: jaggery, mango, cocoa.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-3 space-y-1">
          {results.map((p) => (
            <li key={p.id}>
              <Link
                to={`/product/${p.slug}`}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
              >
                <BagPlate product={p} className="size-11 shrink-0 rounded-md">
                  <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: BAG_TONES[p.image] }} />
                </BagPlate>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {p.notes.join(' · ')}
                  </span>
                </span>
                <span className="price shrink-0 text-xs text-muted-foreground">
                  {money(p.basePrice)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ================================================================ cart drawer */

function CartLine({ line }: { line: ReturnType<typeof useCart>['lines'][number] }) {
  const { setQty, remove } = useCart()
  const product = PRODUCTS.find((p) => p.id === line.productId)
  if (!product) return null
  const grind = line.grind === 'whole' ? 'Whole bean' : line.grind[0].toUpperCase() + line.grind.slice(1)

  return (
    <li className="flex gap-3 py-3.5">
      <Link to={`/product/${product.slug}`} className="shrink-0">
        <BagPlate product={product} className="size-[4.5rem] rounded-md">
          <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: BAG_TONES[product.image] }} />
        </BagPlate>
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/product/${product.slug}`} className="block truncate text-sm font-medium hover:underline underline-offset-4">
              {product.name}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {line.grams >= 1000 ? `${line.grams / 1000} kg` : `${line.grams} g`} · {grind}
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(line.key)}
            aria-label={`Remove ${product.name} from bag`}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-border">
            <button
              type="button"
              onClick={() => setQty(line.key, line.qty - 1)}
              aria-label="Decrease quantity"
              className="grid size-7 place-items-center rounded-l-full transition-colors hover:bg-accent"
            >
              <Minus className="size-3" />
            </button>
            <span className="tnum w-7 text-center text-xs font-medium">{line.qty}</span>
            <button
              type="button"
              onClick={() => setQty(line.key, line.qty + 1)}
              aria-label="Increase quantity"
              className="grid size-7 place-items-center rounded-r-full transition-colors hover:bg-accent"
            >
              <Plus className="size-3" />
            </button>
          </div>
          <span className="price text-sm font-medium">{money(linePrice(product, line.grams, line.qty))}</span>
        </div>
      </div>
    </li>
  )
}

/**
 * The bag, as a drawer. Cart drawer contents are the single best place to sell
 * the next bag, so it carries a "roasting next" rail rather than empty space.
 */
export function CartDrawer() {
  const { lines, totals, drawerOpen, closeDrawer, zone, setZone } = useCart()
  const [justOpened, setJustOpened] = React.useState(false)

  React.useEffect(() => {
    if (drawerOpen) {
      setJustOpened(true)
      const t = window.setTimeout(() => setJustOpened(false), 900)
      return () => window.clearTimeout(t)
    }
  }, [drawerOpen])

  const freeDeliveryProgress = Math.min(100, Math.round(((totals.subtotal - totals.discount) / 12000) * 100))
  const suggestions = PRODUCTS.filter(
    (p) => p.stock > 0 && !lines.some((l) => l.productId === p.id),
  ).slice(0, 2)

  return (
    <Sheet open={drawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-[26rem]">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="serif text-xl">Your bag</SheetTitle>
          <SheetDescription className="text-xs">
            {totals.count === 0
              ? 'Nothing in it yet.'
              : `${totals.count} ${totals.count === 1 ? 'item' : 'items'} · roasted Tuesday and Friday`}
          </SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-muted">
              <ShoppingBag className="size-5 text-muted-foreground" />
            </span>
            <div>
              <p className="text-sm font-medium">Your bag is empty</p>
              <p className="mx-auto mt-1 max-w-[30ch] text-xs leading-relaxed text-muted-foreground">
                Start with the Nuwara Eliya if you drink filter, or Hansa if you have a machine.
              </p>
            </div>
            <Button onClick={closeDrawer} asChild>
              <Link to="/shop">Browse the six coffees</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="px-5">
                <ul className={cn('divide-y divide-border', justOpened && 'reveal is-in')}>
                  {lines.map((line) => (
                    <CartLine key={line.key} line={line} />
                  ))}
                </ul>

                {suggestions.length > 0 && (
                  <div className="border-t border-border py-4">
                    <p className="label text-muted-foreground">Roasting next — add a bag</p>
                    <ul className="mt-2 space-y-1.5">
                      {suggestions.map((p) => (
                        <li key={p.id}>
                          <Link
                            to={`/product/${p.slug}`}
                            onClick={closeDrawer}
                            className="flex items-center gap-2.5 rounded-lg border border-border p-2 transition-colors hover:bg-accent"
                          >
                            <BagPlate product={p} className="size-9 shrink-0 rounded">
                              <div
                                className="absolute inset-x-0 bottom-0 h-1"
                                style={{ background: BAG_TONES[p.image] }}
                              />
                            </BagPlate>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-xs font-medium">{p.name}</span>
                              <IntensityBeans level={p.intensity} />
                            </span>
                            <span className="price text-xs">{money(p.basePrice)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t border-border bg-card/60 px-5 py-4">
              {totals.freeShippingGap > 0 ? (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground">
                    {money(totals.freeShippingGap)} more for free Colombo delivery
                  </p>
                  <Progress value={freeDeliveryProgress} className="mt-1.5 h-1" />
                </div>
              ) : (
                <p className="mb-3 inline-flex items-center gap-1.5 text-xs text-emerald-700">
                  <Check className="size-3.5" />
                  Free delivery unlocked
                </p>
              )}

              <div className="mb-3">
                <label className="label text-muted-foreground" htmlFor="delivery-zone">
                  Delivery
                </label>
                <select
                  id="delivery-zone"
                  value={zone}
                  onChange={(e) => setZone(e.target.value as keyof typeof DELIVERY)}
                  className="mt-1.5 h-9 w-full rounded-[6px] border border-border bg-background px-2.5 text-sm"
                >
                  {Object.entries(DELIVERY).map(([id, z]) => (
                    <option key={id} value={id}>
                      {z.label} — {z.eta}
                    </option>
                  ))}
                </select>
              </div>

              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="price">{money(totals.subtotal)}</dd>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <dt>Discount ({totals.couponNote})</dt>
                    <dd className="price">−{money(totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="price">{totals.shipping === 0 ? 'Free' : money(totals.shipping)}</dd>
                </div>
                <Separator className="my-1.5" />
                <div className="flex items-baseline justify-between">
                  <dt className="font-medium">Total</dt>
                  <dd className="price text-lg font-medium">{money(totals.total)}</dd>
                </div>
              </dl>

              <div className="mt-4 grid gap-2">
                <Button size="lg" onClick={closeDrawer} asChild>
                  <Link to="/checkout">
                    Checkout
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="ghost" onClick={closeDrawer} asChild>
                  <Link to="/cart">View the full bag</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

/* ======================================================================== nav */

const LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Subscribe', to: '/subscribe' },
  { label: 'Brew guides', to: '/brew' },
  { label: 'Wholesale', to: '/wholesale' },
  { label: 'Our roastery', to: '/#roastery' },
]

export function Nav() {
  const route = useRoute()
  const { totals, openDrawer } = useCart()
  const [scrolled, setScrolled] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn('sticky top-0 z-40', scrolled && 'shadow-[0_1px_0_0_var(--border)]')}>
      <AnnouncementBar />
      <div className={cn('border-b transition-colors', scrolled ? 'border-transparent bg-background/85 backdrop-blur-xl' : 'border-border bg-background')}>
        <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-5 px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <Wordmark />
            <span className="serif text-xl leading-none">Knuckles</span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'rounded-md px-3 py-2 text-sm transition-colors',
                  route === link.to ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            {/* search: a popover on desktop, a sheet on a phone */}
            <div className="t-icon-swap-scope hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search the shop"
                className="t-icon-swap"
                data-state={searchOpen ? 'b' : 'a'}
                onClick={() => setSearchOpen((v) => !v)}
              >
                <span className="t-icon" data-icon="a">
                  <Search className="size-4" />
                </span>
                <span className="t-icon" data-icon="b">
                  <X className="size-4" />
                </span>
              </Button>
            </div>

            <AccountMenu />

            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={openDrawer}
            >
              <ShoppingBag className="size-4" />
              Bag
              {totals.count > 0 && (
                <Badge size="sm" className="rounded-full px-1.5 tnum">
                  {totals.count}
                </Badge>
              )}
            </Button>

            <Button size="sm" className="hidden md:inline-flex" asChild>
              <Link to="/subscribe">Subscribe &amp; save</Link>
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className="t-icon-swap-scope inline-flex size-10 items-center justify-center rounded-md border border-border lg:hidden"
            >
              <span className="t-icon-swap" data-state={mobileOpen ? 'b' : 'a'}>
                <span className="t-icon" data-icon="a">
                  <Menu className="size-4" />
                </span>
                <span className="t-icon" data-icon="b">
                  <X className="size-4" />
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* desktop search results drop under the bar rather than in a modal */}
        <div className="t-panel-scope relative mx-auto w-full max-w-[1240px]">
          <div className="t-panel-slide absolute right-5 top-1 z-30 sm:right-8" data-open={searchOpen}>
            <div className="rounded-xl border border-border bg-popover shadow-2xl">
              <SearchPanel autoFocus={searchOpen} onNavigate={() => setSearchOpen(false)} />
            </div>
          </div>
        </div>

        {/* mobile drawer */}
        <div className="t-panel-scope lg:hidden">
          <div
            className="t-panel-slide mx-4 mb-3 rounded-xl border border-border bg-popover p-2 shadow-2xl"
            data-open={mobileOpen}
          >
            <div className="grid gap-0.5">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-accent"
                >
                  {link.label}
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
            <Separator className="my-2" />
            <div className="grid gap-2 p-1">
              <Button
                onClick={() => {
                  setMobileOpen(false)
                  openDrawer()
                }}
              >
                <ShoppingBag className="size-4" />
                Your bag · {totals.count}
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/subscribe" onClick={() => setMobileOpen(false)}>
                  Subscribe &amp; save 10%
                </Link>
              </Button>
            </div>
            <div className="px-3 pb-1 pt-2">
              <SearchPanel onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

/** Stacked-bar mark: two beans and the roastery's ridge line, read as an M. */
function Wordmark() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
      <path d="M2 19 L8.5 5 L12 12 L15.5 5 L22 19" fill="none" stroke="var(--foreground)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <ellipse cx="8.5" cy="5" rx="2.4" ry="1.6" transform="rotate(-25 8.5 5)" fill="var(--foreground)" />
      <ellipse cx="15.5" cy="5" rx="2.4" ry="1.6" transform="rotate(25 15.5 5)" fill="var(--foreground)" />
    </svg>
  )
}

/* ===================================================================== footer */

export function Footer() {
  const { enabled, toggle } = useSound()

  return (
    <footer className="mt-20 border-t border-border bg-card/40">
      <div className="mx-auto w-full max-w-[1240px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <Wordmark />
              <span className="serif text-xl leading-none">Knuckles Roasters</span>
            </div>
            <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
              {BRAND.tagline}. Sourced from six estates, roasted on a 12 kg drum in Colombo 07, and
              shipped with the roast date printed on the bag.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" asChild>
                <a href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}`}>
                  <Phone className="size-3.5" />
                  WhatsApp
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#instagram">
                  <Instagram className="size-3.5" />
                  {BRAND.instagram}
                </a>
              </Button>
            </div>
            <div className="mt-6 flex items-start gap-2.5 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              <span>
                {BRAND.address}
                <br />
                {BRAND.hours}
              </span>
            </div>
          </div>

          <FooterColumn
            title="Shop"
            links={[
              { label: 'All six coffees', to: '/shop' },
              { label: 'Subscriptions', to: '/subscribe' },
              { label: 'Gift a bag', to: '/shop' },
              { label: 'Wholesale for cafés', to: '/wholesale' },
            ]}
          />
          <FooterColumn
            title="Learn"
            links={[
              { label: 'Brew guides', to: '/brew' },
              { label: 'Roast calendar', to: '/#roastery' },
              { label: 'Cupping table, Saturdays', to: '/#roastery' },
              { label: 'Common questions', to: '/#faq' },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { label: 'The roastery', to: '/#roastery' },
              { label: 'Our sourcing', to: '/#process' },
              { label: 'Reviews', to: '/#reviews' },
              { label: 'Your bag', to: '/cart' },
            ]}
          />
        </div>

        <Separator className="my-10" />

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
          <span>
            © {new Date().getFullYear()} {BRAND.full}. A fictional roastery, built as a design study.
          </span>

          <button
            type="button"
            onClick={toggle}
            aria-pressed={enabled}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 transition-colors hover:bg-accent"
          >
            {enabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
            UI sound {enabled ? 'on' : 'off'}
          </button>

          <span className="ml-auto inline-flex items-center gap-2">
            <Bean className="size-3.5" />
            <span>
              Designed by <span className="serif text-sm text-foreground">Niroj Prashath</span>
            </span>
          </span>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="label text-muted-foreground">{title}</p>
      <ul className="mt-3.5 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.to} className="text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Transient confirmation, bottom-centre, so a quick-add is never a silent action. */
export function CartFlash() {
  const { flash, openDrawer } = useCart()
  if (!flash) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <button
        type="button"
        onClick={openDrawer}
        className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-border bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-2xl"
      >
        <Check className="size-3.5" />
        {flash}
        <span className="ml-1 underline underline-offset-4">View bag</span>
      </button>
    </div>
  )
}
