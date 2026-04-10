import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useWebRTC } from '../../hooks/useWebRTC';
import React from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  SkipForward,
  MessageCircle,
  Flag,
  User,
  Clock,
  Send,
  Loader2,
} from 'lucide-react';
import { LANGUAGES } from '../../utils/languages';

const SESSION_DURATION = 10 * 60; // 10 minutes in seconds

export default function VideoChatRoom() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const {
    localVideoRef,
    remoteVideoRef,
    initializeMedia,
    toggleMute,
    toggleCamera,
    findNextPartner,
    cleanup,
    isConnected,
    isMuted,
    isCameraOff,
    error: webrtcError,
  } = useWebRTC();

  const [isMatching, setIsMatching] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'me' | 'partner' }>>([]);
  const [messageInput, setMessageInput] = useState('');

  // Get selected language
  const selectedLanguage = LANGUAGES.find(lang => lang.code === user?.selectedLanguage);

  // Initialize media on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeMedia();
      } catch (err) {
        console.error('Failed to initialize media:', err);
        // User can still try to reconnect with the "Next Partner" button
      }
    };

    init();
    return () => cleanup();
  }, []);

  // Handle connection state
  useEffect(() => {
    if (isConnected) {
      setIsMatching(false);
      // Play connection sound
      playSound('connect');
    }
  }, [isConnected]);

  // Timer countdown
  useEffect(() => {
    if (!isConnected || isMatching) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleEndSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected, isMatching]);

  const playSound = (type: 'connect' | 'disconnect') => {
    try {
      // Create audio context for sound effects
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = type === 'connect' ? 800 : 400;
      gainNode.gain.value = 0.1;

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (err) {
      // Silently fail if audio context is not supported
      console.log('Audio not available');
    }
  };

  const handleEndSession = () => {
    playSound('disconnect');
    cleanup();
    navigate('/language-select');
  };

  const handleNextPartner = () => {
    setIsMatching(true);
    setTimeRemaining(SESSION_DURATION);
    setMessages([]);
    playSound('disconnect');
    findNextPartner();
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages(prev => [...prev, { text: messageInput, sender: 'me' }]);
      setMessageInput('');

      // Simulate partner response (for demo)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: "That's great! I'm learning too 😊",
          sender: 'partner'
        }]);
      }, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user?.selectedLanguage) {
    navigate('/language-select');
    return null;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`border-b ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              theme === 'dark' ? 'bg-red-600/20 text-red-500' : 'bg-blue-600/20 text-blue-600'
            }`}>
              <span className="text-2xl">{selectedLanguage?.flag}</span>
              <span className="font-semibold">{selectedLanguage?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeRemaining < 60
                ? theme === 'dark' ? 'bg-red-600/20 text-red-500' : 'bg-red-100 text-red-600'
                : theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
            </div>

            <button
              onClick={handleEndSession}
              className={`px-4 py-2 rounded-full ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Remote Video */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900">
              {webrtcError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                  <div className="text-center p-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Camera/Microphone Access Needed</h3>
                    <p className="text-gray-400 mb-4">{webrtcError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className={`px-6 py-3 rounded-lg ${
                        theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                      } text-white font-semibold`}
                    >
                      Grant Access & Retry
                    </button>
                  </div>
                </div>
              ) : isMatching ? (
                <MatchingLoader theme={theme} language={selectedLanguage?.name || ''} />
              ) : (
                <>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                      theme === 'dark' ? 'bg-black/50 backdrop-blur-lg' : 'bg-white/90 backdrop-blur-lg'
                    }`}>
                      <User className={`w-5 h-5 ${theme === 'dark' ? 'text-red-500' : 'text-blue-600'}`} />
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Partner</span>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Local Video */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 max-w-xs">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
              <div className="absolute bottom-4 left-4">
                <div className={`px-3 py-1.5 rounded-full text-sm ${
                  theme === 'dark' ? 'bg-black/50 backdrop-blur-lg text-white' : 'bg-white/90 backdrop-blur-lg text-gray-900'
                }`}>
                  You
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <ControlButton
                icon={isMuted ? <MicOff /> : <Mic />}
                active={!isMuted}
                onClick={toggleMute}
                theme={theme}
                label={isMuted ? 'Unmute' : 'Mute'}
              />
              <ControlButton
                icon={isCameraOff ? <VideoOff /> : <Video />}
                active={!isCameraOff}
                onClick={toggleCamera}
                theme={theme}
                label={isCameraOff ? 'Turn On Camera' : 'Turn Off Camera'}
              />
              <ControlButton
                icon={<MessageCircle />}
                active={showChat}
                onClick={() => setShowChat(!showChat)}
                theme={theme}
                label="Chat"
              />
              <ControlButton
                icon={<SkipForward />}
                onClick={handleNextPartner}
                theme={theme}
                label="Next Partner"
                variant="secondary"
              />
              <ControlButton
                icon={<Phone />}
                onClick={handleEndSession}
                theme={theme}
                label="End Call"
                variant="danger"
              />
            </div>
          </div>

          {/* Chat Section */}
          <div className={`rounded-2xl ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
            <div className="p-4 border-b border-gray-800">
              <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Chat
              </h3>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`px-4 py-2 rounded-2xl max-w-xs ${
                      msg.sender === 'me'
                        ? theme === 'dark' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                        : theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className={`flex-1 px-4 py-2 rounded-full ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white border border-gray-700'
                      : 'bg-gray-100 text-gray-900 border border-gray-300'
                  } focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-red-600' : 'focus:ring-blue-600'}`}
                />
                <button
                  onClick={handleSendMessage}
                  className={`p-2 rounded-full ${
                    theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Report Button */}
            <div className="p-4">
              <button className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}>
                <Flag className="w-4 h-4" />
                Report User
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  );
}

function ControlButton({
  icon,
  active = true,
  onClick,
  theme,
  label,
  variant = 'primary'
}: {
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  theme: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={label}
      className={`p-4 rounded-full ${
        variant === 'danger'
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : variant === 'secondary'
          ? theme === 'dark'
            ? 'bg-gray-800 hover:bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          : active
          ? theme === 'dark'
            ? 'bg-red-600 text-white'
            : 'bg-blue-600 text-white'
          : theme === 'dark'
          ? 'bg-gray-800 text-gray-400'
          : 'bg-gray-200 text-gray-600'
      }`}
    >
      {icon}
    </motion.button>
  );
}

function MatchingLoader({ theme, language }: { theme: string; language: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-6"
        >
          <Loader2 className={`w-16 h-16 ${theme === 'dark' ? 'text-red-500' : 'text-blue-500'}`} />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">Finding a partner...</h3>
        <p className="text-gray-400">Looking for someone to practice {language} with</p>
        <div className="flex gap-2 justify-center mt-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-red-500' : 'bg-blue-500'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
