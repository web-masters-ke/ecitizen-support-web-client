'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Phone, PhoneOff, PhoneMissed, Mic, MicOff, Video, VideoOff, Minimize2 } from 'lucide-react'
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
  const [activeCallerId, setActiveCallerId] = useState<string | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
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

  const {
    status, isMuted, isCameraOn, remoteStream, localStream,
    answerCall, rejectCall, hangup, toggleMute, toggleCamera,
  } = useWebRTCCall({
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
      setActiveCallerId(null)
      setIncoming(null)
    },
    onCallRejected: (logId) => {
      stopTimer()
      callsApi.updateStatus(logId, 'MISSED').catch(() => {})
      setCallLogId(null)
      setActiveCallerId(null)
      setIncoming(null)
    },
  })

  // Pipe remote stream to the correct element
  useEffect(() => {
    if (!remoteStream) return
    const hasVideo = remoteStream.getVideoTracks().length > 0
    if (hasVideo && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream
      remoteVideoRef.current.play().catch(() => {})
    } else if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream
      remoteAudioRef.current.play().catch(() => {})
    }
  }, [remoteStream])

  // Pipe local stream to local preview
  useEffect(() => {
    if (localStream && localVideoRef.current && localStream.getVideoTracks().length > 0) {
      localVideoRef.current.srcObject = localStream
      localVideoRef.current.play().catch(() => {})
    }
  }, [localStream, isCameraOn])

  const handleAnswer = async (withVideo = false) => {
    if (!incoming) return
    setActiveCallerId(incoming.callerId)
    await answerCall(incoming, !withVideo)
    setIncoming(null)
  }

  const handleReject = () => {
    if (!incoming) return
    rejectCall(incoming)
    callsApi.updateStatus(incoming.callLogId, 'MISSED').catch(() => {})
    setActiveCallerId(null)
    setIncoming(null)
  }

  const handleHangup = () => {
    const callerId = activeCallerId ?? incoming?.callerId
    if (!callerId) return
    const dur = duration
    const logId = callLogId
    hangup(callerId)
    stopTimer()
    if (logId) callsApi.updateStatus(logId, 'ENDED', dur).catch(() => {})
    setCallLogId(null)
    setActiveCallerId(null)
    setIncoming(null)
  }

  if (!isAuthenticated || !user?.id) return <audio ref={remoteAudioRef} autoPlay hidden />
  if (status === 'idle' && !incoming) return <audio ref={remoteAudioRef} autoPlay hidden />

  const isActive = status === 'connected'
  const isRinging = !!incoming || status === 'ringing'
  const hasRemoteVideo = (remoteStream?.getVideoTracks().length ?? 0) > 0
  const showVideo = isCameraOn || hasRemoteVideo

  return (
    <>
      <audio ref={remoteAudioRef} autoPlay hidden />

      <div
        className={`fixed z-[9999] rounded-2xl shadow-2xl border border-border bg-white transition-all duration-300 overflow-hidden ${
          isRinging && !isActive
            ? 'bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-80 sm:bottom-6 sm:right-6 sm:translate-x-0 sm:translate-y-0'
            : 'bottom-6 right-6'
        } ${minimised ? 'w-14 h-14' : showVideo && isActive ? 'w-80' : isRinging ? 'w-80' : 'w-72'}`}
      >
        {minimised ? (
          <button
            onClick={() => setMinimised(false)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isActive ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}
          >
            <Phone className="h-5 w-5 text-white" />
          </button>
        ) : (
          <div className="space-y-0">
            {/* Remote video */}
            {showVideo && isActive && (
              <div className="relative bg-black w-full h-48">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {isCameraOn && (
                  <div className="absolute bottom-2 right-2 w-20 h-28 rounded-lg overflow-hidden border-2 border-white shadow-lg bg-black">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                  </div>
                )}
              </div>
            )}

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

              {isActive && !showVideo && (
                <div className="flex items-center justify-center gap-2 py-1">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-lg font-mono font-semibold text-foreground">{formatDuration(duration)}</span>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                {isRinging && !isActive && (
                  <>
                    <button onClick={handleReject} className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center" title="Decline">
                      <PhoneMissed className="h-5 w-5 text-white" />
                    </button>
                    <button onClick={() => handleAnswer(false)} className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center animate-pulse" title="Answer">
                      <Phone className="h-5 w-5 text-white" />
                    </button>
                    <button onClick={() => handleAnswer(true)} className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center" title="Answer with video">
                      <Video className="h-5 w-5 text-white" />
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
                    <button
                      onClick={toggleCamera}
                      className={`h-11 w-11 rounded-full flex items-center justify-center ${isCameraOn ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
                    >
                      {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
