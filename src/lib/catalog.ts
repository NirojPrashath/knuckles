/**
 * Knuckles Roasters — catalogue, copy and money.
 *
 * Everything the store shows comes from here: one source of truth so the grid,
 * the product page, the cart and the filters can never disagree with each other.
 * Prices are in LKR, the way a Colombo roastery actually sells (250 g retail,
 * 1 kg for cafés), with a 500 g step in between.
 */

export const BRAND = {
  name: 'Knuckles',
  full: 'Knuckles Roasters',
  tagline: 'Ceylon coffee, roasted weekly in Colombo',
  founded: 2019,
  estd: 'Estd. 2019',
  phone: '+94 11 269 7744',
  whatsapp: '+94 77 269 0188',
  email: 'hello@knucklesroasters.lk',
  instagram: '@knucklesroasters',
  address: '18 Rosmead Place, Colombo 07',
  hours: 'Roastery & counter · Tue–Sun 08:00–18:00',
  freeShippingOver: 12000,
  shippingFlat: 450,
}

export const money = (n: number, currency = 'LKR') =>
  `${currency} ${n.toLocaleString('en-LK')}`

/* ------------------------------------------------------------------ taxonomy */

export type RoastLevel = 'light' | 'medium' | 'dark'

export type Product = {
  id: string
  slug: string
  name: string
  origin: string
  region: string
  altitude: string
  process: string
  varietal: string
  roast: RoastLevel
  /** 1–5, tasting weight: how forceful the cup is */
  intensity: number
  notes: string[]
  blurb: string
  story: string
  /** 250 g price in LKR; the other bag sizes are derived from this */
  basePrice: number
  image: string
  badge?: string
  /** roast date of the current batch, shown on the card the way a real bag does */
  roastedOn: string
  stock: number
  rating: number
  reviews: number
  brew: { label: string; value: string }[]
  /** for filter-style coffees, the espresso recipe we publish */
  recipe?: { dose: string; yield: string; time: string; temp: string }
  soldThisWeek: number
}

export type BagSize = { grams: number; label: string; multiplier: number }
export type Grind = { id: string; label: string; hint: string }

export const BAG_SIZES: BagSize[] = [
  { grams: 250, label: '250 g', multiplier: 1 },
  { grams: 500, label: '500 g', multiplier: 1.92 },
  { grams: 1000, label: '1 kg', multiplier: 3.7 },
]

export const GRINDS: Grind[] = [
  { id: 'whole', label: 'Whole bean', hint: 'Grind it yourself, stays fresh longest' },
  { id: 'filter', label: 'Filter', hint: 'V60, Chemex, Aeropress, drip' },
  { id: 'espresso', label: 'Espresso', hint: 'Fine enough for a 9-bar basket' },
  { id: 'moka', label: 'Moka pot', hint: 'Slightly coarser than espresso' },
  { id: 'south', label: 'South Indian filter', hint: 'For a traditional tumbler' },
]

export const ROAST_LEVELS: { id: RoastLevel; label: string; note: string }[] = [
  { id: 'light', label: 'Light', note: 'Fruit and acidity kept intact' },
  { id: 'medium', label: 'Medium', note: 'Balanced, works in milk' },
  { id: 'dark', label: 'Dark', note: 'Chocolate and body' },
]

/** 1 = delicate, 5 = forceful. Shown as beans on every card. */
export const MAX_INTENSITY = 5

/* ------------------------------------------------------------------- products */

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    slug: 'nuwara-elya-washed',
    name: 'Nuwara Eliya Washed',
    origin: 'Sri Lanka',
    region: 'Nuwara Eliya, 1,780 m',
    altitude: '1,780 m',
    process: 'Fully washed',
    varietal: 'SL34 · Typica',
    roast: 'light',
    intensity: 2,
    notes: ['Jaggery', 'Bergamot', 'Green apple'],
    blurb: 'High-grown and clean. The cup that convinces people Ceylon can do filter coffee.',
    story:
      'Grown on a 40-hectare estate above the tea belt, where the same mist that makes good tea keeps cherry ripening slowly. Picked in December, washed the same evening, dried on raised beds for eleven days.',
    basePrice: 4200,
    image: 'forest',
    badge: 'Roaster’s pick',
    roastedOn: '2026-10-02',
    stock: 24,
    rating: 4.8,
    reviews: 126,
    brew: [
      { label: 'Filter', value: '15 g · 250 ml · 2:45' },
      { label: 'Espresso', value: '18 g in · 40 g out · 28 s' },
      { label: 'Best for', value: 'V60, Chemex, drip' },
    ],
    recipe: { dose: '18 g', yield: '40 g', time: '28 s', temp: '93 °C' },
    soldThisWeek: 41,
  },
  {
    id: 'p2',
    slug: 'knuckles-honey',
    name: 'Knuckles Honey',
    origin: 'Sri Lanka',
    region: 'Knuckles Range, 1,320 m',
    altitude: '1,320 m',
    process: 'Yellow honey',
    varietal: 'SL34',
    roast: 'light',
    intensity: 4,
    notes: ['Ripe mango', 'Honey', 'Cocoa nib'],
    blurb: 'Sweet and syrupy from the name range north of Kandy. Our most awarded lot.',
    story:
      'Yellow honey means the mucilage is left on the parchment for the first day of drying, then washed loose. It costs the mill more labour and gives back a syrupy, fruit-forward cup that still drinks clean.',
    basePrice: 5200,
    image: 'mustard',
    badge: 'Award winner',
    roastedOn: '2026-10-02',
    stock: 9,
    rating: 4.9,
    reviews: 88,
    brew: [
      { label: 'Filter', value: '16 g · 250 ml · 2:30' },
      { label: 'Espresso', value: '18 g in · 36 g out · 26 s' },
      { label: 'Best for', value: 'V60, Aeropress, espresso' },
    ],
    recipe: { dose: '18 g', yield: '36 g', time: '26 s', temp: '94 °C' },
    soldThisWeek: 33,
  },
  {
    id: 'p3',
    slug: 'galle-natural',
    name: 'Galle Natural',
    origin: 'Sri Lanka',
    region: 'Galle District, 620 m',
    altitude: '620 m',
    process: 'Natural, dried in cherry',
    varietal: 'Catimor',
    roast: 'light',
    intensity: 5,
    notes: ['Strawberry', 'Dark rum', 'Cardamom'],
    blurb: 'The loud one. Fermented fruit and spice — a filter coffee that behaves like wine.',
    story:
      'Whole cherries dried on a concrete patio for eighteen days, turned every two hours by hand. This is a small lot: 240 kg green, which is roughly 800 bags of 250 g, and then it is gone until next season.',
    basePrice: 5600,
    image: 'terracotta',
    badge: 'Small lot · 240 kg',
    roastedOn: '2026-09-30',
    stock: 6,
    rating: 4.7,
    reviews: 54,
    brew: [
      { label: 'Filter', value: '14 g · 250 ml · 3:00' },
      { label: 'Best for', value: 'Filter only — not an espresso' },
    ],
    soldThisWeek: 28,
  },
  {
    id: 'p4',
    slug: 'hansa-espresso',
    name: 'Hansa Espresso',
    origin: 'Blend',
    region: 'Two Sri Lankan origins',
    altitude: '620–1,320 m',
    process: 'Washed + natural',
    varietal: 'SL34 · Catimor',
    roast: 'medium',
    intensity: 3,
    notes: ['Toasted hazelnut', 'Dark chocolate', 'Brown sugar'],
    blurb: 'Built for milk. Pulls sweet at 1:2 in twenty-six seconds and holds up under a flat white.',
    story:
      'Our house espresso, and the one most cafés in Colombo buy. Sixty per cent washed for structure, forty per cent natural for the fruit that survives milk. We cup every roast before it ships.',
    basePrice: 3800,
    image: 'charcoal',
    badge: 'Best seller',
    roastedOn: '2026-10-04',
    stock: 68,
    rating: 4.8,
    reviews: 214,
    brew: [
      { label: 'Espresso', value: '18 g in · 36 g out · 26 s' },
      { label: 'Latte', value: '20 g in · 40 g out' },
      { label: 'Best for', value: 'Espresso machines, moka' },
    ],
    recipe: { dose: '18 g', yield: '36 g', time: '26 s', temp: '92 °C' },
    soldThisWeek: 96,
  },
  {
    id: 'p5',
    slug: 'midnight-ocean',
    name: 'Midnight Ocean',
    origin: 'Blend',
    region: 'Sri Lanka + Ethiopia',
    altitude: '1,400–1,900 m',
    process: 'Washed',
    varietal: 'SL34 · Heirloom',
    roast: 'dark',
    intensity: 4,
    notes: ['Bitter cocoa', 'Molasses', 'Clove'],
    blurb: 'For people who want coffee to taste like coffee. Thick, dark, unapologetic.',
    story:
      'Named for the 05:00 run to the harbour. Roasted well into the second crack for body: it takes milk, water and a ristretto pull without going ashy. Replaces what you used to buy from a supermarket shelf.',
    basePrice: 3400,
    image: 'slate',
    roastedOn: '2026-10-04',
    stock: 52,
    rating: 4.6,
    reviews: 173,
    brew: [
      { label: 'Espresso', value: '18 g in · 32 g out · 24 s' },
      { label: 'French press', value: '30 g · 500 ml · 4:00' },
      { label: 'Best for', value: 'Espresso, moka, French press' },
    ],
    recipe: { dose: '18 g', yield: '32 g', time: '24 s', temp: '91 °C' },
    soldThisWeek: 74,
  },
  {
    id: 'p6',
    slug: 'hatton-decaf',
    name: 'Hatton Decaf',
    origin: 'Sri Lanka',
    region: 'Hatton, 1,240 m',
    altitude: '1,240 m',
    process: 'Sugarcane decaf',
    varietal: 'SL34',
    roast: 'medium',
    intensity: 2,
    notes: ['Cocoa', 'Dried fig', 'Almond'],
    blurb: 'Sugar-cane processed, so it tastes like coffee rather than a compromise.',
    story:
      'Sugarcane decaffeination uses a natural by-product of the sugar industry instead of chemical solvents, and it leaves the sweetness behind. Same bean as the Nuwara Eliya, minus the caffeine.',
    basePrice: 4600,
    image: 'brown',
    roastedOn: '2026-09-30',
    stock: 0,
    rating: 4.5,
    reviews: 61,
    brew: [
      { label: 'Filter', value: '16 g · 250 ml · 2:45' },
      { label: 'Espresso', value: '18 g in · 38 g out · 27 s' },
      { label: 'Best for', value: 'Everything, after 16:00' },
    ],
    soldThisWeek: 19,
  },
]

/* --------------------------------------------------------------------- orders */

export const SUBSCRIPTION_PLANS = [
  {
    id: 'weekly',
    name: 'Weekly',
    cadence: 'Every Monday',
    discount: 0.1,
    blurb: 'One bag a week, always the freshest roast on the shelf.',
    perk: 'Free delivery, always',
  },
  {
    id: 'fortnightly',
    name: 'Fortnightly',
    cadence: 'Every second Monday',
    discount: 0.05,
    blurb: 'For two people, or one person with a small machine.',
    perk: 'Free delivery, always',
  },
  {
    id: 'monthly',
    name: 'Monthly',
    cadence: 'First Monday',
    discount: 0,
    blurb: 'A kilo a month, roasted the day before it ships.',
    perk: 'Free delivery, always',
  },
] as const

export const CART_SEED = [
  { productId: 'p4', grams: 500, grind: 'espresso', qty: 1 },
  { productId: 'p1', grams: 250, grind: 'filter', qty: 2 },
]

export const COUPONS: Record<string, { type: 'percent' | 'flat'; value: number; note: string }> = {
  ROAST10: { type: 'percent', value: 10, note: '10% off — new customer code' },
  HARVEST: { type: 'flat', value: 1500, note: 'LKR 1,500 off orders — harvest festival' },
  CAFE25: { type: 'percent', value: 25, note: 'Wholesale 25% — licensed cafés only' },
}

/** Delivery zones a Colombo roaster actually serves. */
export const DELIVERY: Record<string, { label: string; eta: string; fee: number }> = {
  colombo: { label: 'Colombo 1–15', eta: 'Today or tomorrow before 10:00', fee: 0 },
  suburbs: { label: 'Colombo suburbs', eta: '1–2 working days', fee: 450 },
  island: { label: 'Rest of the island', eta: '2–3 working days', fee: 750 },
  pickup: { label: 'Pick up at the roastery', eta: 'Ready in 2 hours, Tue–Sun', fee: 0 },
}

export const DISTRICT_OPTIONS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Galle', 'Kandy', 'Matara', 'Negombo', 'Jaffna', 'Batticaloa',
]

/* -------------------------------------------------------- reviews and content */

export const REVIEWS = [
  {
    name: 'Anjali P.',
    city: 'Colombo 05',
    rating: 5,
    title: 'Genuinely the freshest bag I have bought in Sri Lanka',
    body:
      'Roast date was four days before it landed. The Nuwara Eliya washed has a bergamot thing going on that survives right to the end of the bag.',
    product: 'Nuwara Eliya Washed',
    verified: true,
  },
  {
    name: 'Ravi S.',
    city: 'Dehiwala',
    rating: 5,
    title: 'Hansa in a home machine',
    body:
      'I run a modest Breville and this is the only local blend that does not go bitter at 1:2. Subscription means I stopped thinking about ordering.',
    product: 'Hansa Espresso',
    verified: true,
  },
  {
    name: 'Maya F.',
    city: 'Kandy',
    rating: 4,
    title: 'Loud, in a good way',
    body:
      'The Galle natural is a lot of strawberry. I love it as a filter, my husband does not. Four stars only because I wish the 1 kg bag existed.',
    product: 'Galle Natural',
    verified: true,
  },
  {
    name: 'Nuwan T.',
    city: 'Galle',
    rating: 5,
    title: 'We buy the 1 kg bags for the café',
    body:
      'Consistent roast to roast, which is the whole game when you are pulling 200 shots a day. Deliveries have not been late once in eight months.',
    product: 'Hansa Espresso',
    verified: true,
  },
  {
    name: 'Ishara D.',
    city: 'Negombo',
    rating: 4,
    title: 'Decaf that is not an apology',
    body:
      'Bought it for evenings and ended up drinking it in the mornings too. Would like a light decaf option.',
    product: 'Hatton Decaf',
    verified: true,
  },
]

export const BREW_GUIDES = [
  {
    id: 'v60',
    title: 'V60, without the fuss',
    time: '3 min',
    level: 'Everyday',
    blurb: 'The default for our light roasts. One pour, one swirl, done.',
    steps: [
      'Rinse the paper filter with hot water, then tip the water out.',
      '16 g of coffee, ground like table salt. Level the bed.',
      'Pour 50 g of water at 94 °C and wait 40 seconds.',
      'Pour to 250 g in circles, finishing by 2:00. It should drain by 2:45.',
    ],
  },
  {
    id: 'espresso',
    title: 'Dialling in a new bag',
    time: '20 min',
    level: 'Getting serious',
    blurb: 'Roast date moves the recipe. Here is how to find it in three shots.',
    steps: [
      'Start at 18 g in, 36 g out, 26 seconds — our published recipe.',
      'Tastes sour or thin? Grind finer, or go two degrees hotter.',
      'Tastes bitter or dry? Grind coarser, or pull a shorter ratio.',
      'Write the recipe on the bag. Next time you will not need three shots.',
    ],
  },
  {
    id: 'aeropress',
    title: 'Aeropress, 90 seconds',
    time: '2 min',
    level: 'Everyday',
    blurb: 'The kit that fits in a bag and forgives a bad grinder.',
    steps: [
      '15 g, medium-fine. Inverted method, plunger pulled to 4.',
      'Pour 200 ml at 92 °C, stir five times.',
      'Steep 60 seconds, then cap, flip and press for 30 seconds.',
      'Stop pressing the moment it hisses.',
    ],
  },
  {
    id: 'moka',
    title: 'Moka pot that does not scorch',
    time: '8 min',
    level: 'Kitchen standard',
    blurb: 'Most moka pots fail because of heat and grind, not the pot.',
    steps: [
      'Fill the basket level, no tamping. Medium grind, like coarse sand.',
      'Water in the base up to the valve, already hot.',
      'Low flame. The spout should start dribbling after 3 minutes.',
      'Take it off when it turns pale yellow, not brown.',
    ],
  },
]

export const WHOLESALE_LOG = [
  { week: 'Week of 28 Sep', orders: 62, kg: 148, headline: 'Hansa up 12% after the new roast profile' },
  { week: 'Week of 21 Sep', orders: 57, kg: 131, headline: 'Two new cafés onboarded in Galle Fort' },
  { week: 'Week of 14 Sep', orders: 54, kg: 126, headline: 'Galle Natural sold out in 9 days' },
  { week: 'Week of 7 Sep', orders: 49,kg: 118, headline: 'First wholesale order from Jaffna' },
]

export const FAQS = [
  {
    q: 'How fresh is the coffee when it arrives?',
    a: 'We roast Tuesday and Friday and ship the same or next day. Most orders arrive within four days of roasting, and the roast date is printed on the bag and shown on every product page.',
  },
  {
    q: 'Do you ship outside Colombo?',
    a: 'Yes. Colombo 1–15 is free and usually lands next morning, suburbs are LKR 450, and the rest of the island is LKR 750 in 2–3 working days. Orders over LKR 12,000 ship free islandwide.',
  },
  {
    q: 'Whole bean or ground?',
    a: 'Whole bean keeps flavour for weeks longer. If you do not own a grinder, choose your brew method at checkout and we will grind it on the proper setting — it will drink well for about two weeks.',
  },
  {
    q: 'Can I pause or cancel a subscription?',
    a: 'Any time, from the link in your confirmation email, with no phone call. Pause for one delivery or indefinitely; nothing is charged while a subscription is paused.',
  },
  {
    q: 'What does decaf actually do to the coffee?',
    a: 'Ours is sugarcane processed: the beans sit in a solution derived from fermented sugarcane, which lifts the caffeine out without solvents. It costs more and tastes sweeter than solvent-decaffeinated coffee.',
  },
  {
    q: 'Do you supply cafés and offices?',
    a: 'Yes — wholesale starts at 5 kg a week, with a dedicated account manager, a monthly invoice and free delivery. Licensed cafés get 25% off list with the code CAFE25.',
  },
  {
    q: 'Is there a real shop I can visit?',
    a: 'The roastery counter at 18 Rosmead Place, Colombo 07 is open Tuesday to Sunday, 08:00–18:00. There is a cupping table on Saturdays at 10:00, free, no booking needed.',
  },
  {
    q: 'What if I do not like it?',
    a: 'Drink as much as you like from the bag. If it is not for you, tell us why within 30 days and we will replace it or refund you — no return shipping, we do not resell opened coffee.',
  },
]

export const PROCESS_STEPS = [
  {
    title: 'Sourced by name',
    body: 'Six estates and smallholder groups we visit every season. We publish what we paid above the regional floor.',
    meta: 'Oct–Jan harvest',
  },
  {
    title: 'Roasted twice a week',
    body: '12 kg drum, five batches a day, profiled on a roast curve we log and cup against every time.',
    meta: 'Tue & Fri',
  },
  {
    title: 'Shipped within a day',
    body: 'Bagged with a one-way valve, roast date printed for real, sent out the afternoon it cools.',
    meta: 'Same or next day',
  },
]

export const ROAST_LOG = [
  { label: 'Tue 29 Sep', detail: '4 batches · cupped 86+', tone: 'done' as const },
  { label: 'Fri 02 Oct', detail: '5 batches · Nuwara Eliya + Honey', tone: 'done' as const },
  { label: 'Tue 06 Oct', detail: 'Roasting now · ships 15:00', tone: 'live' as const },
  { label: 'Fri 09 Oct', detail: 'Next roast · slots open', tone: 'next' as const },
]

export const LOYALTY_TIERS = [
  { name: 'First crack', threshold: 'LKR 0', perk: 'Free delivery over LKR 12,000 · roast-date guarantees' },
  { name: 'Second crack', threshold: 'LKR 40,000 spent', perk: '5% off everything · early access to small lots' },
  { name: 'City roast', threshold: 'LKR 120,000 spent', perk: '10% off · free monthly cupping · 1 kg birthday bag' },
]
