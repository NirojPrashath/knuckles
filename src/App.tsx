import * as React from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SoundProvider } from '@/components/ui/sound-provider'
import { CartProvider } from '@/lib/cart'
import { Nav, Footer, CartDrawer, CartFlash } from '@/components/site/Chrome'
import { ThemeSwitcher } from '@/components/site/ThemeSwitcher'
import { Home } from '@/pages/Home'
import { Shop } from '@/pages/Shop'
import { Product } from '@/pages/Product'
import { Cart } from '@/pages/Cart'
import { Checkout } from '@/pages/Checkout'
import { Subscribe } from '@/pages/Subscribe'
import { Brew } from '@/pages/Brew'
import { Wholesale } from '@/pages/Wholesale'
import { NotFound } from '@/pages/NotFound'
import { applyTheme, initialTheme, type ThemeId } from '@/lib/theme'
import { useRoute, segments } from '@/lib/router'

function Screen({ route }: { route: string }) {
  if (route.startsWith('/product/')) {
    return <Product slug={segments(route)[1] ?? ''} />
  }
  switch (route) {
    case '/':
      return <Home />
    case '/shop':
      return <Shop />
    case '/cart':
      return <Cart />
    case '/checkout':
      return <Checkout />
    case '/subscribe':
      return <Subscribe />
    case '/brew':
      return <Brew />
    case '/wholesale':
      return <Wholesale />
    default:
      return <NotFound route={route} />
  }
}

const TITLES: Record<string, string> = {
  '/': 'Knuckles Roasters — Ceylon coffee, roasted weekly in Colombo',
  '/shop': 'Shop coffee — Knuckles Roasters',
  '/cart': 'Your bag — Knuckles Roasters',
  '/checkout': 'Checkout — Knuckles Roasters',
  '/subscribe': 'Subscriptions — Knuckles Roasters',
  '/brew': 'Brew guides — Knuckles Roasters',
  '/wholesale': 'Wholesale for cafés — Knuckles Roasters',
}

export default function App() {
  const [theme, setTheme] = React.useState<ThemeId>(() => initialTheme())
  const route = useRoute()

  React.useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // a route change is a page change: start at the top, without the smooth-scroll
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    document.title = route.startsWith('/product/')
      ? `${segments(route)[1]?.replace(/-/g, ' ') ?? 'Coffee'} — Knuckles Roasters`
      : (TITLES[route] ?? 'Not found — Knuckles Roasters')
  }, [route])

  return (
    <SoundProvider>
      <TooltipProvider delayDuration={200}>
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:border focus:border-border focus:bg-card focus:px-4 focus:py-2 focus:text-sm"
          >
            Skip to content
          </a>

          <Nav />
          <main id="main" tabIndex={-1} className="outline-none">
            <Screen route={route} />
          </main>
          <Footer />

          {/* global commerce chrome */}
          <CartDrawer />
          <CartFlash />
          <ThemeSwitcher theme={theme} onTheme={setTheme} />
        </CartProvider>
      </TooltipProvider>
    </SoundProvider>
  )
}
