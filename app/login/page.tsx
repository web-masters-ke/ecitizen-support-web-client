'use client'
import { Suspense, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { OfflineBanner } from '@/components/ui/OfflineBanner'
import { prepareECitizenSignIn, signInWithECitizen } from '@/lib/auth/ecitizen'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') ?? '/dashboard'

  const [ssoLoading, setSsoLoading] = useState(false)
  const [error, setError] = useState('')
  const prefetchedUrlRef = useRef<string | null>(null)

  // Prefetch the authorize URL on mount. When the user clicks the button
  // we navigate instantly — no network round-trip in the click path.
  useEffect(() => {
    let cancelled = false
    prepareECitizenSignIn(redirectTo)
      .then((url) => { if (!cancelled) prefetchedUrlRef.current = url })
      .catch(() => { /* fallback to lazy fetch in handleSsoClick */ })
    return () => { cancelled = true }
  }, [redirectTo])

  const handleSsoClick = async () => {
    if (ssoLoading) return // guard against double-click while we're already redirecting
    setError('')
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network and try again.')
      return
    }
    setSsoLoading(true)

    // Fast path: prefetched URL is ready, navigate instantly
    const prefetched = prefetchedUrlRef.current
    if (prefetched) {
      window.location.assign(prefetched)
      return
    }

    // Fallback: prefetch failed, do it now
    try {
      await signInWithECitizen(redirectTo)
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

        {/* Branding content — horizontally + vertically centered */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-14 text-white">
          <div className="max-w-md flex flex-col items-center text-center">
            <Image
              src="/kenya-coat-of-arms.svg"
              alt="Kenya Coat of Arms"
              width={120}
              height={120}
              className="object-contain mb-6 drop-shadow-2xl"
              priority
            />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60 mb-2">
              Republic of Kenya
            </p>
            <h1 className="text-4xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              eCitizen<br />Command Centre
            </h1>
            <p className="text-base text-white/75 max-w-xs leading-relaxed mb-10">
              Your portal to submit, track, and resolve government service requests, fast.
            </p>

            {/* Stats row */}
            <div className="flex gap-8">
              {[
                { value: '47', label: 'Counties' },
                { value: '200+', label: 'Services' },
                { value: '24/7', label: 'Support' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-extrabold text-white">{value}</p>
                  <p className="text-xs text-white/55 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom attribution */}
        <div className="absolute bottom-5 left-0 right-0 z-10 text-center">
          <p className="text-[11px] text-white/30">&copy; {new Date().getFullYear()} Government of Kenya</p>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
      <div className="relative flex flex-1 flex-col bg-gradient-to-br from-background via-background to-[#14b04c]/[0.04]">
        {/* Soft animated background blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#14b04c]/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-[#e7191b]/[0.06] blur-3xl" />
        </div>

        {/* Theme toggle (top-right) */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Mobile-only logo */}
            <div className="flex justify-center mb-8 lg:hidden">
              <Image src="/ecitizen-logo.png" alt="eCitizen Kenya" width={200} height={42} className="object-contain" />
            </div>

            {/* Verified badge */}
            <div className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#14b04c]/25 bg-[#14b04c]/10 px-3.5 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14b04c] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14b04c]" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#14b04c]">
                  Government-verified sign-in
                </span>
              </div>
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome back</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Use your eCitizen account to access the<br className="hidden sm:block" /> Service Command Centre.
              </p>
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
              className="group relative w-full flex items-center justify-center gap-3 rounded-xl px-4 py-4 text-base font-semibold text-white disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 shadow-[0_8px_24px_-8px_rgba(20,176,76,0.5)] hover:shadow-[0_12px_28px_-8px_rgba(20,176,76,0.65)] disabled:shadow-none disabled:opacity-90"
              style={{ background: '#14b04c' }}
            >
              {/* Subtle gloss */}
              <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent" />

              {ssoLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Redirecting to eCitizen…
                </>
              ) : (
                <>
                  <span className="flex items-center justify-center h-7 w-7 rounded-md bg-white shadow-sm">
                    <Image
                      src="/ecitizen-logo.png"
                      alt=""
                      width={24}
                      height={24}
                      className="h-5 w-auto object-contain"
                    />
                  </span>
                  Sign in with eCitizen
                </>
              )}
            </button>

            {/* Step preview — what happens next */}
            <div className="mt-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                What happens next
              </p>
              <ol className="space-y-2.5 text-xs text-foreground">
                {[
                  'You are redirected to accounts.ecitizen.go.ke',
                  'You authorise the Command Centre to read your basic profile',
                  'You return here, signed in and ready to raise tickets',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#14b04c]/15 text-[10px] font-bold text-[#14b04c]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Don&apos;t have an eCitizen account?{' '}
              <a
                href="https://accounts.ecitizen.go.ke/en/sign-up"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                style={{ color: '#14b04c' }}
              >
                Create one at eCitizen
              </a>
            </p>
          </div>
        </div>

        <p className="relative z-10 py-4 text-center text-xs text-muted-foreground border-t border-border/60" suppressHydrationWarning>
          &copy; {new Date().getFullYear()} Republic of Kenya · eCitizen Service Command Centre
        </p>

        {/* Bottom-right eCitizen brand mark (desktop only — mobile already shows it inline above the form) */}
        <div className="absolute bottom-20 right-8 hidden lg:block">
          <Image
            src="/ecitizen-logo.png"
            alt="eCitizen Kenya"
            width={180}
            height={38}
            className="h-9 w-auto object-contain opacity-95"
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
