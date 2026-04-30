/**
 * eCitizen SSO helpers — PKCE generation + auth flow kickoff.
 * Browser-only. Don't import from server components.
 */

const SS_CODE_VERIFIER = 'ecitizen.code_verifier'
const SS_STATE = 'ecitizen.state'
const SS_RETURN_TO = 'ecitizen.return_to'
const SS_CACHED_URL = 'ecitizen.cached_url'
const SS_CACHED_AT = 'ecitizen.cached_at'
// eCitizen state params expire in 5–10 min; we refresh a minute early to be safe
const CACHE_TTL_MS = 4 * 60 * 1000

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'

// ── PKCE primitives ──────────────────────────────────────────────────────────

function base64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let s = ''
  for (let i = 0; i < bytes.byteLength; i++) s += String.fromCharCode(bytes[i])
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function randomString(len: number): string {
  const bytes = new Uint8Array(len)
  crypto.getRandomValues(bytes)
  return base64url(bytes.buffer).slice(0, len)
}

async function sha256(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Pre-build the eCitizen authorize URL and stash the PKCE state in
 * sessionStorage. Call this on page mount so the user's click is an
 * instant navigation with zero network wait.
 *
 * Returns the URL the browser should navigate to when the user clicks
 * Sign in with eCitizen.
 */
export async function prepareECitizenSignIn(returnTo: string = '/dashboard'): Promise<string> {
  // If the user pressed Back from eCitizen and the PKCE state + cached URL are
  // still valid, return instantly — no network round-trip needed.
  const cachedUrl = sessionStorage.getItem(SS_CACHED_URL)
  const cachedAt = Number(sessionStorage.getItem(SS_CACHED_AT) ?? 0)
  const stateStillValid =
    sessionStorage.getItem(SS_CODE_VERIFIER) &&
    sessionStorage.getItem(SS_STATE)
  if (cachedUrl && stateStillValid && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedUrl
  }

  const codeVerifier = randomString(64)
  const codeChallenge = base64url(await sha256(codeVerifier))
  const state = randomString(32)

  sessionStorage.setItem(SS_CODE_VERIFIER, codeVerifier)
  sessionStorage.setItem(SS_STATE, state)
  sessionStorage.setItem(SS_RETURN_TO, returnTo)

  const params = new URLSearchParams({ state, codeChallenge })
  const res = await fetch(`${API_BASE}/auth/ecitizen/authorize-url?${params}`)
  if (!res.ok) throw new Error('Could not start eCitizen sign-in')
  const data = await res.json()
  const url: string = data?.data?.url ?? data?.url
  if (!url) throw new Error('No authorize URL returned')

  sessionStorage.setItem(SS_CACHED_URL, url)
  sessionStorage.setItem(SS_CACHED_AT, String(Date.now()))

  return url
}

/**
 * Kick off the eCitizen sign-in flow. Convenience wrapper around
 * prepareECitizenSignIn that immediately navigates. Used when no
 * URL was prefetched.
 *
 * @param returnTo  Optional path to send the user to after successful sign-in
 *                  (e.g. /dashboard). Default: /dashboard.
 */
export async function signInWithECitizen(returnTo: string = '/dashboard'): Promise<void> {
  const url = await prepareECitizenSignIn(returnTo)
  window.location.assign(url)
}

/**
 * Read state, code_verifier, and return-to from sessionStorage. Called from
 * the callback page. Returns null if the flow is not in progress.
 */
export function readPendingFlow(): {
  codeVerifier: string
  state: string
  returnTo: string
} | null {
  const codeVerifier = sessionStorage.getItem(SS_CODE_VERIFIER)
  const state = sessionStorage.getItem(SS_STATE)
  const returnTo = sessionStorage.getItem(SS_RETURN_TO) ?? '/dashboard'
  if (!codeVerifier || !state) return null
  return { codeVerifier, state, returnTo }
}

export function clearPendingFlow(): void {
  sessionStorage.removeItem(SS_CODE_VERIFIER)
  sessionStorage.removeItem(SS_STATE)
  sessionStorage.removeItem(SS_RETURN_TO)
  sessionStorage.removeItem(SS_CACHED_URL)
  sessionStorage.removeItem(SS_CACHED_AT)
}

/** Exchange the code with our backend. Returns access + refresh tokens + user. */
export async function exchangeCode(opts: {
  code: string
  codeVerifier: string
  redirectUri: string
}): Promise<{
  accessToken: string
  refreshToken: string
  user: Record<string, unknown>
}> {
  const res = await fetch(`${API_BASE}/auth/ecitizen/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      err?.message || err?.error?.message || `Exchange failed (HTTP ${res.status})`,
    )
  }
  const data = await res.json()
  return data?.data ?? data
}
