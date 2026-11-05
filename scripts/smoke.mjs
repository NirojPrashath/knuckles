/**
 * SSR route smoke test.
 *
 * Renders every route with react-dom/server inside Vite's SSR module graph, with
 * a minimal `window` stub so the hash router resolves a real route instead of
 * defaulting to '/'. This catches render-time bugs (window reads during render,
 * a Radix component used outside its provider, invalid props) without a browser.
 */
import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import React from 'react'

const ROUTES = [
  '/',
  '/shop',
  '/product/hansa-espresso',
  '/product/knuckles-honey',
  '/product/not-a-coffee',
  '/cart',
  '/checkout',
  '/subscribe',
  '/brew',
  '/wholesale',
  '/nope',
]

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

let failures = 0
const appModule = await server.ssrLoadModule('/src/App.tsx')
const App = appModule.default ?? appModule.App

for (const route of ROUTES) {
  globalThis.window = {
    location: { hash: `#${route}`, href: `http://localhost:5175/#${route}` },
    addEventListener() {},
    removeEventListener() {},
    scrollTo() {},
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    setTimeout,
    clearTimeout,
  }

  try {
    const html = renderToString(React.createElement(App))
    const kb = (html.length / 1024).toFixed(1)
    const checks = {
      main: html.includes('id="main"'),
      nav: html.includes('Skip to content'),
      credit: html.includes('Niroj Prashath'),
      footer: html.includes('Knuckles Roasters'),
      bag: html.includes('Your bag') || html.includes('Checkout') || html.includes('Subscribe'),
    }
    const bad = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
    console.log(`${bad.length ? '✗' : '✓'} ${route.padEnd(12)} ${kb.padStart(6)} kb  ${bad.length ? 'missing: ' + bad.join(',') : 'ok'}`)
    if (bad.length) failures++
  } catch (err) {
    failures++
    console.log(`✗ ${route.padEnd(12)} ${err.message.split('\n')[0]}`)
    if (process.env.VERBOSE) console.log(err.stack)
  }
}

await server.close()
console.log(failures === 0 ? '\nall routes rendered' : `\n${failures} route(s) failed`)
process.exit(failures === 0 ? 0 : 1)
