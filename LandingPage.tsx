import React, { useState } from 'react';
import { Invoice, ProformaInvoice, Customer, Item, Company } from '../types';
import { saveRecord } from '../dataService';
import { Download, Upload, Trash2, ShieldCheck, AlertTriangle, FileJson, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';

interface BackupModuleProps {
  invoices: Invoice[];
  pis: ProformaInvoice[];
  customers: Customer[];
  items: Item[];
  company: Company | null;
  userId: string;
}

export default function BackupModule({ invoices, pis, customers, items, company, userId }: BackupModuleProps) {
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    const data = {
      invoices,
      proforma_invoices: pis,
      customers,
      items,
      company,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SlayteFlow_Backup_${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCSVImport = (type: 'invoices' | 'customers' | 'items') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm(`Importing ${type} from CSV. Ensure headers match the field names. Continue?`)) return;

    setImporting(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const data = results.data as any[];
          for (const row of data) {
            const id = row.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Basic mapping/cleaning
            const record: any = { ...row, uid: userId, id };
            
            // Ensure numeric fields are numbers
            if (type === 'items') {
              record.rate = parseFloat(row.rate) || 0;
              record.tax = parseFloat(row.tax) || 18;
            }
            if (type === 'invoices') {
              record.total = parseFloat(row.total) || 0;
              record.taxAmount = parseFloat(row.taxAmount) || 0;
              record.subtotal = parseFloat(row.subtotal) || 0;
              // Line items would be hard to import via simple CSV without a specific format
              // For now, we assume simple records or pre-formatted JSON strings in columns
              if (typeof row.lineItems === 'string') {
                try { record.lineItems = JSON.parse(row.lineItems); } catch(e) { record.lineItems = []; }
              }
            }

            await saveRecord(type, id, record);
          }
          alert(`Imported ${data.length} ${type} successfully!`);
        } catch (err) {
          console.error(err);
          alert('Failed to import CSV. Check console for details.');
        } finally {
          setImporting(false);
        }
      }
    });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('This will overwrite existing data if IDs match. Continue?')) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        // Import Invoices
        if (data.invoices) {
          for (const inv of data.invoices) await saveRecord('invoices', inv.id, { ...inv, uid: userId });
        }
        // Import PIs
        if (data.proforma_invoices) {
          for (const pi of data.proforma_invoices) await saveRecord('proforma_invoices', pi.id, { ...pi, uid: userId });
        }
        // Import Customers
        if (data.customers) {
          for (const c of data.customers) await saveRecord('customers', c.id, { ...c, uid: userId });
        }
        // Import Items
        if (data.items) {
          for (const i of data.items) await saveRecord('items', i.id, { ...i, uid: userId });
        }
        // Import Company
        if (data.company) {
          await saveRecord('company', userId, { ...data.company, uid: userId });
        }

        alert('Backup restored successfully!');
      } catch (err) {
        console.error(err);
        alert('Failed to import backup. Invalid file format.');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  const format = (date: Date, fmt: string) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-[#1a1f2e] border border-[#252b3b] rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#6c63ff]/10 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-[#6c63ff]" />
          </div>
          <h3 className="text-xl font-bold text-[#e2e5f0]">Backup & Restore</h3>
        </div>
        
        <p className="text-[#8892ab] text-sm mb-8 leading-relaxed">
          Your data is automatically synced to the cloud. However, you can also maintain local backups for offline storage or to migrate your data between accounts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#141824] border border-[#252b3b] p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-[#22c55e]" />
              <h4 className="font-bold text-[#e2e5f0]">Export Data</h4>
            </div>
            <p className="text-xs text-[#4e566b]">Download all your invoices, customers, and items as a single JSON file.</p>
            <button
              onClick={handleExport}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#22c55e]/10"
            >
              Download Backup
            </button>
          </div>

          <div className="bg-[#141824] border border-[#252b3b] p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-[#f59e0b]" />
              <h4 className="font-bold text-[#e2e5f0]">Import CSV</h4>
            </div>
            <p className="text-xs text-[#4e566b]">Import billing data from other apps. Choose the type of data you are uploading.</p>
            <div className="grid grid-cols-1 gap-2">
              <label className="flex items-center justify-between p-2 bg-[#1a1f2e] border border-[#252b3b] rounded-xl cursor-pointer hover:bg-[#202536] transition-colors">
                <span className="text-[10px] font-bold text-[#8892ab]">Import Customers</span>
                <input type="file" accept=".csv" onChange={handleCSVImport('customers')} className="hidden" />
                <Upload className="w-3 h-3 text-[#f59e0b]" />
              </label>
              <label className="flex items-center justify-between p-2 bg-[#1a1f2e] border border-[#252b3b] rounded-xl cursor-pointer hover:bg-[#202536] transition-colors">
                <span className="text-[10px] font-bold text-[#8892ab]">Import Items</span>
                <input type="file" accept=".csv" onChange={handleCSVImport('items')} className="hidden" />
                <Upload className="w-3 h-3 text-[#f59e0b]" />
              </label>
              <label className="flex items-center justify-between p-2 bg-[#1a1f2e] border border-[#252b3b] rounded-xl cursor-pointer hover:bg-[#202536] transition-colors">
                <span className="text-[10px] font-bold text-[#8892ab]">Import Invoices</span>
                <input type="file" accept=".csv" onChange={handleCSVImport('invoices')} className="hidden" />
                <Upload className="w-3 h-3 text-[#f59e0b]" />
              </label>
            </div>
          </div>

          <div className="bg-[#141824] border border-[#252b3b] p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-[#6c63ff]" />
              <h4 className="font-bold text-[#e2e5f0]">Restore JSON</h4>
            </div>
            <p className="text-xs text-[#4e566b]">Restore data from a previously exported SlayteFlow backup file.</p>
            <label className="block">
              <span className="sr-only">Choose backup file</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={importing}
                className="block w-full text-xs text-[#4e566b] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6c63ff] file:text-white hover:file:bg-[#5a52e0] cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-[#ef4444]/5 border border-[#ef4444]/20 rounded-2xl p-6 flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-[#ef4444] mt-1 shrink-0" />
        <div>
          <h4 className="font-bold text-[#ef4444] text-sm">Danger Zone</h4>
          <p className="text-xs text-[#ef4444]/70 mt-1">
            Importing a backup will overwrite existing records that have the same ID. This action cannot be undone. Always keep a copy of your current data before importing.
          </p>
        </div>
      </div>
    </div>
  );
}
