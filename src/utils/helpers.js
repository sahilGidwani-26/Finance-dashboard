import { format, isWithinInterval, subDays, parseISO } from 'date-fns';

export const formatCurrency = (amount, compact = false) => {
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
};

export const filterTransactions = (transactions, filters) => {
  let result = [...transactions];
  const now = new Date();

  // Date range
  if (filters.dateRange !== 'all') {
    const days = parseInt(filters.dateRange);
    const from = subDays(now, days);
    result = result.filter(t => {
      try {
        const d = parseISO(t.date);
        return isWithinInterval(d, { start: from, end: now });
      } catch { return true; }
    });
  }

  // Type
  if (filters.type !== 'all') {
    result = result.filter(t => t.type === filters.type);
  }

  // Category
  if (filters.category !== 'all') {
    result = result.filter(t => t.category === filters.category);
  }

  // Search
  if (filters.search.trim()) {
    const q = filters.search.toLowerCase();
    result = result.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.categoryMeta?.label.toLowerCase().includes(q) ||
      String(t.amount).includes(q)
    );
  }

  // Sort
  result.sort((a, b) => {
    switch (filters.sortBy) {
      case 'date_desc': return new Date(b.date) - new Date(a.date);
      case 'date_asc': return new Date(a.date) - new Date(b.date);
      case 'amount_desc': return b.amount - a.amount;
      case 'amount_asc': return a.amount - b.amount;
      default: return 0;
    }
  });

  return result;
};

export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => [
    t.date,
    `"${t.description}"`,
    t.categoryMeta?.label || t.category,
    t.type,
    t.amount,
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (transactions) => {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const generateId = () => `t${Date.now()}${Math.random().toString(36).substr(2, 5)}`;