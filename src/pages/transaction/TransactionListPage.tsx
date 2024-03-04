import { DatePicker, DeleteDialog, Dropdown } from '@/components/common';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { ROUTE_TRANSACTION } from '@/config/routes';
import CategoryService from '@/service/category_service';
import TransactionService from '@/service/transaction_service';
import { Category } from '@/service/types/category_type';
import { Transaction } from '@/service/types/transaction_type';
import { parseErrorMessage } from '@/utils/api';
import { dateFormat } from '@/utils/date';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TransactionListPage() {
  const [date, setDate] = useState<Date>();
  const [type, setType] = useState('');
  const [category, setCategory] = useState<Category>();
  const wrappedFetchItems = useWrapInvalidToken((args) =>
    TransactionService.gets(args),
  );
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const selectedIdRef = useRef<number>();

  const { toast } = useToast();

  const columnHelper = createColumnHelper<Transaction>();
  const columns: ColumnDef<Transaction, any>[] = [
    columnHelper.accessor('date', {
      cell: (info) => dateFormat(info.getValue()),
      header: () => 'Date',
    }),
    columnHelper.accessor('type', {
      cell: (info) => info.getValue(),
      header: () => 'Type',
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('amount', {
      header: () => 'Amount',
      cell: (info) => new Intl.NumberFormat().format(info.getValue()),
      enableGlobalFilter: false,
    }),
    columnHelper.accessor('category.name', {
      header: () => 'Category',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: () => 'Description',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'action',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`${ROUTE_TRANSACTION}/${row.original.id}`);
                }}
              >
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`${ROUTE_TRANSACTION}/${row.original.id}/edit`);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenDeleteDialog(true);
                  selectedIdRef.current = row.original.id;
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const wrappedFetchCategoryItem = useWrapInvalidToken((args) =>
    CategoryService.gets(args),
  );

  const wrappedDeleteItem = useWrapInvalidToken((args) =>
    TransactionService.delete(args),
  );

  const fetchCategoryData = useCallback(
    async (searchText: string) => {
      const emptyArray: Category[] = [];

      if (!type) return emptyArray;

      const response = await wrappedFetchCategoryItem({ searchText, type });
      if (response) {
        return response.data as Category[];
      }

      return emptyArray;
    },
    [type],
  );

  const getParams = useCallback(() => {
    const params: any = {};
    if (date) params.date = date.toISOString().slice(0, 10);
    if (type && type !== 'ALL') params.type = type;
    if (category) params.categoryId = category.id;

    return params;
  }, [date, type, category]);

  const onConfirmDelete = async (confirmed: boolean) => {
    setOpenDeleteDialog(false);
    if (!confirmed) return;

    try {
      const response = await wrappedDeleteItem(selectedIdRef.current);
      toast({
        title: 'Success',
        description: response?.message,
      });
      setRefetch(!refetch);
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
        <CardHeader>
          <CardTitle>Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex p-2 border rounded-md gap-4 flex-wrap items-center">
            <DatePicker
              onDateChange={(val) => setDate(val)}
              className="md:w-[250px]"
              label="Date"
            />

            <Dropdown
              options={[
                { value: 'INCOME', label: 'INCOME' },
                { value: 'EXPENSE', label: 'EXPENSE' },
              ]}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              label="Type"
              className="md:w-[250px]"
              onChange={(opt) => setType(opt?.value ?? '')}
            />

            <Dropdown
              fetchData={fetchCategoryData}
              label="Category"
              getOptionLabel={(opt) => opt.name}
              getOptionValue={(opt) => opt.id.toString()}
              showSearchbar
              key={type}
              onChange={(opt) => setCategory(opt)}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => navigate(`${ROUTE_TRANSACTION}/create`)}>
              Create Transaction
            </Button>
          </div>
          <DataTable
            limit={10}
            columns={columns}
            fetchItems={wrappedFetchItems}
            getParams={getParams}
            refetch={refetch}
          />
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

export default TransactionListPage;
