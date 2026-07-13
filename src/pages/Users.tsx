import React, { useEffect, useState, useMemo } from 'react';
import type { UserDto, UserCreateDto } from '../types';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Search, ChevronLeft, ChevronRight, User, Plus, Edit2, Trash2 } from 'lucide-react';
import UserModal from '../components/UserModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import type { ToastType } from '../components/Toast';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  // Confirm delete states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);

  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      setToast({ message: 'Error al cargar el listado de usuarios.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    setCurrentPage(1); // Reset to page 1 on search
    return users.filter((u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.roles.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleOpenAddModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (userItem: UserDto) => {
    setSelectedUser(userItem);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (payload: UserCreateDto & { id?: number }) => {
    try {
      if (payload.id) {
        // Edit User
        const updated = await userService.update(payload.id, payload);
        setUsers((prev) => prev.map((u) => (u.id === payload.id ? updated : u)));
        setToast({ message: 'Usuario actualizado correctamente.', type: 'success' });
      } else {
        // Create User
        const created = await userService.register(payload);
        setUsers((prev) => [created, ...prev]);
        setToast({ message: 'Usuario creado correctamente.', type: 'success' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving user:', err);
      throw err; // Let the UserModal handle presenting errors
    }
  };

  const handleDeleteClick = (id: number) => {
    setUserToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDeleteId === null) return;

    try {
      await userService.delete(userToDeleteId);
      setUsers((prev) => prev.filter((u) => u.id !== userToDeleteId));
      setToast({ message: 'Usuario eliminado correctamente.', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setToast({ message: 'Error al eliminar el usuario.', type: 'error' });
    } finally {
      setUserToDeleteId(null);
    }
  };

  const renderRoleBadges = (rolesString: string) => {
    return rolesString.split(',').map((role) => {
      const trimmedRole = role.trim();
      if (trimmedRole === 'ROLE_ADMIN') {
        return (
          <span key={trimmedRole} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-650 dark:text-purple-400 border border-purple-500/20">
            <Key className="w-3 h-3" />
            Administrador
          </span>
        );
      }
      return (
        <span key={trimmedRole} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20">
          <User className="w-3 h-3" />
          Usuario
        </span>
      );
    });
  };

  const startElement = (currentPage - 1) * itemsPerPage + 1;
  const endElement = Math.min(currentPage * itemsPerPage, filteredUsers.length);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            Administración de Usuarios
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestiona cuentas de usuario, contraseñas y niveles de acceso.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-650 hover:bg-purple-600 text-white font-semibold text-sm shadow-lg shadow-purple-600/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Añadir Usuario
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar usuario por correo o rol..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-purple-500 dark:border-t-purple-400 animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">Cargando base de datos...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <User className="w-12 h-12 text-slate-450 dark:text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No se encontraron usuarios</h3>
            <p className="text-slate-500 dark:text-slate-500 text-sm max-w-sm mx-auto">
              Intenta cambiar la búsqueda o verifica que existan usuarios en el sistema.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-950/20">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Usuario</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Roles Asignados</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {paginatedUsers.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-slate-100/50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-650 dark:text-purple-400 flex items-center justify-center font-bold">
                          {userItem.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            {userItem.email}
                            {currentUser?.id === userItem.id && (
                              <span className="text-[10px] bg-slate-250 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
                                Tú
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-550 dark:text-slate-400">
                      {userItem.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {renderRoleBadges(userItem.roles)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(userItem)}
                          className="p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/10 hover:text-indigo-650 dark:hover:text-indigo-400 text-slate-400 dark:text-slate-400 transition-all cursor-pointer"
                          title="Editar usuario"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        
                        {/* Prevent user from deleting their own current active session */}
                        {currentUser?.id !== userItem.id ? (
                          <button
                            onClick={() => handleDeleteClick(userItem.id)}
                            className="p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 hover:text-rose-650 dark:hover:text-rose-400 text-slate-400 dark:text-slate-400 transition-all cursor-pointer"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <div 
                            className="p-2 rounded-lg border border-transparent text-slate-350 dark:text-slate-700 cursor-not-allowed" 
                            title="No puedes eliminar tu propio usuario activo"
                          >
                            <Trash2 className="w-4 h-4 opacity-30" />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-950/10">
                {/* Stats */}
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Mostrando <strong className="text-slate-700 dark:text-slate-200">{startElement}</strong> a <strong className="text-slate-700 dark:text-slate-200">{endElement}</strong> de <strong className="text-slate-700 dark:text-slate-200">{filteredUsers.length}</strong> usuarios
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-purple-650 text-white'
                          : 'border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 text-slate-500 dark:text-slate-400 hover:bg-slate-250 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Edit/Add Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />

      {/* User Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Usuario?"
        message="¿Estás seguro de que deseas eliminar este usuario? Perderá acceso inmediato a la plataforma."
      />

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

export default UsersList;
