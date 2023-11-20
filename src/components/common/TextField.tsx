import { Input, InputProps } from '@/components/ui/input';
import { ReactNode, forwardRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Label } from '@/components/ui/label';

interface ITextFieldProps extends InputProps {
  label: string;
  register: UseFormRegister<any>;
  error: boolean;
  helperText: ReactNode;
}

const TextField = forwardRef<HTMLInputElement, Partial<ITextFieldProps>>(
  (props, ref) => {
    const { label, id, register, name, error, helperText, ...otherProps } =
      props;

    return (
      <div className="mb-3">
        {label ? (
          <Label htmlFor={id} error={error}>
            {label}
          </Label>
        ) : null}
        <Input
          id={id}
          ref={ref}
          register={register}
          name={name}
          error={error}
          helperText={helperText}
          {...otherProps}
        />
      </div>
    );
  },
);

export default TextField;
