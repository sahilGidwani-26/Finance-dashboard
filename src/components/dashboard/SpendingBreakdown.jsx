import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { getSpendingByCategory, getSummary } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';
import useStore from '../../store/useStore';
import { filterTransactions } from '../../utils/helpers';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="var(--text-primary)"
        style={{ fontSize: 14, fontFamily: 'Syne', fontWeight: 700 }}>
        {payload.icon} {payload.name}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text-muted)"
        style={{ fontSize: 12, fontFamily: 'JetBrains Mono' }}>
        {formatCurrency(payload.value, true)}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 10} outerRadius={outerRadius + 14}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

export default function SpendingBreakdown() {
  const { transactions, filters } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const filtered = filterTransactions(transactions, { ...filters, type: 'all' });
  const data = getSpendingByCategory(filtered);

  if (!data.length) {
    return (
      <div className="card p-5 flex items-center justify-center h-64" style={{ animationFillMode: 'forwards' }}>
        <p style={{ color: 'var(--text-muted)' }}>No expense data</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card p-5 animate-fade-up opacity-0-init" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
      <div className="mb-5">
        <h3 className="font-display font-600 text-base" style={{ color: 'var(--text-primary)' }}>
          Spending Breakdown
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>By category</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        <div className="w-full lg:w-1/2" style={{ height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                dataKey="value"
                onMouseEnter={(_, i) => setActiveIndex(i)}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full lg:w-1/2 space-y-2 max-h-44 overflow-y-auto pr-1">
          {data.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors"
              style={{ background: activeIndex === i ? 'var(--accent-dim)' : 'transparent' }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className="text-base">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {item.name}
                  </p>
                  <span className="text-xs font-mono ml-2 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                    {formatCurrency(item.value, true)}
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(item.value / total) * 100}%`, background: item.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}