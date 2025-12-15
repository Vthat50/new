import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Loader2 } from 'lucide-react';

export default function VoiceAgent() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const challenges = [
    {
      number: 1,
      title: "Challenge 1",
      description: "Interrupt mid-sentence"
    },
    {
      number: 2,
      title: "Challenge 2",
      description: "Ask about side effects 3 times"
    },
    {
      number: 3,
      title: "Challenge 3",
      description: "Pretend you don't understand English well"
    },
    {
      number: 4,
      title: "Challenge 4",
      description: "Change your mind about availability"
    },
    {
      number: 5,
      title: "Challenge 5",
      description: "Act confused about the trial purpose"
    }
  ];

  const startCall = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Initiating call to:', phoneNumber);

      // Call our server-side API route (keeps API keys secure)
      const response = await fetch('/api/initiate-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          metadata: {
            age: age,
            gender: gender,
            location: location,
            source: 'landing_page',
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      console.log('Call initiated successfully:', data);

      setIsCallActive(true);
      setIsLoading(false);

    } catch (err: any) {
      console.error('Failed to start call:', err);
      setError(err.message || 'Failed to initiate call');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setPhoneNumber('');
    setAge('');
    setGender('');
    setLocation('');
    setError('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
        style={{ height: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}
      >
        {isCallActive ? (
          /* Call Active State */
          <div className="text-center py-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <p className="text-lg text-green-600 font-semibold">
                Call in progress...
              </p>
            </div>
            <p className="text-gray-600 mb-8">
              You should receive a call at {phoneNumber}
            </p>
            <button
              onClick={() => {
                setIsCallActive(false);
                handleCancel();
              }}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              End Session
            </button>
          </div>
        ) : !showForm ? (
          /* Initial State - Show Challenge and Start Call Button */
          <>
            {/* Challenge Section */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white text-center mb-3">
                "Try to Break Our AI" Challenge
              </h3>
              <p className="text-white/90 text-center mb-5 text-sm">
                See if you can stump our AI. Try these challenges during your call:
              </p>

              <div className="grid md:grid-cols-2 gap-3 mb-5">
                {challenges.slice(0, 4).map((challenge) => (
                  <div
                    key={challenge.number}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4"
                  >
                    <h4 className="text-base font-semibold text-white mb-1">
                      {challenge.title}
                    </h4>
                    <p className="text-white/90 text-sm">
                      {challenge.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Challenge 5 centered */}
              <div className="max-w-md mx-auto mb-5">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                  <h4 className="text-base font-semibold text-white mb-1">
                    Challenge 5
                  </h4>
                  <p className="text-white/90 text-sm">
                    Act confused about the trial purpose
                  </p>
                </div>
              </div>

              {/* Start Call Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Start Call
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Form State - Show Form Fields */
          <>
            {/* Form Fields */}
            <div className="space-y-6 mb-8">
              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isLoading}
                />
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-900 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="45"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isLoading}
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-900 mb-2">
                  Gender *
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  disabled={isLoading}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-600 mb-4 text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={startCall}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Initiating...
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    Make Call
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
