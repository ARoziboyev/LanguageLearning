import React from 'react';
import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full ${
        theme === 'dark'
          ? 'bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-600/30'
          : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-600 border border-blue-600/30'
      } backdrop-blur-lg`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
    </motion.button>
  );
}
