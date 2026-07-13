import React from 'react';
import type { CustomerDto } from '../../types';
import { Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';

interface CustomerTableRowProps {
  customer: CustomerDto;
  isAdmin: boolean;
  onEdit: (customer: CustomerDto) => void;
  onDelete: (id: number) => void;
}

const CustomerTableRow: React.FC<CustomerTableRowProps> = ({
  customer,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="hover:bg-slate-100/50 dark:hover:bg-white/2 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 flex items-center justify-center font-bold">
            {customer.firstName[0]}
            {customer.lastName[0]}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {customer.firstName} {customer.lastName}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-550 font-mono">ID: {customer.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 space-y-1">
        <div className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          {customer.email}
        </div>
        {customer.phone && (
          <div className="text-xs text-slate-650 dark:text-slate-400 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            {customer.phone}
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        {customer.address ? (
          <div className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            {customer.address}
          </div>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-600 italic">No especificada</span>
        )}
      </td>
      {isAdmin && (
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onEdit(customer)}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/10 hover:text-indigo-650 dark:hover:text-indigo-400 text-slate-400 transition-all cursor-pointer"
              title="Editar cliente"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => customer.id && onDelete(customer.id)}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 hover:text-rose-650 dark:hover:text-rose-400 text-slate-400 transition-all cursor-pointer"
              title="Eliminar cliente"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default CustomerTableRow;
