/**
 * api.ts — the one place this storefront talks to the server.
 *
 * Everything goes through `api()` so that three things can never be forgotten
 * in a component:
 *
 *   1. `credentials: 'same-origin'` — the session lives in an httpOnly cookie
 *      that JavaScript cannot read. That is the point: an XSS bug on this page
 *      still cannot exfiltrate the session, because there is nothing to read.
 *   2. The CSRF header on every state-changing request. The server issues a
 *      token bound to the session with an HMAC; a readable `csrf` cookie
 *      carries it, and we echo it back in `X-CSRF-Token`. A cross-site page
 *      can cause the cookie to be sent, but cannot read it to set the header.
 *   3. A single error shape. The server replies with an opaque envelope —
 *      `{ error: { code, message, incidentId } }` — and never a stack trace.
 *
 * Requests are relative ('/api/...'), so in development Vite proxies them to
 * the backend and in production they are served from the same origin. No API
 * base URL is ever baked into the bundle, and there is no key to leak: this
 * client authenticates with a cookie it cannot even see.
 */

export type ApiError = {
  code: string
  message: string
  incidentId?: string
  issues?: string[]
}

export type ApiResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: ApiError }

const SAFE = new Set(['GET', 'HEAD', 'OPTIONS'])

/** Cached from the login/me response; the cookie is the fallback. */
let csrfToken: string | null = null
export const setCsrfToken = (token: string | null) => {
  csrfToken = token
}

function readCookie(name: string): string | null {
  for (const part of document.cookie.split(';')) {
    const [k, ...rest] = part.trim().split('=')
    if (k === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

export async function api<T = unknown>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: unknown,
  opts: { signal?: AbortSignal } = {},
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (!SAFE.has(method)) {
    const token = csrfToken ?? readCookie('csrf')
    if (token) headers['X-CSRF-Token'] = token
  }

  let res: Response
  try {
    res = await fetch(path, {
      method,
      headers,
      credentials: 'same-origin',
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: opts.signal,
    })
  } catch (cause) {
    // Network failure, or the backend is not running. Say so plainly rather
    // than letting a component render "undefined".
    if ((cause as Error)?.name === 'AbortError') throw cause
    return {
      ok: false,
      status: 0,
      error: { code: 'network', message: 'Could not reach the server. Is the backend running on port 4000?' },
    }
  }

  let payload: unknown = null
  const text = await res.text()
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = null
    }
  }

  if (!res.ok) {
    const envelope = (payload as { error?: ApiError } | null)?.error
    if (envelope) return { ok: false, status: res.status, error: envelope }

    /*
     * No error envelope means this did not come from our server. The usual
     * cause is the dev proxy answering on behalf of a backend that is not
     * running — it replies 502/504 with a plain-text body. Saying "Request
     * failed" there sends you hunting for a bug in your password.
     */
    if ([502, 503, 504].includes(res.status)) {
      return {
        ok: false,
        status: res.status,
        error: {
          code: 'upstream_down',
          message: `The backend is not responding (HTTP ${res.status}). Start it with: cd backend && node server.mjs`,
        },
      }
    }
    return {
      ok: false,
      status: res.status,
      error: { code: 'http_' + res.status, message: `Request failed (HTTP ${res.status})` },
    }
  }
  return { ok: true, status: res.status, data: (payload ?? {}) as T }
}

/* ------------------------------------------------------------------ types */

export type SessionUser = {
  id: string
  email: string
  name: string
  roles: Record<string, string>
  entitlements: Record<string, boolean>
  orgId: string | null
  emailVerified: boolean
  totpEnabled: boolean
  passkeyCount: number
  createdAt: string
}

/** A priced cart, as the server computed it. The client never derives these. */
export type Quote = {
  lines: {
    productId: string
    name: string
    grams: number
    grind: string
    qty: number
    unit: number
    lineTotal: number
  }[]
  subtotal: number
  discount: number
  couponApplied: string | null
  couponNote: string | null
  delivery: number
  zone: string
  total: number
  currency: string
}

export type PlacedOrder = {
  id: string
  status: string
  lines: Quote['lines']
  subtotal: number
  discount: number
  delivery: number
  total: number
  currency: string
  createdAt: string
}
