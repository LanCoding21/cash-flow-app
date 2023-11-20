import { DatePicker } from '@/components/common';
import TransactionService from '@/service/transaction_service';
import { DailySummarizeTransaction } from '@/service/types/transaction_type';
import { parseErrorMessage } from '@/utils/api';
import { dateFormat } from '@/utils/date';
import { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';

function SummarizeDailyTransactionChart() {
  const [transactions, setTransactions] =
    useState<DailySummarizeTransaction[]>();
  const [dateStart, setDateStart] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });

  const [dateEnd, setDateEnd] = useState(() => {
    return new Date();
  });

  const dates = useMemo(() => {
    const arr = [];
    if (!dateStart || !dateEnd) return [];

    const date = new Date(dateStart.getTime());

    while (date <= dateEnd) {
      arr.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return arr;
  }, [dateStart, dateEnd]);

  const wrappedFetchItems = useWrapInvalidToken((args) =>
    TransactionService.getSummarizeDailyTransaction(args),
  );

  useEffect(() => {
    let active = true;

    const x = setTimeout(async () => {
      if (!dateStart && !dateEnd) return;
      const params: any = {};
      if (dateStart) {
        params.dateStart = dateStart.toISOString();
      }

      if (dateEnd) {
        params.dateEnd = dateEnd.toISOString();
      }

      try {
        const response = await wrappedFetchItems(params);
        if (!active) return;
        setTransactions(response!.data.transactions);
      } catch (error) {
        parseErrorMessage(error);
      }
    }, 1500);

    return () => {
      active = false;
      clearTimeout(x);
    };
  }, [dateStart, dateEnd]);

  const data = useMemo(() => {
    const dateTransactions = dates.map((date) => {
      const incomeTransactions: DailySummarizeTransaction = (transactions ?? [])
        .filter((t: DailySummarizeTransaction) => {
          return t.date.slice(0, 10) === date.toISOString().slice(0, 10);
        })
        .filter((t: DailySummarizeTransaction) => t.type === 'INCOME')[0];

      const expenseTransaction: DailySummarizeTransaction = (transactions ?? [])
        .filter(
          (t: DailySummarizeTransaction) =>
            t.date.slice(0, 10) === date.toISOString().slice(0, 10),
        )
        .filter((t: DailySummarizeTransaction) => t.type === 'EXPENSE')[0];

      return {
        name: dateFormat(
          date.toISOString(),
          {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
          'en-UK',
        ),
        income: incomeTransactions?.amount ?? 0,
        expense: expenseTransaction?.amount ?? 0,
      };
    });

    return dateTransactions;
  }, [dates, transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Summarize Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 flex-wrap">
          <DatePicker
            defaultDate={dateStart}
            label="Date Start"
            className="md:w-[250px] w-full"
            onDateChange={(val) => setDateStart(val)}
          />
          <DatePicker
            defaultDate={dateEnd}
            onDateChange={(val) => setDateEnd(val)}
            label="Date End"
            className="md:w-[250px] w-full"
          />
        </div>
        <ResponsiveContainer height={300}>
          <LineChart data={data} margin={{ top: 16, left: 16, right: 16 }}>
            <XAxis dataKey="name" />
            <Tooltip
              formatter={(val) =>
                new Intl.NumberFormat().format(+val).toString()
              }
            />
            <YAxis
              tickFormatter={(val) => new Intl.NumberFormat().format(val)}
            />
            <Legend />
            <CartesianGrid stroke="#f5f5f5" />
            <Line type="monotone" dataKey="income" stroke="blue" />
            <Line type="monotone" dataKey="expense" stroke="red" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default SummarizeDailyTransactionChart;
