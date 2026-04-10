import React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/language-select');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-md p-8 rounded-2xl ${
          theme === 'dark'
            ? 'bg-gray-900 border border-red-600/20'
            : 'bg-white shadow-2xl'
        }`}
      >
        <div className="text-center mb-8">
          <div className={`inline-block p-3 rounded-full mb-4 ${theme === 'dark' ? 'bg-red-600/20' : 'bg-blue-600/20'}`}>
            <LogIn className={`w-8 h-8 ${theme === 'dark' ? 'text-red-500' : 'text-blue-600'}`} />
          </div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Welcome Back
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to continue learning
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg flex items-center gap-2 ${
                theme === 'dark'
                  ? 'bg-red-600/20 border border-red-600/30 text-red-400'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-red-600'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-600'
                } focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-red-600/20' : 'focus:ring-blue-600/20'}`}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-red-600'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-600'
                } focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-red-600/20' : 'focus:ring-blue-600/20'}`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold ${
              theme === 'dark'
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
            } disabled:opacity-50`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className={`font-semibold ${theme === 'dark' ? 'text-red-500 hover:text-red-400' : 'text-blue-600 hover:text-blue-700'}`}
            >
              Sign Up
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className={theme === 'dark' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-500 hover:text-gray-600'}
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
