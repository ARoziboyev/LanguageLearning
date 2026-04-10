import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { User, Mail, Users, Globe2, LogOut, Moon, Sun } from 'lucide-react';
import { LANGUAGES } from '../../utils/languages';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const selectedLanguage = LANGUAGES.find(lang => lang.code === user?.selectedLanguage);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`max-w-2xl mx-auto rounded-2xl ${
            theme === 'dark'
              ? 'bg-gray-900 border border-red-600/20'
              : 'bg-white shadow-2xl'
          }`}
        >
          {/* Header */}
          <div className={`p-8 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Profile
              </h1>
              <button
                onClick={() => navigate('/language-select')}
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Back
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-red-600/20' : 'bg-blue-600/20'
              }`}>
                <User className={`w-12 h-12 ${theme === 'dark' ? 'text-red-500' : 'text-blue-600'}`} />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {user?.fullName}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-8 space-y-6">
            <ProfileField
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value={user?.email || ''}
              theme={theme}
            />

            <ProfileField
              icon={<Users className="w-5 h-5" />}
              label="Gender"
              value={user?.gender === 'male' ? 'Male' : 'Female'}
              theme={theme}
            />

            {selectedLanguage && (
              <ProfileField
                icon={<Globe2 className="w-5 h-5" />}
                label="Current Language"
                value={
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedLanguage.flag}</span>
                    <span>{selectedLanguage.name}</span>
                  </div>
                }
                theme={theme}
              />
            )}
          </div>

          {/* Settings */}
          <div className={`p-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Settings
            </h3>

            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className={`flex items-center justify-between p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-red-500" />
                  ) : (
                    <Sun className="w-5 h-5 text-blue-600" />
                  )}
                  <div>
                    <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Theme
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {theme === 'dark' ? 'Dark Mode (Black + Red)' : 'Light Mode (White + Blue)'}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className={`relative w-16 h-8 rounded-full transition-colors ${
                    theme === 'dark' ? 'bg-red-600' : 'bg-blue-600'
                  }`}
                >
                  <motion.div
                    layout
                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                    animate={{ left: theme === 'dark' ? '2.5rem' : '0.25rem' }}
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                  />
                </motion.button>
              </div>

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </motion.button>
            </div>
          </div>

          {/* Stats */}
          <div className={`p-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} grid grid-cols-3 gap-4`}>
            <StatCard
              label="Sessions"
              value="0"
              theme={theme}
            />
            <StatCard
              label="Minutes"
              value="0"
              theme={theme}
            />
            <StatCard
              label="Partners"
              value="0"
              theme={theme}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProfileField({
  icon,
  label,
  value,
  theme
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  theme: string;
}) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className={theme === 'dark' ? 'text-red-500' : 'text-blue-600'}>
        {icon}
      </div>
      <div className="flex-1">
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {label}
        </div>
        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, theme }: { label: string; value: string; theme: string }) {
  return (
    <div className={`text-center p-4 rounded-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-red-500' : 'text-blue-600'}`}>
        {value}
      </div>
      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {label}
      </div>
    </div>
  );
}
