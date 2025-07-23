import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/layout/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';

function AppContent() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {currentUser && <Header />}
      <Routes>
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            borderRadius: '12px',
            border: '1px solid var(--toast-border)'
          }
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;