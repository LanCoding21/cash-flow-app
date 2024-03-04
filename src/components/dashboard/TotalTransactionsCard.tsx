import TransactionService from '@/service/transaction_service';
import { DailySummarizeTransaction } from '@/service/types/transaction_type';
import { parseErrorMessage } from '@/utils/api';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { DatePicker, Typography } from '../common';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';
import clsx from 'clsx';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

function TotalTransactionsCard() {
  const [transactions, setTransactions] =
    useState<DailySummarizeTransaction[]>();
  const [dateStart, setDateStart] = useState<Date | undefined>(() => {
    const date = new Date();

    return new Date(`${date.getFullYear()}-01-01`);
  });

  const [dateEnd, setDateEnd] = useState<Date | undefined>(() => {
    const date = new Date();

    return new Date(`${date.getFullYear()}-12-31`);
  });

  const wrappedFetchItems = useWrapInvalidToken((args) =>
    TransactionService.getSummarizeDailyTransaction(args),
  );

  useEffect(() => {
    let active = true;

    const x = setTimeout(async () => {
      if (!dateStart && !dateEnd) return;
      const params: any = {};
      if (dateStart) {
        dateStart.setHours(dateStart.getHours() - 7);
        params.dateStart = dateStart.toISOString().slice(0, 10);
      }

      if (dateEnd) {
        dateEnd.setHours(dateEnd.getDate() - 7);
        params.dateEnd = dateEnd.toISOString().slice(0, 10);
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

  const incomeTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((t) => t.type === 'INCOME');
  }, [transactions]);

  const expenseTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((t) => t.type === 'EXPENSE');
  }, [transactions]);

  const diffTransactions = useMemo(() => {
    const income = incomeTransactions.reduce((a, b) => a + b.amount, 0);
    const expense = expenseTransactions.reduce((a, b) => a + b.amount, 0);

    return income - expense;
  }, [incomeTransactions, expenseTransactions]);

  const incomePieData = useMemo(() => {
    const group = Array.from(
      new Set(incomeTransactions.map((it) => it.category)),
    );

    return group.map((g) => {
      const value = incomeTransactions
        .filter((it) => it.category === g)
        .reduce((a, b) => a + b.amount, 0);
      return {
        name: g,
        value,
      };
    });
  }, [incomeTransactions]);
  const expensePieData = useMemo(() => {
    const group = Array.from(
      new Set(expenseTransactions.map((it) => it.category)),
    );

    return group.map((g) => {
      const value = expenseTransactions
        .filter((it) => it.category === g)
        .reduce((a, b) => a + b.amount, 0);
      return {
        name: g,
        value,
      };
    });
  }, [expenseTransactions]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Transactions</CardTitle>
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

        <div className="flex flex-col md:flex-row">
          <ResponsiveContainer height={300}>
            <PieChart title="TEST">
              <text
                x="50%"
                y="50%"
                alignmentBaseline="middle"
                textAnchor="middle"
              >
                INCOME
              </text>
              <Pie
                dataKey="value"
                fill="#A7D397"
                data={incomePieData}
                innerRadius={65}
                paddingAngle={6}
              />
              <Tooltip
                formatter={(val: any) => new Intl.NumberFormat().format(val)}
              />
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer height={300}>
            <PieChart title="TEST">
              <text
                x="50%"
                y="50%"
                alignmentBaseline="middle"
                textAnchor="middle"
              >
                EXPENSE
              </text>
              <Pie
                dataKey="value"
                fill="#C70039"
                data={expensePieData}
                innerRadius={65}
                paddingAngle={6}
              />
              <Tooltip
                formatter={(val: any) => new Intl.NumberFormat().format(val)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center">
            <Typography>Income</Typography>
            <Typography variant="h4">
              {new Intl.NumberFormat().format(
                incomeTransactions.reduce((a, b) => a + b.amount, 0),
              )}
            </Typography>
          </div>

          <div className="text-center">
            <Typography>Expense</Typography>
            <Typography variant="h4">
              {new Intl.NumberFormat().format(
                expenseTransactions.reduce((a, b) => a + b.amount, 0),
              )}
            </Typography>
          </div>
        </div>

        <div className="text-center mt-4">
          <Typography variant="h4">Summary</Typography>
          <Typography
            variant="h3"
            className={clsx(
              { 'text-destructive': diffTransactions < 0 },
              'border-b-0',
            )}
          >
            {diffTransactions < 0 ? '-' : '+'}
            {new Intl.NumberFormat().format(Math.abs(diffTransactions))}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export default TotalTransactionsCard;
