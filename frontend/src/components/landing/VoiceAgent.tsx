import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2 } from 'lucide-react';
import Vapi from '@vapi-ai/web';

export default function VoiceAgent() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const vapiRef = useRef<Vapi | null>(null);

  useEffect(() => {
    // Initialize Vapi
    const apiKey = import.meta.env.VITE_VAPI_API_KEY;
    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      hasAgentId: !!import.meta.env.VITE_VAPI_AGENT_ID,
      apiKeyPrefix: apiKey?.substring(0, 10) + '...',
      agentIdPrefix: import.meta.env.VITE_VAPI_AGENT_ID?.substring(0, 15) + '...'
    });

    if (!apiKey) {
      setError('API key not configured');
      return;
    }

    vapiRef.current = new Vapi(apiKey);

    // Set up event listeners
    const vapi = vapiRef.current;

    vapi.on('call-start', () => {
      setIsCallActive(true);
      setIsLoading(false);
      setError('');
    });

    vapi.on('call-end', () => {
      setIsCallActive(false);
      setIsSpeaking(false);
      setTranscript('');
    });

    vapi.on('speech-start', () => {
      setIsSpeaking(true);
    });

    vapi.on('speech-end', () => {
      setIsSpeaking(false);
    });

    vapi.on('message', (message: any) => {
      if (message.type === 'transcript' && message.transcriptType === 'partial') {
        setTranscript(message.transcript);
      }
    });

    vapi.on('error', (error: any) => {
      console.error('Vapi error:', error);
      setError('Connection error. Please try again.');
      setIsLoading(false);
      setIsCallActive(false);
    });

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  const startCall = async () => {
    setIsLoading(true);
    setError('');

    try {
      const agentId = import.meta.env.VITE_VAPI_AGENT_ID;
      console.log('Starting call with agent ID:', agentId ? agentId.substring(0, 15) + '...' : 'NOT FOUND');

      if (!agentId) {
        throw new Error('Agent ID not configured. Please check environment variables.');
      }

      if (!vapiRef.current) {
        throw new Error('Vapi not initialized. Check API key.');
      }

      await vapiRef.current.start(agentId);
    } catch (err: any) {
      console.error('Failed to start call:', err);
      setError(err.message || 'Failed to start call');
      setIsLoading(false);
    }
  };

  const endCall = () => {
    vapiRef.current?.stop();
    setIsCallActive(false);
    setIsSpeaking(false);
    setTranscript('');
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-300 rounded-full mb-4">
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">AI Voice Assistant</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Try Our Voice Agent
          </h3>
          <p className="text-gray-600 text-sm">
            Experience our AI-powered patient support assistant with natural voice powered by Eleven Labs
          </p>
        </div>

        {/* Voice Visualizer */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Animated rings */}
          <AnimatePresence>
            {isCallActive && (
              <>
                <motion.div
                  className="absolute w-32 h-32 rounded-full border-2 border-blue-400"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{
                    scale: isSpeaking ? [1, 1.3, 1] : 1,
                    opacity: isSpeaking ? [0.5, 0.2, 0.5] : 0.3,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: isSpeaking ? 1.5 : 0.3,
                    repeat: isSpeaking ? Infinity : 0,
                  }}
                />
                <motion.div
                  className="absolute w-40 h-40 rounded-full border-2 border-purple-400"
                  initial={{ scale: 1, opacity: 0.3 }}
                  animate={{
                    scale: isSpeaking ? [1, 1.4, 1] : 1,
                    opacity: isSpeaking ? [0.3, 0.1, 0.3] : 0.2,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: isSpeaking ? 2 : 0.3,
                    repeat: isSpeaking ? Infinity : 0,
                    delay: 0.2,
                  }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Center button */}
          <motion.button
            onClick={isCallActive ? endCall : startCall}
            disabled={isLoading}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              isCallActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-600 hover:bg-blue-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
          >
            {isLoading ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : isCallActive ? (
              <PhoneOff className="w-10 h-10 text-white" />
            ) : (
              <Phone className="w-10 h-10 text-white" />
            )}
          </motion.button>
        </div>

        {/* Status */}
        <div className="text-center mb-6">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.p
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-blue-600 font-medium"
              >
                Connecting to agent...
              </motion.p>
            )}
            {isCallActive && !isLoading && (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm text-green-600 font-medium">
                    {isSpeaking ? 'AI is speaking...' : 'Listening...'}
                  </p>
                </div>
                {transcript && (
                  <p className="text-xs text-gray-600 italic">
                    You: {transcript}
                  </p>
                )}
              </motion.div>
            )}
            {!isCallActive && !isLoading && (
              <motion.p
                key="ready"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-gray-600"
              >
                Click to start conversation
              </motion.p>
            )}
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600 mt-2"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Mic className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Natural Voice</p>
              <p className="text-xs text-gray-500">Eleven Labs AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Real-time</p>
              <p className="text-xs text-gray-500">Instant response</p>
            </div>
          </div>
        </div>

        {/* Sample questions */}
        {!isCallActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <p className="text-xs font-semibold text-gray-700 mb-3">Try asking:</p>
            <div className="space-y-2">
              {[
                'How does the patient support program work?',
                'What are the side effects I should watch for?',
                'How do I schedule my next appointment?',
              ].map((question, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200"
                >
                  "{question}"
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
