import React, { useState, useEffect } from 'react';
import type { CustomerDto, InvoiceDto, InvoiceItemDto } from '../../types';
import { invoiceService } from '../../services/api';
import { X, Plus, Trash2, Edit2, FileText, Check, AlertCircle } from 'lucide-react';

interface InvoiceListModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerDto | null;
  isAdmin: boolean;
}

const InvoiceListModal: React.FC<InvoiceListModalProps> = ({
  isOpen,
  onClose,
  customer,
  isAdmin,
}) => {
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states (when adding/editing an invoice)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [items, setItems] = useState<InvoiceItemDto[]>([]);

  // Expandable invoice ID (for showing details)
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<number | null>(null);

  // New item form states
  const [itemDesc, setItemDesc] = useState('');
  const [itemQty, setItemQty] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);

  const fetchInvoices = async () => {
    if (!customer?.id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await invoiceService.getByCustomerId(customer.id);
      setInvoices(data);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar las facturas de este cliente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && customer) {
      fetchInvoices();
      setIsFormOpen(false);
      setEditingInvoiceId(null);
      setExpandedInvoiceId(null);
    }
  }, [isOpen, customer]);

  if (!isOpen || !customer) return null;

  const handleOpenAddForm = () => {
    setEditingInvoiceId(null);
    setDesc('');
    setStatus('PENDING');
    setItems([]);
    setItemDesc('');
    setItemQty(1);
    setItemPrice(0);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (invoice: InvoiceDto) => {
    setEditingInvoiceId(invoice.id || null);
    setDesc(invoice.description || '');
    setStatus(invoice.status);
    setItems(invoice.items || []);
    setItemDesc('');
    setItemQty(1);
    setItemPrice(0);
    setIsFormOpen(true);
  };

  const handleAddItem = () => {
    if (!itemDesc.trim() || itemQty <= 0 || itemPrice <= 0) return;
    const newItem: InvoiceItemDto = {
      description: itemDesc,
      quantity: itemQty,
      unitPrice: itemPrice,
      totalPrice: itemQty * itemPrice,
    };
    setItems((prev) => [...prev, newItem]);
    setItemDesc('');
    setItemQty(1);
    setItemPrice(0);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Debes agregar al menos un ítem a la factura.');
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const payload: InvoiceDto = {
      customerId: customer.id!,
      amount: totalAmount,
      description: desc || undefined,
      status,
      items,
    };

    try {
      setLoading(true);
      if (editingInvoiceId) {
        payload.id = editingInvoiceId;
        await invoiceService.update(editingInvoiceId, payload);
      } else {
        await invoiceService.create(payload);
      }
      setIsFormOpen(false);
      fetchInvoices();
    } catch (err: any) {
      console.error(err);
      alert('Error al guardar la factura.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta factura?')) return;
    try {
      setLoading(true);
      await invoiceService.delete(id);
      fetchInvoices();
    } catch (err: any) {
      console.error(err);
      alert('Error al eliminar la factura.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedInvoiceId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 shadow-2xl relative border border-slate-200 dark:border-white/10 z-10 animate-scale-in text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/5 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Facturas de {customer.firstName} {customer.lastName}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">ID Cliente: {customer.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Errors / Warnings */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {isFormOpen ? (
          /* FORM VIEW (Create/Edit Invoice) */
          <form onSubmit={handleSaveInvoice} className="space-y-4">
            <h4 className="text-md font-bold text-slate-700 dark:text-slate-300">
              {editingInvoiceId ? 'Editar Factura' : 'Nueva Factura'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Descripción</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Por ejemplo: Servicios de consultoría"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                >
                  <option value="PENDING">Pendiente (PENDING)</option>
                  <option value="PAID">Pagada (PAID)</option>
                  <option value="CANCELLED">Cancelada (CANCELLED)</option>
                </select>
              </div>
            </div>

            {/* Invoice items manager */}
            <div className="border border-slate-200 dark:border-white/5 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/20">
              <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Líneas de la Factura (Ítems)</h5>
              
              {/* Existing added items */}
              {items.length === 0 ? (
                <p className="text-sm text-slate-400 italic mb-4">No hay ítems agregados a esta factura.</p>
              ) : (
                <div className="overflow-x-auto mb-4 border border-slate-200 dark:border-white/5 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-950/40 border-b border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400">
                        <th className="px-3 py-2">Descripción</th>
                        <th className="px-3 py-2 text-center">Cant.</th>
                        <th className="px-3 py-2 text-right">P. Unitario</th>
                        <th className="px-3 py-2 text-right">Total</th>
                        <th className="px-3 py-2 text-center">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                      {items.map((item, idx) => (
                        <tr key={idx} className="text-slate-700 dark:text-slate-300">
                          <td className="px-3 py-2 font-medium">{item.description}</td>
                          <td className="px-3 py-2 text-center">{item.quantity}</td>
                          <td className="px-3 py-2 text-right">${Number(item.unitPrice).toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-bold text-indigo-650 dark:text-indigo-400">${Number(item.totalPrice).toFixed(2)}</td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-rose-500 hover:text-rose-600 transition-colors cursor-pointer p-1 rounded hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add item inline form */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Concepto</label>
                  <input
                    type="text"
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    placeholder="Descripción del servicio/producto"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Cant.</label>
                  <input
                    type="number"
                    min="1"
                    value={itemQty}
                    onChange={(e) => setItemQty(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none text-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">P. Unitario</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950/40 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none text-xs text-right"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 text-xs font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir Concepto
              </button>
            </div>

            {/* Form footer actions */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-4 mt-6">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Monto Total Estimado:{' '}
                <span className="text-lg font-bold text-indigo-650 dark:text-indigo-400">
                  ${items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Guardar Factura
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* LIST VIEW (Show Invoices list) */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Historial de Facturas</h4>
              {isAdmin && (
                <button
                  onClick={handleOpenAddForm}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all cursor-pointer shadow shadow-indigo-600/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nueva Factura
                </button>
              )}
            </div>

            {loading && invoices.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 rounded-full border-3 border-slate-200 dark:border-slate-800 border-t-indigo-500 animate-spin"></div>
                <p className="text-slate-400 text-xs">Cargando facturas...</p>
              </div>
            ) : invoices.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
                <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No hay facturas registradas</p>
                {isAdmin && (
                  <p className="text-slate-400 text-xs mt-1">Haz clic en "Nueva Factura" para crear el primer registro.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {invoices.map((inv) => {
                  const isExpanded = expandedInvoiceId === inv.id;
                  const formattedTotal = Number(inv.amount).toFixed(2);
                  const isPaid = inv.status === 'PAID';

                  return (
                    <div
                      key={inv.id}
                      className="border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-white/1"
                    >
                      {/* Accordion Row Trigger */}
                      <div
                        onClick={() => inv.id && toggleExpand(inv.id)}
                        className="flex items-center justify-between p-4 hover:bg-slate-100/50 dark:hover:bg-white/2 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPaid ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                            {isPaid ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {inv.description || `Factura #${inv.id}`}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">ID: {inv.id}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isPaid ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                            {inv.status}
                          </span>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            ${formattedTotal}
                          </span>
                          {isAdmin && (
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleOpenEditForm(inv)}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => inv.id && handleDeleteInvoice(inv.id)}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expandable Invoice Details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 bg-white/50 dark:bg-slate-950/10 border-t border-slate-100 dark:border-white/5">
                          <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Desglose de Ítems</h5>
                          <div className="space-y-1.5">
                            {inv.items && inv.items.length > 0 ? (
                              inv.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-white/2 last:border-b-0 text-slate-655 dark:text-slate-350">
                                  <div>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200">{item.description}</span>
                                    <span className="text-[10px] text-slate-400 ml-1.5">x{item.quantity} (${Number(item.unitPrice).toFixed(2)})</span>
                                  </div>
                                  <span className="font-semibold text-slate-800 dark:text-slate-200">${Number(item.totalPrice).toFixed(2)}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-400 italic">No hay ítems en esta factura.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-end border-t border-slate-200 dark:border-white/5 pt-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-250 dark:hover:bg-white/10 text-slate-750 dark:text-slate-250 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceListModal;
