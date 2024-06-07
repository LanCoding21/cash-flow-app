import { DailySummarizeTransaction } from '@/service/types/transaction_type';
import { Card, CardContent } from '../ui/card';
import { useMemo } from 'react';
import { numberFormat } from '@/utils/number';
import { Typography } from '../common';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';

interface IStatsCardProps {
  data: DailySummarizeTransaction[];
  previousData: DailySummarizeTransaction[];
  title: string;
}

function StatsCard(props: IStatsCardProps) {
  const { data, previousData, title } = props;

  const total = useMemo(() => {
    return data.reduce((a, b) => a + b.amount, 0);
  }, [data]);

  const totalPrevious = useMemo(() => {
    return previousData.reduce((a, b) => a + b.amount, 0);
  }, [previousData]);

  const percentage = useMemo(() => {
    if (!totalPrevious) return 100;

    return ((total - totalPrevious) / totalPrevious) * 100;
  }, [total, totalPrevious]);

  const isMinus = percentage < 0;

  const icon = isMinus ? (
    <TriangleDownIcon className="text-destructive w-6 h-6" />
  ) : (
    <TriangleUpIcon className="text-primary-500 w-6 h-6" />
  );

  return (
    <Card>
      <CardContent className="flex flex-col">
        <div className="flex items-center">
          <Typography variant="p" className="font-medium pr-2">
            {title}
          </Typography>
          ({icon}
          <span
            className={clsx('font-medium', { 'text-destructive': isMinus })}
          >
            {percentage.toFixed(2)}%
          </span>
          )
        </div>
        <Typography variant="h4">{numberFormat(total)}</Typography>
      </CardContent>
    </Card>
  );
}

export default StatsCard;
