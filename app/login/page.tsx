'use client'
import { Suspense, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { OfflineBanner } from '@/components/ui/OfflineBanner'
import { signInWithECitizen } from '@/lib/auth/ecitizen'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/dashboard'

  const [ssoLoading, setSsoLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSsoClick = async () => {
    if (ssoLoading) return // guard against double-click while we're already redirecting
    setError('')
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network and try again.')
      return
    }
    setSsoLoading(true)
    try {
      await signInWithECitizen(redirectTo)
      // signInWithECitizen calls window.location.assign — page is unloading.
      // We leave ssoLoading=true so the button stays disabled until navigation.
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Could not start eCitizen sign-in',
      )
      setSsoLoading(false)
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

            {/* Sign in with eCitizen — the only path */}
            <button
              type="button"
              onClick={handleSsoClick}
              disabled={ssoLoading}
              className="w-full flex items-center justify-center gap-3 rounded-lg px-4 py-3.5 text-sm font-semibold text-white disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm"
              style={{ background: '#14b04c' }}
            >
              {ssoLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Redirecting to eCitizen…
                </>
              ) : (
                <>
                  <Image
                    src="/ecitizen-logo.png"
                    alt=""
                    width={22}
                    height={22}
                    className="h-5 w-5 object-contain bg-white rounded-sm p-0.5"
                  />
                  Sign in with eCitizen
                </>
              )}
            </button>

            <p className="mt-5 text-center text-xs text-muted-foreground leading-relaxed">
              You will be redirected to <span className="font-medium text-foreground">accounts.ecitizen.go.ke</span> to verify your identity, then brought back here.
            </p>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Don&apos;t have an eCitizen account?{' '}
              <a
                href="https://accounts.ecitizen.go.ke/en/sign-up"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
                style={{ color: '#14b04c' }}
              >
                Create one at eCitizen
              </a>
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
