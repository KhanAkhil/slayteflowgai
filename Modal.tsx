import React, { useState } from 'react';
import { Customer, Address } from '../types';
import { saveRecord, deleteRecord } from '../dataService';
import { INDIAN_STATES, PRESEEDED_CUSTOMER } from '../constants';
import { Plus, Search, Edit2, Trash2, User, Mail, Phone, MapPin, Building, Briefcase, CreditCard, Landmark, Users, X } from 'lucide-react';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';

interface CustomerModuleProps {
  customers: Customer[];
  userId: string;
}

export default function CustomerModule({ customers, userId }: CustomerModuleProps) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSeedConfirmOpen, setIsSeedConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  const initialAddress: Address = { line1: '', line2: '', city: '', state: 'Karnataka', pin: '', country: 'India' };
  
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    contact: '',
    gstin: '',
    pan: '',
    email: '',
    phone: '',
    phone2: '',
    website: '',
    industry: '',
    type: 'B2B',
    billingAddr: { ...initialAddress },
    shippingAddr: { ...initialAddress },
    creditLimit: 0,
    paymentTerms: 'Net 30',
    bankAccount: '',
    ifsc: '',
    notes: ''
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.gstin.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData(customer);
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        contact: '',
        gstin: '',
        pan: '',
        email: '',
        phone: '',
        phone2: '',
        website: '',
        industry: '',
        type: 'B2B',
        billingAddr: { ...initialAddress },
        shippingAddr: { ...initialAddress },
        creditLimit: 0,
        paymentTerms: 'Net 30',
        bankAccount: '',
        ifsc: '',
        notes: ''
      });
    }
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingCustomer?.id || Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const newCustomer: Customer = {
      ...formData as Customer,
      id,
      createdAt: editingCustomer?.createdAt || new Date().toISOString(),
      uid: userId
    };
    try {
      await saveRecord('customers', id, newCustomer);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save customer.');
    }
  };

  const handleDelete = async (id: string) => {
    setCustomerToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await deleteRecord('customers', customerToDelete);
        setIsConfirmOpen(false);
      } catch (err) {
        console.error(err);
      } finally {
        setCustomerToDelete(null);
      }
    }
  };

  const seedCustomer = async () => {
    setIsSeedConfirmOpen(true);
  };

  const confirmSeed = async () => {
    try {
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      await saveRecord('customers', id, {
        ...PRESEEDED_CUSTOMER,
        id,
        contact: 'Operations Manager',
        industry: 'Real Estate',
        type: 'B2B',
        creditLimit: 500000,
        paymentTerms: 'Net 30',
        createdAt: new Date().toISOString(),
        uid: userId
      });
    } catch (err) {
      console.error(err);
    }
  };

  const copyBillingToShipping = () => {
    setFormData({
      ...formData,
      shippingAddr: { ...formData.billingAddr! }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
          <input
            type="text"
            placeholder="Search customers by name, GSTIN, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1f2e] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={seedCustomer}
            className="bg-[#1a1f2e] border border-[#252b3b] hover:border-[#6c63ff]/50 text-[#8892ab] hover:text-[#e2e5f0] font-bold py-2.5 px-4 rounded-xl text-sm transition-all"
          >
            Seed Customer
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#6c63ff]/20"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-[#1a1f2e] border border-[#252b3b] rounded-2xl p-6 hover:border-[#6c63ff]/50 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-[#6c63ff]/10 rounded-lg">
                <Building className="w-5 h-5 text-[#6c63ff]" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(customer)} className="p-1.5 hover:bg-[#202536] rounded-lg text-[#8892ab] hover:text-[#6c63ff] transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(customer.id)} className="p-1.5 hover:bg-[#202536] rounded-lg text-[#8892ab] hover:text-[#ef4444] transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-lg font-bold text-[#e2e5f0] truncate">{customer.name}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                  customer.type === 'B2B' ? 'bg-[#6c63ff]/10 text-[#6c63ff]' : 'bg-[#06b6d4]/10 text-[#06b6d4]'
                }`}>
                  {customer.type}
                </span>
              </div>
              <p className="text-xs text-[#4e566b] font-mono">{customer.gstin || 'No GSTIN'}</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#8892ab]">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{customer.email || '-'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#8892ab]">
                <Phone className="w-3.5 h-3.5" />
                <span>{customer.phone || '-'}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-[#8892ab]">
                <MapPin className="w-3.5 h-3.5 mt-0.5" />
                <span className="line-clamp-2">{customer.billingAddr.city}, {customer.billingAddr.state}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-20 text-center bg-[#1a1f2e]/50 border border-dashed border-[#252b3b] rounded-2xl">
            <Users className="w-12 h-12 text-[#4e566b] mx-auto mb-4 opacity-20" />
            <p className="text-[#8892ab] italic">No customers found matching your search.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#8892ab] hover:bg-[#202536] transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white font-bold py-2.5 px-8 rounded-xl text-sm transition-all shadow-lg shadow-[#6c63ff]/20">
              {editingCustomer ? 'Update Customer' : 'Save Customer'}
            </button>
          </>
        }
      >
        <div className="flex gap-2 mb-8 border-b border-[#252b3b] overflow-x-auto">
          {[
            { id: 'basic', label: 'Basic Info', icon: User },
            { id: 'billing', label: 'Billing Address', icon: MapPin },
            { id: 'shipping', label: 'Shipping Address', icon: MapPin },
            { id: 'finance', label: 'Finance & Notes', icon: CreditCard }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab.id ? 'border-[#6c63ff] text-[#6c63ff]' : 'border-transparent text-[#4e566b] hover:text-[#8892ab]'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                  placeholder="Godrej Properties Ltd"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">GSTIN</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                  placeholder="29AAACG3995M1ZX"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">PAN</label>
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                  placeholder="AAACG3995M"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                  placeholder="contact@godrej.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Customer Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors appearance-none"
                >
                  <option value="B2B">B2B (Business)</option>
                  <option value="B2C">B2C (Individual)</option>
                  <option value="Government">Government</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                  placeholder="Real Estate"
                />
              </div>
            </div>
          )}

          {(activeTab === 'billing' || activeTab === 'shipping') && (
            <div className="space-y-6">
              {activeTab === 'shipping' && (
                <button
                  type="button"
                  onClick={copyBillingToShipping}
                  className="text-xs text-[#6c63ff] font-bold hover:underline flex items-center gap-2"
                >
                  <Plus className="w-3 h-3" />
                  Same as Billing Address
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Address Line 1</label>
                  <input
                    type="text"
                    value={activeTab === 'billing' ? formData.billingAddr?.line1 : formData.shippingAddr?.line1}
                    onChange={(e) => {
                      const addr = activeTab === 'billing' ? { ...formData.billingAddr! } : { ...formData.shippingAddr! };
                      addr.line1 = e.target.value;
                      setFormData({ ...formData, [activeTab === 'billing' ? 'billingAddr' : 'shippingAddr']: addr });
                    }}
                    className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    placeholder="9th Floor, Unit No.4 & 5"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Address Line 2</label>
                  <input
                    type="text"
                    value={activeTab === 'billing' ? formData.billingAddr?.line2 : formData.shippingAddr?.line2}
                    onChange={(e) => {
                      const addr = activeTab === 'billing' ? { ...formData.billingAddr! } : { ...formData.shippingAddr! };
                      addr.line2 = e.target.value;
                      setFormData({ ...formData, [activeTab === 'billing' ? 'billingAddr' : 'shippingAddr']: addr });
                    }}
                    className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    placeholder="Indiranagar"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">City</label>
                  <input
                    type="text"
                    value={activeTab === 'billing' ? formData.billingAddr?.city : formData.shippingAddr?.city}
                    onChange={(e) => {
                      const addr = activeTab === 'billing' ? { ...formData.billingAddr! } : { ...formData.shippingAddr! };
                      addr.city = e.target.value;
                      setFormData({ ...formData, [activeTab === 'billing' ? 'billingAddr' : 'shippingAddr']: addr });
                    }}
                    className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    placeholder="Bangalore"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">State</label>
                  <select
                    value={activeTab === 'billing' ? formData.billingAddr?.state : formData.shippingAddr?.state}
                    onChange={(e) => {
                      const addr = activeTab === 'billing' ? { ...formData.billingAddr! } : { ...formData.shippingAddr! };
                      addr.state = e.target.value;
                      setFormData({ ...formData, [activeTab === 'billing' ? 'billingAddr' : 'shippingAddr']: addr });
                    }}
                    className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors appearance-none"
                  >
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">PIN Code</label>
                  <input
                    type="text"
                    value={activeTab === 'billing' ? formData.billingAddr?.pin : formData.shippingAddr?.pin}
                    onChange={(e) => {
                      const addr = activeTab === 'billing' ? { ...formData.billingAddr! } : { ...formData.shippingAddr! };
                      addr.pin = e.target.value;
                      setFormData({ ...formData, [activeTab === 'billing' ? 'billingAddr' : 'shippingAddr']: addr });
                    }}
                    className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    placeholder="560038"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Country</label>
                  <input
                    type="text"
                    value={activeTab === 'billing' ? formData.billingAddr?.country : formData.shippingAddr?.country}
                    onChange={(e) => {
                      const addr = activeTab === 'billing' ? { ...formData.billingAddr! } : { ...formData.shippingAddr! };
                      addr.country = e.target.value;
                      setFormData({ ...formData, [activeTab === 'billing' ? 'billingAddr' : 'shippingAddr']: addr });
                    }}
                    className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    placeholder="India"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Credit Limit (₹)</label>
                <input
                  type="number"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                  placeholder="500000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Payment Terms</label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors appearance-none"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Bank Account No.</label>
                <div className="relative">
                  <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
                  <input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    placeholder="1234567890"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifsc}
                  onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                  placeholder="SBIN0001234"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Internal Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors min-h-[80px]"
                  placeholder="Important client, prefers email communication..."
                />
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />

      <ConfirmModal
        isOpen={isSeedConfirmOpen}
        onClose={() => setIsSeedConfirmOpen(false)}
        onConfirm={confirmSeed}
        title="Seed Customer"
        message="This will add Godrej Properties Ltd to your database. Continue?"
        confirmText="Add Customer"
        type="info"
      />
    </div>
  );
}
