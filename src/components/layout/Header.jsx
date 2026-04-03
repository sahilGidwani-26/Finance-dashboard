import React from 'react';
import { Menu, Sun, Moon, Bell, Download } from 'lucide-react';
import useStore from '../../store/useStore';
import { exportToCSV, exportToJSON } from '../../utils/helpers';
import { filterTransactions } from '../../utils/helpers';
import { useState } from 'react';

const pageTitles = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
};

export default function Header() {
  const { darkMode, toggleDarkMode, setSidebarOpen, activePage, transactions, filters, role } = useStore();
  const [exportOpen, setExportOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const filteredTxns = filterTransactions(transactions, filters);

  return (
    <header
      className="flex items-center justify-between px-6 py-4 sticky top-0 z-30"
      style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 rounded-xl"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-card)' }}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-display font-700 text-xl" style={{ color: 'var(--text-primary)' }}>
            {pageTitles[activePage]}
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Export - admin only */}
        {role === 'admin' && (
          <div className="relative">
            <button
              className="btn-ghost text-sm px-3 py-2 flex items-center gap-2"
              onClick={() => setExportOpen(!exportOpen)}
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
            {exportOpen && (
              <div
                className="absolute right-0 top-12 w-40 rounded-xl shadow-2xl z-50 py-1"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <button
                  className="w-full px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => { exportToCSV(filteredTxns); setExportOpen(false); }}
                >
                  📄 Export CSV
                </button>
                <button
                  className="w-full px-4 py-2.5 text-sm text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => { exportToJSON(filteredTxns); setExportOpen(false); }}
                >
                  📦 Export JSON
                </button>
              </div>
            )}
          </div>
        )}

        {/* Dark mode */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl transition-all"
          style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2.5 rounded-xl"
            style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            <Bell size={18} />
          </button>
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--accent)' }}
          />
        </div>

        {notifOpen && (
          <div
            className="absolute right-0 top-12 w-64 rounded-xl shadow-2xl z-50 py-2"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <p className="px-4 py-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Notifications
            </p>

            <div className="px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
              💰 New income added
            </div>

            <div className="px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
              ⚠️ Expense limit reached
            </div>

            <div className="px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5">
              📊 Monthly report ready
            </div>

            <button
              className="w-full text-center text-xs py-2 mt-1"
              style={{ color: 'var(--accent)' }}
              onClick={() => setNotifOpen(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </header>
  );
}