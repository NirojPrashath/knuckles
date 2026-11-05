# Knuckles Roasters — e-commerce store

A complete store design for a speciality coffee roastery, built as a runnable site: React 19 +
TypeScript + Vite 6 + Tailwind v4, every colour driven by design tokens.

**Designed by Niroj Prashath.**

**Brand (invented, clearly fictional):** *Knuckles Roasters* — Ceylon coffee roasted twice a week on a
12 kg drum at 18 Rosmead Place, Colombo 07. Six coffees (three Sri Lankan single origins, two blends,
one cane-process decaf), a subscription club, brew guides and a wholesale programme. Prices in LKR.

```bash
npm install
npm run dev              # http://localhost:5175
npm run build
node scripts/smoke.mjs   # SSR render of all 11 routes — the no-browser QA pass
```

---

## Why this direction

An earlier build in this workspace was a gym on a dark-orange system. A store needs the opposite:
**light, tactile, calm, and ruthless about clarity.** The direction is tactile, near-monochrome and light — depth without noise,
which is what a shop lives or dies on.

| Decision | Reasoning |
| --- | --- |
| Near-monochrome, tactile depth | Product photography supplies every colour on the page. A loud UI palette fights it and makes a shop look cheap. |
| **Fraunces** for display, Inter for UI, JetBrains Mono for all figures | A coffee brand sets names in a serif — it is a craft product with a harvest and a place. Prices in tabular numerals so columns line up in carts and tables. All self-hosted, no external font requests. |
| The bag label is **live type**, not baked into the photo | Six studio bag shots with blank printed bands; the coffee's name, origin, altitude and notes render as real HTML over the band. Selectable, searchable, re-skinnable. |
| Intensity printed as **1–5 beans** on every card | "How strong is it?" is the only question a photo of a paper bag cannot answer. We publish it, and it filters the shelf. |
| Roast **date**, stock level, and delivery **ETA** on the product surface | Freshness and availability are the two things online coffee buyers cannot verify. Both are shown, not promised. |
| Scarcity only below 12 bags | A shop that shouts "only 3 left!" on a healthy stock is lying. Below 12 it is real information, so it is stated. |
| Wholesale rates published on the page | A café cannot cost a flat white around "contact us for trade pricing". Three tiers, per kilo, on the page. |

Six light and dark palettes switch at runtime from the bottom-right switcher — the whole store
re-skins, including the product cards and the cart drawer.

## Routes

| Route | Screen | What makes it real |
| --- | --- | --- |
| `#/` | Storefront | Editorial hero with a live **roast calendar** and one-tap add; the shelf of six with roast-level **facet chips**; a **subscription box builder** that prices as you choose; the cherry-to-bag process; brew-guide teasers; a review rotator; the roastery block; FAQ accordion |
| `#/shop` | Catalogue | Facet sidebar (roast, process, price slider, in-stock) + **grid/list toggle**, live result count, sort, a real empty state with a way back, mobile filter sheet |
| `#/product/:slug` | Product | Live label-band photography, four-fact strip (altitude, process, varietal, roast date), size/grind picks, **subscribe-and-save toggle** that changes the price in place, quantity, stock bar, published espresso recipe, story/brew/delivery accordions, review filter by star rating, "often bought with" |
| `#/cart` | Full bag | Per-line quantity steppers with per-unit price maths, **coupon validation** (3 real codes, honest errors), free-delivery meter, delivery zone with ETAs, summary rail |
| `#/checkout` | Checkout | Three steps (contact → delivery → payment), per-step validation, delivery method picker with real fees, card fields with formatting + validation, bank-transfer details, terms gate, **order confirmation** restating the whole order, cart cleared |
| `#/subscribe` | Subscriptions | Live box builder, four-stage timeline of what actually happens on a roast week, loyalty tiers, gift block, pause/swap/cancel panel, FAQ |
| `#/brew` | Brew guides | Four method tabs, **tick-able step checklists**, what-you-need list, coffees matched to the method, and an honest freshness explainer |
| `#/wholesale` | Trade | Published per-kilo tiers, a real wholesale log table, what a trade account includes, and an application form with validation → sending → sent states |
| `#/product/unknown`, anything else | Not found | Two 404s: a product-shaped one and a site-wide one, both with useful exits |

Global chrome: sticky nav with a roasting-status strip, **search across name/origin/notes/process**,
a **cart drawer** with free-delivery progress and an "add a bag" rail, an add-to-bag flash toast, and a
footer with a UI-sound toggle (off by default — the registry plays a tick on every button, which is
hostile in a shop).

## Commerce logic

`src/lib/cart.tsx` is a real reducer + context, not a mock: line keys are `product:grams:grind`, three
bag sizes have their own price multipliers, three coupons (`ROAST10`, `HARVEST`, `CAFE25`) price
correctly as percent or flat, delivery is free over LKR 12,000, and the whole cart persists to
localStorage and rehydrates in an effect so SSR stays clean. Money formatting lives in one place.

## Structure

```
src/
  lib/catalog.ts     all copy and data: brand, 6 products, bag sizes, grind list, 5 reviews,
                     4 brew guides, subscription plans, delivery zones, coupons, wholesale log, FAQs
  lib/cart.tsx       cart reducer, totals maths, localStorage persistence, drawer + flash state
  lib/images.ts      the six bag photographs + their label-band tones
  lib/theme.ts       6 retail systems + applyTheme/localStorage
  components/ui/*    59 vendored UI primitives + _shared, sound-provider (see NOTICE.md)
  components/shop/   bits (intensity beans, stock bar, bag plate, price/quotes), ProductCard + QuickAdd,
                     BoxBuilder
  components/site/   Chrome (nav, search, cart drawer, footer, flash), Reveal, ThemeSwitcher, useInView
  pages/             Home, Shop, Product, Cart, Checkout, Subscribe, Brew, Wholesale, NotFound
scripts/
  gen-theme.mjs      regenerates tokens/themes/theme-map CSS from the registry
  smoke.mjs          SSR render of all 11 routes
```

## Verification

- `npx tsc -b` clean. Three registry bugs patched and documented in-file: `steps.tsx` mapped over its
  children but never rendered them (steps showed bare numbers); `_shared` and `sound-provider` were
  missing relative imports; sound defaulted to ON.
- `node scripts/smoke.mjs` → **all 11 routes render server-side**, including both 404 paths and two
  real product slugs (home 131 kb of HTML, shop 78 kb).
- `npm run build` → CSS 83 kB (gzip 14.8), JS split react 246 / app 184 / radix 126 / vendor 53 /
  icons 22 kB; no chunk-size warnings.
- One in-browser-only bug found by inspection and fixed: two always-mounted search panels with
  `autoFocus` would have stolen focus and scrolled the page on load.

## Honest limits

- **No backend and no payment.** Checkout validates, calculates and confirms against local timers;
  nothing is charged, stored or sent. Card fields discard what you type and say so on screen.
- Inventory, roast dates, reviews and the wholesale log are plausible fiction for a design study.
- Photography is AI-generated (six studio bag shots with deliberately blank label bands, plus a
  pour-over hero and the roastery). The blank bands are the trick that lets live type carry the
  product name on every card.
- The vendored UI primitives are third-party, MIT-licensed source; provenance and the licence
  notice are in [NOTICE.md](NOTICE.md).
