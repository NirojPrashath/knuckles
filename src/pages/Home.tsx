import * as React from 'react'
import { ArrowRight, Check, Coffee, MapPin, Package, Sparkles, Truck } from 'lucide-react'
import { Link } from '@/lib/router'
import {
  BREW_GUIDES,
  BRAND,
  FAQS,
  PROCESS_STEPS,
  PRODUCTS,
  REVIEWS,
  ROAST_LEVELS,
  ROAST_LOG,
  money,
  type RoastLevel,
} from '@/lib/catalog'
import { BAG_TONES, heroPour, roastery } from '@/lib/images'
import { useCart } from '@/lib/cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar } from '@/components/ui/avatar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Reveal, RevealText } from '@/components/site/Reveal'
import { ProductCard } from '@/components/shop/ProductCard'
import { BoxBuilder } from '@/components/shop/BoxBuilder'
import { Eyebrow, IntensityBeans, RatingStrip } from '@/components/shop/bits'

export function Home() {
  return (
    <>
      <Hero />
      <Shelf />
      <Subscribe />
      <Process />
      <BrewTeaser />
      <Reviews />
      <Roastery />
      <Faq />
      <CtaBand />
    </>
  )
}

/* ========================================================================= hero */

function Hero() {
  const { add } = useCart()
  const houseEspresso = PRODUCTS.find((p) => p.id === 'p4')!

  return (
    <section className="relative border-b border-border">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-16">
        <div className="flex flex-col justify-center">
          <Eyebrow>{BRAND.estd} · Colombo 07</Eyebrow>

          <h1 className="serif mt-5 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem]">
            <RevealText text="Roasted on a" />
            <br />
            <span className="serif-italic">Tuesday</span>{' '}
            <RevealText text="morning." stagger={18} />
          </h1>

          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-muted-foreground">
            Ceylon coffee from six named estates, roasted twice a week in a 12 kg drum, and shipped
            the same afternoon it cools. The roast date is printed on the bag, not just promised on a
            website.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link to="/shop">
                Shop the six coffees
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/subscribe">Subscribe &amp; save 10%</Link>
            </Button>
          </div>

          <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {[
              { label: 'Roasts a week', value: '2', detail: 'Tue & Fri' },
              { label: 'Estates', value: '6', detail: 'all named' },
              { label: 'Bags shipped', value: '18.4k', detail: 'since 2019' },
              { label: 'Avg. rating', value: '4.8', detail: '632 reviews' },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 70}>
                <dt className="label text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1.5">
                  <span className="price text-2xl font-medium">{stat.value}</span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">{stat.detail}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        {/* photography with the roast log laid over it — the "is it fresh" proof */}
        <Reveal delay={80} className="relative">
          <div className="grain relative h-[22rem] overflow-hidden rounded-xl border border-border sm:h-[26rem] lg:h-full lg:min-h-[30rem]">
            <img src={heroPour} alt="Pouring a V60 at the roastery counter" className="h-full w-full object-cover" />
          </div>

          <div className="absolute -bottom-4 left-4 right-4 rounded-lg border border-border bg-background/95 p-4 shadow-xl backdrop-blur-sm sm:left-6 sm:right-auto sm:w-[19rem]">
            <p className="label text-muted-foreground">Roast calendar</p>
            <ul className="mt-2.5 space-y-1.5">
              {ROAST_LOG.map((row) => (
                <li key={row.label} className="flex items-center gap-2.5 text-xs">
                  <span
                    className={
                      row.tone === 'live'
                        ? 'size-1.5 shrink-0 rounded-full bg-emerald-600'
                        : row.tone === 'done'
                          ? 'size-1.5 shrink-0 rounded-full bg-foreground/50'
                          : 'size-1.5 shrink-0 rounded-full border border-border'
                    }
                  />
                  <span className="w-[4.5rem] shrink-0 font-medium">{row.label}</span>
                  <span className="truncate text-muted-foreground">{row.detail}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-3" />
            <button
              type="button"
              onClick={() => add(houseEspresso.id, 250, 'espresso')}
              className="group flex w-full items-center gap-2.5 text-left"
            >
              <span className="size-8 shrink-0 rounded" style={{ background: BAG_TONES[houseEspresso.image] }} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium">Hansa Espresso · {money(3800)}</span>
                <span className="block text-[11px] text-muted-foreground">Add a 250 g bag to your bag</span>
              </span>
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </Reveal>
      </div>

      <ul className="border-t border-border bg-card/40">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-x-8 gap-y-2 px-5 py-3 text-xs text-muted-foreground sm:px-8">
          <li className="flex items-center gap-1.5">
            <Package className="size-3.5" />
            Roast date printed, always within 5 days
          </li>
          <li className="flex items-center gap-1.5">
            <Truck className="size-3.5" />
            Free Colombo delivery over {money(12000)}
          </li>
          <li className="flex items-center gap-1.5">
            <Coffee className="size-3.5" />
            30-day taste guarantee, opened bag included
          </li>
          <li className="hidden items-center gap-1.5 lg:flex">
            <Sparkles className="size-3.5" />
            Free cupping table, Saturdays at 10:00
          </li>
        </div>
      </ul>
    </section>
  )
}

/* ======================================================================= shelf */

function Shelf() {
  const [roast, setRoast] = React.useState<RoastLevel | 'all'>('all')
  const visible = roast === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.roast === roast)

  return (
    <section id="shop" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>This week’s shelf</Eyebrow>
            <h2 className="serif mt-4 text-3xl sm:text-4xl lg:text-5xl">Six coffees, one shelf</h2>
            <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
              Three single-origin Ceylon lots, two blends for milk, and one decaf that behaves. Every
              bag lists its estate, altitude, process and roast date — the same facts a café gets on
              the wholesale invoice.
            </p>
          </div>

          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Filter by roast level">
            <button
              type="button"
              role="radio"
              aria-checked={roast === 'all'}
              onClick={() => setRoast('all')}
              data-selected={roast === 'all'}
              className="chip"
            >
              All {PRODUCTS.length}
            </button>
            {ROAST_LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                role="radio"
                aria-checked={roast === level.id}
                onClick={() => setRoast(level.id)}
                data-selected={roast === level.id}
                className="chip"
              >
                {level.label}
                <span className="tnum text-[10px] opacity-70">
                  {PRODUCTS.filter((p) => p.roast === level.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="serif text-xl">No {roast} roasts this week</p>
            <p className="mx-auto mt-2 max-w-[40ch] text-sm text-muted-foreground">
              We only roast six coffees, so a missing roast level is normal. The next {roast} batch is
              on the Friday schedule.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setRoast('all')}>
              Show all six
            </Button>
          </div>
        ) : (
          <div className="mt-9 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product, i) => (
              <Reveal key={product.id} delay={(i % 3) * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/shop">
              Full shop with filters
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Sold out of the Hatton Decaf — restocked with the Friday roast.
          </p>
        </div>
      </div>
    </section>
  )
}

/* =================================================================== subscribe */

function Subscribe() {
  return (
    <section id="subscribe" className="border-y border-border bg-card/40 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-[60ch]">
          <Eyebrow>Subscriptions</Eyebrow>
          <h2 className="serif mt-4 text-3xl sm:text-4xl lg:text-5xl">
            Never run out on a Sunday
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Build the box below and see the real price before you commit — no “from” pricing, no
            hidden minimum. Subscribers get free delivery on every order, islandwide.
          </p>
        </div>
        <Reveal className="mt-9">
          <BoxBuilder />
        </Reveal>
      </div>
    </section>
  )
}

/* ===================================================================== process */

function Process() {
  return (
    <section id="process" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
          <Reveal>
            <div className="grain relative overflow-hidden rounded-xl border border-border">
              <img
                src={roastery}
                alt="Pouring green beans into the drum roaster at the Colombo roastery"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 rounded-lg bg-background/95 px-3.5 py-2.5 backdrop-blur-sm">
                <p className="label text-muted-foreground">18 Rosmead Place</p>
                <p className="mt-0.5 text-xs">12 kg drum · five batches a day</p>
              </div>
            </div>
          </Reveal>

          <div>
            <Eyebrow>From cherry to bag</Eyebrow>
            <h2 className="serif mt-4 text-3xl sm:text-4xl lg:text-5xl">
              Three things we do in the open
            </h2>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
              Most coffee marketing describes a feeling. We would rather describe the schedule, so
              you can tell when a bag was made and who grew it.
            </p>

            <ol className="mt-8 space-y-6">
              {PROCESS_STEPS.map((step, i) => (
                <Reveal as="li" key={step.title} delay={i * 80} className="flex gap-4">
                  <span className="serif mt-0.5 w-8 shrink-0 text-2xl text-muted-foreground/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-medium">{step.title}</h3>
                      <Badge variant="outline" size="sm" className="rounded-full">
                        {step.meta}
                      </Badge>
                    </div>
                    <p className="mt-1.5 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link to="/wholesale">
                  Wholesale for cafés
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/brew">How to brew it properly</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* =================================================================== brew teaser */

function BrewTeaser() {
  return (
    <section className="border-y border-border bg-card/40 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Brew guides</Eyebrow>
            <h2 className="serif mt-4 text-3xl sm:text-4xl lg:text-5xl">
              Four methods, honestly explained
            </h2>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
              Written by the people who roast it, with the water temperature and the timing that
              actually worked, not a generic recipe.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/brew">
              All brew guides
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BREW_GUIDES.map((guide, i) => (
            <Reveal key={guide.id} delay={i * 70}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" size="sm" className="rounded-full">
                      {guide.level}
                    </Badge>
                    <span className="label text-muted-foreground">{guide.time}</span>
                  </div>
                  <h3 className="serif text-xl leading-tight">{guide.title}</h3>
                  <p className="flex-1 text-xs leading-relaxed text-muted-foreground">{guide.blurb}</p>
                  <Link
                    to="/brew"
                    className="inline-flex items-center gap-1.5 text-xs font-medium underline-offset-4 hover:underline"
                  >
                    Read the method
                    <ArrowRight className="size-3" />
                  </Link>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ===================================================================== reviews */

function Reviews() {
  const [index, setIndex] = React.useState(0)
  const review = REVIEWS[index]
  const product = PRODUCTS.find((p) => p.name === review.product)

  return (
    <section id="reviews" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-14">
          <div>
            <Eyebrow>Reviews</Eyebrow>
            <h2 className="serif mt-4 text-3xl sm:text-4xl lg:text-5xl">
              632 reviews, and we publish the awkward ones
            </h2>
            <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every review below is from a verified order. The four-star ones stay up because they say
              something useful.
            </p>

            <RatingStrip rating={4.8} reviews={632} className="mt-5" />

            <div className="mt-6 flex gap-2">
              {REVIEWS.map((r, i) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show review from ${r.name}`}
                  aria-current={i === index}
                  className={
                    i === index
                      ? 'h-1 w-8 rounded-full bg-foreground transition-all'
                      : 'h-1 w-4 rounded-full bg-border transition-all hover:bg-muted-foreground/50'
                  }
                />
              ))}
            </div>
          </div>

          <Reveal>
            <Card className="relative overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <Avatar className="size-11 shrink-0">
                    <span className="grid size-full place-items-center rounded-full bg-secondary text-sm font-medium">
                      {review.name.slice(0, 1)}
                    </span>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{review.name}</span>
                      <span className="text-xs text-muted-foreground">{review.city}</span>
                      {review.verified && (
                        <Badge variant="secondary" size="sm" className="rounded-full">
                          <Check className="size-3" />
                          Verified order
                        </Badge>
                      )}
                    </div>
                    <RatingStrip rating={review.rating} reviews={0} className="mt-1.5 [&>span:last-child]:hidden" />
                  </div>
                </div>

                <p className="serif mt-5 text-xl leading-snug sm:text-2xl">{review.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.body}</p>

                {product && (
                  <div className="mt-6 flex items-center gap-3 rounded-lg border border-border p-2.5">
                    <span
                      className="size-9 shrink-0 rounded"
                      style={{ background: BAG_TONES[product.image] }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{product.name}</p>
                      <IntensityBeans level={product.intensity} />
                    </div>
                    <Link
                      to={`/product/${product.slug}`}
                      className="shrink-0 text-xs font-medium underline-offset-4 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ==================================================================== roastery */

function Roastery() {
  return (
    <section id="roastery" className="border-y border-border bg-primary py-16 text-primary-foreground sm:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="label flex items-center gap-2.5 opacity-70">
              <span className="h-px w-5 bg-current" aria-hidden="true" />
              Visit the roastery
            </p>
            <h2 className="serif mt-4 text-3xl sm:text-4xl lg:text-5xl">
              A counter, a cupping table, and no queue
            </h2>
            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed opacity-85 sm:text-base">
              The roastery doubles as our only shop. Come on a Saturday at ten and taste the whole
              shelf before you buy — it is free, it takes half an hour, and you will leave knowing
              which of the six you actually like.
            </p>

            <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div>
                <dt className="label opacity-70">Where</dt>
                <dd className="mt-1.5 text-sm">{BRAND.address}</dd>
              </div>
              <div>
                <dt className="label opacity-70">Open</dt>
                <dd className="mt-1.5 text-sm">{BRAND.hours.replace('Roastery & counter · ', '')}</dd>
              </div>
              <div>
                <dt className="label opacity-70">Cupping table</dt>
                <dd className="mt-1.5 text-sm">Saturdays, 10:00 · free, no booking</dd>
              </div>
              <div>
                <dt className="label opacity-70">Cafés &amp; offices</dt>
                <dd className="mt-1.5 text-sm">Wholesale from 5 kg a week</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                asChild
              >
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(BRAND.address)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <MapPin className="size-4" />
                  Get directions
                </a>
              </Button>
              <Button variant="glass" asChild>
                <a href={`https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}`}>WhatsApp the counter</a>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-current/20 p-5 sm:p-6">
            <p className="label opacity-70">This week at the counter</p>
            <ul className="mt-4 space-y-4">
              {[
                { day: 'Tue', note: 'Roast day · filter shelf restocked', tone: 'done' },
                { day: 'Thu', note: 'New lot on the cupping table: Galle Natural', tone: 'live' },
                { day: 'Fri', note: 'Roast day · 1 kg bags and wholesale', tone: 'next' },
                { day: 'Sat', note: 'Cupping table 10:00 · free tasting, 12 seats', tone: 'next' },
              ].map((row) => (
                <li key={row.day} className="flex items-start gap-3.5">
                  <span className="serif w-9 shrink-0 text-lg opacity-90">{row.day}</span>
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-current opacity-60" />
                  <span className="text-sm opacity-90">{row.note}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-5 bg-current/20" />
            <p className="text-xs leading-relaxed opacity-80">
              Bring a friend. The kettle is always on and nobody minds you taking up the bench for an
              hour with a laptop, as long as you move for the 10:00 cupping.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================================================= faq */

function Faq() {
  const [open, setOpen] = React.useState('faq-0')
  return (
    <section id="faq" className="py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="serif mt-4 text-3xl sm:text-4xl">What people ask at the counter</h2>
          <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            Delivery, freshness, grinding and the taste guarantee. If something is missing, WhatsApp
            us — a person answers, usually within the hour.
          </p>
          <Button variant="ghost" className="mt-5" asChild>
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          </Button>
        </div>

        <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
          {FAQS.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`} className="border-b border-border">
              <AccordionTrigger className="py-4 text-left text-[15px] font-medium hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

/* ==================================================================== cta band */

function CtaBand() {
  return (
    <section className="border-t border-border bg-card/40 py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-[1240px] gap-8 px-5 sm:px-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <h2 className="serif text-3xl sm:text-4xl lg:text-5xl">
            Start with one bag, or start with a routine
          </h2>
          <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
            A single 250 g bag is {money(3800)} and ships tomorrow. A subscription is a small discount
            and one fewer decision each week.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Button size="lg" asChild>
            <Link to="/shop">
              Shop coffee
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/subscribe">Build a subscription</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
