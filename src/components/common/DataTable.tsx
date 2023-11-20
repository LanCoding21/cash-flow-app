import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, ReloadIcon } from '@radix-ui/react-icons';
import { TextField } from '@/components/common';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface IDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  fetchItems?: (...args: any) => Promise<any>;
  limit?: number;
  page?: number;
  refetch?: boolean;
  getParams?: () => {};
  data?: TData[];
}

export default function DataTable<TData, TValue>({
  columns,
  fetchItems,
  data: parentData,
  limit = 10,
  page,
  getParams,
  refetch,
}: IDataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>(
    () => parentData ?? ([] as TData[]),
  );
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  });

  const [pageData, setPageData] = useState({
    totalItems: data.length,
    limit,
    page: page ?? 1,
  });

  useEffect(() => {
    let active = true;

    const x = setTimeout(async () => {
      setLoading(true);
      try {
        if (!fetchItems) return;

        let params: any = {
          limit: pageData.limit,
          offset: pageData.page,
          searchText,
        };

        if (getParams) {
          params = {
            ...params,
            ...getParams(),
          };
        }

        const response = await fetchItems(params);

        if (!active) return;

        setData(response.data ?? []);
        setPageData((old) => ({
          ...old,
          totalItems: response.page?.totalItems ?? 0,
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 1000);

    return () => {
      active = false;
      clearTimeout(x);
    };
  }, [
    pageData.limit,
    pageData.page,
    fetchItems,
    searchText,
    getParams,
    refetch,
  ]);

  useEffect(() => {
    const x = setTimeout(() => {
      setPageData((old) => ({
        ...old,
        page: 1,
      }));
    }, 750);

    return () => {
      clearTimeout(x);
    };
  }, [searchText, getParams, refetch]);

  const helperText = useMemo(() => {
    const start = ((pageData.page ?? 1) - 1) * limit + 1;
    let end = (pageData.page ?? 1) * limit;

    if (data.length < limit) {
      end = ((pageData.page ?? 1) - 1) * limit + data.length;
    }
    return `Shows ${start} - ${end} of ${pageData.totalItems} row(s)`;
  }, [pageData.page, limit, pageData.totalItems, data]);

  const hasData = useMemo(() => {
    return data.length > 0;
  }, [data]);

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center py-4">
        <TextField
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="md:ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded md-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center gap-4">
                    <ReloadIcon /> Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
            {hasData && !loading
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
            {!hasData && !loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data available!
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {data.length ? helperText : null}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPageData((old) => ({
                  ...old,
                  page: old.page - 1,
                }))
              }
              disabled={pageData.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPageData((old) => ({
                  ...old,
                  page: old.page + 1,
                }))
              }
              disabled={
                (pageData.page - 1) * pageData.limit + data.length >=
                pageData.totalItems
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
