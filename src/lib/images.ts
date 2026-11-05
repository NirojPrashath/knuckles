/**
 * Product photography, mapped by key so `catalog.ts` stays data-only and this
 * file is the one place that knows about Vite asset handling.
 */
import bagForest from '@/assets/bag-forest.jpg'
import bagMustard from '@/assets/bag-mustard.jpg'
import bagTerracotta from '@/assets/bag-terracotta.jpg'
import bagCharcoal from '@/assets/bag-charcoal.jpg'
import bagSlate from '@/assets/bag-slate.jpg'
import bagBrown from '@/assets/bag-brown.jpg'
import heroPour from '@/assets/hero-pour.jpg'
import roastery from '@/assets/roastery.jpg'

export const BAG_IMAGES: Record<string, string> = {
  forest: bagForest,
  mustard: bagMustard,
  terracotta: bagTerracotta,
  charcoal: bagCharcoal,
  slate: bagSlate,
  brown: bagBrown,
}

/** The label band colour each bag was shot with — used for swatches and accents. */
export const BAG_TONES: Record<string, string> = {
  forest: '#3f5138',
  mustard: '#c98a2b',
  terracotta: '#b5543c',
  charcoal: '#2b2b2b',
  slate: '#5b6b7a',
  brown: '#7a4b2e',
}

export { heroPour, roastery }
