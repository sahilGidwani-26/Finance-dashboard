import React, { useEffect } from 'react';
import useStore from './store/useStore';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import Transactions from './components/transactions/Transactions';
import Insights from './components/insights/Insights';
import { Toaster } from "react-hot-toast";


export default function App() {
  const { darkMode, activePage } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="grid-dashboard">
      <Sidebar />
      <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Header />
        <main className="flex-1 overflow-auto">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'transactions' && <Transactions />}
          {activePage === 'insights' && <Insights />}
        </main>
        <Toaster position="top-right" />
      </div>
    </div>
  );
}