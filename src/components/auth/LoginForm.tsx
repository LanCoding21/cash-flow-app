import TextField from '@/components/common/TextField';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@/components/ui/button';

const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required(),
});

interface ILoginFormProps {
  onSubmit: (val: { email: string; password: string }) => void;
  loading: boolean;
}

function LoginForm(props: ILoginFormProps) {
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
    name: 'email' | 'password',
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
        <TextField
          {...getFormAttribute('Email', 'email', 'email')}
          type="email"
        />
        <TextField
          {...getFormAttribute('Password', 'password', 'password')}
          type="password"
        />
        <Button loading={loading} className="w-full">
          Login
        </Button>
      </form>
    </>
  );
}

export default LoginForm;
