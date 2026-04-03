import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { getMonthlyTrend } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';
import useStore from '../../store/useStore';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 shadow-xl" style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      minWidth: 160
    }}>
      <p className="text-xs font-semibold mb-2 font-display" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-xs flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="text-xs font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(p.value, true)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceTrend() {
  const { darkMode } = useStore();
  const data = getMonthlyTrend();
  const gridColor = darkMode ? '#1e1e38' : '#e8e8ed';
  const textColor = darkMode ? '#6e6e85' : '#a0a0b0';

  return (
    <div className="card p-5 animate-fade-up opacity-0-init" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-600 text-base" style={{ color: 'var(--text-primary)' }}>
            Balance Trend
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Last 6 months</p>
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded inline-block" style={{ background: '#4fffb0' }} />
            Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded inline-block" style={{ background: '#ff6b6b' }} />
            Expenses
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4fffb0" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4fffb0" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => formatCurrency(v, true)} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" name="Income" stroke="#4fffb0" strokeWidth={2}
            fill="url(#incomeGrad)" dot={{ fill: '#4fffb0', r: 4 }} activeDot={{ r: 6 }} />
          <Area type="monotone" dataKey="expense" name="Expenses" stroke="#ff6b6b" strokeWidth={2}
            fill="url(#expenseGrad)" dot={{ fill: '#ff6b6b', r: 4 }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}