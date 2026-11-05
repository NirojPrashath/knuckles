import * as React from 'react'
import { api, type Quote } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { BAG_SIZES, DELIVERY, PRODUCTS, money, type Product } from '@/lib/catalog'

export type CartLine = {
  /** stable key: product + bag size + grind, so the same coffee twice is one line */
  key: string
  productId: string
  grams: number
  grind: string
  qty: number
}

export type CartState = {
  lines: CartLine[]
  coupon: string | null
  zone: keyof typeof DELIVERY
}

type Action =
  | { type: 'add'; productId: string; grams: number; grind: string; qty?: number }
  | { type: 'remove'; key: string }
  | { type: 'qty'; key: string; qty: number }
  | { type: 'coupon'; code: string | null }
  | { type: 'zone'; zone: keyof typeof DELIVERY }
  | { type: 'replace'; state: CartState }

const lineKey = (productId: string, grams: number, grind: string) => `${productId}:${grams}:${grind}`

const STORAGE_KEY = 'knuckles.cart'

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.productId, action.grams, action.grind)
      const existing = state.lines.find((l) => l.key === key)
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.key === key ? { ...l, qty: Math.min(9, l.qty + (action.qty ?? 1)) } : l,
          ),
        }
      }
      return {
        ...state,
        lines: [
          ...state.lines,
          { key, productId: action.productId, grams: action.grams, grind: action.grind, qty: action.qty ?? 1 },
        ],
      }
    }
    case 'remove':
      return { ...state, lines: state.lines.filter((l) => l.key !== action.key) }
    case 'qty':
      return {
        ...state,
        lines: action.qty <= 0
          ? state.lines.filter((l) => l.key !== action.key)
          : state.lines.map((l) => (l.key === action.key ? { ...l, qty: Math.min(9, action.qty) } : l)),
      }
    case 'coupon':
      return { ...state, coupon: action.code }
    case 'zone':
      return { ...state, zone: action.zone }
    case 'replace':
      return action.state
  }
}

/** price of a line, rounded to the nearest 10 rupees the way a shop quotes */
export function linePrice(product: Product, grams: number, qty: number) {
  const size = BAG_SIZES.find((s) => s.grams === grams) ?? BAG_SIZES[0]
  return Math.round((product.basePrice * size.multiplier * qty) / 10) * 10
}

export type Totals = {
  count: number
  subtotal: number
  discount: number
  shipping: number
  total: number
  couponNote: string | null
  freeShippingGap: number
}

/**
 * A LOCAL ESTIMATE, shown only until the server answers.
 *
 * Note what it cannot do: work out a discount. The coupon table used to live
 * in this bundle — `COUPONS` in catalog.ts, with the 25% wholesale rate in
 * plain sight — which is review finding F-01. It is gone. The browser no
 * longer knows which codes exist, what they are worth, or who qualifies, so
 * `discount` here is always 0 and only the server can make it anything else.
 *
 * Everything this function returns is for responsiveness. The figure that is
 * charged comes from /api/knuckles/quote, and from nowhere else.
 */
export function estimateTotals(state: CartState): Totals {
  const subtotal = state.lines.reduce((sum, line) => {
    const product = PRODUCTS.find((p) => p.id === line.productId)
    return product ? sum + linePrice(product, line.grams, line.qty) : sum
  }, 0)
  const zone = DELIVERY[state.zone]
  const shipping = subtotal >= 12000 || subtotal === 0 ? 0 : zone.fee
  return {
    count: state.lines.reduce((n, l) => n + l.qty, 0),
    subtotal,
    discount: 0,
    shipping,
    total: subtotal + shipping,
    couponNote: null,
    freeShippingGap: Math.max(0, 12000 - subtotal),
  }
}

/** Map the server's authoritative quote onto the shape the UI already uses. */
function totalsFromQuote(quote: Quote, count: number): Totals {
  return {
    count,
    subtotal: quote.subtotal,
    discount: quote.discount,
    shipping: quote.delivery,
    total: quote.total,
    couponNote: quote.couponNote,
    freeShippingGap: Math.max(0, 12000 - (quote.subtotal - quote.discount)),
  }
}

type CartContext = CartState & {
  /** server-priced when `priced` is true, a local estimate otherwise */
  totals: Totals
  /** the raw server quote, or null before the first reply */
  quote: Quote | null
  /** true once the figures on screen are the server's, not ours */
  priced: boolean
  /** a quote request is in flight */
  pricing: boolean
  /** the server refused to price the cart at all (network down, bad line) */
  priceError: string | null
  add: (productId: string, grams: number, grind: string, qty?: number) => void
  remove: (key: string) => void
  setQty: (key: string, qty: number) => void
  setCoupon: (code: string | null) => void
  setZone: (zone: keyof typeof DELIVERY) => void
  clear: () => void
  /** the sliding drawer is opened from anywhere: add-to-cart, the nav, the product page */
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  /** transient "added to bag" toast copy */
  flash: string | null
}

const Ctx = React.createContext<CartContext | null>(null)

const seed: CartState = {
  lines: [
    { key: 'p4:500:espresso', productId: 'p4', grams: 500, grind: 'espresso', qty: 1 },
    { key: 'p1:250:filter', productId: 'p1', grams: 250, grind: 'filter', qty: 2 },
  ],
  coupon: null,
  zone: 'colombo',
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, seed)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [flash, setFlash] = React.useState<string | null>(null)
  const [hydrated, setHydrated] = React.useState(false)

  /* Who is signed in matters to the price: the wholesale rate is granted by a
     verified entitlement on the account, so the same basket legitimately costs
     a café less than it costs me. That is decided server-side — this is only
     the reason the quote is re-requested when the user changes. */
  const { user } = useAuth()
  const [quote, setQuote] = React.useState<Quote | null>(null)
  const [pricing, setPricing] = React.useState(false)
  const [priceError, setPriceError] = React.useState<string | null>(null)

  // localStorage is a browser-only store: read it in an effect so SSR still renders
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) dispatch({ type: 'replace', state: JSON.parse(saved) as CartState })
    } catch {
      /* private mode or corrupt payload — the seed cart is fine */
    }
    setHydrated(true)
  }, [])

  React.useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state, hydrated])

  /* The only thing we send: product ids, sizes, grinds, quantities. No
     prices, no subtotal, no discount — nothing the server would have to
     trust. It recomputes the lot and returns the figure it will charge. */
  const request = React.useMemo(
    () => ({
      lines: state.lines.map((l) => ({ productId: l.productId, grams: l.grams, grind: l.grind, qty: l.qty })),
      zone: state.zone,
      ...(state.coupon ? { couponCode: state.coupon } : {}),
    }),
    [state.lines, state.zone, state.coupon],
  )
  const requestKey = JSON.stringify(request) + '|' + (user?.id ?? 'anonymous')

  React.useEffect(() => {
    if (!hydrated) return
    if (request.lines.length === 0) {
      setQuote(null)
      setPriceError(null)
      setPricing(false)
      return
    }
    const controller = new AbortController()
    setPricing(true)
    // Debounced: holding the + button should not fire a request per click.
    const timer = window.setTimeout(async () => {
      try {
        const res = await api<{ quote: Quote }>('POST', '/api/knuckles/quote', request, {
          signal: controller.signal,
        })
        if (controller.signal.aborted) return
        if (res.ok) {
          setQuote(res.data.quote)
          setPriceError(null)
        } else {
          setQuote(null)
          setPriceError(res.error.message)
        }
      } catch {
        /* aborted by a newer request — the newer one owns the state now */
      } finally {
        if (!controller.signal.aborted) setPricing(false)
      }
    }, 220)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey, hydrated])

  const value = React.useMemo<CartContext>(() => {
    const estimate = estimateTotals(state)
    const totals = quote ? totalsFromQuote(quote, estimate.count) : estimate
    return {
      ...state,
      totals,
      quote,
      priced: quote !== null,
      pricing,
      priceError,
      drawerOpen,
      flash,
      add: (productId, grams, grind, qty) => {
        dispatch({ type: 'add', productId, grams, grind, qty })
        const product = PRODUCTS.find((p) => p.id === productId)
        const size = BAG_SIZES.find((s) => s.grams === grams)
        setFlash(`${product?.name ?? 'Added'} · ${size?.label ?? ''} added to your bag`)
        setDrawerOpen(true)
        window.setTimeout(() => setFlash(null), 3200)
      },
      remove: (key) => dispatch({ type: 'remove', key }),
      setQty: (key, qty) => dispatch({ type: 'qty', key, qty }),
      setCoupon: (code) => dispatch({ type: 'coupon', code }),
      setZone: (zone) => dispatch({ type: 'zone', zone }),
      clear: () => dispatch({ type: 'replace', state: { lines: [], coupon: null, zone: state.zone } }),
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }
  }, [state, quote, pricing, priceError, drawerOpen, flash])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

/** money helper re-export so components import from one place */
export { money }
