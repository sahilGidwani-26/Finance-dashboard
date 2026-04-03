import React from 'react';
import {
  LayoutDashboard, Receipt, Lightbulb, ChevronRight,
  X, TrendingUp, Shield, Eye
} from 'lucide-react';
import useStore from '../../store/useStore';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar() {
  const { activePage, setActivePage, role, setRole, sidebarOpen, setSidebarOpen, darkMode } = useStore();

  const handleNav = (id) => {
    setActivePage(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-50 flex flex-col
        lg:static lg:z-auto lg:flex
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
        style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: 'var(--accent)', color: '#0a0a18' }}>
              F
            </div>
            <span className="font-display font-700 text-lg" style={{ color: 'var(--text-primary)' }}>
              FinVault
            </span>
          </div>
          <button
            className="lg:hidden p-1.5 rounded-lg"
            style={{ color: 'var(--text-muted)' }}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="px-4 mb-4">
          <div className="rounded-xl p-1 flex gap-1" style={{ background: 'var(--bg-primary)' }}>
            <button
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${role === 'admin' ? 'text-obsidian-900 dark:text-obsidian-900' : ''
                }`}
              style={role === 'admin' ? { background: 'var(--accent)', color: '#0a0a18' } : { color: 'var(--text-muted)' }}
            >
              <Shield size={12} />
              Admin
            </button>
            <button
              onClick={() => setRole('viewer')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all`}
              style={role === 'viewer' ? { background: 'var(--accent)', color: '#0a0a18' } : { color: 'var(--text-muted)' }}
            >
              <Eye size={12} />
              Viewer
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
            {role === 'admin' ? 'Can add & edit transactions' : 'Read-only access'}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3">
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Navigation
          </p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`nav-link w-full mb-1 ${activePage === id ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span className="flex-1 text-left font-display">{label}</span>
              {activePage === id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        {/* Bottom info */}
        <div className="px-4 pb-6">
          <div className="rounded-xl p-4" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} style={{ color: 'var(--accent)' }} />
              <span className="text-xs font-semibold font-display" style={{ color: 'var(--accent)' }}>
                Pro Tip
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Switch roles to explore different UI permissions.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}