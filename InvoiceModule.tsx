import React, { useState } from 'react';
import { Item } from '../types';
import { saveRecord, deleteRecord } from '../dataService';
import { UNITS, TAX_RATES, PRESEEDED_ITEMS } from '../constants';
import { Plus, Search, Edit2, Trash2, Package, Tag, Hash, IndianRupee, Percent, Sparkles, Loader2 } from 'lucide-react';
import Modal from './Modal';
import ConfirmModal from './ConfirmModal';
import { suggestItemDetails } from '../services/geminiService';

interface ItemModuleProps {
  items: Item[];
  userId: string;
}

export default function ItemModule({ items, userId }: ItemModuleProps) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSeedConfirmOpen, setIsSeedConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [suggesting, setSuggesting] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState<Partial<Item>>({
    name: '',
    category: '',
    desc: '',
    hsn: '',
    unit: 'Nos',
    rate: 0,
    tax: 18
  });

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.hsn.includes(search) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        category: '',
        desc: '',
        hsn: '',
        unit: 'Nos',
        rate: 0,
        tax: 18
      });
    }
    setIsModalOpen(true);
  };

  const handleSuggest = async () => {
    if (!formData.name) return;
    setSuggesting(true);
    const suggestion = await suggestItemDetails(formData.name);
    if (suggestion) {
      setFormData(prev => ({ ...prev, hsn: suggestion.hsn, desc: suggestion.description }));
    }
    setSuggesting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingItem?.id || Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const newItem: Item = {
      ...formData as Item,
      id,
      createdAt: editingItem?.createdAt || new Date().toISOString(),
      uid: userId
    };
    try {
      await saveRecord('items', id, newItem);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save item.');
    }
  };

  const handleDelete = async (id: string) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteRecord('items', itemToDelete);
        setIsConfirmOpen(false);
      } catch (err) {
        console.error(err);
      } finally {
        setItemToDelete(null);
      }
    }
  };

  const seedItems = async () => {
    setIsSeedConfirmOpen(true);
  };

  const confirmSeed = async () => {
    try {
      for (const item of PRESEEDED_ITEMS) {
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        await saveRecord('items', id, {
          ...item,
          id,
          category: 'General',
          desc: '',
          createdAt: new Date().toISOString(),
          uid: userId
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
          <input
            type="text"
            placeholder="Search items by name, HSN, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1f2e] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={seedItems}
            className="bg-[#1a1f2e] border border-[#252b3b] hover:border-[#6c63ff]/50 text-[#8892ab] hover:text-[#e2e5f0] font-bold py-2.5 px-4 rounded-xl text-sm transition-all"
          >
            Seed Items
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-[#6c63ff]/20"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-[#1a1f2e] border border-[#252b3b] rounded-2xl p-6 hover:border-[#6c63ff]/50 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-[#6c63ff]/10 rounded-lg">
                <Package className="w-5 h-5 text-[#6c63ff]" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(item)} className="p-1.5 hover:bg-[#202536] rounded-lg text-[#8892ab] hover:text-[#6c63ff] transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-[#202536] rounded-lg text-[#8892ab] hover:text-[#ef4444] transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-lg font-bold text-[#e2e5f0] mb-1">{item.name}</h4>
              <p className="text-xs text-[#4e566b] uppercase tracking-wider font-bold">{item.category || 'Uncategorized'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b]">HSN/SAC</p>
                <p className="text-[#e2e5f0] font-mono">{item.hsn || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b]">Unit</p>
                <p className="text-[#e2e5f0]">{item.unit}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b]">Rate</p>
                <p className="text-[#e2e5f0] font-bold">₹{item.rate.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b]">GST %</p>
                <p className="text-[#22c55e] font-bold">{item.tax}%</p>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center bg-[#1a1f2e]/50 border border-dashed border-[#252b3b] rounded-2xl">
            <Package className="w-12 h-12 text-[#4e566b] mx-auto mb-4 opacity-20" />
            <p className="text-[#8892ab] italic">No items found matching your search.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-[#8892ab] hover:bg-[#202536] transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white font-bold py-2.5 px-8 rounded-xl text-sm transition-all shadow-lg shadow-[#6c63ff]/20">
              {editingItem ? 'Update Item' : 'Save Item'}
            </button>
          </>
        }
      >
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b]">Item Name</label>
              <button 
                type="button"
                onClick={handleSuggest}
                disabled={!formData.name || suggesting}
                className="text-[10px] flex items-center gap-1 text-[#6c63ff] hover:text-[#5a52e0] disabled:opacity-50 font-bold"
              >
                {suggesting ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                AI Suggest
              </button>
            </div>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                placeholder="Sound System"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
              placeholder="Electronics"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">HSN/SAC Code</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
              <input
                type="text"
                value={formData.hsn}
                onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                placeholder="997321"
              />
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Description</label>
            <textarea
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors min-h-[80px]"
              placeholder="Full sound setup for outdoor events..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Default Rate (₹)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
              <input
                type="number"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                placeholder="4500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Unit</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors appearance-none"
            >
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">GST Rate (%)</label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
              <select
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: parseInt(e.target.value) })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors appearance-none"
              >
                {TAX_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />

      <ConfirmModal
        isOpen={isSeedConfirmOpen}
        onClose={() => setIsSeedConfirmOpen(false)}
        onConfirm={confirmSeed}
        title="Seed Items"
        message="This will add 12 pre-seeded items to your catalogue. Continue?"
        confirmText="Add Items"
        type="info"
      />
    </div>
  );
}
