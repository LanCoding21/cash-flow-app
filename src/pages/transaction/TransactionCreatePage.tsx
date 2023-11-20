import TransactionForm from '@/components/transaction/TransactionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ROUTE_TRANSACTION } from '@/config/routes';
import CategoryService from '@/service/category_service';
import TransactionService from '@/service/transaction_service';
import { parseErrorMessage } from '@/utils/api';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TransactionCreatePage() {
  const [loading, setLoading] = useState(false);

  const wrappedFetchCategory = useWrapInvalidToken((args) =>
    CategoryService.gets(args),
  );

  const wrappedCreateItem = useWrapInvalidToken((args) =>
    TransactionService.create(args),
  );

  const navigate = useNavigate();

  const { toast } = useToast();

  const onSubmit = async (val: FormData) => {
    try {
      setLoading(true);
      const response = await wrappedCreateItem(val);
      toast({
        title: 'Success',
        description: response?.message,
      });
      navigate(ROUTE_TRANSACTION);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: parseErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm
          fetchCategory={wrappedFetchCategory}
          onCancel={() => navigate(ROUTE_TRANSACTION)}
          onSubmit={onSubmit}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}

export default TransactionCreatePage;
