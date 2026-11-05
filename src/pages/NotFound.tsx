import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from '@/lib/router'
import { Button } from '@/components/ui/button'
import { PRODUCTS } from '@/lib/catalog'
import { CompactCard } from '@/components/shop/ProductCard'

export function NotFound({ route }: { route: string }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[720px] px-5 text-center sm:px-8">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-muted">
          <Compass className="size-6 text-muted-foreground" />
        </span>
        <p className="label mt-6 text-muted-foreground">404 · {route}</p>
        <h1 className="serif mt-3 text-4xl sm:text-5xl">That page is not on the shelf</h1>
        <p className="mx-auto mt-4 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
          We are a small shop — six coffees, four brew guides, two people answering email. Whatever you
          were looking for, it is probably one of these instead.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="size-4" />
              Back to the shop
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/brew">Brew guides</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
          {PRODUCTS.slice(0, 3).map((p) => (
            <CompactCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
