import { Category } from '@/service/types/category_type';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Dropdown, TextField } from '../common';
import { Button } from '../ui/button';

interface ICategoryFormProps {
  defaultValue: Category;
  onSubmit: (val: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const schema = yup.object().shape({
  type: yup.string().required('This field is required'),
  name: yup.string().required('This field is required'),
});

function CategoryForm(props: Partial<ICategoryFormProps>) {
  const {
    defaultValue,
    onSubmit = (_val) => {},
    onCancel,
    isSubmitting,
  } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const types = [
    { label: 'Income', value: 'INCOME' },
    { label: 'Expense', value: 'EXPENSE' },
  ];
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="type"
          defaultValue={defaultValue?.type ?? ''}
          render={({ field: { onChange } }) => {
            return (
              <Dropdown
                options={types}
                label="Type"
                getOptionLabel={(opt) => opt.label}
                getOptionValue={(opt) => opt.value}
                onChange={(opt) => {
                  onChange(opt?.value ?? '');
                }}
                helperText={errors?.type?.message}
                error={!!errors?.type}
                defaultValue={
                  types.filter((t) => t.value === defaultValue?.type)[0]
                }
                className="w-full"
              />
            );
          }}
        />
        <TextField
          label="Name"
          name="name"
          helperText={errors?.name?.message}
          error={!!errors?.name}
          register={register}
          defaultValue={defaultValue?.name ?? ''}
        />

        <div className="flex gap-2 mt-3">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={isSubmitting}>
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}

export default CategoryForm;
