import { useRef, useState } from 'react';

interface PeerConnection {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
}

export function useWebRTC() {
  const [peerConnection, setPeerConnection] = useState<PeerConnection>({
    localStream: null,
    remoteStream: null,
    isConnected: false,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize local media stream
  const initializeMedia = async () => {
    try {
      setError(null);

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('WebRTC is not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setPeerConnection(prev => ({ ...prev, localStream: stream }));

      // Simulate remote connection for demo
      // In production, this would use WebRTC signaling
      setTimeout(() => {
        simulateRemoteConnection(stream);
      }, 2000);

      return stream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error accessing media devices';
      console.error('Media error:', errorMessage);
      setError(errorMessage);
      throw err;
    }
  };

  // Simulate remote connection (for demo purposes)
  const simulateRemoteConnection = (localStream: MediaStream) => {
    // In production, this would be replaced with actual WebRTC peer connection
    // For now, we'll mirror the local stream as remote
    const remoteStream = localStream.clone();

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }

    setPeerConnection(prev => ({
      ...prev,
      remoteStream,
      isConnected: true,
    }));
  };

  // Toggle microphone
  const toggleMute = () => {
    if (peerConnection.localStream) {
      const audioTrack = peerConnection.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (peerConnection.localStream) {
      const videoTrack = peerConnection.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    }
  };

  // Cleanup
  const cleanup = () => {
    if (peerConnection.localStream) {
      peerConnection.localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnection.remoteStream) {
      peerConnection.remoteStream.getTracks().forEach(track => track.stop());
    }
  };

  // Find next partner (disconnect current)
  const findNextPartner = () => {
    cleanup();
    setPeerConnection({
      localStream: null,
      remoteStream: null,
      isConnected: false,
    });

    // Reinitialize
    setTimeout(() => {
      initializeMedia();
    }, 1000);
  };

  return {
    localVideoRef,
    remoteVideoRef,
    initializeMedia,
    toggleMute,
    toggleCamera,
    findNextPartner,
    cleanup,
    isConnected: peerConnection.isConnected,
    isMuted,
    isCameraOff,
    error,
  };
}
