import {
  CurrencyTextField,
  DatePicker,
  Dropdown,
  TextField,
} from '@/components/common';
import { Category } from '@/service/types/category_type';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Transaction } from '@/service/types/transaction_type';

const schema = yup.object().shape({
  date: yup.string().required('This field is required'),
  type: yup.string().required('This field is required'),
  categoryId: yup
    .number()
    .typeError('This field is required')
    .required('This field is required'),
  description: yup.string().required('This field is required'),
  amount: yup
    .number()
    .typeError('This field is required')
    .min(1, 'Must be greated than 0')
    .required('This field is required'),
});

interface ITransactionFormProps {
  fetchCategory: (
    args: any,
  ) => Promise<{ data: any; message: string; page: any } | undefined>;
  onSubmit: (val: FormData) => void;
  onCancel?: () => void;
  loading?: boolean;
  defaultValue?: Transaction;
}

function TransactionForm(props: ITransactionFormProps) {
  const { fetchCategory, onSubmit, onCancel, loading, defaultValue } = props;
  const [selectedType, setSelectedType] = useState(defaultValue?.type ?? '');
  const [receipt, setReceipt] = useState<File>();

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchCategoryData = useCallback(
    async (searchText: string) => {
      const emptyArray: Category[] = [];
      if (!selectedType) return emptyArray;

      const response = await fetchCategory({ type: selectedType, searchText });

      if (response) {
        return response.data as Category[];
      }
      return emptyArray;
    },
    [selectedType],
  );

  const submitForm = (val: any) => {
    const formData = new FormData();
    if (receipt) formData.append('receipt', receipt);

    const keys = Object.keys(val);
    keys.forEach((k) => {
      formData.append(k, val[k]);
    });

    onSubmit(formData);
  };

  const types = [
    { value: 'INCOME', label: 'INCOME' },
    { value: 'EXPENSE', label: 'EXPENSE' },
  ];

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="w-full md:w-1/3">
        <Controller
          control={control}
          name="date"
          defaultValue={defaultValue?.date ?? ''}
          render={({ field: { onChange } }) => {
            return (
              <DatePicker
                label="Date"
                className="w-full"
                onDateChange={(val) => {
                  onChange(val?.toISOString() ?? '');
                }}
                defaultDate={
                  defaultValue?.date ? new Date(defaultValue.date) : undefined
                }
                error={!!errors?.date}
                helperText={errors?.date?.message}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="type"
          defaultValue={selectedType}
          render={({ field: { onChange } }) => {
            return (
              <Dropdown
                options={types}
                getOptionLabel={(opt) => opt.label}
                getOptionValue={(opt) => opt.value}
                label="Type"
                className="w-full"
                onChange={(opt) => {
                  setSelectedType(opt?.value ?? '');
                  onChange(opt?.value);
                }}
                defaultValue={
                  types.filter((t) => t.value === defaultValue?.type)[0]
                }
                error={!!errors?.type}
                helperText={errors?.type?.message}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="categoryId"
          defaultValue={defaultValue?.categoryId}
          render={({ field: { onChange } }) => {
            return (
              <Dropdown
                fetchData={fetchCategoryData}
                getOptionLabel={(opt) => opt.name}
                getOptionValue={(opt) => opt.id.toString()}
                label="Category"
                showSearchbar
                className="w-full"
                onChange={(opt) => {
                  onChange(opt?.id ?? '');
                }}
                defaultValue={defaultValue?.category}
                error={!!errors?.categoryId}
                helperText={errors?.categoryId?.message}
              />
            );
          }}
        />
        <TextField
          label="Description"
          register={register}
          name="description"
          error={!!errors?.description}
          helperText={errors?.description?.message}
          defaultValue={defaultValue?.description ?? ''}
        />
        <Controller
          control={control}
          name="amount"
          defaultValue={defaultValue?.amount}
          render={({ field: { onChange } }) => {
            return (
              <CurrencyTextField
                name="amount"
                error={!!errors?.amount}
                helperText={errors?.amount?.message}
                label="Amount"
                onValueChange={(val) => onChange(val)}
                defaultValue={defaultValue?.amount ?? 0}
              />
            );
          }}
        />
        <TextField
          label="Receipt"
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => {
            const val = (e.target.files ?? []).length
              ? e.target.files![0]
              : undefined;
            setReceipt(val);
          }}
        />
      </div>

      <div className="flex mt-3 gap-3">
        <Button onClick={onCancel} size="sm" variant="outline">
          Cancel
        </Button>
        <Button type="submit" size="sm" loading={loading}>
          Submit
        </Button>
      </div>
    </form>
  );
}

export default TransactionForm;
