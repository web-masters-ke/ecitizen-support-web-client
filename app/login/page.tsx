'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { OfflineBanner } from '@/components/ui/OfflineBanner'
import { signInWithECitizen } from '@/lib/auth/ecitizen'

function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network and try again.')
      return
    }
    setLoading(true)
    try {
      await login(email, password)
      router.push(redirectTo)
    } catch (err: unknown) {
      const d = (err as { response?: { data?: { message?: string; error?: { message?: string } } } })?.response?.data
      const msg =
        d?.error?.message || d?.message ||
        'Invalid email or password. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — Nairobi hero ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <Image
          src="/nairobi-bg.jpg"
          alt="Nairobi skyline"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay — lighter at top, darker at bottom */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f3d]/80 via-[#0a1f3d]/65 to-[#0a1f3d]/85" />

        {/* Kenya flag stripe */}
        <div className="absolute top-0 left-0 right-0 flex h-1.5 z-10">
          <div className="flex-1 bg-[#006600]" />
          <div className="flex-1 bg-[#cc0000]" />
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-[#cc0000]" />
          <div className="flex-1 bg-[#006600]" />
        </div>

        {/* Branding content */}
        <div className="relative z-10 flex flex-col justify-center items-start px-14 py-20 text-white h-full">
          <Image
            src="/kenya-coat-of-arms.svg"
            alt="Kenya Coat of Arms"
            width={110}
            height={110}
            className="object-contain mb-6 drop-shadow-2xl"
            priority
          />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60 mb-2">
            Republic of Kenya
          </p>
          <h1 className="text-4xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            eCitizen<br />Command Centre
          </h1>
          <p className="text-base text-white/70 max-w-xs leading-relaxed mb-10">
            Your portal to submit, track, and resolve government service requests, fast.
          </p>

          {/* Stats row */}
          <div className="flex gap-8">
            {[
              { value: '47', label: 'Counties' },
              { value: '200+', label: 'Services' },
              { value: '24/7', label: 'Support' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-white/55 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom attribution */}
        <div className="absolute bottom-5 left-0 right-0 z-10 text-center">
          <p className="text-[11px] text-white/30">&copy; {new Date().getFullYear()} Government of Kenya</p>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col bg-background">
        {/* Theme toggle (top-right) */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-sm">
            {/* Mobile-only logo (left panel hidden below lg) */}
            <div className="flex justify-center mb-6 lg:hidden">
              <Image src="/ecitizen-logo.png" alt="eCitizen Kenya" width={200} height={42} className="object-contain" />
            </div>

            <div className="mb-7 text-center">
              <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to your eCitizen account</p>
            </div>

            <OfflineBanner />

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Sign in with eCitizen — primary path */}
            <button
              type="button"
              onClick={async () => {
                try {
                  setError('')
                  await signInWithECitizen(redirectTo)
                } catch (e) {
                  setError(
                    e instanceof Error
                      ? e.message
                      : 'Could not start eCitizen sign-in',
                  )
                }
              }}
              className="mb-5 w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-card hover:bg-muted px-4 py-3 text-sm font-semibold text-foreground transition-colors"
            >
              <Image
                src="/ecitizen-logo.png"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
              Sign in with eCitizen
            </button>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or sign in with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <Link href="/forgot-password" className="text-xs hover:underline" style={{ color: '#14b04c' }}>
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                style={{ background: '#14b04c' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>

        <p className="py-4 text-center text-xs text-muted-foreground border-t border-border" suppressHydrationWarning>
          &copy; {new Date().getFullYear()} Republic of Kenya. All rights reserved.
        </p>

        {/* Bottom-right eCitizen brand mark (desktop only — mobile already shows it inline above the form) */}
        <div className="absolute bottom-12 right-6 hidden lg:block">
          <Image
            src="/ecitizen-logo.png"
            alt="eCitizen Kenya"
            width={140}
            height={30}
            className="h-7 w-auto object-contain opacity-90"
          />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
