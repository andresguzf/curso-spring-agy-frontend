import React from 'react';
import type { CustomerDto } from '../../types';
import { Users } from 'lucide-react';
import CustomerTableRow from './CustomerTableRow';

interface CustomerTableProps {
  customers: CustomerDto[];
  isAdmin: boolean;
  onEdit: (customer: CustomerDto) => void;
  onDelete: (id: number) => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  if (customers.length === 0) {
    return (
      <div className="p-12 text-center space-y-3">
        <Users className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No se encontraron clientes</h3>
        <p className="text-slate-500 dark:text-slate-500 text-sm max-w-sm mx-auto">
          Intenta cambiar la búsqueda o haz clic en "Añadir Cliente" para registrar uno nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-950/20">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cliente</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Contacto</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dirección</th>
            {isAdmin && <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
          {customers.map((customer) => (
            <CustomerTableRow
              key={customer.id}
              customer={customer}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
