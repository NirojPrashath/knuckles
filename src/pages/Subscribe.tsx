import * as React from 'react'
import { ArrowRight, CalendarClock, Check, Coffee, Gift, PauseCircle, RefreshCw, Truck } from 'lucide-react'
import { Link } from '@/lib/router'
import { BREW_GUIDES, FAQS, LOYALTY_TIERS, PRODUCTS, SUBSCRIPTION_PLANS, money } from '@/lib/catalog'
import { BAG_TONES } from '@/lib/images'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { BoxBuilder } from '@/components/shop/BoxBuilder'
import { BagPlate, Eyebrow, IntensityBeans } from '@/components/shop/bits'
import { Reveal } from '@/components/site/Reveal'

export function Subscribe() {
  const [openFaq, setOpenFaq] = React.useState('sub-faq-0')

  return (
    <>
      <section className="border-b border-border py-10 sm:py-14">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Subscriptions</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
            <div>
              <Eyebrow>Subscribe &amp; save</Eyebrow>
              <h1 className="serif mt-4 text-4xl leading-[1.03] sm:text-5xl lg:text-6xl">
                Coffee that arrives before you notice it is gone
              </h1>
              <p className="mt-4 max-w-[50ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                Choose a coffee, a bag and a rhythm. We roast it the Monday before each delivery and
                ship it free. Pause it for a holiday, swap the coffee when a new lot lands, cancel
                whenever — all from the link at the bottom of any email.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href="#builder">Build your box</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/shop">Shop one-off bags</Link>
                </Button>
              </div>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: <Truck className="size-3.5" />, text: 'Free islandwide delivery on every order' },
                  { icon: <CalendarClock className="size-3.5" />, text: 'Roasted the Monday before each delivery' },
                  { icon: <PauseCircle className="size-3.5" />, text: 'Pause or skip from any email, no phone call' },
                  { icon: <Coffee className="size-3.5" />, text: 'Swap the coffee whenever a new lot lands' },
                ].map((row) => (
                  <li key={row.text} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <span className="mt-0.5 shrink-0">{row.icon}</span>
                    {row.text}
                  </li>
                ))}
              </ul>
            </div>

            <Reveal delay={80}>
              <div className="grid gap-3">
                {SUBSCRIPTION_PLANS.map((plan, i) => (
                  <div
                    key={plan.id}
                    className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
                  >
                    <span className="serif w-8 shrink-0 text-2xl text-muted-foreground/50">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{plan.name}</p>
                        {plan.discount > 0 && (
                          <Badge size="sm" className="rounded-full">
                            −{Math.round(plan.discount * 100)}%
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{plan.blurb}</p>
                      <p className="label mt-2 text-muted-foreground">{plan.cadence} · {plan.perk}</p>
                    </div>
                  </div>
                ))}
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Every plan is free delivery, and the discount applies to whatever you put in the box —
                  250 g of filter or a kilo of espresso.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* builder */}
      <section id="builder" className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="max-w-[58ch]">
            <Eyebrow>The builder</Eyebrow>
            <h2 className="serif mt-4 text-3xl sm:text-4xl">See the price before you commit</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Subscription pricing online usually reads “from LKR 3,400” and then surprises you at
              delivery two. Ours updates live as you choose, so the number you see is the number you
              pay.
            </p>
          </div>
          <Reveal className="mt-8">
            <BoxBuilder />
          </Reveal>
        </div>
      </section>

      {/* how it works */}
      <section className="border-y border-border bg-card/40 py-14 sm:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <Eyebrow>What actually happens</Eyebrow>
              <h2 className="serif mt-4 text-3xl sm:text-4xl">Four Mondays a month, one email</h2>
              <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
                Subscriptions are the part of a roastery where it is easy to be vague. Here is the whole
                sequence, with the timings we actually keep.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <Link to="/brew">
                    Brew guides
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/wholesale">Wholesale for cafés</Link>
                </Button>
              </div>
            </div>

            <ol className="space-y-5">
              {[
                { t: 'Sunday, 18:00', d: 'You get one email: what is coming, and a link to skip or swap it.' },
                { t: 'Monday, 06:00', d: 'Your coffee goes on the drum with the rest of the batch.' },
                { t: 'Monday, 15:00', d: 'Bags are sealed with a one-way valve and the roast date printed.' },
                { t: 'Tuesday morning', d: 'Colombo orders arrive before 10:00. The island takes two more days.' },
              ].map((row, i) => (
                <Reveal as="li" key={row.t} delay={i * 70} className="flex gap-4">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-foreground" />
                  <div>
                    <p className="label text-muted-foreground">{row.t}</p>
                    <p className="mt-1 text-sm">{row.d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <Separator className="my-12" />

          {/* loyalty */}
          <div>
            <h2 className="serif text-2xl sm:text-3xl">Gift and loyalty tiers</h2>
            <p className="mt-2 max-w-[54ch] text-sm text-muted-foreground">
              Subscriptions count towards loyalty automatically. No card to carry, no app to install.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {LOYALTY_TIERS.map((tier, i) => (
                <Card key={tier.name} className="h-full">
                  <CardContent className="flex h-full flex-col gap-2 p-5">
                    <div className="flex items-center justify-between">
                      <p className="serif text-xl">{tier.name}</p>
                      {i === 0 && (
                        <Badge variant="outline" size="sm" className="rounded-full">
                          Everyone
                        </Badge>
                      )}
                    </div>
                    <p className="label text-muted-foreground">{tier.threshold}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tier.perk}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card/50 p-5">
              <Gift className="size-5 shrink-0" />
              <p className="flex-1 text-sm">
                <span className="font-medium">Gifting a subscription?</span>{' '}
                <span className="text-muted-foreground">
                  Set a start date and a number of deliveries, and we will print the recipient's name on
                  the label band instead of ours.
                </span>
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/shop">Browse gift bags</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* pause / cancel + faq */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <Eyebrow>Subscription questions</Eyebrow>
            <h2 className="serif mt-4 text-3xl sm:text-4xl">Leaving is as easy as joining</h2>
            <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
              We would rather you pause for two months than cancel out of embarrassment about a
              forgotten delivery. Both take one click.
            </p>

            <div className="mt-6 rounded-xl border border-border bg-card p-5">
              <p className="label text-muted-foreground">Manage from one link</p>
              <ul className="mt-3 space-y-3 text-sm">
                {[
                  { icon: <PauseCircle className="size-4" />, label: 'Pause', detail: 'Skip the next delivery, or pause indefinitely.' },
                  { icon: <RefreshCw className="size-4" />, label: 'Swap', detail: 'Change the coffee or the bag size for the next one.' },
                  { icon: <Check className="size-4" />, label: 'Cancel', detail: 'Stop whenever; the bag already shipped is still yours.' },
                ].map((row) => (
                  <li key={row.label} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">{row.icon}</span>
                    <span>
                      <span className="block font-medium">{row.label}</span>
                      <span className="block text-xs text-muted-foreground">{row.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Accordion type="single" collapsible value={openFaq} onValueChange={setOpenFaq}>
            {FAQS.slice(0, 6).map((item, i) => (
              <AccordionItem key={item.q} value={`sub-faq-${i}`} className="border-b border-border">
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

      {/* brew + shelf strip */}
      <section className="border-t border-border bg-card/40 py-14 sm:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Not sure which coffee?</Eyebrow>
              <h2 className="serif mt-4 text-3xl sm:text-4xl">Start with the roast level you drink</h2>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
                Light roasts keep the fruit — good for filter. Medium and dark hold up in milk. Every
                bag carries an intensity rating so you can go up or down from what you know.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/shop">Filter the shelf</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PRODUCTS.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="lift flex items-center gap-4 rounded-xl border border-border bg-background p-4"
              >
                <BagPlate product={p} className="size-16 shrink-0 rounded-lg">
                  <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ background: BAG_TONES[p.image] }} />
                </BagPlate>
                <div className="min-w-0">
                  <p className="serif truncate text-lg">{p.name}</p>
                  <IntensityBeans level={p.intensity} className="mt-1" />
                  <p className="price mt-1 text-xs text-muted-foreground">{money(p.basePrice)} / 250 g</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {BREW_GUIDES.slice(0, 3).map((g) => (
              <Link
                key={g.id}
                to="/brew"
                className="chip"
              >
                {g.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
