import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockTransactions } from '../data/mockData.js';

const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      darkMode: false,
      toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),

      // Role
      role: 'admin', // 'admin' | 'viewer'
      setRole: (role) => set({ role }),

      // Active nav
      activePage: 'dashboard',
      setActivePage: (page) => set({ activePage: page }),

      // Transactions
      transactions: mockTransactions,
      addTransaction: (txn) => set(s => ({ transactions: [txn, ...s.transactions] })),
      updateTransaction: (id, data) => set(s => ({
        transactions: s.transactions.map(t => t.id === id ? { ...t, ...data } : t)
      })),
      deleteTransaction: (id) => set(s => ({
        transactions: s.transactions.filter(t => t.id !== id)
      })),

      // Filters
      filters: {
        search: '',
        type: 'all',
        category: 'all',
        sortBy: 'date_desc',
        dateRange: '30',
      },
      setFilter: (key, value) => set(s => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () => set({ filters: { search: '', type: 'all', category: 'all', sortBy: 'date_desc', dateRange: '30' } }),

      // Sidebar
      sidebarOpen: false,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
    }),
    {
      name: 'finvault-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        role: state.role,
        transactions: state.transactions,
      }),
    }
  )
);

export default useStore;