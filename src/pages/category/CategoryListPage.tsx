import { DeleteDialog, Dropdown } from '@/components/common';
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
import { ROUTE_CATEGORY } from '@/config/routes';
import CategoryService from '@/service/category_service';
import { Category } from '@/service/types/category_type';
import { parseErrorMessage } from '@/utils/api';
import useWrapInvalidToken from '@/utils/hooks/useWrapInvalidToken';
import { createColumnHelper } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CategoryListPage() {
  const [type, setType] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const selectedIdRef = useRef<number>();
  const [refetch, setRefetch] = useState(false);
  const { toast } = useToast();

  const navigate = useNavigate();

  const wrappedFetchCategory = useWrapInvalidToken((args) =>
    CategoryService.gets(args),
  );
  const wrappedDeleteItem = useWrapInvalidToken((args) =>
    CategoryService.delete(args),
  );

  const columnHelper = createColumnHelper<Category>();

  const columns = [
    columnHelper.accessor('type', {
      cell: (info) => info.getValue(),
      header: () => 'Type',
    }),
    columnHelper.accessor('name', {
      cell: (info) => info.getValue(),
      header: () => 'Name',
    }),
    columnHelper.display({
      id: 'action',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigate(`${ROUTE_CATEGORY}/${row.original.id}/edit`);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  selectedIdRef.current = row.original.id;
                  setOpenDeleteDialog(true);
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

  const getParams = useCallback(() => {
    const params: any = {};

    if (type) params.type = type;

    return params;
  }, [type]);

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
        title: 'Error',
        description: parseErrorMessage(error),
        variant: 'destructive',
      });
    }
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex p-2 rounded-md border">
            <Dropdown
              options={[
                { label: 'Income', value: 'INCOME' },
                { label: 'Expense', value: 'EXPENSE' },
              ]}
              label="Type"
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => opt.value}
              onChange={(opt) => setType(opt?.value ?? '')}
            />
          </div>
          <DataTable
            fetchItems={wrappedFetchCategory}
            columns={columns}
            getParams={getParams}
            refetch={refetch}
          />

          <div className="flex justify-end">
            <Button onClick={() => navigate(`${ROUTE_CATEGORY}/create`)}>
              Create Category
            </Button>
          </div>
        </CardContent>
      </Card>
      <DeleteDialog
        itemName="Category"
        open={openDeleteDialog}
        onClose={onConfirmDelete}
      />
    </>
  );
}

export default CategoryListPage;
