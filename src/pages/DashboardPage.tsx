import StatsCard from '@/components/dashboard/StatsCard';
import SummarizeDailyTransactionChart from '@/components/dashboard/SummarizeDailyTransactionChart';
import TotalTransactionsCard from '@/components/dashboard/TotalTransactionsCard';
import TransactionService from '@/service/transaction_service';
import { DailySummarizeTransaction } from '@/service/types/transaction_type';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';
import { useEffect, useState } from 'react';

function DashboardPage() {
  const wrappedFetchItems = useWrapInvalidToken((args) =>
    TransactionService.getSummarizeDailyTransaction(args),
  );

  const [currData, setCurrData] = useState<DailySummarizeTransaction[]>([]);
  const [prevData, setPrevData] = useState<DailySummarizeTransaction[]>([]);

  const [currMonth] = useState(() => {
    const currentDate = new Date();

    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    firstDay.setHours(firstDay.getHours() + 7);
    lastDay.setHours(lastDay.getHours() + 7);

    return [firstDay, lastDay];
  });

  const [prevMonth] = useState(() => {
    const currentDate = new Date();

    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0,
    );

    firstDay.setHours(firstDay.getHours() + 7);
    lastDay.setHours(lastDay.getHours() + 7);

    return [firstDay, lastDay];
  });

  useEffect(() => {
    let active = true;

    (async () => {
      const response = await Promise.all([
        wrappedFetchItems({
          dateStart: currMonth[0].toISOString(),
          dateEnd: currMonth[1].toISOString(),
        }),
        wrappedFetchItems({
          dateStart: prevMonth[0].toISOString(),
          dateEnd: prevMonth[1].toISOString(),
        }),
      ]);

      if (!active) return;

      setCurrData(response[0]!.data.transactions);
      setPrevData(response[1]!.data.transactions);
    })();

    return () => {
      active = false;
    };
  }, []);

  const monthFormat = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title={`Income ${monthFormat(currMonth[0])}`}
          data={currData.filter((d) => d.type === 'INCOME')}
          previousData={prevData.filter((d) => d.type === 'INCOME')}
        />

        <StatsCard
          title={`Expense ${monthFormat(currMonth[0])}`}
          data={currData.filter((d) => d.type === 'EXPENSE')}
          previousData={prevData.filter((d) => d.type === 'EXPENSE')}
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <SummarizeDailyTransactionChart />
        <div>
          <TotalTransactionsCard />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
