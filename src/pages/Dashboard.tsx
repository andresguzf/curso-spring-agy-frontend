import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { customerService, userService } from '../services/api';
import { Users, ShieldAlert, Award, Key, UserCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const isAdmin = hasRole('ROLE_ADMIN');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const customers = await customerService.getAll();
        setCustomerCount(customers.length);

        if (isAdmin) {
          const users = await userService.getAll();
          setUserCount(users.length);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header welcome banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative border border-slate-200 dark:border-white/5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Award className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Dashboard de Seguridad</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
            ¡Bienvenido de nuevo, <span className="text-gradient">{user?.email.split('@')[0]}</span>!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl">
            Has iniciado sesión de manera segura. A continuación tienes un resumen del estado del sistema y los controles de acceso.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 px-4 py-3 rounded-2xl">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}>
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Nivel de Acceso</span>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {isAdmin ? 'Administrador Core' : 'Operador de Lectura'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Stats */}
        <div className="glass-panel glass-card-hover rounded-2xl p-6 flex items-start gap-4 border border-slate-200 dark:border-white/5">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-left">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Clientes Totales</span>
            {loadingStats ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-white/5 animate-pulse rounded-md mt-1"></div>
            ) : (
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">
                {customerCount !== null ? customerCount : '--'}
              </h3>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Sincronizado con base de datos H2</p>
          </div>
        </div>

        {/* User Stats (Admin-restricted) */}
        <div className="glass-panel glass-card-hover rounded-2xl p-6 flex items-start gap-4 relative overflow-hidden border border-slate-200 dark:border-white/5">
          {!isAdmin && (
            <div className="absolute inset-0 bg-slate-100/60 dark:bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center z-10">
              <Key className="w-5 h-5 text-slate-500 dark:text-slate-500 mb-1" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Acceso restringido a Admins</span>
            </div>
          )}
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-left">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Usuarios Registrados</span>
            {loadingStats ? (
              <div className="h-8 w-16 bg-slate-200 dark:bg-white/5 animate-pulse rounded-md mt-1"></div>
            ) : (
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">
                {userCount !== null ? userCount : '--'}
              </h3>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Usuarios con accesos asignados</p>
          </div>
        </div>

        {/* System Details */}
        <div className="glass-panel glass-card-hover rounded-2xl p-6 flex items-start gap-4 border border-slate-200 dark:border-white/5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-left">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estado de Sesión</span>
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping"></span>
              Conexión Activa
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 truncate">JWT Cookie: HttpOnly (Lax)</p>
          </div>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-white/5">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white text-left">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/customers"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950/50 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Gestionar Clientes</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Listado, filtrado y creación de clientes</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </Link>

          {isAdmin ? (
            <Link
              to="/users"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/30 hover:bg-slate-100 dark:hover:bg-slate-950/50 hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-650 dark:text-purple-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Administrar Usuarios</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Visualizar lista completa de usuarios del sistema</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </Link>
          ) : (
            <div
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-200/30 dark:bg-slate-950/10 opacity-60 cursor-not-allowed"
              title="Esta acción requiere privilegios de administrador"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-slate-400">Ver Usuarios (Bloqueado)</span>
                  <span className="text-xs text-slate-650 dark:text-slate-600">Requiere permisos ROLE_ADMIN</span>
                </div>
              </div>
              <Key className="w-5 h-5 text-slate-400 dark:text-slate-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
