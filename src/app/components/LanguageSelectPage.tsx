import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LANGUAGES } from '../../utils/languages';
import { Globe2, ArrowRight } from 'lucide-react';

export default function LanguageSelectPage() {
  const { user, updateLanguage } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLanguageSelect = (languageCode: string) => {
    updateLanguage(languageCode);
    navigate('/chat');
  };

  return (
    <div className={`min-h-screen px-4 py-12 ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className={`inline-block p-4 rounded-full mb-6 ${theme === 'dark' ? 'bg-red-600/20' : 'bg-blue-600/20'}`}>
            <Globe2 className={`w-12 h-12 ${theme === 'dark' ? 'text-red-500' : 'text-blue-600'}`} />
          </div>

          <h1 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Welcome, {user?.fullName}! 👋
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose a language to practice
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LANGUAGES.map((language, index) => (
            <motion.button
              key={language.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLanguageSelect(language.code)}
              className={`p-6 rounded-2xl text-center group relative overflow-hidden ${
                theme === 'dark'
                  ? 'bg-gray-900 border border-red-600/20 hover:border-red-600/50'
                  : 'bg-white border-2 border-blue-200 hover:border-blue-400 shadow-lg'
              }`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${language.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />

              <div className="relative">
                <div className="text-6xl mb-4">{language.flag}</div>
                <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {language.name}
                </h3>
                <div className={`flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-red-500' : 'text-blue-600'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <span>Start Learning</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`mt-12 p-6 rounded-xl text-center ${
            theme === 'dark'
              ? 'bg-gray-900/50 border border-red-600/20'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            💡 You'll be matched with {user?.gender === 'male' ? 'male' : 'female'} users who want to practice the same language
          </p>
        </motion.div>
      </div>
    </div>
  );
}
