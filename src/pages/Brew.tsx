import * as React from 'react'
import { ArrowRight, Check, Droplets, Flame, Scale, Thermometer } from 'lucide-react'
import { Link } from '@/lib/router'
import { BREW_GUIDES, PRODUCTS, money } from '@/lib/catalog'
import { BAG_TONES } from '@/lib/images'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { BagPlate, Eyebrow, IntensityBeans } from '@/components/shop/bits'
import { Reveal } from '@/components/site/Reveal'

/**
 * Brew guides.
 *
 * A roastery's brew page is the highest-intent page it owns: someone is standing
 * at a kettle with a bag in their hand. So this is a working reference — method,
 * ratios, timings — with a checklist you can actually tick while brewing, rather
 * than four paragraphs about the romance of the pour.
 */
export function Brew() {
  const [method, setMethod] = React.useState(BREW_GUIDES[0].id)
  const [done, setDone] = React.useState<Record<string, boolean>>({})

  const guide = BREW_GUIDES.find((g) => g.id === method) ?? BREW_GUIDES[0]
  const matching = PRODUCTS.filter((p) =>
    method === 'espresso' || method === 'moka' ? p.roast !== 'light' : p.roast !== 'dark',
  ).slice(0, 3)

  return (
    <>
      <section className="border-b border-border py-10 sm:py-14">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Brew guides</span>
          </nav>

          <div className="mt-6 max-w-[62ch]">
            <Eyebrow>Brew guides</Eyebrow>
            <h1 className="serif mt-4 text-4xl leading-[1.04] sm:text-5xl">
              Four methods, and the numbers that work
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every guide below is the recipe we actually use at the counter, tested on the coffees on
              our shelf. Ratios are in grams, temperatures in Celsius, and nothing assumes a grinder
              worth more than the coffee.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Droplets className="size-3.5" />
              Water: filtered, 75–120 ppm
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Thermometer className="size-3.5" />
              Light roasts 94 °C · dark roasts 91 °C
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Scale className="size-3.5" />
              Weigh the coffee, weigh the water, ignore the scoop
            </span>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <Tabs value={method} onValueChange={setMethod}>
            <TabsList className="flex-wrap">
              {BREW_GUIDES.map((g) => (
                <TabsTrigger key={g.id} value={g.id}>
                  {g.title.split(',')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={method} className="mt-8">
              <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="rounded-full">{guide.level}</Badge>
                    <span className="label text-muted-foreground">{guide.time} start to finish</span>
                  </div>
                  <h2 className="serif mt-4 text-3xl sm:text-4xl">{guide.title}</h2>
                  <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
                    {guide.blurb}
                  </p>

                  <ol className="mt-7 space-y-3">
                    {guide.steps.map((step, i) => {
                      const key = `${guide.id}-${i}`
                      return (
                        <Reveal as="li" key={key} delay={i * 60}>
                          <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/25">
                            <Checkbox
                              checked={!!done[key]}
                              onCheckedChange={(v) => setDone((d) => ({ ...d, [key]: v === true }))}
                              className="mt-0.5"
                              aria-label={`Step ${i + 1}`}
                            />
                            <span className="flex-1">
                              <span className="label text-muted-foreground">Step {i + 1}</span>
                              <span className={`mt-1 block text-sm leading-relaxed ${done[key] ? 'text-muted-foreground line-through' : ''}`}>
                                {step}
                              </span>
                            </span>
                          </label>
                        </Reveal>
                      )
                    })}
                  </ol>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDone({})}
                    >
                      Reset the checklist
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Tick as you go — it is a checklist, not a quiz.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-5">
                      <p className="label text-muted-foreground">What you need</p>
                      <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                        {[
                          'A scale that reads single grams',
                          'A kettle you can pour slowly with',
                          'Coffee ground within the last ten minutes',
                          method === 'v60' ? 'Paper filters — rinsed' : 'A timer you can see',
                        ].map((item) => (
                          <li key={item} className="flex gap-2.5">
                            <Check className="mt-0.5 size-3.5 shrink-0 text-foreground" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-5">
                      <p className="label text-muted-foreground">Coffees that suit this method</p>
                      <ul className="mt-3 space-y-2">
                        {matching.map((p) => (
                          <li key={p.id}>
                            <Link
                              to={`/product/${p.slug}`}
                              className="flex items-center gap-3 rounded-lg border border-border p-2.5 transition-colors hover:bg-accent"
                            >
                              <BagPlate product={p} className="size-10 shrink-0 rounded">
                                <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: BAG_TONES[p.image] }} />
                              </BagPlate>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-medium">{p.name}</span>
                                <IntensityBeans level={p.intensity} />
                              </span>
                              <span className="price shrink-0 text-xs text-muted-foreground">{money(p.basePrice)}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                        {method === 'espresso' || method === 'moka'
                          ? 'Medium and dark roasts hold their sweetness at pressure. A light Ethiopian-style lot will taste sharp through a home machine.'
                          : 'Light roasts keep the fruit and the acidity. If you find filter coffee sour, it is usually under-extraction, not the bean.'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2">
                        <Flame className="size-4" />
                        <p className="label text-muted-foreground">Freshness, honestly</p>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        Coffee is best between 5 and 25 days after roasting. Before day 4 it gasses off
                        and pours unevenly; after five weeks it goes flat and papery. Store it sealed, at
                        room temperature, away from light — the freezer only helps if you never open the
                        bag twice a day.
                      </p>
                      <Separator className="my-4" />
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        If your coffee tastes worse than it did last week, check the roast date first,
                        then your grind. It is almost never the coffee.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="border-t border-border bg-card/40 py-14">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-6 px-5 sm:px-8">
          <div className="min-w-[18rem] flex-1">
            <h2 className="serif text-2xl sm:text-3xl">Brewing on the counter</h2>
            <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-muted-foreground">
              Saturdays at ten we set up three brewers on the bench and taste the whole shelf. Bring a
              bag you already like and we will compare it against ours — that comparison is more useful
              than anything on this page.
            </p>
          </div>
          <Button asChild>
            <Link to="/shop">
              Shop coffee
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
