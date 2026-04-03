import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { getSummary } from '../../data/mockData';
import useStore from '../../store/useStore';
import { filterTransactions } from '../../utils/helpers';

function AnimatedNumber({ value, prefix = '₹' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{formatCurrency(display)}</span>;
}

const cards = [
  {
    key: 'balance',
    label: 'Total Balance',
    icon: Wallet,
    colorClass: 'accent',
    getVal: s => s.balance,
    change: '+12.4%',
    positive: true,
  },
  {
    key: 'income',
    label: 'Total Income',
    icon: TrendingUp,
    colorClass: 'electric',
    getVal: s => s.income,
    change: '+8.2%',
    positive: true,
  },
  {
    key: 'expense',
    label: 'Total Expenses',
    icon: TrendingDown,
    colorClass: 'coral',
    getVal: s => s.expense,
    change: '-3.1%',
    positive: false,
  },
];

export default function SummaryCards() {
  const { transactions, filters } = useStore();
  const filtered = filterTransactions(transactions, { ...filters, type: 'all' });
  const summary = getSummary(filtered);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const val = card.getVal(summary);
        const isAccent = card.key === 'balance';
        const iconColor = isAccent ? 'var(--accent)' : card.key === 'income' ? '#4fffb0' : '#ff6b6b';
        const iconBg = isAccent ? 'var(--accent-dim)' : card.key === 'income' ? 'rgba(79,255,176,0.1)' : 'rgba(255,107,107,0.1)';

        return (
          <div
            key={card.key}
            className="card card-hover p-5 animate-fade-up opacity-0-init"
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  {card.label}
                </p>
                <p className="font-display font-700 text-2xl" style={{ color: 'var(--text-primary)' }}>
                  <AnimatedNumber value={val} />
                </p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: iconBg }}>
                <Icon size={20} style={{ color: iconColor }} />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {card.positive
                ? <ArrowUpRight size={14} style={{ color: '#4fffb0' }} />
                : <ArrowDownRight size={14} style={{ color: '#ff6b6b' }} />
              }
              <span className="text-xs font-medium" style={{ color: card.positive ? '#4fffb0' : '#ff6b6b' }}>
                {card.change}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}