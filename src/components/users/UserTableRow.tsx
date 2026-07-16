import React from 'react';
import type { UserDto } from '../../types';
import { Key, User, Edit2, Trash2 } from 'lucide-react';

interface UserTableRowProps {
  userItem: UserDto;
  currentUserId?: number;
  onEdit: (userItem: UserDto) => void;
  onDelete: (id: number) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  userItem,
  currentUserId,
  onEdit,
  onDelete,
}) => {
  const renderRoleBadges = (rolesString: string) => {
    return rolesString.split(',').map((role) => {
      const trimmedRole = role.trim();
      if (trimmedRole === 'ROLE_ADMIN') {
        return (
          <span
            key={trimmedRole}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-655 dark:text-purple-400 border border-purple-500/20"
          >
            <Key className="w-3 h-3" />
            Administrador
          </span>
        );
      }
      return (
        <span
          key={trimmedRole}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-655 dark:text-indigo-400 border border-indigo-500/20"
        >
          <User className="w-3 h-3" />
          Usuario
        </span>
      );
    });
  };

  const isSelf = currentUserId === userItem.id;

  return (
    <tr className="hover:bg-slate-100/50 dark:hover:bg-white/2 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-650 dark:text-purple-400 flex items-center justify-center font-bold">
            {userItem.email[0].toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-left">
              {userItem.email}
              {isSelf && (
                <span className="text-[10px] bg-slate-250 dark:bg-slate-800 text-slate-650 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
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
        <div className="flex flex-wrap gap-2">{renderRoleBadges(userItem.roles)}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(userItem)}
            className="p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/10 hover:text-indigo-650 dark:hover:text-indigo-400 text-slate-400 transition-all cursor-pointer"
            title="Editar usuario"
            aria-label={`Editar usuario ${userItem.email}`}
          >
            <Edit2 className="w-4 h-4" aria-hidden="true" />
          </button>

          {!isSelf ? (
            <button
              onClick={() => onDelete(userItem.id)}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 hover:text-rose-650 dark:hover:text-rose-400 text-slate-400 transition-all cursor-pointer"
              title="Eliminar usuario"
              aria-label={`Eliminar usuario ${userItem.email}`}
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            <div
              className="p-2 rounded-lg border border-transparent text-slate-350 dark:text-slate-700 cursor-not-allowed"
              title="No puedes eliminar tu propio usuario activo"
              aria-label="No puedes eliminar tu propio usuario"
            >
              <Trash2 className="w-4 h-4 opacity-30" aria-hidden="true" />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default React.memo(UserTableRow);
