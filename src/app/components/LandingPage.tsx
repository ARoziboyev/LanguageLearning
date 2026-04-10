import React from 'react';
import { motion } from 'motion/react';
import { Globe2, Video, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-red-600/20' : 'bg-blue-600/20'}`}>
              <Globe2 className={`w-16 h-16 ${theme === 'dark' ? 'text-red-500' : 'text-blue-600'}`} />
            </div>
          </div>

          <h1 className={`text-6xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Learn Languages
            <span className={`block ${theme === 'dark' ? 'text-red-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'}`}>
              Through Real Conversations
            </span>
          </h1>

          <p className={`text-xl mb-12 max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
            Connect with people worldwide. Practice languages through 10-minute video calls.
            Real people, real conversations, real progress.
          </p>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className={`px-8 py-4 rounded-full text-lg font-semibold ${
                theme === 'dark'
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
              }`}
            >
              Get Started Free
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className={`px-8 py-4 rounded-full text-lg font-semibold ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-white border border-red-600/30'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-blue-600'
              }`}
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8 mt-24"
        >
          <FeatureCard
            icon={<Video className="w-8 h-8" />}
            title="Real-Time Video Calls"
            description="Practice with native speakers through live video conversations"
            theme={theme}
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Smart Matching"
            description="Get matched with partners based on language and preferences"
            theme={theme}
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="10-Minute Sessions"
            description="Perfect length to stay focused and make real progress"
            theme={theme}
          />
        </motion.div>

        {/* Languages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 text-center"
        >
          <h2 className={`text-3xl font-bold mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            7 Languages Available
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['🇬🇧 English', '🇷🇺 Russian', '🇸🇦 Arabic', '🇰🇷 Korean', '🇯🇵 Japanese', '🇹🇷 Turkish', '🇺🇿 Uzbek'].map((lang) => (
              <div
                key={lang}
                className={`px-6 py-3 rounded-full text-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white border border-red-600/20'
                    : 'bg-white text-gray-900 border-2 border-blue-200'
                }`}
              >
                {lang}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, theme }: { icon: React.ReactNode; title: string; description: string; theme: string }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`p-8 rounded-2xl ${
        theme === 'dark'
          ? 'bg-gray-900 border border-red-600/20'
          : 'bg-white border-2 border-blue-200 shadow-lg'
      }`}
    >
      <div className={`mb-4 ${theme === 'dark' ? 'text-red-500' : 'text-blue-600'}`}>
        {icon}
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
        {description}
      </p>
    </motion.div>
  );
}
