import React from 'react';
import type { UserDto } from '../../types';
import { User } from 'lucide-react';
import UserTableRow from './UserTableRow';

interface UserTableProps {
  users: UserDto[];
  currentUserId?: number;
  onEdit: (userItem: UserDto) => void;
  onDelete: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  if (users.length === 0) {
    return (
      <div className="p-12 text-center space-y-3">
        <User className="w-12 h-12 text-slate-450 dark:text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No se encontraron usuarios</h3>
        <p className="text-slate-500 dark:text-slate-500 text-sm max-w-sm mx-auto">
          Intenta cambiar la búsqueda o verifica que existan usuarios en el sistema.
        </p>
      </div>
    );
  }

  return (
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
          {users.map((u) => (
            <UserTableRow
              key={u.id}
              userItem={u}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
