'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { authApi } from '@/lib/api'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { OfflineBanner } from '@/components/ui/OfflineBanner'

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (password.length === 0) return { label: '', color: '', width: 'w-0' }
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[@$!%*?&#]/.test(password)
  const hasLength = password.length >= 8
  const score = [hasLower, hasUpper, hasNumber, hasSpecial, hasLength].filter(Boolean).length
  if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' }
  if (score <= 4) return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/3' }
  return { label: 'Strong', color: 'bg-green-500', width: 'w-full' }
}

const ACCOUNT_TYPES = [
  { value: 'CITIZEN', label: 'Citizen' },
  { value: 'ORGANIZATION', label: 'Organization' },
  { value: 'FOREIGNER', label: 'Foreigner' },
  { value: 'RESIDENT', label: 'Resident' },
  { value: 'REFUGEE', label: 'Refugee' },
]

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationalId: '',
    accountType: 'CITIZEN',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const strength = getPasswordStrength(form.password)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!PASSWORD_REGEX.test(form.password)) {
      setError('Password must include uppercase, lowercase, a number, and a special character (@$!%*?&#).')
      return
    }
    if (!agreed) { setError('Please accept the Terms of Service to continue.'); return }
    if (!navigator.onLine) { setError('No internet connection. Please check your network and try again.'); return }

    setLoading(true)
    try {
      let phoneNumber: string | undefined
      if (form.phone) {
        const p = form.phone.trim()
        if (p.startsWith('0') && p.length === 10) phoneNumber = '+254' + p.slice(1)
        else if (p.startsWith('+')) phoneNumber = p
        else phoneNumber = p
      }
      await authApi.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber,
        nationalId: form.nationalId.trim() || undefined,
        accountType: form.accountType,
        password: form.password,
      })
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      const errData = (err as { response?: { data?: { error?: { message?: string | string[] }; message?: string | string[] } } })?.response?.data
      const raw = errData?.error?.message ?? errData?.message ?? 'Registration failed. Please try again.'
      const msg = Array.isArray(raw) ? raw.join('. ') : raw
      setError(typeof msg === 'string' ? msg : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-border bg-card shadow-sm px-8 py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Account Created!</h2>
            <p className="text-muted-foreground mb-6">
              Your eCitizen account has been created successfully. Redirecting you to login…
            </p>
            <Link href="/login" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — Nairobi hero ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
        <Image
          src="/nairobi-bg.jpg"
          alt="Nairobi skyline"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f3d]/85 via-[#0a1f3d]/70 to-[#0a1f3d]/88" />

        {/* Kenya flag stripe */}
        <div className="absolute top-0 left-0 right-0 flex h-1.5 z-10">
          <div className="flex-1 bg-[#006600]" />
          <div className="flex-1 bg-[#cc0000]" />
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-[#cc0000]" />
          <div className="flex-1 bg-[#006600]" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-start px-12 py-20 text-white h-full">
          <Image
            src="/kenya-coat-of-arms.svg"
            alt="Kenya Coat of Arms"
            width={64}
            height={64}
            className="object-contain mb-6 drop-shadow-2xl"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50 mb-2">
            Republic of Kenya
          </p>
          <h1 className="text-3xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            Join eCitizen<br />Command Centre
          </h1>
          <p className="text-sm text-white/65 max-w-[240px] leading-relaxed mb-8">
            Access 200+ government services from anywhere. Fast, transparent, and secure.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              { n: '1', text: 'Create your account' },
              { n: '2', text: 'Verify your identity' },
              { n: '3', text: 'Access all services' },
            ].map(({ n, text }) => (
              <div key={n} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white backdrop-blur-sm">
                  {n}
                </div>
                <span className="text-sm text-white/75">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-5 left-0 right-0 z-10 text-center">
          <p className="text-[11px] text-white/30">&copy; {new Date().getFullYear()} Government of Kenya</p>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col bg-background overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/kenya-coat-of-arms.svg" alt="Kenya" width={28} height={28} className="object-contain" />
            <span className="text-sm font-bold text-foreground hidden sm:block">eCitizen Portal</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-lg">
            <div className="mb-7 text-center">
              <h2 className="text-2xl font-bold text-foreground">Create Your Account</h2>
              <p className="mt-1 text-sm text-muted-foreground">Submit and track government service requests</p>
            </div>

            <OfflineBanner />

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'firstName', label: 'First Name', placeholder: 'John' },
                  { id: 'lastName', label: 'Last Name', placeholder: 'Doe' },
                ].map(({ id, label, placeholder }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
                      {label} <span className="text-destructive">*</span>
                    </label>
                    <input
                      id={id} name={id} type="text" required
                      value={form[id as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  id="email" name="email" type="email" autoComplete="email" required
                  value={form.email} onChange={handleChange} placeholder="john@example.com"
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* Phone + National ID */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                    Phone <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <input
                    id="phone" name="phone" type="tel"
                    value={form.phone} onChange={handleChange} placeholder="+254 7XX XXX XXX"
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label htmlFor="nationalId" className="block text-sm font-medium text-foreground mb-1.5">
                    National ID <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <input
                    id="nationalId" name="nationalId" type="text"
                    value={form.nationalId} onChange={handleChange} placeholder="e.g. 12345678"
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              {/* Account Type */}
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium text-foreground mb-1.5">
                  Account Type <span className="text-destructive">*</span>
                </label>
                <select
                  id="accountType" name="accountType"
                  value={form.accountType}
                  onChange={(e) => setForm((prev) => ({ ...prev, accountType: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {ACCOUNT_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                  Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password" name="password" type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password" required
                    value={form.password} onChange={handleChange} placeholder="Min. 8 characters"
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Strength: <span className="font-medium text-foreground">{strength.label}</span>
                      {': '}uppercase, lowercase, number &amp; special char
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
                  Confirm Password <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password" required
                    value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter password"
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="mt-1 text-xs text-destructive">Passwords do not match</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input id="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-input accent-primary" />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{' '}
                  <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Creating account…</>
                ) : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">Login here</Link>
            </p>
          </div>
        </div>

        <p className="py-4 text-center text-xs text-muted-foreground border-t border-border shrink-0" suppressHydrationWarning>
          &copy; {new Date().getFullYear()} Republic of Kenya. All rights reserved.
        </p>
      </div>
    </div>
  )
}
