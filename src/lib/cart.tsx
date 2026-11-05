import * as React from 'react'
import { BAG_SIZES, COUPONS, DELIVERY, PRODUCTS, money, type Product } from '@/lib/catalog'

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

export function computeTotals(state: CartState): Totals {
  const subtotal = state.lines.reduce((sum, line) => {
    const product = PRODUCTS.find((p) => p.id === line.productId)
    return product ? sum + linePrice(product, line.grams, line.qty) : sum
  }, 0)

  const coupon = state.coupon ? COUPONS[state.coupon] : undefined
  const discount = !coupon
    ? 0
    : coupon.type === 'percent'
      ? Math.round((subtotal * coupon.value) / 100 / 10) * 10
      : Math.min(coupon.value, subtotal)

  const afterDiscount = subtotal - discount
  const zone = DELIVERY[state.zone]
  const shipping = afterDiscount >= 12000 || afterDiscount === 0 ? 0 : zone.fee

  return {
    count: state.lines.reduce((n, l) => n + l.qty, 0),
    subtotal,
    discount,
    shipping,
    total: afterDiscount + shipping,
    couponNote: coupon?.note ?? null,
    freeShippingGap: Math.max(0, 12000 - afterDiscount),
  }
}

type CartContext = CartState & {
  totals: Totals
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

  const value = React.useMemo<CartContext>(() => {
    const totals = computeTotals(state)
    return {
      ...state,
      totals,
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
  }, [state, drawerOpen, flash])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

/** money helper re-export so components import from one place */
export { money }
