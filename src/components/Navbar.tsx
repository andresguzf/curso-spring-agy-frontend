import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { LogOut, Users, User, LayoutDashboard, Shield, Sun, Moon } from 'lucide-react';

const Navbar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const hasRole = useAuthStore((state) => state.hasRole);
  
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/10 dark:border-indigo-500/20'
      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 border-transparent';
  };

  const isAdmin = hasRole('ROLE_ADMIN');

  return (
    <nav className="glass-panel sticky top-0 z-40 border-b border-slate-200/50 dark:border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white group-hover:opacity-90 transition-opacity">
            AGY <span className="text-indigo-600 dark:text-indigo-400">Security</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${isActive('/dashboard')}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          
          <Link
            to="/customers"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${isActive('/customers')}`}
          >
            <Users className="w-4 h-4" />
            Clientes
          </Link>

          {isAdmin && (
            <Link
              to="/users"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${isActive('/users')}`}
            >
              <User className="w-4 h-4" />
              Usuarios
            </Link>
          )}
        </div>

        {/* User profile & Actions */}
        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="hidden sm:flex flex-col text-right mr-1">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.email}</span>
            <span className="text-xs font-semibold mt-0.5 self-end">
              {isAdmin ? (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Administrador
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Usuario
                </span>
              )}
            </span>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95 transition-all duration-300 cursor-pointer"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600" />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-300 cursor-pointer animate-fade-in"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
