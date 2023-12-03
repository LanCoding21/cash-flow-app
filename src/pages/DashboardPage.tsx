import SummarizeDailyTransactionChart from '@/components/dashboard/SummarizeDailyTransactionChart';
import TotalTransactionsCard from '@/components/dashboard/TotalTransactionsCard';

function DashboardPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <SummarizeDailyTransactionChart />
        <div>
          <TotalTransactionsCard />
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
