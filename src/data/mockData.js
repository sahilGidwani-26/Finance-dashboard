import { subDays, format, startOfMonth, subMonths } from 'date-fns';

const categories = [
  { id: 'food', label: 'Food & Dining', icon: '🍽️', color: '#ff6b6b' },
  { id: 'transport', label: 'Transport', icon: '🚗', color: '#4fffb0' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#c77dff' },
  { id: 'health', label: 'Health', icon: '💊', color: '#ffd166' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#06d6a0' },
  { id: 'utilities', label: 'Utilities', icon: '⚡', color: '#118ab2' },
  { id: 'salary', label: 'Salary', icon: '💼', color: '#00ff88' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: '#4fffb0' },
  { id: 'investment', label: 'Investment', icon: '📈', color: '#ffd166' },
];

export const CATEGORIES = categories;

const generateTransactions = () => {
  const txns = [
    // Current month
    { id: 't001', date: subDays(new Date(), 1), description: 'Monthly Salary', amount: 85000, type: 'income', category: 'salary', note: 'Net salary after TDS' },
    { id: 't002', date: subDays(new Date(), 2), description: 'Swiggy Order', amount: 450, type: 'expense', category: 'food', note: 'Dinner for two' },
    { id: 't003', date: subDays(new Date(), 3), description: 'Ola Ride', amount: 220, type: 'expense', category: 'transport' },
    { id: 't004', date: subDays(new Date(), 4), description: 'Freelance Project', amount: 12000, type: 'income', category: 'freelance', note: 'UI design project' },
    { id: 't005', date: subDays(new Date(), 5), description: 'Netflix', amount: 649, type: 'expense', category: 'entertainment' },
    { id: 't006', date: subDays(new Date(), 6), description: 'Grocery - DMart', amount: 3200, type: 'expense', category: 'food' },
    { id: 't007', date: subDays(new Date(), 7), description: 'Electricity Bill', amount: 1850, type: 'expense', category: 'utilities' },
    { id: 't008', date: subDays(new Date(), 8), description: 'Amazon Order', amount: 2499, type: 'expense', category: 'shopping', note: 'Books' },
    { id: 't009', date: subDays(new Date(), 9), description: 'Gym Membership', amount: 2000, type: 'expense', category: 'health' },
    { id: 't010', date: subDays(new Date(), 10), description: 'Mutual Fund SIP', amount: 5000, type: 'expense', category: 'investment', note: 'HDFC Mid Cap' },
    { id: 't011', date: subDays(new Date(), 11), description: 'Petrol', amount: 1500, type: 'expense', category: 'transport' },
    { id: 't012', date: subDays(new Date(), 12), description: 'Restaurant - Pizza', amount: 850, type: 'expense', category: 'food' },
    { id: 't013', date: subDays(new Date(), 13), description: 'Dividend Income', amount: 3200, type: 'income', category: 'investment' },
    { id: 't014', date: subDays(new Date(), 14), description: 'Internet Bill', amount: 999, type: 'expense', category: 'utilities' },
    { id: 't015', date: subDays(new Date(), 15), description: 'Myntra Order', amount: 1799, type: 'expense', category: 'shopping' },
    { id: 't016', date: subDays(new Date(), 16), description: 'Doctor Visit', amount: 600, type: 'expense', category: 'health' },
    { id: 't017', date: subDays(new Date(), 17), description: 'Movie Tickets', amount: 700, type: 'expense', category: 'entertainment' },
    { id: 't018', date: subDays(new Date(), 18), description: 'Coffee - Starbucks', amount: 350, type: 'expense', category: 'food' },
    { id: 't019', date: subDays(new Date(), 19), description: 'Bus Pass', amount: 800, type: 'expense', category: 'transport' },
    { id: 't020', date: subDays(new Date(), 20), description: 'Freelance Project 2', amount: 8000, type: 'income', category: 'freelance' },
    // Previous months for trend
    { id: 't021', date: subMonths(new Date(), 1), description: 'Monthly Salary', amount: 85000, type: 'income', category: 'salary' },
    { id: 't022', date: subMonths(new Date(), 1), description: 'Monthly Expenses', amount: 28500, type: 'expense', category: 'food' },
    { id: 't023', date: subMonths(new Date(), 1), description: 'Freelance', amount: 15000, type: 'income', category: 'freelance' },
    { id: 't024', date: subMonths(new Date(), 2), description: 'Monthly Salary', amount: 85000, type: 'income', category: 'salary' },
    { id: 't025', date: subMonths(new Date(), 2), description: 'Monthly Expenses', amount: 31200, type: 'expense', category: 'shopping' },
    { id: 't026', date: subMonths(new Date(), 3), description: 'Monthly Salary', amount: 82000, type: 'income', category: 'salary' },
    { id: 't027', date: subMonths(new Date(), 3), description: 'Monthly Expenses', amount: 26800, type: 'expense', category: 'food' },
    { id: 't028', date: subMonths(new Date(), 4), description: 'Monthly Salary', amount: 82000, type: 'income', category: 'salary' },
    { id: 't029', date: subMonths(new Date(), 4), description: 'Monthly Expenses', amount: 29000, type: 'expense', category: 'utilities' },
    { id: 't030', date: subMonths(new Date(), 5), description: 'Monthly Salary', amount: 80000, type: 'income', category: 'salary' },
    { id: 't031', date: subMonths(new Date(), 5), description: 'Monthly Expenses', amount: 24500, type: 'expense', category: 'food' },
  ];

  return txns.map(t => ({
    ...t,
    date: format(t.date, 'yyyy-MM-dd'),
    categoryMeta: categories.find(c => c.id === t.category),
  }));
};

export const mockTransactions = generateTransactions();

export const getMonthlyTrend = () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const monthLabel = format(date, 'MMM yy');
    const income = mockTransactions
      .filter(t => format(new Date(t.date), 'MMM yy') === monthLabel && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = mockTransactions
      .filter(t => format(new Date(t.date), 'MMM yy') === monthLabel && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    months.push({ month: monthLabel, income, expense, balance: income - expense });
  }
  return months;
};

export const getSpendingByCategory = (transactions) => {
  const map = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    if (!map[t.category]) {
      map[t.category] = { name: t.categoryMeta?.label || t.category, value: 0, color: t.categoryMeta?.color || '#888', icon: t.categoryMeta?.icon || '💰' };
    }
    map[t.category].value += t.amount;
  });
  return Object.values(map).sort((a, b) => b.value - a.value);
};

export const getSummary = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
};