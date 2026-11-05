import * as React from 'react'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  FileText,
  Package,
  Percent,
  Phone,
  Truck,
  UserCheck,
} from 'lucide-react'
import { Link } from '@/lib/router'
import { BRAND, FAQS, PRODUCTS, WHOLESALE_LOG, money } from '@/lib/catalog'
import { BAG_TONES } from '@/lib/images'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { BagPlate, Eyebrow, IntensityBeans } from '@/components/shop/bits'
import { Reveal } from '@/components/site/Reveal'

/** Wholesale rates per kilo, published — a café cannot plan around “contact us”. */
const TIERS = [
  { kilos: '5–9 kg / week', rate: 12900, discount: '10%', note: 'One delivery a week, Tuesday' },
  { kilos: '10–24 kg / week', rate: 11500, discount: '20%', note: 'Twice weekly deliveries, loan grinder' },
  { kilos: '25 kg+ / week', rate: 10700, discount: '25%', note: 'Own roast slot, quarterly training, account manager' },
]

export function Wholesale() {
  const [sent, setSent] = React.useState(false)
  const [sending, setSending] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [form, setForm] = React.useState({
    venue: '',
    name: '',
    email: '',
    phone: '',
    volume: '5-9',
    city: 'Colombo',
    equipment: 'espresso',
    notes: '',
    sample: true,
  })
  const [openFaq, setOpenFaq] = React.useState('ws-0')

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (form.venue.trim().length < 2) next.venue = 'Which café, hotel or office?'
    if (form.name.trim().length < 2) next.name = 'Who should we talk to?'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'A work email we can reply to'
    if (!/^(\+94|0)?[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{4}$/.test(form.phone.trim()))
      next.phone = 'A mobile, e.g. 077 269 0188'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setSent(true)
    }, 950)
  }

  return (
    <>
      <section className="border-b border-border py-10 sm:py-14">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Wholesale</span>
          </nav>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div>
              <Eyebrow>For cafés, hotels &amp; offices</Eyebrow>
              <h1 className="serif mt-4 text-4xl leading-[1.04] sm:text-5xl">
                We publish the wholesale price
              </h1>
              <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
                Most roasters hide trade pricing behind a form and a phone call. Ours is on this page
                because you cannot cost a flat white around a mystery. Rates include delivery, and the
                roast date is on every bag like it is for everyone else.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: <Building2 className="size-4" />, value: '38', label: 'venues on our books' },
                  { icon: <Truck className="size-4" />, value: '2×', label: 'deliveries a week' },
                  { icon: <UserCheck className="size-4" />, value: '1', label: 'account manager each' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-secondary">
                      {stat.icon}
                    </span>
                    <p className="price mt-2.5 text-2xl font-medium">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <Reveal delay={80}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="label text-muted-foreground">Rates per kilo</p>
                    <Badge variant="outline" size="sm" className="rounded-full">
                      <Percent className="size-3" />
                      VAT inclusive
                    </Badge>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {TIERS.map((tier) => (
                      <li key={tier.kilos} className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-medium">{tier.kilos}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{tier.note}</p>
                        </div>
                        <div className="text-right">
                          <p className="price text-sm font-medium">{money(tier.rate)}</p>
                          <p className="label text-muted-foreground">−{tier.discount}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                    Prices are per kilogram, green-to-roast weight. Sample bags for a new venue are free
                    once, and we will send three coffees rather than one.
                  </p>
                  <Button className="mt-4 w-full" asChild>
                    <a href="#apply">
                      Request a sample box and rates
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* what you get */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            <div>
              <Eyebrow>What a trade account includes</Eyebrow>
              <h2 className="serif mt-4 text-3xl sm:text-4xl">Everything except the waffle</h2>
              <ul className="mt-6 space-y-4">
                {[
                  { icon: <Package className="size-4" />, t: 'Roast-date guarantee', d: 'Delivered within four days of roasting, every week, or the delivery is free.' },
                  { icon: <Truck className="size-4" />, t: 'Scheduled deliveries', d: 'Tuesday and Friday on the Colombo and Galle routes; other districts on request.' },
                  { icon: <FileText className="size-4" />, t: 'Recipe card with every lot', d: 'Dose, yield, time and temperature on paper, so a new barista can dial in before you train them.' },
                  { icon: <UserCheck className="size-4" />, t: 'One named contact', d: 'A person who answers, not a group chat. Their mobile is on your invoice.' },
                ].map((row, i) => (
                  <Reveal as="li" key={row.t} delay={i * 70} className="flex gap-3.5">
                    <span className="mt-0.5 shrink-0">{row.icon}</span>
                    <span>
                      <span className="block text-sm font-medium">{row.t}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{row.d}</span>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </div>

            {/* roast log: the operational detail that wins trade accounts */}
            <div>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="label text-muted-foreground">Wholesale log</p>
                    <Badge variant="secondary" size="sm" className="rounded-full">
                      updated Monday
                    </Badge>
                  </div>
                  <table className="mt-4 w-full text-left text-sm">
                    <thead>
                      <tr className="label text-muted-foreground">
                        <th scope="col" className="pb-2 font-medium">Week</th>
                        <th scope="col" className="pb-2 text-right font-medium">Orders</th>
                        <th scope="col" className="pb-2 text-right font-medium">Kilos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {WHOLESALE_LOG.map((row) => (
                        <tr key={row.week}>
                          <td className="py-2.5">
                            <span className="block">{row.week}</span>
                            <span className="block text-xs text-muted-foreground">{row.headline}</span>
                          </td>
                          <td className="tnum py-2.5 text-right align-top">{row.orders}</td>
                          <td className="tnum py-2.5 text-right align-top">{row.kg}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Separator className="my-4" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    We publish this because it is the honest answer to “are you big enough to keep us
                    supplied”. If a number looks small, that is because we are a small roastery and we
                    would rather you knew.
                  </p>
                </CardContent>
              </Card>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {PRODUCTS.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.slug}`}
                    className="lift rounded-lg border border-border p-3"
                  >
                    <BagPlate product={p} className="h-24 w-full rounded-md">
                      <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: BAG_TONES[p.image] }} />
                    </BagPlate>
                    <p className="mt-2 truncate text-xs font-medium">{p.name}</p>
                    <IntensityBeans level={p.intensity} className="mt-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* application */}
      <section id="apply" className="border-y border-border bg-card/40 py-14 sm:py-16">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
            <div>
              <Eyebrow>Open an account</Eyebrow>
              <h2 className="serif mt-4 text-3xl sm:text-4xl">Two minutes, no obligation</h2>
              <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                Tell us the venue and roughly what you pour. We will send a sample box with the three
                coffees that fit your machine and your menu, plus the rate card for your volume.
              </p>

              <div className="mt-6 space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`}>
                    <Phone className="size-4" />
                    {BRAND.phone}
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`mailto:${BRAND.email}`}>
                    <FileText className="size-4" />
                    {BRAND.email}
                  </a>
                </Button>
              </div>

              <div className="mt-6 rounded-xl border border-border bg-background p-5">
                <p className="label text-muted-foreground">Trusted by</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Hotel terrace, Galle Fort · 24 kg a week</li>
                  <li>Two-cup kiosk, Colombo 03 · 6 kg a week</li>
                  <li>Weligama surf café · 12 kg a week, seasonal</li>
                </ul>
              </div>
            </div>

            <Reveal delay={60}>
              <Card>
                <CardContent className="p-5 sm:p-6">
                  {sent ? (
                    <div className="flex flex-col items-center gap-4 py-10 text-center">
                      <span className="grid size-12 place-items-center rounded-full bg-primary">
                        <Check className="size-6 text-primary-foreground" />
                      </span>
                      <h3 className="serif text-2xl">Sample box on its way</h3>
                      <p className="max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
                        Thanks {form.name.split(' ')[0]} — we have your details for {form.venue}. A
                        sample box ships with the next roast, and Michael will call {form.phone} within
                        two working days with rates for your volume.
                      </p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <Button variant="outline" asChild>
                          <Link to="/brew">Read the brew guides</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSent(false)
                            setForm((f) => ({ ...f, notes: '' }))
                          }}
                        >
                          Submit another venue
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={submit} noValidate className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="venue">Venue or company</Label>
                          <Input
                            id="venue"
                            value={form.venue}
                            onChange={(e) => set('venue', e.target.value)}
                            aria-invalid={!!errors.venue}
                            placeholder="Fort Terrace Hotel"
                          />
                          {errors.venue && <ErrorLine>{errors.venue}</ErrorLine>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ws-name">Your name</Label>
                          <Input
                            id="ws-name"
                            value={form.name}
                            onChange={(e) => set('name', e.target.value)}
                            aria-invalid={!!errors.name}
                            placeholder="Michael Perera"
                          />
                          {errors.name && <ErrorLine>{errors.name}</ErrorLine>}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="ws-email">Work email</Label>
                          <Input
                            id="ws-email"
                            type="email"
                            value={form.email}
                            onChange={(e) => set('email', e.target.value)}
                            aria-invalid={!!errors.email}
                            placeholder="michael@fortterrace.lk"
                          />
                          {errors.email && <ErrorLine>{errors.email}</ErrorLine>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ws-phone">Mobile</Label>
                          <Input
                            id="ws-phone"
                            inputMode="tel"
                            value={form.phone}
                            onChange={(e) => set('phone', e.target.value)}
                            aria-invalid={!!errors.phone}
                            placeholder="077 269 0188"
                          />
                          {errors.phone && <ErrorLine>{errors.phone}</ErrorLine>}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="ws-volume">Volume</Label>
                          <Select value={form.volume} onValueChange={(v) => set('volume', v)}>
                            <SelectTrigger id="ws-volume">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="under5">Under 5 kg / week</SelectItem>
                              <SelectItem value="5-9">5–9 kg / week</SelectItem>
                              <SelectItem value="10-24">10–24 kg / week</SelectItem>
                              <SelectItem value="25plus">25 kg+ / week</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ws-city">Location</Label>
                          <Select value={form.city} onValueChange={(v) => set('city', v)}>
                            <SelectTrigger id="ws-city">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['Colombo', 'Galle', 'Kandy', 'Negombo', 'Weligama', 'Jaffna', 'Other'].map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ws-equipment">Main kit</Label>
                          <Select value={form.equipment} onValueChange={(v) => set('equipment', v)}>
                            <SelectTrigger id="ws-equipment">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="espresso">Espresso machine</SelectItem>
                              <SelectItem value="batch">Batch brew / filter</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                              <SelectItem value="moka">Moka &amp; manual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ws-notes">Anything else?</Label>
                        <Textarea
                          id="ws-notes"
                          rows={3}
                          value={form.notes}
                          onChange={(e) => set('notes', e.target.value)}
                          placeholder="We pour 120 flat whites a day and want a single origin on the filter menu."
                        />
                      </div>

                      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3.5">
                        <Checkbox
                          checked={form.sample}
                          onCheckedChange={(v) => set('sample', v === true)}
                          className="mt-0.5"
                          aria-label="Send a sample box"
                        />
                        <span className="text-xs leading-relaxed">
                          Send a free sample box with the next roast — three coffees matched to my
                          machine, no obligation to order.
                        </span>
                      </label>

                      <Button type="submit" size="lg" className="w-full" disabled={sending}>
                        {sending ? (
                          <>
                            <Spinner className="size-4" />
                            Sending
                          </>
                        ) : (
                          <>
                            Request rates and samples
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </Button>
                      <p className="text-center text-[11px] text-muted-foreground">
                        We reply within two working days, from a person, with a price.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="serif text-2xl sm:text-3xl">Trade questions</h2>
              <p className="mt-2 max-w-[40ch] text-sm text-muted-foreground">
                The commercially awkward ones, answered on the page.
              </p>
            </div>
            <Accordion type="single" collapsible value={openFaq} onValueChange={setOpenFaq}>
              {FAQS.slice(2).map((item, i) => (
                <AccordionItem key={item.q} value={`ws-${i}`} className="border-b border-border">
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
        </div>
      </section>
    </>
  )
}

function ErrorLine({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="flex items-center gap-1.5 text-xs text-destructive">
      <AlertCircle className="size-3.5 shrink-0" />
      {children}
    </p>
  )
}
