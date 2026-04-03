import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, RadarChart, Radar, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';
import {
    TrendingUp, TrendingDown, AlertCircle, Zap, Target, ArrowUpRight, ArrowDownRight, Flame, ShoppingBag, Calendar,
} from 'lucide-react';
import useStore from '../../store/useStore';
import { filterTransactions, formatCurrency } from '../../utils/helpers';
import { getMonthlyTrend, getSpendingByCategory, CATEGORIES } from '../../data/mockData';
import { format, subMonths, parseISO } from 'date-fns';

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl p-3 shadow-xl text-sm"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minWidth: 150 }}>
            <p className="font-display font-600 mb-2" style={{ color: 'var(--text-primary)' }}>{label}</p>
            {payload.map(p => (
                <div key={p.name} className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: p.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        {p.name}
                    </span>
                    <span className="text-xs font-mono font-600" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(p.value, true)}
                    </span>
                </div>
            ))}
        </div>
    );
};

// Insight Card
const InsightCard = ({ icon: Icon, iconColor, iconBg, label, value, sub, delay = 0 }) => (
    <div
        className="card card-hover p-5 animate-fade-up opacity-0-init"
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
        <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-xl" style={{ background: iconBg }}>
                <Icon size={18} style={{ color: iconColor }} />
            </div>
        </div>
        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="font-display font-700 text-xl mb-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
        {sub && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
    </div>
);

// Observation Tag
const ObsBadge = ({ type, children }) => {
    const styles = {
        good: { bg: 'rgba(79,255,176,0.1)', color: '#4fffb0', Icon: TrendingUp },
        warn: { bg: 'rgba(255,209,102,0.1)', color: '#ffd166', Icon: AlertCircle },
        bad: { bg: 'rgba(255,107,107,0.1)', color: '#ff6b6b', Icon: TrendingDown },
        info: { bg: 'rgba(199,125,255,0.1)', color: '#c77dff', Icon: Zap },
    };
    const s = styles[type] || styles.info;
    return (
        <div className="flex items-start gap-3 p-3.5 rounded-xl" style={{ background: s.bg }}>
            <s.Icon size={16} className="flex-shrink-0 mt-0.5" style={{ color: s.color }} />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{children}</p>
        </div>
    );
};

// Main Component
export default function Insights() {
    const { transactions, darkMode } = useStore();
    const gridColor = darkMode ? '#1e1e38' : '#e8e8ed';
    const textColor = darkMode ? '#6e6e85' : '#a0a0b0';

    // All transactions (no filter date restriction for insights)
    const allTxns = useMemo(() => filterTransactions(transactions, {
        search: '', type: 'all', category: 'all', sortBy: 'date_desc', dateRange: 'all'
    }), [transactions]);

    const currentMonthLabel = format(new Date(), 'MMM yy');
    const lastMonthLabel = format(subMonths(new Date(), 1), 'MMM yy');

    const currentMonthTxns = allTxns.filter(t => format(parseISO(t.date), 'MMM yy') === currentMonthLabel);
    const lastMonthTxns = allTxns.filter(t => format(parseISO(t.date), 'MMM yy') === lastMonthLabel);

    const currIncome = currentMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const currExpense = currentMonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const prevIncome = lastMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const prevExpense = lastMonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    const expenseDelta = prevExpense ? ((currExpense - prevExpense) / prevExpense) * 100 : 0;
    const incomeDelta = prevIncome ? ((currIncome - prevIncome) / prevIncome) * 100 : 0;
    const savingsRate = currIncome ? ((currIncome - currExpense) / currIncome) * 100 : 0;
    const monthlySaving = currIncome - currExpense;

    // Spending by category (all time)
    const spendingByCat = useMemo(() => getSpendingByCategory(allTxns), [allTxns]);
    const topCategory = spendingByCat[0];
    const totalSpend = spendingByCat.reduce((s, c) => s + c.value, 0);

    // Monthly trend data
    const trendData = useMemo(() => getMonthlyTrend(), []);

    // Monthly comparison bar data (income vs expense, last 6 months)
    const comparisonData = trendData.map(d => ({
        month: d.month,
        Income: d.income,
        Expenses: d.expense,
        Savings: Math.max(0, d.income - d.expense),
    }));

    // Category radar data (top 6 expense categories)
    const radarData = spendingByCat.slice(0, 6).map(c => ({
        category: c.name.split(' ')[0], // short label
        value: c.value,
        fullMark: spendingByCat[0]?.value || 1,
    }));

    // Average daily spend (current month)
    const dayOfMonth = new Date().getDate();
    const avgDailySpend = dayOfMonth > 0 ? currExpense / dayOfMonth : 0;

    // Observations
    const observations = useMemo(() => {
        const obs = [];
        if (savingsRate >= 30) obs.push({ type: 'good', text: `Great saving discipline! You're saving ${savingsRate.toFixed(1)}% of your income this month — well above the recommended 20%.` });
        else if (savingsRate >= 15) obs.push({ type: 'info', text: `Your savings rate is ${savingsRate.toFixed(1)}% this month. You're on the right track — try nudging it toward 30%.` });
        else obs.push({ type: 'warn', text: `Your savings rate is only ${savingsRate.toFixed(1)}% this month. Consider reviewing discretionary spending.` });

        if (expenseDelta > 15) obs.push({ type: 'bad', text: `Expenses rose ${expenseDelta.toFixed(1)}% compared to last month. Biggest driver: ${topCategory?.name || 'N/A'}.` });
        else if (expenseDelta < -5) obs.push({ type: 'good', text: `Expenses dropped ${Math.abs(expenseDelta).toFixed(1)}% vs last month — you're managing spending better!` });
        else obs.push({ type: 'info', text: `Spending is relatively stable (${expenseDelta >= 0 ? '+' : ''}${expenseDelta.toFixed(1)}% vs last month). Keep monitoring your ${topCategory?.name || ''} budget.` });

        if (topCategory) {
            const pct = ((topCategory.value / totalSpend) * 100).toFixed(1);
            obs.push({ type: pct > 40 ? 'warn' : 'info', text: `${topCategory.icon} ${topCategory.name} is your top expense at ${formatCurrency(topCategory.value, true)} — ${pct}% of total spending.` });
        }

        if (avgDailySpend > 0) obs.push({ type: 'info', text: `Your average daily spend this month is ${formatCurrency(avgDailySpend, true)}. Projected month total: ${formatCurrency(avgDailySpend * 30, true)}.` });

        if (incomeDelta > 0) obs.push({ type: 'good', text: `Income grew ${incomeDelta.toFixed(1)}% compared to last month. Keep up the great work!` });

        return obs;
    }, [savingsRate, expenseDelta, incomeDelta, topCategory, totalSpend, avgDailySpend]);

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">

            {/*  KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <InsightCard
                    icon={Flame} iconColor="#ff6b6b" iconBg="rgba(255,107,107,0.1)"
                    label="Top Spending Category"
                    value={topCategory ? `${topCategory.icon} ${topCategory.name.split(' ')[0]}` : '—'}
                    sub={topCategory ? formatCurrency(topCategory.value, true) + ' spent' : 'No data'}
                    delay={0}
                />
                <InsightCard
                    icon={Target} iconColor="#4fffb0" iconBg="rgba(79,255,176,0.1)"
                    label="Savings Rate"
                    value={`${savingsRate.toFixed(1)}%`}
                    sub={`${formatCurrency(monthlySaving, true)} saved this month`}
                    delay={100}
                />
                <InsightCard
                    icon={Calendar} iconColor="#c77dff" iconBg="rgba(199,125,255,0.1)"
                    label="Avg Daily Spend"
                    value={formatCurrency(avgDailySpend, true)}
                    sub={`Based on ${dayOfMonth} days`}
                    delay={200}
                />
                <InsightCard
                    icon={ShoppingBag} iconColor="#ffd166" iconBg="rgba(255,209,102,0.1)"
                    label="Expense Change"
                    value={`${expenseDelta >= 0 ? '+' : ''}${expenseDelta.toFixed(1)}%`}
                    sub="vs last month"
                    delay={300}
                />
            </div>

            {/*  Monthly Comparison Bar Chart  */}
            <div className="card p-5 animate-fade-up opacity-0-init" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="font-display font-600 text-base" style={{ color: 'var(--text-primary)' }}>
                            Monthly Comparison
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Income vs Expenses vs Savings — last 6 months</p>
                    </div>
                    <div className="flex gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {[['#4fffb0', 'Income'], ['#ff6b6b', 'Expenses'], ['#c77dff', 'Savings']].map(([c, l]) => (
                            <span key={l} className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}
                            </span>
                        ))}
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={comparisonData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false}
                            tickFormatter={v => formatCurrency(v, true)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="Income" fill="#4fffb0" radius={[4, 4, 0, 0]} maxBarSize={28} />
                        <Bar dataKey="Expenses" fill="#ff6b6b" radius={[4, 4, 0, 0]} maxBarSize={28} />
                        <Bar dataKey="Savings" fill="#c77dff" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Category Spend + Radar  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Top spending categories */}
                <div className="card p-5 animate-fade-up opacity-0-init" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                    <h3 className="font-display font-600 text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                        Highest Spending Categories
                    </h3>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>All-time breakdown</p>

                    {spendingByCat.length === 0 ? (
                        <p className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>No expense data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {spendingByCat.slice(0, 7).map((cat, i) => {
                                const pct = totalSpend ? (cat.value / totalSpend) * 100 : 0;
                                return (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">{cat.icon}</span>
                                                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                    {cat.name}
                                                </span>
                                                {i === 0 && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                                                        style={{ background: 'rgba(255,107,107,0.12)', color: '#ff6b6b' }}>
                                                        Top
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-mono font-600" style={{ color: 'var(--text-primary)' }}>
                                                    {formatCurrency(cat.value, true)}
                                                </span>
                                                <span className="text-xs ml-1.5" style={{ color: 'var(--text-muted)' }}>
                                                    {pct.toFixed(1)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, background: cat.color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Radar chart */}
                <div className="card p-5 animate-fade-up opacity-0-init" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                    <h3 className="font-display font-600 text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                        Spending Pattern Radar
                    </h3>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Top 6 expense categories</p>
                    {radarData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <RadarChart data={radarData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                                <PolarGrid stroke={gridColor} />
                                <PolarAngleAxis dataKey="category" tick={{ fill: textColor, fontSize: 11 }} />
                                <PolarRadiusAxis tick={false} axisLine={false} />
                                <Radar
                                    name="Spending" dataKey="value"
                                    stroke="#4fffb0" fill="#4fffb0" fillOpacity={0.18}
                                    strokeWidth={2} dot={{ fill: '#4fffb0', r: 4 }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>No data</p>
                    )}
                </div>
            </div>

            {/*  This Month vs Last Month Side-by-Side  */}
            <div className="card p-5 animate-fade-up opacity-0-init" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
                <h3 className="font-display font-600 text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                    This Month vs Last Month
                </h3>
                <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Direct comparison</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Income', curr: currIncome, prev: prevIncome, color: '#4fffb0' },
                        { label: 'Expenses', curr: currExpense, prev: prevExpense, color: '#ff6b6b' },
                        { label: 'Savings', curr: currIncome - currExpense, prev: prevIncome - prevExpense, color: '#c77dff' },
                    ].map(({ label, curr, prev, color }) => {
                        const delta = prev ? ((curr - prev) / Math.abs(prev)) * 100 : 0;
                        const positive = label === 'Expenses' ? delta <= 0 : delta >= 0;
                        return (
                            <div key={label} className="p-4 rounded-xl" style={{ background: 'var(--bg-primary)' }}>
                                <p className="text-xs mb-3 font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="font-display font-700 text-xl" style={{ color: 'var(--text-primary)' }}>
                                            {formatCurrency(curr, true)}
                                        </p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                            prev: {formatCurrency(prev, true)}
                                        </p>
                                    </div>
                                    <div
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold"
                                        style={{ background: positive ? 'rgba(79,255,176,0.1)' : 'rgba(255,107,107,0.1)', color: positive ? '#4fffb0' : '#ff6b6b' }}
                                    >
                                        {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {Math.abs(delta).toFixed(1)}%
                                    </div>
                                </div>
                                {/* Mini progress bar */}
                                <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${Math.min(100, prev > 0 ? (curr / prev) * 50 : 50)}%`, background: color, transition: 'width 0.8s ease' }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Observations ── */}
            <div className="card p-5 animate-fade-up opacity-0-init" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg" style={{ background: 'rgba(199,125,255,0.1)' }}>
                        <Zap size={16} style={{ color: '#c77dff' }} />
                    </div>
                    <div>
                        <h3 className="font-display font-600 text-base" style={{ color: 'var(--text-primary)' }}>
                            Smart Observations
                        </h3>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Auto-generated from your data</p>
                    </div>
                </div>
                <div className="space-y-2.5">
                    {observations.map((obs, i) => (
                        <ObsBadge key={i} type={obs.type}>{obs.text}</ObsBadge>
                    ))}
                </div>
            </div>

        </div>
    );
}