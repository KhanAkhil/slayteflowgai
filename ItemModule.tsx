import React from 'react';
import { Invoice, ProformaInvoice, Customer, Item } from '../types';
import { TrendingUp, CheckCircle2, AlertCircle, Clock, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  invoices: Invoice[];
  piCount: number;
  itemCount: number;
  customerCount: number;
}

export default function Dashboard({ invoices, piCount, itemCount, customerCount }: DashboardProps) {
  const totalBilled = invoices.reduce((acc, inv) => acc + inv.grand, 0);
  const collected = invoices.filter(inv => inv.status === 'paid').reduce((acc, inv) => acc + inv.grand, 0);
  const outstanding = invoices.filter(inv => inv.status === 'pending').reduce((acc, inv) => acc + inv.grand, 0);
  const overdue = invoices.filter(inv => inv.status === 'overdue').length;

  const stats = [
    { label: 'Total Billed', value: `₹${totalBilled.toLocaleString()}`, icon: TrendingUp, color: 'text-[#6c63ff]', bg: 'bg-[#6c63ff]/10' },
    { label: 'Collected', value: `₹${collected.toLocaleString()}`, icon: CheckCircle2, color: 'text-[#22c55e]', bg: 'bg-[#22c55e]/10' },
    { label: 'Outstanding', value: `₹${outstanding.toLocaleString()}`, icon: Clock, color: 'text-[#f59e0b]', bg: 'bg-[#f59e0b]/10' },
    { label: 'Overdue', value: overdue.toString(), icon: AlertCircle, color: 'text-[#ef4444]', bg: 'bg-[#ef4444]/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#1a1f2e] border border-[#252b3b] p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#4e566b]" />
            </div>
            <p className="text-[#8892ab] text-xs font-medium uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold text-[#e2e5f0] mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1a1f2e] border border-[#252b3b] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#e2e5f0]">Recent Invoices</h3>
            <button className="text-xs text-[#6c63ff] font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] border-b border-[#252b3b]">
                  <th className="pb-3 pl-2">Invoice #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252b3b]">
                {invoices.slice(0, 5).map((inv) => (
                  <tr key={inv.id} className="text-sm group hover:bg-[#202536]/50 transition-colors">
                    <td className="py-4 pl-2 font-mono text-[#6c63ff]">{inv.number}</td>
                    <td className="py-4 text-[#e2e5f0]">{inv.customerName}</td>
                    <td className="py-4 text-[#e2e5f0] font-medium">₹{inv.grand.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        inv.status === 'paid' ? 'bg-[#22c55e]/10 text-[#22c55e]' :
                        inv.status === 'pending' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' :
                        inv.status === 'overdue' ? 'bg-[#ef4444]/10 text-[#ef4444]' :
                        'bg-[#4e566b]/10 text-[#8892ab]'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#4e566b] text-sm italic">No invoices found. Create your first one!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1f2e] border border-[#252b3b] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[#e2e5f0] mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8892ab]">Proforma Invoices</span>
                <span className="text-sm font-bold text-[#e2e5f0]">{piCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8892ab]">Customers</span>
                <span className="text-sm font-bold text-[#e2e5f0]">{customerCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8892ab]">Items in Catalogue</span>
                <span className="text-sm font-bold text-[#e2e5f0]">{itemCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#6c63ff] to-[#9c5cff] rounded-2xl p-6 text-white shadow-lg shadow-[#6c63ff]/20">
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-xs text-white/80 mb-4">Check out our documentation or contact support for assistance with GST billing.</p>
            <button className="w-full bg-white text-[#6c63ff] font-bold py-2 rounded-xl text-xs hover:bg-white/90 transition-colors">
              View Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
