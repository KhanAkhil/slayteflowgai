import React, { useState } from 'react';
import { Company } from '../types';
import { saveRecord } from '../dataService';
import { INDIAN_STATES, PAYMENT_TERMS } from '../constants';
import { Save, Building2, Globe, Mail, Phone, MapPin, FileText } from 'lucide-react';

interface CompanyModuleProps {
  company: Company | null;
  userId: string;
}

export default function CompanyModule({ company, userId }: CompanyModuleProps) {
  const [formData, setFormData] = useState<Company>(company || {
    name: '',
    gstin: '',
    pan: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: 'Karnataka',
    pin: '',
    prefix: 'INV',
    taxtype: 'gst',
    terms: '',
    uid: userId
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveRecord('company', userId, formData);
      alert('Company profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#1a1f2e] border border-[#252b3b] rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#6c63ff]/10 rounded-lg">
              <Building2 className="w-5 h-5 text-[#6c63ff]" />
            </div>
            <h3 className="text-xl font-bold text-[#e2e5f0]">Company Profile</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                placeholder="AK Events and Tent House"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">GSTIN</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                placeholder="29BUUPA1314C1ZY"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">PAN</label>
              <input
                type="text"
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                placeholder="BUUPA1314C"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                  placeholder="akevents@outlook.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                  placeholder="7676965155"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4e566b]" />
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                  placeholder="www.akevents.com"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Full Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#4e566b]" />
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors min-h-[80px]"
                placeholder="Shop No 1, Khajisonnenahalli Village..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                placeholder="Bangalore"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors appearance-none"
              >
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">PIN Code</label>
              <input
                type="text"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                placeholder="560067"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#1a1f2e] border border-[#252b3b] rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[#6c63ff]/10 rounded-lg">
              <FileText className="w-5 h-5 text-[#6c63ff]" />
            </div>
            <h3 className="text-xl font-bold text-[#e2e5f0]">Billing Defaults</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Invoice Prefix</label>
              <input
                type="text"
                value={formData.prefix}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                placeholder="INV"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Tax Type</label>
              <select
                value={formData.taxtype}
                onChange={(e) => setFormData({ ...formData, taxtype: e.target.value as any })}
                className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors appearance-none"
              >
                <option value="gst">CGST + SGST (Intra-state)</option>
                <option value="igst">IGST (Inter-state)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] ml-1">Default Terms & Conditions</label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              className="w-full bg-[#202536] border border-[#252b3b] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#6c63ff] transition-colors min-h-[120px]"
              placeholder="1. Payment should be made within..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#6c63ff]/20 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
            <Save className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
