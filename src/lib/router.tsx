import * as React from 'react'

/**
 * Hash router — 60 lines instead of a dependency.
 *
 * Routes starting with `/` are owned by the app; anything else (bare anchors
 * like `#pricing`) is left to the browser so the landing page keeps native
 * anchor scrolling without remounting.
 */
export function useRoute() {
  const [route, setRoute] = React.useState(() => read())
  React.useEffect(() => {
    const onHash = () => setRoute(read())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

function read() {
  // guarded so the module can be imported outside a browser (tests, SSR smoke)
  if (typeof window === 'undefined') return '/'
  const raw = window.location.hash.replace(/^#/, '')
  return raw.startsWith('/') ? raw : '/'
}

export function navigate(to: string) {
  if (window.location.hash.replace(/^#/, '') === to) return
  window.location.hash = to
}

export function Link({
  to,
  children,
  className,
  onClick,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        onClick?.(e)
        // same-document hash change: let the browser update the URL, then move focus
        requestAnimationFrame(() => document.getElementById('main')?.focus())
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

/** `#/app/runs/run_8f42c1` -> ['app','runs','run_8f42c1'] */
export function segments(route: string) {
  return route.split('/').filter(Boolean)
}
