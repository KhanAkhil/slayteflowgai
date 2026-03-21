import React from 'react';
import { auth } from '../firebase';
import { Zap, FileText, Quote, Database, Users, Settings, LogOut, Database as BackupIcon, RefreshCw, X, FileMinus } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  companyName?: string;
  gstin?: string;
  syncStatus: 'synced' | 'syncing' | 'error';
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, companyName, gstin, syncStatus, isOpen, onClose }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Zap, section: 'Overview' },
    { id: 'invoices', label: 'Invoices', icon: FileText, section: 'Billing' },
    { id: 'proforma', label: 'Proforma Invoices', icon: Quote, section: 'Billing' },
    { id: 'quotations', label: 'Quotations', icon: Quote, section: 'Billing' },
    { id: 'credit-notes', label: 'Credit Notes', icon: FileMinus, section: 'Billing' },
    { id: 'items', label: 'Item Database', icon: Database, section: 'Catalogue' },
    { id: 'customers', label: 'Customers', icon: Users, section: 'Contacts' },
    { id: 'company', label: 'Company Info', icon: Settings, section: 'Settings' },
  ];

  const sections = ['Overview', 'Billing', 'Catalogue', 'Contacts', 'Settings'];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-all"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "w-64 bg-[#141824] border-r border-[#252b3b] flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6c63ff] to-[#9c5cff] rounded-lg flex items-center justify-center shadow-lg shadow-[#6c63ff]/20">
                <Zap className="text-white w-6 h-6 fill-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-[#e2e5f0]">
                  Slayte<span className="text-[#6c63ff]">Flow</span>
                </h1>
                <p className="text-[#8892ab] text-[9px] uppercase tracking-[0.2em]">Billing · Flow</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-[#8892ab] hover:text-[#e2e5f0]">
              <X className="w-5 h-5" />
            </button>
          </div>

        <nav className="space-y-6 overflow-y-auto pr-2 -mr-2 no-scrollbar">
          {sections.map(section => (
            <div key={section}>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#4e566b] mb-3 ml-2">{section}</p>
              <div className="space-y-1">
                {navItems.filter(item => item.section === section).map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                      activeTab === item.id 
                        ? "bg-[#6c63ff]/10 text-[#6c63ff]" 
                        : "text-[#8892ab] hover:bg-[#1a1f2e] hover:text-[#e2e5f0]"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-[#6c63ff]" : "text-[#4e566b] group-hover:text-[#8892ab]")} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 space-y-4">
        <div className="bg-[#1a1f2e] rounded-xl p-3 border border-[#252b3b]">
          <p className="text-[10px] font-bold text-[#e2e5f0] truncate">{companyName || 'Set Company Name'}</p>
          <p className="text-[9px] text-[#8892ab] mt-0.5">{gstin || 'No GSTIN set'}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              syncStatus === 'synced' ? "bg-[#22c55e]" : syncStatus === 'syncing' ? "bg-[#f59e0b] animate-pulse" : "bg-[#ef4444]"
            )} />
            <span className="text-[9px] text-[#4e566b] uppercase tracking-wider font-bold">
              {syncStatus === 'synced' ? 'Synced' : syncStatus === 'syncing' ? 'Syncing...' : 'Sync Error'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab('backup')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#8892ab] hover:bg-[#1a1f2e] hover:text-[#e2e5f0] transition-all"
          >
            <BackupIcon className="w-3.5 h-3.5" />
            Backup / Restore
          </button>
          
          <div className="pt-2 border-t border-[#252b3b] mt-2">
            <div className="px-3 py-1 mb-1">
              <p className="text-[9px] text-[#4e566b] truncate">{auth.currentUser?.email}</p>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
