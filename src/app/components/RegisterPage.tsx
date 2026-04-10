import { useState } from 'react';
import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { UserPlus, Mail, Lock, User, Users } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '' as 'male' | 'female' | '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.gender) {
      setError('Please select your gender');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.fullName, formData.gender);
      navigate('/language-select');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
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
            <UserPlus className={`w-8 h-8 ${theme === 'dark' ? 'text-red-500' : 'text-blue-600'}`} />
          </div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Create Account
          </h1>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Start your language learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg text-sm ${
                theme === 'dark'
                  ? 'bg-red-600/20 border border-red-600/30 text-red-400'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Full Name
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-red-600'
                    : 'bg-gray-50 border border-gray-300 text-gray-900 focus:border-blue-600'
                } focus:outline-none focus:ring-2 ${theme === 'dark' ? 'focus:ring-red-600/20' : 'focus:ring-blue-600/20'}`}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              Gender
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'male' })}
                className={`py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                  formData.gender === 'male'
                    ? theme === 'dark'
                      ? 'bg-red-600 text-white border-2 border-red-600'
                      : 'bg-blue-600 text-white border-2 border-blue-600'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-red-600'
                    : 'bg-gray-50 text-gray-700 border border-gray-300 hover:border-blue-600'
                }`}
              >
                <Users className="w-5 h-5" />
                Male
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'female' })}
                className={`py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                  formData.gender === 'female'
                    ? theme === 'dark'
                      ? 'bg-red-600 text-white border-2 border-red-600'
                      : 'bg-blue-600 text-white border-2 border-blue-600'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-red-600'
                    : 'bg-gray-50 text-gray-700 border border-gray-300 hover:border-blue-600'
                }`}
              >
                <Users className="w-5 h-5" />
                Female
              </button>
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Confirm Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
            {isLoading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className={`font-semibold ${theme === 'dark' ? 'text-red-500 hover:text-red-400' : 'text-blue-600 hover:text-blue-700'}`}
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
