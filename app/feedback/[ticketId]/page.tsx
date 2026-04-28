'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'

async function submitFeedback(ticketId: string, payload: { rating: number; feedback?: string }) {
  await axios.post(`${API_BASE}/tickets/${ticketId}/feedback`, payload)
}

/* ── Kenya flag divider ─────────────────────────────────────────────────────── */
function FlagDivider() {
  return (
    <div className="flex h-1 w-full my-6">
      <div className="flex-1 bg-black" />
      <div className="flex-1 bg-[#e7191b]" />
      <div className="flex-1 bg-[#14b04c]" />
    </div>
  )
}

/* ── Star Rating ────────────────────────────────────────────────────────────── */
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="w-14 h-14 rounded-xl border-2 border-gray-200 flex items-center justify-center transition-all hover:border-yellow-400 hover:scale-105 focus:outline-none"
            style={{ borderColor: filled ? '#f59e0b' : undefined, background: filled ? '#fefce8' : 'white' }}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill={filled ? '#f59e0b' : 'none'} stroke={filled ? '#f59e0b' : '#d1d5db'} strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

/* ── NPS Slider ─────────────────────────────────────────────────────────────── */
function NpsSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #14b04c ${(value / 5) * 100}%, #e5e7eb ${(value / 5) * 100}%)`,
          accentColor: '#14b04c',
        }}
      />
      <div className="flex justify-between mt-2">
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <span key={n} className="text-sm text-gray-500 font-medium">{n}</span>
        ))}
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function FeedbackPage() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const [rating, setRating] = useState(0)
  const [nps, setNps] = useState(3)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { setError('Please select a star rating.'); return }
    setError('')
    setLoading(true)
    try {
      const feedbackText = [
        `NPS: ${nps}/5`,
        comment.trim() ? comment.trim() : null,
      ].filter(Boolean).join('\n\n')
      await submitFeedback(ticketId, { rating, feedback: feedbackText || undefined })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-0">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image
              src="/kenya-coat-of-arms.png"
              alt="Republic of Kenya"
              width={56}
              height={56}
              className="object-contain"
            />
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight" style={{ color: '#14b04c' }}>e</span>
              <span className="text-2xl font-black tracking-tight text-gray-900">Citizen</span>
            </div>
          </div>

          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Rate your experience</h1>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              Please take a moment to rate your experience<br />with our service.
            </p>
          </div>

          <FlagDivider />
        </div>

        {submitted ? (
          /* ── Success state ── */
          <div className="px-8 pb-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#f0fdf4' }}>
              <CheckCircle2 className="w-8 h-8" style={{ color: '#14b04c' }} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Thank you!</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your feedback helps us improve government services for all Kenyans.
            </p>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            {/* Star rating */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">
                How satisfied are you with your experience? <span className="text-[#e7191b]">*</span>
              </p>
              <StarRating value={rating} onChange={setRating} />
            </div>

            {/* NPS slider */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-3">
                How likely are you to recommend us to others?
              </p>
              <NpsSlider value={nps} onChange={setNps} />
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Additional comments
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Please share any additional feedback or suggestions..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 resize-none"
                style={{ '--tw-ring-color': '#14b04c' } as React.CSSProperties}
              />
            </div>

            {error && (
              <p className="text-sm text-[#e7191b] font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all disabled:opacity-60"
              style={{ background: '#14b04c' }}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Submit Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
