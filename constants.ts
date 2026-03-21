import React, { useState, useMemo, useCallback } from 'react';
import { Invoice, Customer, Item, LineItem, DocType, InvoiceStatus, TaxType, Quotation } from '../types';
import { saveRecord, deleteRecord } from '../dataService';
import { INDIAN_STATES, UNITS, TAX_RATES, COMMON_HSN } from '../constants';
import { generateInvoicePDF } from '../pdfService';
import { Plus, Search, Edit2, Trash2, Download, Eye, PlusCircle, Trash, UserPlus, Share2, Mail, MessageCircle, ChevronDown, ChevronUp, MoreVertical, Sparkles, Loader2, X } from 'lucide-react';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';
import { format } from 'date-fns';
import { suggestItemDetails } from '../services/geminiService';

interface InvoiceModuleProps {
  invoices: Invoice[];
  customers: Customer[];
  items: Item[];
  company: any;
  userId: string;
  isQuotation?: boolean;
  isCreditNote?: boolean;
}

export default function InvoiceModule({ invoices, customers, items, company, userId, isQuotation, isCreditNote }: InvoiceModuleProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  const [formData, setFormData] = useState<Partial<Invoice>>({});
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [showItemDropdown, setShowItemDropdown] = useState<string | null>(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showHSNDropdown, setShowHSNDropdown] = useState<string | null>(null);
  const [suggestingId, setSuggestingId] = useState<string | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.number.toLowerCase().includes(search.toLowerCase()) || 
                          inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || inv.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((acc, item) => acc + (item.qty * item.rate), 0);
    const discTotal = lineItems.reduce((acc, item) => acc + (item.qty * item.rate * (item.disc / 100)), 0);
    const taxableAmount = subtotal - discTotal;
    const taxTotal = lineItems.reduce((acc, item) => {
      const itemTaxable = (item.qty * item.rate) * (1 - item.disc / 100);
      return acc + (itemTaxable * (item.tax / 100));
    }, 0);
    const grand = taxableAmount + taxTotal;
    return { subtotal, discTotal, taxTotal, grand };
  }, [lineItems]);

  const handleOpenModal = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData(invoice);
      setLineItems(invoice.items);
    } else {
      setEditingInvoice(null);
      const nextNum = invoices.length + 1;
      let prefix = company?.prefix || 'INV';
      if (isQuotation) prefix = 'QT';
      if (isCreditNote) prefix = 'CN';
      
      setFormData({
        number: `${prefix}-${nextNum.toString().padStart(4, '0')}`,
        date: format(new Date(), 'yyyy-MM-dd'),
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'pending',
        docType: isQuotation ? 'quotation' : (isCreditNote ? 'credit' : 'tax'),
        taxType: company?.taxtype || 'gst',
        placeOfSupply: company?.state || 'Karnataka',
        supplierName: company?.name || '',
        supplierGstin: company?.gstin || '',
        supplierAddr: company?.address || '',
        supplierPhone: company?.phone || '',
        supplierEmail: company?.email || '',
        customerName: '',
        customerGstin: '',
        customerEmail: '',
        customerPhone: '',
        billingAddr: { line1: '', line2: '', city: '', state: 'Karnataka', pin: '', country: 'India' },
        shippingAddr: { line1: '', line2: '', city: '', state: 'Karnataka', pin: '', country: 'India' },
        notes: '',
        terms: company?.terms || '',
        refNumber: '',
        lrNumber: '',
        siteName: '',
        salutation: 'Dear Sir,'
      });
      setLineItems([{ id: '1', name: '', desc: '', hsn: '', qty: 1, unit: 'Nos', rate: 0, tax: 18, disc: 0 }]);
    }
    setIsModalOpen(true);
  };

  const handleAutoSave = async (invoice: Invoice) => {
    // Auto-save customer if new
    const existingCustomer = customers.find(c => c.name.toLowerCase() === invoice.customerName.toLowerCase() || (invoice.customerGstin && c.gstin === invoice.customerGstin));
    if (!existingCustomer && invoice.customerName) {
      const customerId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      const newCustomer: Customer = {
        id: customerId,
        name: invoice.customerName,
        contact: '',
        gstin: invoice.customerGstin || '',
        pan: '',
        email: invoice.customerEmail || '',
        phone: invoice.customerPhone || '',
        phone2: '',
        website: '',
        industry: '',
        type: 'B2B',
        billingAddr: invoice.billingAddr,
        shippingAddr: invoice.shippingAddr,
        creditLimit: 0,
        paymentTerms: '',
        bankAccount: '',
        ifsc: '',
        notes: 'Auto-added from invoice',
        createdAt: new Date().toISOString(),
        uid: userId
      };
      await saveRecord('customers', customerId, newCustomer);
    }

    // Auto-save items if new
    for (const lineItem of invoice.items) {
      const existingItem = items.find(i => i.name.toLowerCase() === lineItem.name.toLowerCase());
      if (!existingItem && lineItem.name) {
        const itemId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        const newItem: Item = {
          id: itemId,
          name: lineItem.name,
          category: 'General',
          desc: lineItem.desc || '',
          hsn: lineItem.hsn || '',
          unit: lineItem.unit || 'Nos',
          rate: lineItem.rate,
          tax: lineItem.tax,
          createdAt: new Date().toISOString(),
          uid: userId
        };
        await saveRecord('items', itemId, newItem);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingInvoice?.id || Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const newInvoice: Invoice = {
      ...formData as Invoice,
      id,
      items: lineItems,
      ...totals,
      createdAt: editingInvoice?.createdAt || new Date().toISOString(),
      uid: userId
    };
    const collectionName = isQuotation ? 'quotations' : 'invoices';
    await saveRecord(collectionName, id, newInvoice);
    await handleAutoSave(newInvoice);
    setIsModalOpen(false);
  };

  const handleShareWhatsApp = (inv: Invoice) => {
    const text = `Hi, here is your ${isQuotation ? 'Quotation' : 'Invoice'} ${inv.number} for ₹${inv.grand.toLocaleString()}. View it here: ${window.location.origin}`;
    window.open(`https://wa.me/${inv.customerPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = (inv: Invoice) => {
    const subject = `${isQuotation ? 'Quotation' : 'Invoice'} ${inv.number} from ${company?.name}`;
    const body = `Hi ${inv.customerName},\n\nPlease find attached the ${isQuotation ? 'quotation' : 'invoice'} ${inv.number} for ₹${inv.grand.toLocaleString()}.\n\nRegards,\n${company?.name}`;
    window.location.href = `mailto:${inv.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSuggest = async (id: string, name: string) => {
    if (!name) return;
    setSuggestingId(id);
    const suggestion = await suggestItemDetails(name);
    if (suggestion) {
      setLineItems(lineItems.map(li => li.id === id ? { ...li, hsn: suggestion.hsn, desc: suggestion.description } : li));
    }
    setSuggestingId(null);
  };

  const handleDelete = async (id: string) => {
    setInvoiceToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (invoiceToDelete) {
      const collectionName = isQuotation ? 'quotations' : 'invoices';
      try {
        await deleteRecord(collectionName, invoiceToDelete);
      } catch (err) {
        console.error(err);
      } finally {
        setInvoiceToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#1a1f2e] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff]" />
          </div>
          <div className="flex bg-[#1a1f2e] p-1 rounded-xl border border-[#252b3b] overflow-x-auto no-scrollbar">
            {['all', 'pending', 'paid', 'overdue'].map((f) => (
              <button key={f} onClick={() => setFilter(f as any)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filter === f ? 'bg-[#6c63ff] text-white' : 'text-[#4e566b] hover:text-[#8892ab]'}`}>{f}</button>
            ))}
          </div>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6c63ff]/20">
          <Plus className="w-4 h-4" /> New {isQuotation ? 'Quotation' : (isCreditNote ? 'Credit Note' : 'Invoice')}
        </button>
      </div>

      <div className="bg-[#1a1f2e] border border-[#252b3b] rounded-2xl overflow-hidden shadow-sm">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] border-b border-[#252b3b]">
                <th className="px-6 py-4">{isQuotation ? 'Quotation' : (isCreditNote ? 'Credit Note' : 'Invoice')} #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4 hidden md:table-cell">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 hidden lg:table-cell">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252b3b]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="text-sm group hover:bg-[#202536]/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[#6c63ff]">{inv.number}</td>
                  <td className="px-6 py-4">
                    <div className="text-[#e2e5f0] font-medium">{inv.customerName}</div>
                    <div className="text-[10px] text-[#4e566b] md:hidden">{inv.date}</div>
                  </td>
                  <td className="px-6 py-4 text-[#8892ab] hidden md:table-cell">{inv.date}</td>
                  <td className="px-6 py-4 text-[#e2e5f0] font-bold">₹{inv.grand.toLocaleString()}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${inv.status === 'paid' ? 'bg-[#22c55e]/10 text-[#22c55e]' : inv.status === 'pending' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : inv.status === 'overdue' ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#4e566b]/10 text-[#8892ab]'}`}>{inv.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 sm:gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setViewingInvoice(inv); setIsViewModalOpen(true); }} className="p-2 hover:bg-[#252b3b] rounded-lg text-[#8892ab] hover:text-[#6c63ff]"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => handleOpenModal(inv)} className="p-2 hover:bg-[#252b3b] rounded-lg text-[#8892ab] hover:text-[#6c63ff]"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => generateInvoicePDF(inv)} className="p-2 hover:bg-[#252b3b] rounded-lg text-[#8892ab] hover:text-[#22c55e]"><Download className="w-4 h-4" /></button>
                      <button onClick={() => handleShareWhatsApp(inv)} className="p-2 hover:bg-[#252b3b] rounded-lg text-[#8892ab] hover:text-[#22c55e]"><Share2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(inv.id)} className="p-2 hover:bg-[#252b3b] rounded-lg text-[#8892ab] hover:text-[#ef4444]"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden divide-y divide-[#252b3b]">
          {filteredInvoices.map((inv) => (
            <div key={inv.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-[#6c63ff] text-xs">{inv.number}</p>
                  <h4 className="text-[#e2e5f0] font-bold">{inv.customerName}</h4>
                  <p className="text-[10px] text-[#4e566b]">{inv.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${inv.status === 'paid' ? 'bg-[#22c55e]/10 text-[#22c55e]' : inv.status === 'pending' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : inv.status === 'overdue' ? 'bg-[#ef4444]/10 text-[#ef4444]' : 'bg-[#4e566b]/10 text-[#8892ab]'}`}>{inv.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-[#e2e5f0]">₹{inv.grand.toLocaleString()}</p>
                <div className="flex gap-1">
                  <button onClick={() => { setViewingInvoice(inv); setIsViewModalOpen(true); }} className="p-2 bg-[#202536] rounded-lg text-[#8892ab]"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleOpenModal(inv)} className="p-2 bg-[#202536] rounded-lg text-[#8892ab]"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => generateInvoicePDF(inv)} className="p-2 bg-[#202536] rounded-lg text-[#8892ab]"><Download className="w-4 h-4" /></button>
                  <button onClick={() => handleShareWhatsApp(inv)} className="p-2 bg-[#202536] rounded-lg text-[#8892ab]"><Share2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(inv.id)} className="p-2 bg-[#202536] rounded-lg text-[#ef4444]"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingInvoice ? `Edit ${isQuotation ? 'Quotation' : (isCreditNote ? 'Credit Note' : 'Invoice')}` : `New ${isQuotation ? 'Quotation' : (isCreditNote ? 'Credit Note' : 'Invoice')}`} 
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
        <div className="space-y-6 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#4e566b] mb-1 ml-1">Number</label>
              <input type="text" value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2 px-3 text-sm focus:border-[#6c63ff] outline-none" placeholder="Invoice #" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#4e566b] mb-1 ml-1">Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2 px-3 text-sm focus:border-[#6c63ff] outline-none" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#4e566b] mb-1 ml-1">Due Date</label>
              <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2 px-3 text-sm focus:border-[#6c63ff] outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-[#252b3b] relative">
              <div className="flex justify-between mb-2">
                <h4 className="text-xs font-bold">Customer Details</h4>
                <button 
                  type="button" 
                  onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                  className="text-[10px] text-[#6c63ff] font-bold flex items-center gap-1"
                >
                  <Search className="w-3 h-3" /> Select from DB
                </button>
              </div>
              
              {showCustomerDropdown && (
                <div className="absolute top-12 right-4 left-4 bg-[#141824] border border-[#252b3b] rounded-xl shadow-2xl z-30 max-h-48 overflow-y-auto">
                  {customers.map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          customerName: c.name,
                          customerGstin: c.gstin,
                          customerEmail: c.email,
                          customerPhone: c.phone,
                          billingAddr: c.billingAddr,
                          shippingAddr: c.shippingAddr
                        });
                        setShowCustomerDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-[#6c63ff]/10 border-b border-[#252b3b] last:border-0"
                    >
                      <p className="font-bold">{c.name}</p>
                      <p className="text-[10px] text-[#4e566b]">{c.gstin}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <input type="text" placeholder="Customer Name" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="GSTIN" value={formData.customerGstin} onChange={(e) => setFormData({ ...formData, customerGstin: e.target.value })} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs" />
                  <input type="text" placeholder="Phone" value={formData.customerPhone} onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs" />
                </div>
                <input type="email" placeholder="Email" value={formData.customerEmail} onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs" />
              </div>
            </div>

            <div className="bg-[#1a1f2e] p-4 rounded-xl border border-[#252b3b]">
              <h4 className="text-xs font-bold mb-2">Tax & Supply</h4>
              <div className="space-y-2">
                <select value={formData.taxType} onChange={(e) => setFormData({ ...formData, taxType: e.target.value as any })} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs">
                  <option value="gst">CGST + SGST (Intra-state)</option>
                  <option value="igst">IGST (Inter-state)</option>
                </select>
                <select value={formData.placeOfSupply} onChange={(e) => setFormData({ ...formData, placeOfSupply: e.target.value })} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs">
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex items-center gap-2">
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="flex-1 bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs">
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {!isQuotation && (
                    <select value={formData.docType} onChange={(e) => setFormData({ ...formData, docType: e.target.value as any })} className="flex-1 bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs">
                      <option value="tax">Tax Invoice</option>
                      <option value="credit">Credit Note</option>
                      <option value="draft">Draft</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold">Line Items</h4>
              <button 
                type="button" 
                onClick={() => setLineItems([...lineItems, { id: Date.now().toString(), name: '', desc: '', hsn: '', qty: 1, unit: 'Nos', rate: 0, tax: 18, disc: 0 }])} 
                className="text-[10px] bg-[#6c63ff]/10 text-[#6c63ff] px-3 py-1 rounded-lg font-bold hover:bg-[#6c63ff]/20 transition-colors"
              >
                + Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={item.id} className="bg-[#1a1f2e] border border-[#252b3b] rounded-xl p-4 relative group">
                  <button 
                    type="button" 
                    onClick={() => setLineItems(lineItems.filter(li => li.id !== item.id))} 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-[#ef4444] text-white rounded-full flex items-center justify-center text-xs shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    ×
                  </button>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5 relative">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[9px] uppercase font-bold text-[#4e566b]">Item Name</label>
                        <button 
                          type="button"
                          onClick={() => handleSuggest(item.id, item.name)}
                          disabled={!item.name || suggestingId === item.id}
                          className="text-[9px] flex items-center gap-1 text-[#6c63ff] hover:text-[#5a52e0] disabled:opacity-50 font-bold"
                          title="Auto-fill description and HSN using AI"
                        >
                          {suggestingId === item.id ? <Loader2 className="w-2 h-2 animate-spin" /> : <Sparkles className="w-2 h-2" />}
                          AI Suggest
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={item.name} 
                          onChange={(e) => {
                            const val = e.target.value;
                            setLineItems(lineItems.map(li => li.id === item.id ? { ...li, name: val } : li));
                            setShowItemDropdown(val.length > 0 ? item.id : null);
                          }} 
                          className="flex-1 bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs" 
                          placeholder="Search or type item..." 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowItemDropdown(showItemDropdown === item.id ? null : item.id)}
                          className="p-1.5 bg-[#202536] border border-[#252b3b] rounded-lg text-[#4e566b]"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                      
                      {showItemDropdown === item.id && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#141824] border border-[#252b3b] rounded-xl shadow-2xl z-30 max-h-40 overflow-y-auto">
                          {items.filter(i => i.name.toLowerCase().includes(item.name.toLowerCase())).map(i => (
                            <button
                              key={i.id}
                              onClick={() => {
                                setLineItems(lineItems.map(li => li.id === item.id ? { ...li, name: i.name, hsn: i.hsn, rate: i.rate, tax: i.tax, desc: i.desc } : li));
                                setShowItemDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-xs hover:bg-[#6c63ff]/10 border-b border-[#252b3b] last:border-0"
                            >
                              <p className="font-bold">{i.name}</p>
                              <p className="text-[10px] text-[#4e566b]">₹{i.rate} · {i.hsn}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-3 relative">
                      <label className="block text-[9px] uppercase font-bold text-[#4e566b] mb-1">HSN/SAC</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={item.hsn} 
                          onChange={(e) => {
                            const val = e.target.value;
                            setLineItems(lineItems.map(li => li.id === item.id ? { ...li, hsn: val } : li));
                            setShowHSNDropdown(val.length > 0 ? item.id : null);
                          }} 
                          className="flex-1 bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs" 
                          placeholder="HSN Code" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowHSNDropdown(showHSNDropdown === item.id ? null : item.id)}
                          className="p-1.5 bg-[#202536] border border-[#252b3b] rounded-lg text-[#4e566b]"
                        >
                          <Search className="w-3 h-3" />
                        </button>
                      </div>

                      {showHSNDropdown === item.id && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#141824] border border-[#252b3b] rounded-xl shadow-2xl z-30 max-h-40 overflow-y-auto">
                          {COMMON_HSN.filter(h => h.code.includes(item.hsn) || h.desc.toLowerCase().includes(item.hsn.toLowerCase())).map(h => (
                            <button
                              key={h.code}
                              onClick={() => {
                                setLineItems(lineItems.map(li => li.id === item.id ? { ...li, hsn: h.code } : li));
                                setShowHSNDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 text-[10px] hover:bg-[#6c63ff]/10 border-b border-[#252b3b] last:border-0"
                            >
                              <p className="font-bold text-[#6c63ff]">{h.code}</p>
                              <p className="text-[#8892ab] line-clamp-1">{h.desc}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[9px] uppercase font-bold text-[#4e566b] mb-1">Qty</label>
                      <input type="number" value={item.qty} onChange={(e) => setLineItems(lineItems.map(li => li.id === item.id ? { ...li, qty: parseFloat(e.target.value) || 0 } : li))} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs" />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[9px] uppercase font-bold text-[#4e566b] mb-1">Rate</label>
                      <input type="number" value={item.rate} onChange={(e) => setLineItems(lineItems.map(li => li.id === item.id ? { ...li, rate: parseFloat(e.target.value) || 0 } : li))} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-3">
                    <div className="sm:col-span-8">
                      <label className="block text-[9px] uppercase font-bold text-[#4e566b] mb-1">Description</label>
                      <input type="text" value={item.desc} onChange={(e) => setLineItems(lineItems.map(li => li.id === item.id ? { ...li, desc: e.target.value } : li))} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs" placeholder="Product details..." />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[9px] uppercase font-bold text-[#4e566b] mb-1">Tax %</label>
                      <select value={item.tax} onChange={(e) => setLineItems(lineItems.map(li => li.id === item.id ? { ...li, tax: parseInt(e.target.value) } : li))} className="w-full bg-[#202536] border border-[#252b3b] rounded-lg py-1.5 px-3 text-xs">
                        {TAX_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[9px] uppercase font-bold text-[#4e566b] mb-1 text-right">Total</label>
                      <div className="py-1.5 text-xs font-bold text-right text-[#e2e5f0]">
                        ₹{((item.qty * item.rate) * (1 + item.tax / 100)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        title={`View ${isQuotation ? 'Quotation' : (isCreditNote ? 'Credit Note' : 'Invoice')}`} 
        footer={
          <div className="flex flex-wrap gap-3 w-full justify-end">
            <button onClick={() => handleShareWhatsApp(viewingInvoice!)} className="flex items-center gap-2 bg-[#25d366] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-lg shadow-[#25d366]/20">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
            <button onClick={() => handleShareEmail(viewingInvoice!)} className="flex items-center gap-2 bg-[#ea4335] text-white font-bold py-2 px-4 rounded-xl text-xs shadow-lg shadow-[#ea4335]/20">
              <Mail className="w-4 h-4" /> Email
            </button>
            <button onClick={() => generateInvoicePDF(viewingInvoice!)} className="flex items-center gap-2 bg-[#6c63ff] text-white font-bold py-2 px-6 rounded-xl text-xs shadow-lg shadow-[#6c63ff]/20">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        }
      >
        {viewingInvoice && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-[#252b3b] pb-4">
              <div>
                <p className="text-[10px] font-bold text-[#4e566b] uppercase tracking-wider">Customer</p>
                <p className="text-lg font-bold text-[#e2e5f0]">{viewingInvoice.customerName}</p>
                <p className="text-xs text-[#8892ab]">{viewingInvoice.customerGstin}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[#4e566b] uppercase tracking-wider">{isQuotation ? 'Quotation' : (isCreditNote ? 'Credit Note' : 'Invoice')} #</p>
                <p className="text-lg font-bold text-[#6c63ff] font-mono">{viewingInvoice.number}</p>
                <p className="text-xs text-[#8892ab]">{viewingInvoice.date}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-[#4e566b] uppercase tracking-wider">Items</p>
              <div className="border border-[#252b3b] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#202536] text-[#4e566b]">
                    <tr>
                      <th className="p-3">Item</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#252b3b]">
                    {viewingInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3">
                          <p className="font-bold">{item.name}</p>
                          <p className="text-[10px] text-[#8892ab]">{item.desc}</p>
                        </td>
                        <td className="p-3 text-center">{item.qty} {item.unit}</td>
                        <td className="p-3 text-right font-bold">₹{((item.qty * item.rate) * (1 + item.tax / 100)).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#1a1f2e] border border-[#252b3b] rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#8892ab] uppercase tracking-wider">Total Amount</span>
                <span className="text-2xl font-bold text-[#6c63ff]">₹{viewingInvoice.grand.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${isQuotation ? 'Quotation' : (isCreditNote ? 'Credit Note' : 'Invoice')}`}
        message={`Are you sure you want to delete this ${isQuotation ? 'quotation' : (isCreditNote ? 'credit note' : 'invoice')}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
}
