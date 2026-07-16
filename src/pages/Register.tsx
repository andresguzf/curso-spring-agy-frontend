import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { registerSchema } from '../utils/schemas';
import { Shield, Mail, Lock, UserPlus, Sun, Moon } from 'lucide-react';
import Toast from '../components/Toast';
import type { ToastType } from '../components/Toast';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const registerUser = useAuthStore((state) => state.register);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse({ email, password, roles: 'ROLE_USER' });
    if (!result.success) {
      const errMsg = result.error.issues[0].message;
      setToast({ message: errMsg, type: 'error' });
      return;
    }

    setFormLoading(true);
    try {
      await registerUser({ email, password, roles: 'ROLE_USER' });
      setToast({ message: '¡Usuario registrado correctamente! Redirigiendo...', type: 'success' });
      
      // Delay navigation slightly so they can read the success toast
      setTimeout(() => {
        navigate('/login');
      }, 1550);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.message || 
                     (error.response?.status === 400 ? 'El correo ya está registrado.' : 'Error al registrar el usuario.');
      setToast({ message: errMsg, type: 'error' });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-premium relative flex items-center justify-center p-4 overflow-hidden transition-colors duration-300">
      {/* Floating Theme Toggle Switcher */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 z-20 flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95 shadow-sm transition-all duration-300 cursor-pointer"
        title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </button>

      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '-4s' }}></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            AGY <span className="text-indigo-600 dark:text-indigo-400">Security</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">Crea una nueva cuenta de acceso</p>
        </div>

        {/* Register Panel */}
        <div className="glass-panel rounded-2xl p-8 shadow-2xl relative border border-slate-200 dark:border-white/5">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Registro de Usuario</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="register-email" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Contraseña (Mín. 6 caracteres)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950/50 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-655 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>



            <button
              type="submit"
              disabled={formLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-semibold shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 active:scale-98 transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none mt-2 cursor-pointer"
            >
              {formLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Register;
