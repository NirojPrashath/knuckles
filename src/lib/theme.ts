/**
 * Six retail design systems ship in `themes.css`; this is the switcher's model.
 * The store's own direction is tactile-minimal — the tactile, near-monochrome
 * system — because speciality coffee sells on materiality, not on colour.
 */
export const THEMES = [
  { id: 'tactile-minimal', label: 'Tactile Minimal', swatch: 'linear-gradient(135deg,#070707,#f2f2f2)', mode: 'light', vibe: 'Tactile depth · minimal colour' },
  { id: 'minimal-light', label: 'Minimal Light', swatch: 'linear-gradient(135deg,#111111,#ffffff)', mode: 'light', vibe: 'Black primary · border-only cards' },
  { id: 'pillow-light', label: 'Pillow', swatch: 'linear-gradient(135deg,#e8e2d8,#ffffff)', mode: 'light', vibe: 'Soft shadows · rounded comfort' },
  { id: 'light-marketplace', label: 'Marketplace', swatch: 'linear-gradient(135deg,#2f2f2f,#efefef)', mode: 'light', vibe: 'Charcoal buttons · flat cards' },
  { id: 'precision-light', label: 'Precision', swatch: 'linear-gradient(135deg,#3a3a3a,#f7f7f7)', mode: 'light', vibe: 'Precision layered shadows' },
  { id: 'editorial-dark', label: 'Editorial Dark', swatch: 'linear-gradient(135deg,#f5f5f5,#09090b)', mode: 'dark', vibe: 'Serif display · flat · content-first' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

const IDS = THEMES.map((t) => t.id) as readonly string[]

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && IDS.includes(value)
}

export function applyTheme(id: ThemeId) {
  const root = document.documentElement
  const entry = THEMES.find((t) => t.id === id)
  root.dataset.theme = id
  root.classList.toggle('dark', entry?.mode === 'dark')
  root.style.colorScheme = entry?.mode ?? 'light'
  try {
    localStorage.setItem('knuckles.theme', id)
  } catch {
    /* private mode — the in-memory choice still applies */
  }
}

export function initialTheme(): ThemeId {
  try {
    const saved = localStorage.getItem('knuckles.theme')
    if (isThemeId(saved)) return saved
  } catch {
    /* ignore */
  }
  return 'tactile-minimal'
}
