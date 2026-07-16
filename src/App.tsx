import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import UsersList from './pages/Users';

const App: React.FC = () => {
  const checkSession = useAuthStore((state) => state.checkSession);
  const loading = useAuthStore((state) => state.loading);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a13] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">Iniciando aplicación…</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Secure / Protected Application Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Redirect root to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          
          {/* Admin only route */}
          <Route
            path="users"
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <UsersList />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all route redirects to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
