'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';

export interface IncomingCall {
  callLogId: string;
  callerId: string;
  callerName: string;
  offer: RTCSessionDescriptionInit;
}

interface UseWebRTCCallOptions {
  userId: string;
  userName: string;
  onIncomingCall?: (call: IncomingCall) => void;
  onCallEnded?: (callLogId: string) => void;
  onCallRejected?: (callLogId: string) => void;
  onConnected?: (callLogId: string) => void;
}

const AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  channelCount: 1,
};

// TURN creds — env preferred, with hardcoded fallback so calls work even when
// NEXT_PUBLIC_ vars weren't injected at build time. Update both .env.example
// and these fallbacks together when rotating.
const XIRSYS_USERNAME = process.env.NEXT_PUBLIC_XIRSYS_USERNAME
  || 'nLwh8A66HieRxOQkp7d2jgUZbWlo91O45cGV4vCSzZ467LS7NYPL1XnLFe83yzXMAAAAAGnqX1B3YXNhYWNoYXQ=';
const XIRSYS_CREDENTIAL = process.env.NEXT_PUBLIC_XIRSYS_CREDENTIAL
  || 'f452fc82-3f3e-11f1-8ef6-0242ac140004';
const EXPRESS_TURN_USERNAME = process.env.NEXT_PUBLIC_EXPRESS_TURN_USERNAME
  || '000000002092881791';
const EXPRESS_TURN_CREDENTIAL = process.env.NEXT_PUBLIC_EXPRESS_TURN_CREDENTIAL
  || '42y+MSLrgrTEI6/1NajKnh9KlY8=';

const ICE_SERVERS: RTCIceServer[] = [
  // Google STUN (free, always-on fallback)
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
  // ExpressTURN — primary (free tier 1TB/mo, GeoDNS auto-routing)
  {
    username: EXPRESS_TURN_USERNAME,
    credential: EXPRESS_TURN_CREDENTIAL,
    urls: [
      'turn:free.expressturn.com:3478?transport=udp',
      'turn:free.expressturn.com:3478?transport=tcp',
    ],
  },
  // Xirsys STUN
  { urls: 'stun:bn-turn1.xirsys.com' },
  // Xirsys TURN — secondary, all transports
  {
    username: XIRSYS_USERNAME,
    credential: XIRSYS_CREDENTIAL,
    urls: [
      'turn:bn-turn1.xirsys.com:80?transport=udp',
      'turn:bn-turn1.xirsys.com:3478?transport=udp',
      'turn:bn-turn1.xirsys.com:80?transport=tcp',
      'turn:bn-turn1.xirsys.com:3478?transport=tcp',
      'turns:bn-turn1.xirsys.com:443?transport=tcp',
      'turns:bn-turn1.xirsys.com:5349?transport=tcp',
    ],
  },
];

export function useWebRTCCall({
  userId,
  userName,
  onIncomingCall,
  onCallEnded,
  onCallRejected,
  onConnected,
}: UseWebRTCCallOptions) {
  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const activeCallLogIdRef = useRef<string | null>(null);
  const targetUserIdRef = useRef<string | null>(null);

  const onIncomingCallRef = useRef(onIncomingCall);
  const onCallEndedRef = useRef(onCallEnded);
  const onCallRejectedRef = useRef(onCallRejected);
  const onConnectedRef = useRef(onConnected);
  useEffect(() => { onIncomingCallRef.current = onIncomingCall; }, [onIncomingCall]);
  useEffect(() => { onCallEndedRef.current = onCallEnded; }, [onCallEnded]);
  useEffect(() => { onCallRejectedRef.current = onCallRejected; }, [onCallRejected]);
  useEffect(() => { onConnectedRef.current = onConnected; }, [onConnected]);

  const [status, setStatus] = useState<CallStatus>('idle');
  const [activeCallLogId, setActiveCallLogId] = useState<string | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const setCallLogId = useCallback((id: string | null) => {
    activeCallLogIdRef.current = id;
    setActiveCallLogId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:4010';
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) return;

    const socket = io(`${apiUrl}/ws`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('call:ring', (data: IncomingCall) => {
      setStatus('ringing');
      setCallLogId(data.callLogId);
      onIncomingCallRef.current?.(data);
    });

    socket.on('call:answer', async (data: { callLogId: string; answer: RTCSessionDescriptionInit }) => {
      if (!pcRef.current) return;
      try {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        setStatus('connected');
        onConnectedRef.current?.(data.callLogId);
      } catch { /* stale */ }
    });

    socket.on('call:ice', async (data: { candidate: RTCIceCandidateInit }) => {
      if (!pcRef.current) return;
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch { /* ignore stale */ }
    });

    socket.on('call:hangup', (data: { callLogId: string }) => {
      const logId = data.callLogId;
      hangupCleanup();
      setStatus('ended');
      onCallEndedRef.current?.(logId);
      setTimeout(() => setStatus('idle'), 1500);
    });

    socket.on('call:reject', (data: { callLogId: string }) => {
      const logId = data.callLogId;
      hangupCleanup();
      setStatus('ended');
      onCallRejectedRef.current?.(logId);
      setTimeout(() => setStatus('idle'), 1500);
    });

    socketRef.current = socket;
    return () => { socket.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const createPeerConnection = useCallback((targetUserId: string) => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    const pc = new RTCPeerConnection({
      iceServers: ICE_SERVERS,
      iceCandidatePoolSize: 10,
    });

    pc.onicecandidate = (e) => {
      if (e.candidate && socketRef.current) {
        socketRef.current.emit('call:ice', {
          targetUserId,
          candidate: e.candidate.toJSON(),
        });
      }
    };

    const remoteMs = new MediaStream();
    pc.ontrack = (e) => {
      e.streams[0]?.getTracks().forEach((t) => {
        if (!remoteMs.getTrackById(t.id)) remoteMs.addTrack(t);
      });
      setRemoteStream(new MediaStream(remoteMs.getTracks()));
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        hangupCleanup();
        setStatus('ended');
        setTimeout(() => setStatus('idle'), 1500);
      }
    };

    pcRef.current = pc;
    return pc;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hangupCleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    setIsMuted(false);
    setIsCameraOn(false);
    setCallLogId(null);
    targetUserIdRef.current = null;
  }, [setCallLogId]);

  const startCall = useCallback(async (opts: {
    targetUserId: string;
    callLogId: string;
    audioOnly?: boolean;
  }) => {
    if (!socketRef.current) return;
    targetUserIdRef.current = opts.targetUserId;
    setStatus('calling');
    setCallLogId(opts.callLogId);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: AUDIO_CONSTRAINTS,
      video: opts.audioOnly ? false : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
    });
    localStreamRef.current = stream;
    setLocalStream(stream);
    setIsCameraOn(!opts.audioOnly && stream.getVideoTracks().length > 0);

    const pc = createPeerConnection(opts.targetUserId);
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socketRef.current.emit('call:offer', {
      targetUserId: opts.targetUserId,
      offer,
      callLogId: opts.callLogId,
      callerName: userName,
    });
  }, [createPeerConnection, userName, setCallLogId]);

  const answerCall = useCallback(async (incomingCall: IncomingCall, audioOnly = true) => {
    if (!socketRef.current) return;
    targetUserIdRef.current = incomingCall.callerId;
    setStatus('connected');
    setCallLogId(incomingCall.callLogId);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: AUDIO_CONSTRAINTS,
      video: audioOnly ? false : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
    });
    localStreamRef.current = stream;
    setLocalStream(stream);
    setIsCameraOn(!audioOnly && stream.getVideoTracks().length > 0);

    const pc = createPeerConnection(incomingCall.callerId);
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socketRef.current.emit('call:answer', {
      callerId: incomingCall.callerId,
      answer,
      callLogId: incomingCall.callLogId,
    });
    onConnectedRef.current?.(incomingCall.callLogId);
  }, [createPeerConnection, setCallLogId]);

  const rejectCall = useCallback((incomingCall: IncomingCall) => {
    if (!socketRef.current) return;
    socketRef.current.emit('call:reject', {
      callerId: incomingCall.callerId,
      callLogId: incomingCall.callLogId,
    });
    setStatus('idle');
    setCallLogId(null);
  }, [setCallLogId]);

  const hangup = useCallback((targetUserId: string) => {
    const logId = activeCallLogIdRef.current;
    if (socketRef.current && logId) {
      socketRef.current.emit('call:hangup', { targetUserId, callLogId: logId });
    }
    hangupCleanup();
    setStatus('idle');
  }, [hangupCleanup]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !newMuted; });
      return newMuted;
    });
  }, []);

  const toggleCamera = useCallback(async () => {
    const stream = localStreamRef.current;
    const pc = pcRef.current;
    const targetId = targetUserIdRef.current;
    const existingVideoTracks = stream?.getVideoTracks() ?? [];

    if (existingVideoTracks.length > 0) {
      const newEnabled = !existingVideoTracks[0].enabled;
      existingVideoTracks.forEach((t) => { t.enabled = newEnabled; });
      setIsCameraOn(newEnabled);
    } else if (stream && pc && targetId) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        });
        const videoTrack = videoStream.getVideoTracks()[0];
        stream.addTrack(videoTrack);
        localStreamRef.current = stream;
        setLocalStream(new MediaStream(stream.getTracks()));

        const existingSender = pc.getSenders().find((s) => s.track?.kind === 'video');
        if (existingSender) {
          await existingSender.replaceTrack(videoTrack);
        } else {
          pc.addTrack(videoTrack, stream);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socketRef.current?.emit('call:offer', {
            targetUserId: targetId,
            offer,
            callLogId: activeCallLogIdRef.current,
            callerName: userName,
          });
        }
        setIsCameraOn(true);
      } catch {
        // Camera permission denied
      }
    }
  }, [userName]);

  return {
    status,
    activeCallLogId,
    remoteStream,
    localStream,
    isMuted,
    isCameraOn,
    startCall,
    answerCall,
    rejectCall,
    hangup,
    toggleMute,
    toggleCamera,
  };
}
