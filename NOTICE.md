# Knuckles Roasters — e-commerce store — credits and licence

**Design and build: Niroj Prashath.** The visual design, layout, motion, copy, data model, application
logic and all screen composition in this project are original work.

## Third-party components

`src/components/ui/` is vendored source, not hand-written in this project. It is derived from the
**better-design** component registry (MIT), Copyright (c) 2026 Marvin Kaunda —
<https://github.com/marvkr/better-design>. Those files carry the upstream MIT permission notice; keep
it intact if you redistribute this project, or replace the directory with your own primitives.

Their generated token layer (`src/tokens.css`, `src/themes.css`, `src/theme-map.css`) is produced by
`npm run gen:theme`, which reads the same upstream corpus. Regenerating it does not change the design
of this project — it only refreshes the token values.

Local modifications to vendored files are noted in comments at each edit site:

  - `components/ui/steps.tsx` — the component mapped over its children but never rendered them;
    step labels now render inside each step.
  - `components/ui/sound-provider.tsx` — UI sound defaults to **off**; the footer carries the toggle.
  - `components/ui/_shared.ts`, `sound-provider.tsx` — added, they were unresolved relative imports.


## Elsewhere

- Typefaces are self-hosted via Fontsource (Inter, JetBrains Mono, Fraunces), each under the SIL Open Font
  Licence.
- Photography is AI-generated for this project and is not third-party material.
