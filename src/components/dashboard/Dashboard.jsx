import SummaryCards from './SummaryCards';
import BalanceTrend from './BalanceTrend';
import SpendingBreakdown from './SpendingBreakdown';
import RecentTransactions from './RecentTransactions';

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <BalanceTrend />
        </div>
        <div className="lg:col-span-2">
          <SpendingBreakdown />
        </div>
      </div>

      <RecentTransactions />
    </div>
  );
}