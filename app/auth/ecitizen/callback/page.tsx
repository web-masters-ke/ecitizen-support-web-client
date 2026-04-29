'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import {
  readPendingFlow,
  clearPendingFlow,
  exchangeCode,
} from '@/lib/auth/ecitizen'

function FlagDivider() {
  return (
    <div className="flex h-1 w-full my-6">
      <div className="flex-1 bg-black" />
      <div className="flex-1 bg-[#e7191b]" />
      <div className="flex-1 bg-[#14b04c]" />
    </div>
  )
}

function CallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'pending' | 'error' | 'success'>('pending')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // eCitizen returned an error (user denied, etc.)
    if (error) {
      setStatus('error')
      setErrorMsg(errorDescription || error)
      clearPendingFlow()
      return
    }

    if (!code || !state) {
      setStatus('error')
      setErrorMsg('Authorization code or state missing from the callback URL.')
      return
    }

    const pending = readPendingFlow()
    if (!pending) {
      setStatus('error')
      setErrorMsg(
        'No pending sign-in flow was found in this browser. Please start sign-in again.',
      )
      return
    }

    if (pending.state !== state) {
      setStatus('error')
      setErrorMsg(
        'Security check failed (state mismatch). Please start sign-in again.',
      )
      clearPendingFlow()
      return
    }

    const redirectUri = `${window.location.origin}/auth/ecitizen/callback`

    exchangeCode({ code, codeVerifier: pending.codeVerifier, redirectUri })
      .then((data) => {
        // Persist tokens (same shape as email/password login uses)
        if (data?.accessToken) localStorage.setItem('accessToken', data.accessToken)
        if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
        if (data?.user) localStorage.setItem('user', JSON.stringify(data.user))

        const target = pending.returnTo
        clearPendingFlow()
        setStatus('success')
        // Small delay so the success state is visible
        setTimeout(() => router.replace(target), 600)
      })
      .catch((err: Error) => {
        setStatus('error')
        setErrorMsg(err?.message || 'Could not complete sign-in. Please try again.')
        clearPendingFlow()
      })
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-8 py-10 text-center">
        <div className="flex justify-center mb-2">
          <Image
            src="/ecitizen-logo.png"
            alt="eCitizen Kenya"
            width={200}
            height={42}
            className="object-contain"
          />
        </div>
        <FlagDivider />

        {status === 'pending' && (
          <>
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400 mb-3" />
            <h1 className="text-xl font-bold text-gray-900">Signing you in</h1>
            <p className="mt-1 text-sm text-gray-500">
              Verifying your eCitizen authorization.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: '#f0fdf4' }}>
              <CheckCircle2 className="w-8 h-8" style={{ color: '#14b04c' }} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">You are signed in</h1>
            <p className="mt-1 text-sm text-gray-500">Redirecting you to the dashboard.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: '#fef2f2' }}>
              <AlertCircle className="w-8 h-8" style={{ color: '#e7191b' }} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Sign-in could not complete</h1>
            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{errorMsg}</p>
            <button
              type="button"
              onClick={() => router.replace('/login')}
              className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white"
              style={{ background: '#14b04c' }}
            >
              Back to sign in
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function ECitizenCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  )
}
