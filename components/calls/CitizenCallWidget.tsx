'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Phone, PhoneOff, PhoneMissed, Mic, MicOff, Minimize2 } from 'lucide-react'
import { useWebRTCCall, type IncomingCall } from '@/hooks/useWebRTCCall'
import { callsApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function CitizenCallWidget() {
  const { user, isAuthenticated } = useAuth()
  const [incoming, setIncoming] = useState<IncomingCall | null>(null)
  const [minimised, setMinimised] = useState(false)
  const [duration, setDuration] = useState(0)
  const [callLogId, setCallLogId] = useState<string | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setDuration(0)
  }, [])

  const { status, isMuted, remoteStream, answerCall, rejectCall, hangup, toggleMute } = useWebRTCCall({
    userId: user?.id ?? '',
    userName: user ? `${user.firstName} ${user.lastName}` : 'Citizen',
    onIncomingCall: (call) => setIncoming(call),
    onConnected: (logId) => {
      startTimer()
      setCallLogId(logId)
      callsApi.updateStatus(logId, 'ANSWERED').catch(() => {})
    },
    onCallEnded: (logId) => {
      const dur = Math.floor((Date.now() - startTimeRef.current) / 1000)
      stopTimer()
      callsApi.updateStatus(logId, 'ENDED', dur).catch(() => {})
      setCallLogId(null)
      setIncoming(null)
    },
    onCallRejected: (logId) => {
      stopTimer()
      callsApi.updateStatus(logId, 'MISSED').catch(() => {})
      setCallLogId(null)
      setIncoming(null)
    },
  })

  useEffect(() => {
    if (remoteStream && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream
      remoteAudioRef.current.play().catch(() => {})
    }
  }, [remoteStream])

  const handleAnswer = async () => {
    if (!incoming) return
    await answerCall(incoming, true)
    setIncoming(null)
  }

  const handleReject = () => {
    if (!incoming) return
    rejectCall(incoming)
    callsApi.updateStatus(incoming.callLogId, 'MISSED').catch(() => {})
    setIncoming(null)
  }

  const handleHangup = () => {
    if (!incoming && status !== 'connected') return
    const targetId = incoming?.callerId ?? ''
    hangup(targetId)
    stopTimer()
    if (callLogId) callsApi.updateStatus(callLogId, 'ENDED', duration).catch(() => {})
    setCallLogId(null)
    setIncoming(null)
  }

  // Only render when authenticated and something is happening
  if (!isAuthenticated || !user?.id) return <audio ref={remoteAudioRef} autoPlay hidden />
  if (status === 'idle' && !incoming) return <audio ref={remoteAudioRef} autoPlay hidden />

  const isActive = status === 'connected'
  const isRinging = !!incoming || status === 'ringing'

  return (
    <>
      <audio ref={remoteAudioRef} autoPlay hidden />

      <div className={`fixed bottom-6 right-6 z-[9999] rounded-2xl shadow-2xl border border-border bg-white transition-all duration-300 ${minimised ? 'w-14 h-14' : isRinging ? 'w-80' : 'w-72'}`}>
        {minimised ? (
          <button
            onClick={() => setMinimised(false)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isActive ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}
          >
            <Phone className="h-5 w-5 text-white" />
          </button>
        ) : (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {isRinging && incoming ? incoming.callerName : 'eCitizen Support'}
                </p>
                <p className={`text-xs ${isActive ? 'text-green-600' : 'text-amber-600'}`}>
                  {isActive ? formatDuration(duration) : isRinging ? 'Incoming call from support agent' : 'Connecting…'}
                </p>
              </div>
              {isActive && (
                <button onClick={() => setMinimised(true)} className="text-gray-400 hover:text-gray-700 p-1 rounded">
                  <Minimize2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Ringing animation */}
            {isRinging && !isActive && (
              <div className="flex justify-center py-2">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full bg-amber-100 animate-ping absolute inset-0" />
                  <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center relative">
                    <Phone className="h-7 w-7 text-amber-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Active call timer */}
            {isActive && (
              <div className="flex items-center justify-center gap-2 py-1">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-lg font-mono font-semibold text-foreground">{formatDuration(duration)}</span>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3 justify-center">
              {isRinging && !isActive && (
                <>
                  <button onClick={handleReject} className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center" title="Decline">
                    <PhoneMissed className="h-5 w-5 text-white" />
                  </button>
                  <button onClick={handleAnswer} className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center animate-pulse" title="Answer">
                    <Phone className="h-5 w-5 text-white" />
                  </button>
                </>
              )}
              {isActive && (
                <>
                  <button
                    onClick={toggleMute}
                    className={`h-11 w-11 rounded-full flex items-center justify-center ${isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                  <button onClick={handleHangup} className="h-11 w-11 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center" title="Hang up">
                    <PhoneOff className="h-5 w-5 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
