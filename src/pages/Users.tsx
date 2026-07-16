import React, { useEffect, useState, useMemo } from 'react';
import type { UserDto, UserCreateDto } from '../types';
import { userService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Shield, Plus } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import UserTable from '../components/users/UserTable';
import Pagination from '../components/Pagination';
import UserModal from '../components/users/UserModal';
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

  const currentUser = useAuthStore((state) => state.user);

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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
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
      throw err;
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

      {/* Search Bar Component */}
      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Buscar usuario por correo o rol..."
      />

      {/* Main Table Component */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-purple-500 dark:border-t-purple-400 animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">Cargando base de datos…</p>
          </div>
        ) : (
          <>
            <UserTable
              users={paginatedUsers}
              currentUserId={currentUser?.id}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteClick}
            />

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              startElement={startElement}
              endElement={endElement}
              totalElements={filteredUsers.length}
              onPageChange={setCurrentPage}
              itemName="usuarios"
            />
          </>
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
