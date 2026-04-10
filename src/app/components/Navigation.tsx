import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { User, Globe2 } from 'lucide-react';

export default function Navigation() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 ${
        theme === 'dark'
          ? 'bg-gray-900/80 border-b border-red-600/20'
          : 'bg-white/80 border-b border-blue-200'
      } backdrop-blur-lg`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Globe2 className={`w-8 h-8 ${theme === 'dark' ? 'text-red-500' : 'text-blue-600'}`} />
          <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            LangConnect
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/language-select')}
            className={`px-4 py-2 rounded-lg font-medium ${
              theme === 'dark'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Start Chat
          </button>

          <button
            onClick={() => navigate('/profile')}
            className={`p-2 rounded-full ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <User className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
