import { ArrowRight } from 'lucide-react';
import useStore from '../../store/useStore';
import { filterTransactions, formatCurrency, formatDate } from '../../utils/helpers';

export default function RecentTransactions() {
  const { transactions, setActivePage } = useStore();
  const recent = filterTransactions(transactions, {
    search: '', type: 'all', category: 'all', sortBy: 'date_desc', dateRange: '30'
  }).slice(0, 5);

  return (
    <div className="card p-5 animate-fade-up opacity-0-init" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-600 text-base" style={{ color: 'var(--text-primary)' }}>
            Recent Transactions
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Last 5 transactions</p>
        </div>
        <button
          onClick={() => setActivePage('transactions')}
          className="text-xs flex items-center gap-1 font-medium transition-colors"
          style={{ color: 'var(--accent)' }}
        >
          View all <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-1">
        {recent.length === 0 && (
          <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            No transactions yet
          </p>
        )}
        {recent.map((txn, i) => (
          <div
            key={txn.id}
            className="flex items-center gap-3 p-3 rounded-xl transition-colors"
            style={{ animationDelay: `${400 + i * 50}ms` }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-dim)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{ background: 'var(--bg-primary)' }}>
              {txn.categoryMeta?.icon || '💰'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {txn.description}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {formatDate(txn.date)} · {txn.categoryMeta?.label || txn.category}
              </p>
            </div>
            <span
              className="text-sm font-mono font-600 flex-shrink-0"
              style={{ color: txn.type === 'income' ? '#4fffb0' : '#ff6b6b' }}
            >
              {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, true)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}