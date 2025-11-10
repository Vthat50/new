import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Volume2, Loader2 } from 'lucide-react';

export default function VoiceAgent() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationId, setConversationId] = useState('');

  const startCall = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;
      const phoneNumberId = import.meta.env.VITE_ELEVENLABS_PHONE_NUMBER_ID;

      if (!apiKey || !agentId || !phoneNumberId) {
        throw new Error('Eleven Labs configuration is missing');
      }

      // Format phone number (ensure it starts with +)
      let formattedNumber = phoneNumber.trim();
      if (!formattedNumber.startsWith('+')) {
        // Assume US number if no country code
        formattedNumber = '+1' + formattedNumber.replace(/\D/g, '');
      }

      console.log('Initiating call to:', formattedNumber);

      // Call Eleven Labs API directly
      const response = await fetch('https://api.elevenlabs.io/v1/convai/twilio/outbound-call', {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId,
          agent_phone_number_id: phoneNumberId,
          to_number: formattedNumber,
          metadata: {
            patient_name: 'Demo User',
            source: 'landing_page',
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: { message: 'Failed to initiate call' } }));
        throw new Error(errorData.detail?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Call initiated successfully:', data);

      setConversationId(data.conversation_id || '');
      setIsCallActive(true);
      setIsLoading(false);

    } catch (err: any) {
      console.error('Failed to start call:', err);
      setError(err.message || 'Failed to initiate call');
      setIsLoading(false);
    }
  };

  const endCall = async () => {
    // Note: The call will end when either party hangs up
    setIsCallActive(false);
    setPhoneNumber('');
    setConversationId('');
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
            Get a Call from Our AI Assistant
          </h3>
          <p className="text-gray-600 text-sm">
            Enter your phone number and we'll call you instantly with our AI-powered support
          </p>
        </div>

        {!isCallActive && (
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Your Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Include country code (e.g., +1 for US)
            </p>
          </div>
        )}

        {/* Call Status Visualizer */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Animated rings when call is active */}
          <AnimatePresence>
            {isCallActive && (
              <>
                <motion.div
                  className="absolute w-32 h-32 rounded-full border-2 border-green-400"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <motion.div
                  className="absolute w-40 h-40 rounded-full border-2 border-blue-400"
                  initial={{ scale: 1, opacity: 0.3 }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 0.3,
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
                Initiating call...
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
                    Call in progress...
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  You should receive a call at {phoneNumber}
                </p>
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
                Enter your number to get started
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
              <Phone className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Real Phone Call</p>
              <p className="text-xs text-gray-500">Direct to your phone</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Instant Connect</p>
              <p className="text-xs text-gray-500">Within seconds</p>
            </div>
          </div>
        </div>

        {/* Sample topics */}
        {!isCallActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <p className="text-xs font-semibold text-gray-700 mb-3">Topics to discuss:</p>
            <div className="space-y-2">
              {[
                'Patient support program details',
                'Side effects and what to watch for',
                'Scheduling appointments and follow-ups',
              ].map((topic, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200"
                >
                  • {topic}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
