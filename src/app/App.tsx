import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import LanguageSelectPage from './components/LanguageSelectPage';
import VideoChatRoom from './components/VideoChatRoom';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
export default function App() {
  // Suppress browser extension errors on mount
  useEffect(() => {
    const originalError = console.error;

    console.error = (...args: any[]) => {
      const errorString = args.join(' ');
      if (
        !errorString.includes('MetaMask') &&
        !errorString.includes('chrome-extension') &&
        !errorString.includes('nkbihfbeogaeaoehlefnkodbefgpgknn')
      ) {
        originalError.apply(console, args);
      }
    };

    // Suppress extension-related unhandled rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason?.message || event.reason || '');
      if (reason.includes('MetaMask') || reason.includes('chrome-extension')) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      console.error = originalError;
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ThemeToggle />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/language-select"
                element={
                  <ProtectedRoute>
                    <LanguageSelectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <VideoChatRoom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}