import { DeleteDialog, ItemDisplay, Typography } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ROUTE_TRANSACTION } from '@/config/routes';
import { isImage } from '@/lib/file-utils';
import TransactionService from '@/service/transaction_service';
import { Transaction } from '@/service/types/transaction_type';
import { parseErrorMessage } from '@/utils/api';
import { dateFormat } from '@/utils/date';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';
import { numberFormat } from '@/utils/number';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function TransactionItemPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Transaction>();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const wrappedFetchTransaction = useWrapInvalidToken((args) =>
    TransactionService.getById(args),
  );

  const wrappedDeleteItem = useWrapInvalidToken((args) =>
    TransactionService.delete(args),
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

  const onEditClick = () => {
    navigate(`${ROUTE_TRANSACTION}/${item!.id}/edit`);
  };

  const onConfirmDelete = async (confirmed: boolean) => {
    setOpenDeleteDialog(false);
    if (!confirmed) return;

    try {
      const response = await wrappedDeleteItem(id);
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
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex md:flex-row justify-between md:items-center">
          <CardTitle>Transaction Detail</CardTitle>
          {!loading && item ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEditClick}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete
              </Button>
            </div>
          ) : null}
        </CardHeader>
        <CardContent>
          {loading ? <>Loading...</> : null}
          {!loading && !item ? (
            <>
              <Typography>Data not found</Typography>
            </>
          ) : null}
          {!loading && item ? (
            <ItemDisplay
              data={item}
              attrsAndLabels={[
                { attr: 'type', label: 'Type' },
                {
                  attr: 'category',
                  display: (val) => val.name,
                  label: 'Category',
                },
                {
                  attr: 'date',
                  label: 'Date',
                  display: (val) => dateFormat(val),
                },
                {
                  attr: 'description',
                  label: 'Description',
                },
                {
                  attr: 'amount',
                  label: 'Amount',
                  display: (val) => numberFormat(val),
                },
                {
                  attr: 'receiptFile',
                  label: 'Receipt',
                  display: (val) => {
                    if (!val) return 'No receipt attached';

                    const isImg = isImage(val);

                    if (!isImg) {
                      return (
                        <button
                          onClick={() => {
                            window.open(
                              `${import.meta.env.VITE_API_URL}/${val}`,
                            );
                          }}
                          className="hover:underline"
                        >
                          See Attachment
                        </button>
                      );
                    }

                    return (
                      <img
                        style={{ width: 300 }}
                        src={`${import.meta.env.VITE_API_URL}/${val}`}
                      />
                    );
                  },
                },
              ]}
            />
          ) : null}
        </CardContent>
      </Card>
      <DeleteDialog
        onClose={onConfirmDelete}
        open={openDeleteDialog}
        itemName="Transaction"
      />
    </>
  );
}

export default TransactionItemPage;
