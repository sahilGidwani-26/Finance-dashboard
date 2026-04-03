import React, { useState } from 'react';
import {
  Search, Plus, Trash2, Edit2, X, SlidersHorizontal
} from 'lucide-react';
import toast from "react-hot-toast";
import useStore from '../../store/useStore';
import { filterTransactions, formatCurrency, formatDate } from '../../utils/helpers';
import { CATEGORIES } from '../../data/mockData';
import TransactionModal from './TransactionModal';

export default function Transactions() {
  const { transactions, filters, setFilter, resetFilters, deleteTransaction, role } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = filterTransactions(transactions, filters);

  const openAdd = () => { setEditingTxn(null); setModalOpen(true); };
  const openEdit = (txn) => { setEditingTxn(txn); setModalOpen(true); };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    deleteTransaction(deleteId);
    setDeleteId(null);
    toast.success("Transaction deleted successfully");
  };

  const hasActiveFilters = filters.type !== 'all' || filters.category !== 'all' || filters.search || filters.dateRange !== '30';

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-52 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            className="input-field pl-9"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-ghost relative"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
            )}
          </button>

          {/* Add transaction - admin only */}
          {role === 'admin' && (
            <button onClick={openAdd} className="btn-primary">
              <Plus size={16} />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="card p-4 mb-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display font-600 text-sm" style={{ color: 'var(--text-primary)' }}>Filters & Sort</span>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                <X size={12} /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Type</label>
              <select className="select-field text-sm" value={filters.type} onChange={e => setFilter('type', e.target.value)}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Category</label>
              <select className="select-field text-sm" value={filters.category} onChange={e => setFilter('category', e.target.value)}>
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Date Range</label>
              <select className="select-field text-sm" value={filters.dateRange} onChange={e => setFilter('dateRange', e.target.value)}>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 6 months</option>
                <option value="all">All time</option>
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--text-muted)' }}>Sort By</label>
              <select className="select-field text-sm" value={filters.sortBy} onChange={e => setFilter('sortBy', e.target.value)}>
                <option value="date_desc">Newest first</option>
                <option value="date_asc">Oldest first</option>
                <option value="amount_desc">Highest amount</option>
                <option value="amount_asc">Lowest amount</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Result count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{filtered.length}</span> transactions
        </p>
        <div className="flex gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>
            In: <span style={{ color: '#4fffb0' }}>
              {formatCurrency(filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), true)}
            </span>
          </span>
          <span>
            Out: <span style={{ color: '#ff6b6b' }}>
              {formatCurrency(filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), true)}
            </span>
          </span>
        </div>
      </div>

      {/* Transactions list */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-display font-600" style={{ color: 'var(--text-primary)' }}>No transactions found</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Date', 'Description', 'Category', 'Type', 'Amount', ...(role === 'admin' ? ['Actions'] : [])].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--text-muted)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn, i) => (
                  <tr
                    key={txn.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dim)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {formatDate(txn.date)}
                    </td>
                    <td className="px-4 py-3 min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{txn.description}</p>
                      {txn.note && <p className="text-xs truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>{txn.note}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-sm whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                        {txn.categoryMeta?.icon} {txn.categoryMeta?.label || txn.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={txn.type === 'income' ? 'badge-income' : 'badge-expense'}>
                        {txn.type === 'income' ? '↑' : '↓'} {txn.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-600 text-sm whitespace-nowrap"
                        style={{ color: txn.type === 'income' ? '#4fffb0' : '#ff6b6b' }}>
                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, true)}
                      </span>
                    </td>
                    {role === 'admin' && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(txn)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(txn.id)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ff6b6b'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-[380px] shadow-xl animate-fade-in">

            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 className="text-red-500" size={18} />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Delete Transaction</h2>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            {/* Message */}
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
              Are you sure you want to permanently delete this transaction?
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <TransactionModal
          transaction={editingTxn}
          onClose={() => { setModalOpen(false); setEditingTxn(null); }}
        />
      )}
    </div>
  );
}