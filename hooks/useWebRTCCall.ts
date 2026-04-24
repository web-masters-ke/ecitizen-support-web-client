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
  const remoteStreamRef = useRef<MediaStream | null>(null);
  // Keep callbacks in refs so the socket useEffect never needs to re-run
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
  const [isMuted, setIsMuted] = useState(false);

  // Connect WebSocket once
  useEffect(() => {
    if (!userId) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:4010';
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) return;

    const socket = io(`${apiUrl}/ws`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      socket.emit('subscribe', { channel: `user:${userId}` });
    });

    // Incoming call ring
    socket.on('call:ring', (data: IncomingCall) => {
      setStatus('ringing');
      setActiveCallLogId(data.callLogId);
      onIncomingCallRef.current?.(data);
      (socket as any)._pendingOffer = data;
    });

    // Callee answered — receive answer SDP
    socket.on('call:answer', async (data: { callLogId: string; answer: RTCSessionDescriptionInit }) => {
      if (!pcRef.current) return;
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      setStatus('connected');
      onConnectedRef.current?.(data.callLogId);
    });

    // ICE candidates from remote
    socket.on('call:ice', async (data: { candidate: RTCIceCandidateInit }) => {
      if (!pcRef.current) return;
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch { /* ignore stale candidates */ }
    });

    // Remote ended the call
    socket.on('call:hangup', (data: { callLogId: string }) => {
      hangupCleanup();
      setStatus('ended');
      onCallEndedRef.current?.(data.callLogId);
      setTimeout(() => setStatus('idle'), 2000);
    });

    // Remote rejected
    socket.on('call:reject', (data: { callLogId: string }) => {
      hangupCleanup();
      setStatus('ended');
      onCallRejectedRef.current?.(data.callLogId);
      setTimeout(() => setStatus('idle'), 2000);
    });

    socketRef.current = socket;
    return () => { socket.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const createPeerConnection = useCallback((targetUserId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
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
      e.streams[0]?.getTracks().forEach((t) => remoteMs.addTrack(t));
      remoteStreamRef.current = remoteMs;
      setRemoteStream(remoteMs);
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setStatus('ended');
        setTimeout(() => setStatus('idle'), 2000);
      }
    };

    pcRef.current = pc;
    return pc;
  }, []);

  const hangupCleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current = null;
    setRemoteStream(null);
  }, []);

  // Initiate outbound call
  const startCall = useCallback(async (opts: {
    targetUserId: string;
    callLogId: string;
    audioOnly?: boolean;
  }) => {
    if (!socketRef.current) return;
    setStatus('calling');
    setActiveCallLogId(opts.callLogId);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: opts.audioOnly ? false : true,
    });
    localStreamRef.current = stream;

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
  }, [createPeerConnection, userName]);

  // Answer incoming call
  const answerCall = useCallback(async (incomingCall: IncomingCall, audioOnly = true) => {
    if (!socketRef.current) return;
    setStatus('connected');
    setActiveCallLogId(incomingCall.callLogId);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: !audioOnly });
    localStreamRef.current = stream;

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
  }, [createPeerConnection]);

  // Reject incoming call
  const rejectCall = useCallback((incomingCall: IncomingCall) => {
    if (!socketRef.current) return;
    socketRef.current.emit('call:reject', {
      callerId: incomingCall.callerId,
      callLogId: incomingCall.callLogId,
    });
    setStatus('idle');
  }, []);

  // Hang up active call
  const hangup = useCallback((targetUserId: string) => {
    if (!socketRef.current || !activeCallLogId) return;
    socketRef.current.emit('call:hangup', { targetUserId, callLogId: activeCallLogId });
    hangupCleanup();
    setStatus('ended');
    setTimeout(() => setStatus('idle'), 1500);
  }, [activeCallLogId, hangupCleanup]);

  const toggleMute = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMuted((m) => !m);
  }, []);

  return {
    status,
    activeCallLogId,
    remoteStream,
    isMuted,
    startCall,
    answerCall,
    rejectCall,
    hangup,
    toggleMute,
  };
}
