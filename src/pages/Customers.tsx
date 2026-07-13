import React, { useEffect, useState, useMemo } from 'react';
import type { CustomerDto } from '../types';
import { customerService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Search, Users, ChevronLeft, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import CustomerModal from '../components/CustomerModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import type { ToastType } from '../components/Toast';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(null);

  // Confirm delete states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [customerToDeleteId, setCustomerToDeleteId] = useState<number | null>(null);

  const { hasRole } = useAuth();
  const isAdmin = hasRole('ROLE_ADMIN');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err: any) {
      console.error(err);
      setToast({ message: 'Error al cargar el listado de clientes.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter items based on search query
  const filteredCustomers = useMemo(() => {
    setCurrentPage(1); // Reset to page 1 on search
    return customers.filter((customer) => {
      const query = searchQuery.toLowerCase();
      return (
        customer.firstName.toLowerCase().includes(query) ||
        customer.lastName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.toLowerCase().includes(query)) ||
        (customer.address && customer.address.toLowerCase().includes(query))
      );
    });
  }, [customers, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const handleOpenAddModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: CustomerDto) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (payload: CustomerDto) => {
    try {
      if (payload.id) {
        // Edit Customer
        const updated = await customerService.update(payload.id, payload);
        setCustomers((prev) => prev.map((c) => (c.id === payload.id ? updated : c)));
        setToast({ message: 'Cliente actualizado correctamente.', type: 'success' });
      } else {
        // Add Customer
        const created = await customerService.create(payload);
        setCustomers((prev) => [created, ...prev]);
        setToast({ message: 'Cliente creado correctamente.', type: 'success' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      throw err; // Let the modal handle showing the specific field errors
    }
  };

  const handleDeleteClick = (id: number) => {
    setCustomerToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (customerToDeleteId === null) return;

    try {
      await customerService.delete(customerToDeleteId);
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDeleteId));
      setToast({ message: 'Cliente eliminado correctamente.', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setToast({ message: 'Error al eliminar el cliente.', type: 'error' });
    } finally {
      setCustomerToDeleteId(null);
    }
  };

  const startElement = (currentPage - 1) * itemsPerPage + 1;
  const endElement = Math.min(currentPage * itemsPerPage, filteredCustomers.length);

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Gestión de Clientes
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visualiza y administra el catálogo de clientes del sistema.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Añadir Cliente
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="glass-panel rounded-2xl p-4 flex items-center gap-3 border border-slate-200 dark:border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, correo, teléfono o dirección..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 dark:border-t-indigo-400 animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">Cargando base de datos...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No se encontraron clientes</h3>
            <p className="text-slate-500 dark:text-slate-500 text-sm max-w-sm mx-auto">
              Intenta cambiar la búsqueda o haz clic en "Añadir Cliente" para registrar uno nuevo.
            </p>
          </div>
        ) : (
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
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-100/50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 flex items-center justify-center font-bold">
                          {customer.firstName[0]}{customer.lastName[0]}
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
                        <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
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
                            onClick={() => handleOpenEditModal(customer)}
                            className="p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/10 hover:text-indigo-650 dark:hover:text-indigo-400 text-slate-400 dark:text-slate-400 transition-all cursor-pointer"
                            title="Editar cliente"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => customer.id && handleDeleteClick(customer.id)}
                            className="p-2 rounded-lg border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/2 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 hover:text-rose-650 dark:hover:text-rose-400 text-slate-400 dark:text-slate-400 transition-all cursor-pointer"
                            title="Eliminar cliente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-950/10">
                {/* Stats */}
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Mostrando <strong className="text-slate-700 dark:text-slate-200">{startElement}</strong> a <strong className="text-slate-700 dark:text-slate-200">{endElement}</strong> de <strong className="text-slate-700 dark:text-slate-200">{filteredCustomers.length}</strong> clientes
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
                          ? 'bg-indigo-650 text-white'
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

      {/* Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Cliente?"
        message="¿Estás seguro de que deseas eliminar este cliente? Se borrará de la base de datos de forma permanente."
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

export default Customers;
