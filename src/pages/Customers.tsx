

import React, { useEffect, useState, useMemo } from 'react';
import type { CustomerDto } from '../types';
import { customerService } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Plus, Users } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CustomerTable from '../components/customers/CustomerTable';
import Pagination from '../components/Pagination';
import CustomerModal from '../components/customers/CustomerModal';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import type { ToastType } from '../components/Toast';
import InvoiceListModal from '../components/customers/InvoiceListModal';

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

  // Invoices modal states
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceCustomer, setInvoiceCustomer] = useState<CustomerDto | null>(null);

  const handleOpenInvoiceModal = (customer: CustomerDto) => {
    setInvoiceCustomer(customer);
    setIsInvoiceModalOpen(true);
  };

  const hasRole = useAuthStore((state) => state.hasRole);
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Filter items based on search query
  const filteredCustomers = useMemo(() => {
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
      throw err;
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

      {/* Search Bar Component */}
      <SearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Buscar por nombre, correo, teléfono o dirección..."
      />

      {/* Main Table Component */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 dark:border-t-indigo-400 animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium animate-pulse">Cargando base de datos…</p>
          </div>
        ) : (
          <>
            <CustomerTable
              customers={paginatedCustomers}
              isAdmin={isAdmin}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteClick}
              onOpenInvoices={handleOpenInvoiceModal}
            />

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              startElement={startElement}
              endElement={endElement}
              totalElements={filteredCustomers.length}
              onPageChange={setCurrentPage}
              itemName="clientes"
            />
          </>
        )}
      </div>

      {/* Form Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
      />

      {/* Invoices List and Detail Modal */}
      <InvoiceListModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        customer={invoiceCustomer}
        isAdmin={isAdmin}
      />

      {/* Confirm Delete Dialog */}
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
