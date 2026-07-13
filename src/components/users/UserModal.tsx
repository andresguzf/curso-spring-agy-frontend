import React, { useState, useEffect } from 'react';
import type { UserDto, UserCreateDto } from '../../types';
import { userCreateSchema, userUpdateSchema } from '../../utils/schemas';
import { X, Save, Mail, Lock, ShieldAlert } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: UserCreateDto & { id?: number }) => Promise<void>;
  user?: UserDto | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState('ROLE_USER');
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPassword(''); // Always reset password field on edit
      setRoles(user.roles || 'ROLE_USER');
    } else {
      setEmail('');
      setPassword('');
      setRoles('ROLE_USER');
    }
    setErrors({});
  }, [user, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const data = {
      email,
      roles,
      password: password || undefined,
    };

    const schema = user ? userUpdateSchema : userCreateSchema;
    const result = schema.safeParse(data);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const payload: UserCreateDto & { id?: number } = {
        email,
        roles,
      };

      if (password) {
        payload.password = password;
      }

      if (user?.id) {
        payload.id = user.id;
      }

      await onSave(payload);
    } catch (err: any) {
      console.error('UserModal save error:', err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else if (err.response?.status === 400) {
        setErrors({ general: 'El correo electrónico ingresado ya está registrado.' });
      } else {
        setErrors({ general: 'Ocurrió un error al guardar el usuario.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl relative border border-slate-200 dark:border-white/10 z-10 animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/5 mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {user ? 'Editar Usuario' : 'Añadir Usuario'}
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Errors Alert */}
        {errors.general && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-semibold">
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@correo.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/40 border ${errors.email ? 'border-rose-500/50' : 'border-slate-300 dark:border-white/10'} text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm`}
              />
            </div>
            {errors.email && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Contraseña {user && '(Opcional)'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/40 border ${errors.password ? 'border-rose-500/50' : 'border-slate-300 dark:border-white/10'} text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm`}
              />
            </div>
            {user && (
              <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-1 italic">
                Deja la contraseña en blanco si no deseas cambiarla.
              </p>
            )}
            {errors.password && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1 font-medium">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Roles del Sistema</label>
            <div className="relative">
              <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <select
                value={roles}
                onChange={(e) => setRoles(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="ROLE_USER" className="bg-slate-905 text-slate-200">Usuario (ROLE_USER)</option>
                <option value="ROLE_USER,ROLE_ADMIN" className="bg-slate-905 text-slate-200">Administrador (ROLE_USER, ROLE_ADMIN)</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0"></div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/5 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
