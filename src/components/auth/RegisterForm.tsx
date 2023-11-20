import TextField from '@/components/common/TextField';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';

const schema = yup.object().shape({
  fullName: yup.string().required('This field is required'),
  email: yup.string().required(),
  password: yup.string().required(),
});

interface IRegisterFormProps {
  onSubmit: (val: { email: string; password: string }) => void;
  loading?: boolean;
}

function RegisterForm(props: IRegisterFormProps) {
  const { onSubmit, loading } = props;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const getFormAttribute = (
    label: string,
    name: 'email' | 'password' | 'fullName',
    id: string,
  ) => {
    const errObj = errors[name] ?? null;
    return {
      label,
      name,
      id,
      register,
      error: !!errObj,
      helperText: errObj?.message,
    };
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField {...getFormAttribute('Full Name', 'fullName', 'fullName')} />
        <TextField
          {...getFormAttribute('Email', 'email', 'email')}
          type="email"
        />
        <TextField
          {...getFormAttribute('Password', 'password', 'password')}
          type="password"
        />
        <Button loading={loading} className="w-full">
          Register
        </Button>
      </form>
    </>
  );
}

export default RegisterForm;
