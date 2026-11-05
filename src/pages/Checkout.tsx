import * as React from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  CreditCard,
  Lock,
  MapPin,
  Package,
  PartyPopper,
  Truck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from '@/lib/router'
import { DISTRICT_OPTIONS, PRODUCTS, money } from '@/lib/catalog'
import { BAG_TONES } from '@/lib/images'
import { linePrice, useCart } from '@/lib/cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Steps, Step } from '@/components/ui/steps'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BagPlate } from '@/components/shop/bits'
import { Reveal } from '@/components/site/Reveal'

type Payment = 'card' | 'transfer' | 'cod'

const STEP_LABELS = ['Contact', 'Delivery', 'Payment']

/**
 * Checkout.
 *
 * Three steps because each one ends in a decision, not a form field: who you are,
 * where it goes, how you pay. Every step validates on continue and keeps the
 * errors in place; the summary rail is sticky so the total never leaves the screen.
 * No account is required anywhere — a shop that demands registration to sell two
 * bags of coffee has confused itself with a bank.
 */
export function Checkout() {
  const { lines, totals, zone, setZone, clear } = useCart()
  const [step, setStep] = React.useState(0)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [placing, setPlacing] = React.useState(false)
  const [order, setOrder] = React.useState<{ number: string; eta: string } | null>(null)

  const [contact, setContact] = React.useState({ email: '', phone: '', name: '' })
  const [address, setAddress] = React.useState({
    line1: '',
    line2: '',
    city: '',
    district: DISTRICT_OPTIONS[0],
    notes: '',
  })
  const [payment, setPayment] = React.useState<Payment>('card')
  const [card, setCard] = React.useState({ number: '', expiry: '', cvc: '', name: '' })
  const [newsletter, setNewsletter] = React.useState(false)
  const [terms, setTerms] = React.useState(false)

  const update = <T extends object>(setter: (v: T) => void, current: T) => (patch: Partial<T>) =>
    setter({ ...current, ...patch })

  const validate = (index: number) => {
    const next: Record<string, string> = {}
    if (index === 0) {
      if (contact.name.trim().length < 2) next.name = 'Who is the bag for?'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) next.email = 'We send the receipt here'
      if (!/^(\+94|0)?[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{4}$/.test(contact.phone.trim()))
        next.phone = 'A Sri Lankan mobile, e.g. 077 269 0188'
    }
    if (index === 1) {
      if (address.line1.trim().length < 4) next.line1 = 'Street address'
      if (address.city.trim().length < 2) next.city = 'Town or city'
    }
    if (index === 2) {
      if (payment === 'card') {
        if (card.number.replace(/\s/g, '').length < 12) next.number = 'That card number looks short'
        if (!/^\d{2}\s?\/?\s?\d{2}$/.test(card.expiry.trim())) next.expiry = 'MM / YY'
        if (card.cvc.trim().length < 3) next.cvc = '3 digits on the back'
        if (card.name.trim().length < 2) next.name = 'Name on the card'
      }
      if (!terms) next.terms = 'Please accept the taste guarantee and delivery terms'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const nextStep = () => {
    if (!validate(step)) return
    setStep((s) => Math.min(2, s + 1))
  }

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate(2)) return
    setPlacing(true)
    window.setTimeout(() => {
      const number = `KR-${String(Math.floor(1000 + Math.random() * 8999))}`
      setOrder({ number, eta: zone === 'colombo' ? 'Tomorrow before 10:00' : zone === 'pickup' ? 'Ready in 2 hours' : 'In 2–3 working days' })
      setPlacing(false)
      clear()
    }, 1100)
  }

  /* --------------------------------------------------------------- confirmed */
  if (order) {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[680px] px-5 text-center sm:px-8">
          <Reveal>
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary">
              <PartyPopper className="size-6 text-primary-foreground" />
            </span>
            <h1 className="serif mt-6 text-3xl sm:text-4xl">Order {order.number} is in</h1>
            <p className="mx-auto mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
              We have emailed the receipt to{' '}
              <span className="text-foreground">{contact.email || 'your inbox'}</span>. Your coffee is
              packed on the roast day, so it arrives within a few days of leaving the drum.
            </p>

            <div className="mx-auto mt-7 max-w-[30rem] space-y-3 rounded-xl border border-border bg-card p-5 text-left text-sm">
              <Row label="Order" value={order.number} />
              <Row label="Name" value={contact.name} />
              <Row label="Delivering to" value={[address.line1, address.city].filter(Boolean).join(', ')} />
              <Row label="Method" value={zone === 'pickup' ? 'Roastery pickup' : 'Courier'} />
              <Row label="Arrives" value={order.eta} />
              <Separator />
              <Row
                label="Paid"
                value={
                  payment === 'card'
                    ? `Card ending ${card.number.replace(/\s/g, '').slice(-4) || '····'}`
                    : payment === 'transfer'
                      ? 'Bank transfer pending'
                      : 'Cash on delivery'
                }
              />
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/shop">Buy another bag</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/brew">Brew it properly</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/subscribe">Subscribe and save 10%</Link>
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Something wrong with the order? WhatsApp {`+94 77 269 0188`} with the order number and a
              person will fix it the same day.
            </p>
          </Reveal>
        </div>
      </section>
    )
  }

  if (lines.length === 0) {
    return (
      <section className="py-20">
        <div className="mx-auto w-full max-w-[560px] px-5 text-center sm:px-8">
          <h1 className="serif text-3xl">There is nothing to check out</h1>
          <p className="mx-auto mt-3 max-w-[40ch] text-sm text-muted-foreground">
            Your bag is empty, so this page has nothing to do. That is the honest version of this
            screen.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/shop">Shop the six coffees</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <h1 className="serif text-3xl sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No account needed. Three steps and the bag is on its way.
        </p>

        <div className="mt-8">
          <Steps currentStep={step} className="max-w-[34rem]">
            {STEP_LABELS.map((label, i) => (
              <Step
                key={label}
                className={cn(
                  'ml-2 mr-4 whitespace-nowrap',
                  i === step ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </Step>
            ))}
          </Steps>
        </div>

        <div className="mt-9 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <form onSubmit={placeOrder} noValidate className="min-w-0">
            {/* ------------------------------------------------------- step 1 */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="serif text-xl">Who is this for?</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="name" label="Full name" error={errors.name}>
                    <Input
                      id="name"
                      value={contact.name}
                      onChange={(e) => update(setContact, contact)({ name: e.target.value })}
                      aria-invalid={!!errors.name}
                      placeholder="Dilini Fernando"
                    />
                  </Field>
                  <Field id="phone" label="Mobile" error={errors.phone}>
                    <Input
                      id="phone"
                      inputMode="tel"
                      value={contact.phone}
                      onChange={(e) => update(setContact, contact)({ phone: e.target.value })}
                      aria-invalid={!!errors.phone}
                      placeholder="077 269 0188"
                    />
                  </Field>
                </div>
                <Field
                  id="email"
                  label="Email"
                  hint="Receipt and tracking link. We do not add you to a mailing list."
                  error={errors.email}
                >
                  <Input
                    id="email"
                    type="email"
                    value={contact.email}
                    onChange={(e) => update(setContact, contact)({ email: e.target.value })}
                    aria-invalid={!!errors.email}
                    placeholder="you@email.lk"
                  />
                </Field>
              </div>
            )}

            {/* ------------------------------------------------------- step 2 */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="serif text-xl">Where is it going?</h2>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      { id: 'colombo', icon: <Truck className="size-4" />, label: 'Colombo 1–15', detail: 'Free over ' + money(12000) + ' · next morning' },
                      { id: 'suburbs', icon: <MapPin className="size-4" />, label: 'Colombo suburbs', detail: money(450) + ' · 1–2 working days' },
                      { id: 'island', icon: <Package className="size-4" />, label: 'Rest of the island', detail: money(750) + ' · 2–3 working days' },
                      { id: 'pickup', icon: <Building2 className="size-4" />, label: 'Pick up at the roastery', detail: 'Ready in 2 hours · Tue–Sun' },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setZone(option.id)}
                      className={cn(
                        'flex items-start gap-3 rounded-lg border p-3.5 text-left transition-colors',
                        zone === option.id ? 'border-foreground bg-accent' : 'border-border hover:border-foreground/30',
                      )}
                    >
                      <span className="mt-0.5 shrink-0">{option.icon}</span>
                      <span>
                        <span className="block text-sm font-medium">{option.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{option.detail}</span>
                      </span>
                    </button>
                  ))}
                </div>

                {zone !== 'pickup' ? (
                  <div className="space-y-4 rounded-lg border border-border p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="line1" label="Street address" error={errors.line1}>
                        <Input
                          id="line1"
                          value={address.line1}
                          onChange={(e) => update(setAddress, address)({ line1: e.target.value })}
                          aria-invalid={!!errors.line1}
                          placeholder="24/1 Temple Lane"
                        />
                      </Field>
                      <Field id="line2" label="Apartment, floor (optional)">
                        <Input
                          id="line2"
                          value={address.line2}
                          onChange={(e) => update(setAddress, address)({ line2: e.target.value })}
                          placeholder="Apartment 4B"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field id="city" label="Town or city" error={errors.city}>
                        <Input
                          id="city"
                          value={address.city}
                          onChange={(e) => update(setAddress, address)({ city: e.target.value })}
                          aria-invalid={!!errors.city}
                          placeholder="Colombo 07"
                        />
                      </Field>
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Select
                          value={address.district}
                          onValueChange={(v) => update(setAddress, address)({ district: v })}
                        >
                          <SelectTrigger id="district">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DISTRICT_OPTIONS.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Field
                      id="notes"
                      label="Delivery notes (optional)"
                      hint="Gate code, landmark, or “call before 6pm”."
                    >
                      <Input
                        id="notes"
                        value={address.notes}
                        onChange={(e) => update(setAddress, address)({ notes: e.target.value })}
                        placeholder="Leave with the security desk"
                      />
                    </Field>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border bg-card p-4 text-sm">
                    <p className="font-medium">18 Rosmead Place, Colombo 07</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Tuesday to Sunday, 08:00–18:00. Ring the bell on the roller door and ask for your
                      order number. There is parking for two cars in the yard.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------- step 3 */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="serif text-xl">How would you like to pay?</h2>

                <RadioGroup value={payment} onValueChange={(v) => setPayment(v as Payment)} className="space-y-3">
                  {(
                    [
                      { id: 'card' as Payment, icon: <CreditCard className="size-4" />, title: 'Card', detail: 'Visa, Mastercard, Amex · 3-D Secure' },
                      { id: 'transfer' as Payment, icon: <Building2 className="size-4" />, title: 'Bank transfer', detail: 'We ship once the transfer clears, usually same day' },
                      { id: 'cod' as Payment, icon: <Banknote className="size-4" />, title: 'Cash on delivery', detail: 'Colombo and suburbs only, exact change appreciated' },
                    ] as const
                  ).map((option) => (
                    <label
                      key={option.id}
                      htmlFor={`pay-${option.id}`}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors',
                        payment === option.id ? 'border-foreground bg-accent' : 'border-border hover:border-foreground/30',
                      )}
                    >
                      <RadioGroupItem value={option.id} id={`pay-${option.id}`} className="mt-0.5" />
                      <span className="flex-1">
                        <span className="flex items-center gap-2 text-sm font-medium">
                          {option.icon}
                          {option.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{option.detail}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>

                {payment === 'card' && (
                  <div className="space-y-4 rounded-lg border border-border bg-card/50 p-4">
                    <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="size-3.5" />
                      This demo collects nothing — the fields validate, then discard what you type.
                    </p>
                    <Field id="cardnumber" label="Card number" error={errors.number}>
                      <Input
                        id="cardnumber"
                        inputMode="numeric"
                        value={card.number}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
                          update(setCard, card)({ number: digits.replace(/(.{4})/g, '$1 ').trim() })
                        }}
                        aria-invalid={!!errors.number}
                        placeholder="4242 4242 4242 4242"
                        className="font-mono"
                      />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field id="expiry" label="Expiry" error={errors.expiry}>
                        <Input
                          id="expiry"
                          value={card.expiry}
                          onChange={(e) => update(setCard, card)({ expiry: e.target.value })}
                          aria-invalid={!!errors.expiry}
                          placeholder="09 / 28"
                          className="font-mono"
                        />
                      </Field>
                      <Field id="cvc" label="CVC" error={errors.cvc}>
                        <Input
                          id="cvc"
                          inputMode="numeric"
                          value={card.cvc}
                          onChange={(e) => update(setCard, card)({ cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          aria-invalid={!!errors.cvc}
                          placeholder="123"
                          className="font-mono"
                        />
                      </Field>
                      <Field id="cardname" label="Name on card" error={errors.name}>
                        <Input
                          id="cardname"
                          value={card.name}
                          onChange={(e) => update(setCard, card)({ name: e.target.value })}
                          aria-invalid={!!errors.name}
                          placeholder="D. Fernando"
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {payment === 'transfer' && (
                  <div className="rounded-lg border border-border bg-card p-4 text-sm">
                    <p className="label text-muted-foreground">Transfer to</p>
                    <dl className="mt-2.5 space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Bank</dt>
                        <dd>Commercial Bank · Colombo 07</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Account</dt>
                        <dd>Knuckles Roasters (Pvt) Ltd</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Number</dt>
                        <dd>800 1234 5678</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Reference</dt>
                        <dd>Your mobile number</dd>
                      </div>
                    </dl>
                  </div>
                )}

                <div className="space-y-3">
                  <label
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5',
                      errors.terms ? 'border-destructive bg-destructive/5' : 'border-border',
                    )}
                  >
                    <Checkbox
                      checked={terms}
                      onCheckedChange={(v) => setTerms(v === true)}
                      className="mt-0.5"
                      aria-label="Accept the terms"
                    />
                    <span className="text-xs leading-relaxed">
                      I have read the 30-day taste guarantee and the delivery times. Coffee is a fresh
                      product; I know the roast date is on the bag.
                    </span>
                  </label>
                  {errors.terms && (
                    <p role="alert" className="flex items-center gap-1.5 text-xs text-destructive">
                      <AlertCircle className="size-3.5" />
                      {errors.terms}
                    </p>
                  )}

                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3.5">
                    <Checkbox
                      checked={newsletter}
                      onCheckedChange={(v) => setNewsletter(v === true)}
                      className="mt-0.5"
                      aria-label="Monthly email"
                    />
                    <span className="text-xs leading-relaxed">
                      Email me once a month when a new lot lands on the shelf. No more than that.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------- nav */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {step > 0 && (
                <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              )}
              {step < 2 ? (
                <Button type="button" size="lg" className="ml-auto" onClick={nextStep}>
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button type="submit" size="lg" className="ml-auto" disabled={placing}>
                  {placing ? (
                    <>
                      <Spinner className="size-4" />
                      Placing order
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      Place order · {money(totals.total)}
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>

          {/* ------------------------------------------------------- summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h2 className="serif text-lg">In the bag</h2>
                  <Badge variant="outline" className="rounded-full tnum">
                    {totals.count} {totals.count === 1 ? 'item' : 'items'}
                  </Badge>
                </div>

                <ul className="mt-4 space-y-3">
                  {lines.map((line) => {
                    const product = PRODUCTS.find((p) => p.id === line.productId)
                    if (!product) return null
                    return (
                      <li key={line.key} className="flex items-center gap-3">
                        <BagPlate product={product} className="size-12 shrink-0 rounded-md">
                          <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: BAG_TONES[product.image] }} />
                        </BagPlate>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm">{product.name}</span>
                          <span className="block text-xs text-muted-foreground">
                            {line.grams >= 1000 ? `${line.grams / 1000} kg` : `${line.grams} g`} × {line.qty}
                          </span>
                        </span>
                        <span className="price text-sm">{money(linePrice(product, line.grams, line.qty))}</span>
                      </li>
                    )
                  })}
                </ul>

                <Separator className="my-4" />

                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="price">{money(totals.subtotal)}</dd>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <dt>Discount</dt>
                      <dd className="price">−{money(totals.discount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Delivery</dt>
                    <dd className="price">{totals.shipping === 0 ? 'Free' : money(totals.shipping)}</dd>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex items-baseline justify-between">
                    <dt className="font-medium">Total</dt>
                    <dd className="price text-xl font-medium">{money(totals.total)}</dd>
                  </div>
                </dl>

                <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                  Prices include VAT. Delivery is charged once per order, not per bag.
                </p>
              </CardContent>
            </Card>

            <div className="mt-4 rounded-xl border border-border bg-card/50 p-4">
              <p className="label text-muted-foreground">Roasting schedule</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Batches go on the drum Tuesday and Friday. Orders placed before 11:00 on a roast day
                ship that afternoon; anything later catches the next one.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value || '—'}</span>
    </div>
  )
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {hint && <span className="ml-2 font-normal text-muted-foreground">{hint}</span>}
      </Label>
      {children}
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
