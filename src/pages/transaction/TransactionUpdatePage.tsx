import { Typography } from '@/components/common';
import TransactionForm from '@/components/transaction/TransactionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ROUTE_TRANSACTION } from '@/config/routes';
import CategoryService from '@/service/category_service';
import TransactionService from '@/service/transaction_service';
import { Transaction } from '@/service/types/transaction_type';
import { parseErrorMessage } from '@/utils/api';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function TransactionUpdatePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Transaction>();

  const wrappedFetchTransaction = useWrapInvalidToken((args) =>
    TransactionService.getById(args),
  );

  const wrappedFetchCategory = useWrapInvalidToken((args) =>
    CategoryService.gets(args),
  );

  const wrappedUpdateTransaction = useWrapInvalidToken(
    (id: number, payload: FormData) => TransactionService.update(id, payload),
  );

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await wrappedFetchTransaction(id);
        if (!active) return;
        setItem(response?.data);
      } catch (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: parseErrorMessage(error),
        });
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  const onCancelClick = () => {
    navigate(`${ROUTE_TRANSACTION}/${item!.id}`);
  };

  const onSubmit = async (val: FormData) => {
    try {
      const response = await wrappedUpdateTransaction(id, val);
      toast({
        title: 'Success',
        description: response?.message,
      });

      navigate(`${ROUTE_TRANSACTION}/${id}`);
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: parseErrorMessage(error),
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <>Loading...</> : null}
        {!loading && !item ? (
          <>
            <Typography>Data not found</Typography>
          </>
        ) : null}
        {!loading && item ? (
          <TransactionForm
            fetchCategory={wrappedFetchCategory}
            onSubmit={onSubmit}
            onCancel={onCancelClick}
            defaultValue={item}
            key={item.id}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

export default TransactionUpdatePage;
