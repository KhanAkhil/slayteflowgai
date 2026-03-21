import React, { useState, useMemo } from 'react';
import { ProformaInvoice, Customer, Item, PILineItem, PIStatus, TaxType } from '../types';
import { saveRecord, deleteRecord } from '../dataService';
import { INDIAN_STATES, UNITS, TAX_RATES } from '../constants';
import { generateProformaPDF } from '../pdfService';
import { Plus, Search, Edit2, Trash2, Download, Eye, PlusCircle, Trash, UserPlus, X } from 'lucide-react';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';
import { format } from 'date-fns';

interface ProformaModuleProps {
  pis: ProformaInvoice[];
  customers: Customer[];
  items: Item[];
  company: any;
  userId: string;
}

export default function ProformaModule({ pis, customers, items, company, userId }: ProformaModuleProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<PIStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [piToDelete, setPiToDelete] = useState<string | null>(null);
  const [editingPI, setEditingPI] = useState<ProformaInvoice | null>(null);
  const [viewingPI, setViewingPI] = useState<ProformaInvoice | null>(null);

  const [formData, setFormData] = useState<Partial<ProformaInvoice>>({});
  const [lineItems, setLineItems] = useState<PILineItem[]>([]);

  const filteredPIs = pis.filter(pi => {
    const matchesSearch = pi.number.toLowerCase().includes(search.toLowerCase()) || 
                          pi.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || pi.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((acc, item) => acc + (item.qty * item.rate), 0);
    const taxTotal = subtotal * 0.18; // Standard 18% for proforma
    const grand = subtotal + taxTotal;
    return { subtotal, taxTotal, grand };
  }, [lineItems]);

  const handleOpenModal = (pi?: ProformaInvoice) => {
    if (pi) {
      setEditingPI(pi);
      setFormData(pi);
      setLineItems(pi.items);
    } else {
      setEditingPI(null);
      const nextNum = pis.length + 1;
      setFormData({
        number: `PI-${nextNum.toString().padStart(4, '0')}`,
        date: format(new Date(), 'yyyy-MM-dd'),
        validUntil: format(new Date(), 'yyyy-MM-dd'),
        status: 'draft',
        taxType: company?.taxtype || 'gst',
        supplierName: company?.name || '',
        supplierGstin: company?.gstin || '',
        supplierAddr: company?.address || '',
        supplierPhone: company?.phone || '',
        supplierEmail: company?.email || '',
        customerName: '',
        customerGstin: '',
        customerCity: '',
        siteName: '',
        salutation: 'Dear Sir,',
        notes: ''
      });
      setLineItems([{ id: '1', name: '', hsn: '', qty: 1, unit: 'Nos', rate: 0 }]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingPI?.id || Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const newPI: ProformaInvoice = {
      ...formData as ProformaInvoice,
      id,
      items: lineItems,
      ...totals,
      createdAt: editingPI?.createdAt || new Date().toISOString(),
      uid: userId
    };
    await saveRecord('proforma_invoices', id, newPI);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    setPiToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (piToDelete) {
      try {
        await deleteRecord('proforma_invoices', piToDelete);
      } catch (err) {
        console.error(err);
      } finally {
        setPiToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#1a1f2e] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff]" />
          </div>
          <div className="flex bg-[#1a1f2e] p-1 rounded-xl border border-[#252b3b]">
            {['all', 'draft', 'sent', 'accepted'].map((f) => (
              <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-[#6c63ff] text-white' : 'text-[#4e566b] hover:text-[#8892ab]'}`}>{f}</button>
            ))}
          </div>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#6c63ff]/20">
          <Plus className="w-4 h-4" /> New Proforma
        </button>
      </div>

      <div className="bg-[#1a1f2e] border border-[#252b3b] rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] border-b border-[#252b3b]">
                <th className="px-6 py-4">PI #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 hidden md:table-cell">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 hidden lg:table-cell">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252b3b]">
              {filteredPIs.map((pi) => (
                <tr key={pi.id} className="text-sm group hover:bg-[#202536]/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[#6c63ff]">{pi.number}</td>
                  <td className="px-6 py-4 text-[#e2e5f0] font-medium">{pi.customerName}</td>
                  <td className="px-6 py-4 text-[#8892ab] hidden md:table-cell">{pi.date}</td>
                  <td className="px-6 py-4 text-[#e2e5f0] font-bold">₹{pi.grand.toLocaleString()}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${pi.status === 'accepted' ? 'bg-[#22c55e]/10 text-[#22c55e]' : pi.status === 'sent' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-[#4e566b]/10 text-[#8892ab]'}`}>{pi.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setViewingPI(pi); setIsViewModalOpen(true); }} className="p-2 hover:bg-[#252b3b] rounded-lg text-[#8892ab] hover:text-[#6c63ff]"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenModal(pi)} className="p-2 hover:bg-[#252b3b] rounded-lg text-[#8892ab] hover:text-[#6c63ff]"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => generateProformaPDF(pi)} className="p-2 hover:bg-[#252b3b] rounded-lg text-[#8892ab] hover:text-[#22c55e]"><Download className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(pi.id)} className="p-2 hover:bg-[#252b3b] rounded-lg text-[#8892ab] hover:text-[#ef4444]"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-[#252b3b]">
          {filteredPIs.map((pi) => (
            <div key={pi.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-[#6c63ff] text-xs">{pi.number}</p>
                  <h4 className="text-[#e2e5f0] font-bold">{pi.customerName}</h4>
                  <p className="text-[10px] text-[#4e566b]">{pi.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${pi.status === 'accepted' ? 'bg-[#22c55e]/10 text-[#22c55e]' : pi.status === 'sent' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-[#4e566b]/10 text-[#8892ab]'}`}>{pi.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-[#e2e5f0]">₹{pi.grand.toLocaleString()}</p>
                <div className="flex gap-1">
                  <button onClick={() => { setViewingPI(pi); setIsViewModalOpen(true); }} className="p-2 bg-[#202536] rounded-lg text-[#8892ab]"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleOpenModal(pi)} className="p-2 bg-[#202536] rounded-lg text-[#8892ab]"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => generateProformaPDF(pi)} className="p-2 bg-[#202536] rounded-lg text-[#8892ab]"><Download className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(pi.id)} className="p-2 bg-[#202536] rounded-lg text-[#ef4444]"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingPI ? 'Edit Proforma' : 'New Proforma'} 
        footer={
          <div className="flex flex-col sm:flex-row justify-between w-full items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-[10px] uppercase font-bold text-[#4e566b]">Grand Total</p>
              <p className="text-xl font-bold text-[#6c63ff]">₹{totals.grand.toLocaleString()}</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold text-[#8892ab] hover:bg-[#1a1f2e]">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 sm:flex-none bg-[#6c63ff] text-white font-bold py-2.5 px-8 rounded-xl text-sm shadow-lg shadow-[#6c63ff]/20">Save</button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} className="bg-[#202536] border border-[#252b3b] rounded-xl py-2 px-3 text-sm focus:border-[#6c63ff] outline-none" placeholder="PI #" />
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="bg-[#202536] border border-[#252b3b] rounded-xl py-2 px-3 text-sm focus:border-[#6c63ff] outline-none" />
            <input type="date" value={formData.validUntil} onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })} className="bg-[#202536] border border-[#252b3b] rounded-xl py-2 px-3 text-sm focus:border-[#6c63ff] outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-[#252b3b]">
              <h4 className="text-xs font-bold mb-2">Customer</h4>
              <input type="text" placeholder="Name" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs mb-2 focus:border-[#6c63ff] outline-none" />
              <input type="text" placeholder="City" value={formData.customerCity} onChange={(e) => setFormData({ ...formData, customerCity: e.target.value })} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs mb-2 focus:border-[#6c63ff] outline-none" />
              <input type="text" placeholder="Site Name" value={formData.siteName} onChange={(e) => setFormData({ ...formData, siteName: e.target.value })} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs focus:border-[#6c63ff] outline-none" />
            </div>
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-[#252b3b]">
              <h4 className="text-xs font-bold mb-2">Status</h4>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs mb-2 focus:border-[#6c63ff] outline-none"><option value="draft">Draft</option><option value="sent">Sent</option><option value="accepted">Accepted</option></select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center"><h4 className="text-xs font-bold">Items</h4><button type="button" onClick={() => setLineItems([...lineItems, { id: Date.now().toString(), name: '', hsn: '', qty: 1, unit: 'Nos', rate: 0 }])} className="text-[10px] text-[#6c63ff] font-bold">+ Add</button></div>
            <div className="border border-[#252b3b] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-[10px] min-w-[500px]">
                <thead className="bg-[#202536] text-[#4e566b]"><tr><th className="p-2">Item</th><th className="p-2 w-12">Qty</th><th className="p-2 w-20">Rate</th><th className="p-2 text-right">Total</th><th className="p-2 w-8"></th></tr></thead>
                <tbody>
                  {lineItems.map((item) => (
                    <tr key={item.id} className="border-t border-[#252b3b]">
                      <td className="p-2"><input type="text" value={item.name} onChange={(e) => setLineItems(lineItems.map(li => li.id === item.id ? { ...li, name: e.target.value } : li))} className="w-full bg-transparent border-none p-0" placeholder="Item name" /></td>
                      <td className="p-2"><input type="number" value={item.qty} onChange={(e) => setLineItems(lineItems.map(li => li.id === item.id ? { ...li, qty: parseFloat(e.target.value) } : li))} className="w-full bg-transparent border-none p-0" /></td>
                      <td className="p-2"><input type="number" value={item.rate} onChange={(e) => setLineItems(lineItems.map(li => li.id === item.id ? { ...li, rate: parseFloat(e.target.value) } : li))} className="w-full bg-transparent border-none p-0" /></td>
                      <td className="p-2 text-right">₹{(item.qty * item.rate).toLocaleString()}</td>
                      <td className="p-2"><button type="button" onClick={() => setLineItems(lineItems.filter(li => li.id !== item.id))} className="text-[#ef4444]">×</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Proforma" footer={<button onClick={() => generateProformaPDF(viewingPI!)} className="bg-[#6c63ff] text-white font-bold py-2 px-6 rounded-xl text-sm">Download PDF</button>}>
        {viewingPI && <div className="space-y-4 text-sm"><div className="grid grid-cols-2 gap-4"><div><p className="text-[10px] font-bold text-[#4e566b]">Customer</p><p>{viewingPI.customerName}</p></div><div><p className="text-[10px] font-bold text-[#4e566b]">Date</p><p>{viewingPI.date}</p></div></div><div className="border border-[#252b3b] rounded-xl p-4"><div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-[#6c63ff]">₹{viewingPI.grand.toLocaleString()}</span></div></div></div>}
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Proforma"
        message="Are you sure you want to delete this proforma? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}
