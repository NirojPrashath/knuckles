/**
 * auth.tsx — who is signed in, according to the server.
 *
 * There is no token in localStorage and no user object persisted anywhere on
 * this machine. On boot the app asks `/api/auth/me`; the answer is whatever
 * the session cookie proves. That means you cannot grant yourself a role by
 * editing storage — the roles rendered here are display only, and every
 * endpoint re-checks them server-side before it does anything.
 */
import * as React from 'react'
import { api, setCsrfToken, type SessionUser } from '@/lib/api'

type MeResponse = { user: SessionUser; session: { stepUpValid: boolean }; csrfToken: string }
type LoginResponse =
  | { status: 'ok'; user: SessionUser }
  | { status: 'mfa_required'; methods: string[]; pendingId: string; pendingToken: string }

export type SignInResult =
  | { ok: true }
  | { ok: false; message: string }
  | { ok: 'mfa'; pendingId: string; pendingToken: string }

type AuthValue = {
  user: SessionUser | null
  /** false when /api is unreachable — a dead backend must never look like "signed out" */
  online: boolean
  /** true until the first /me has resolved, so the UI does not flash "signed out" */
  loading: boolean
  signIn: (email: string, password: string) => Promise<SignInResult>
  submitTotp: (pendingId: string, pendingToken: string, code: string) => Promise<SignInResult>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const Ctx = React.createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [online, setOnline] = React.useState(true)

  const refresh = React.useCallback(async () => {
    const res = await api<MeResponse>('GET', '/api/auth/me')
    if (res.ok) {
      setUser(res.data.user)
      setCsrfToken(res.data.csrfToken)
      setOnline(true)
    } else {
      // 401 here is the normal "not signed in" case, not an error worth showing.
      // A network failure is a different thing entirely and must be said out loud.
      setUser(null)
      setCsrfToken(null)
      setOnline(res.error.code !== 'network' && res.error.code !== 'upstream_down')
    }
    setLoading(false)
  }, [])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  /* The backend can die independently of this page — it has, repeatedly, in
     the environment this was built in. Poll a cheap endpoint so the header
     reports it instead of letting you discover it at the login button. */
  React.useEffect(() => {
    const tick = async () => {
      const res = await api('GET', '/api/health')
      setOnline(res.ok)
      // Coming back from the dead: re-establish who we are.
      if (res.ok && !user) void refresh()
    }
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [user, refresh])

  const signIn = React.useCallback<AuthValue['signIn']>(
    async (email, password) => {
      const res = await api<LoginResponse>('POST', '/api/auth/login', { email, password })
      if (!res.ok) return { ok: false, message: res.error.message }
      if (res.data.status === 'mfa_required') {
        return { ok: 'mfa', pendingId: res.data.pendingId, pendingToken: res.data.pendingToken }
      }
      await refresh()
      return { ok: true }
    },
    [refresh],
  )

  const submitTotp = React.useCallback<AuthValue['submitTotp']>(
    async (pendingId, pendingToken, code) => {
      const res = await api('POST', '/api/auth/login/totp', { pendingId, pendingToken, code })
      if (!res.ok) return { ok: false, message: res.error.message }
      await refresh()
      return { ok: true }
    },
    [refresh],
  )

  const signOut = React.useCallback(async () => {
    await api('POST', '/api/auth/logout')
    setUser(null)
    setCsrfToken(null)
  }, [])

  const value = React.useMemo<AuthValue>(
    () => ({ user, online, loading, signIn, submitTotp, signOut, refresh }),
    [user, online, loading, signIn, submitTotp, signOut, refresh],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = React.useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
