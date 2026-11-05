/**
 * AccountMenu.tsx — sign in, and show what the server says you are.
 *
 * The roles and entitlements rendered here are decoration. They come from
 * /api/auth/me, and every endpoint re-derives them from the session before it
 * acts, so editing anything on this page changes what you see and nothing you
 * can do. There is no token in localStorage to steal or forge: the session is
 * an httpOnly cookie this script cannot read.
 */
import * as React from 'react'
import { LogOut, ShieldCheck, User, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth'

const DEMO = [
  { email: 'cafe@knuckles.demo', note: 'licensed café — the only one CAFE25 works for' },
  { email: 'shopper@knuckles.demo', note: 'ordinary customer' },
  { email: 'staff@knuckles.demo', note: 'shop staff — outranks a customer, still no trade discount' },
]

export function AccountMenu() {
  const { user, online, loading, signIn, signOut, submitTotp } = useAuth()
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('demo-password-12345')
  const [error, setError] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [mfa, setMfa] = React.useState<{ pendingId: string; pendingToken: string } | null>(null)
  const [code, setCode] = React.useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const res = await signIn(email, password)
    setBusy(false)
    if (res.ok === true) {
      setOpen(false)
      setPassword('demo-password-12345')
    } else if (res.ok === 'mfa') {
      setMfa({ pendingId: res.pendingId, pendingToken: res.pendingToken })
    } else {
      setError(res.message)
    }
  }

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mfa) return
    setBusy(true)
    setError(null)
    const res = await submitTotp(mfa.pendingId, mfa.pendingToken, code)
    setBusy(false)
    if (res.ok === true) {
      setOpen(false)
      setMfa(null)
      setCode('')
    } else if (res.ok === false) {
      setError(res.message)
    }
  }

  if (!online) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-600/40 bg-amber-600/5 px-2.5 py-1.5 text-xs text-amber-700 dark:text-amber-500">
        <WifiOff className="size-3.5" />
        <span className="hidden sm:inline">API offline — start the backend on :4000</span>
        <span className="sm:hidden">API offline</span>
      </span>
    )
  }

  if (loading) {
    return (
      <span className="grid size-9 place-items-center" aria-label="Checking session">
        <Spinner className="size-4 text-muted-foreground" />
      </span>
    )
  }

  if (user) {
    const wholesale = user.entitlements?.wholesale === true
    return (
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
          <ShieldCheck className={wholesale ? 'size-3.5 text-emerald-600' : 'size-3.5'} />
          <span className="max-w-[14ch] truncate">{user.name || user.email}</span>
          {wholesale ? (
            <span className="rounded-full bg-emerald-600/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
              trade
            </span>
          ) : null}
        </span>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sign out"
          onClick={() => {
            void signOut()
          }}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <User className="size-4" />
          Sign in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[26rem]">
        <DialogHeader>
          <DialogTitle className="serif text-xl">Sign in</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">
            Against the real backend. The session comes back as an httpOnly cookie, so nothing
            here can read it — including this page.
          </DialogDescription>
        </DialogHeader>

        {mfa ? (
          <form onSubmit={submitCode} className="space-y-3">
            <p className="text-xs text-muted-foreground">
              This account has an authenticator enabled. Enter the six-digit code.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="totp">Authentication code</Label>
              <Input
                id="totp"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                className="font-mono"
                placeholder="000000"
                autoFocus
              />
            </div>
            {error ? (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Spinner className="size-4" /> : null}
              Verify
            </Button>
          </form>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cafe@knuckles.demo"
                autoComplete="username"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error ? (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Spinner className="size-4" /> : null}
              Sign in
            </Button>

            <Separator className="my-1" />
            <p className="text-[11px] text-muted-foreground">
              Demo accounts — password is prefilled:
            </p>
            <ul className="space-y-1">
              {DEMO.map((d) => (
                <li key={d.email}>
                  <button
                    type="button"
                    onClick={() => setEmail(d.email)}
                    className="w-full rounded-md px-2 py-1.5 text-left text-[11px] hover:bg-accent"
                  >
                    <span className="font-mono">{d.email}</span>
                    <span className="block text-muted-foreground">{d.note}</span>
                  </button>
                </li>
              ))}
            </ul>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
