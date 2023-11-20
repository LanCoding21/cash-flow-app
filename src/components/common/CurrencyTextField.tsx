import { parseLocaleNumber } from '@/utils/number';
import { InputHTMLAttributes, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UseFormRegister } from 'react-hook-form';

interface CurrencyTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error: boolean;
  helperText: any;
  rounded: boolean;
  labelClassName: string;
  onValueChange: (val: number) => void;
  register: UseFormRegister<any>;
}

function CurrencyTextField(props: Partial<CurrencyTextFieldProps>) {
  const {
    label,
    className,
    error,
    helperText,
    rounded,
    id,
    name,
    labelClassName,
    type,
    defaultValue = 0,
    onValueChange = (_val) => {},
    register,
    ...otherProps
  } = props;
  const num = useRef<number>(+defaultValue);
  const [formattedNumber, setFormattedNumber] = useState(
    new Intl.NumberFormat('id-ID').format(num.current),
  );

  const handleChange = (str: string) => {
    num.current = parseLocaleNumber(str);
    setFormattedNumber(new Intl.NumberFormat('id-ID').format(num.current));
    onValueChange(num.current);
  };

  return (
    <div className="mb-3">
      {label && (
        <Label error={error} htmlFor={id} className={labelClassName}>
          {label}
        </Label>
      )}
      {register ? (
        <input hidden {...register(name!)} value={num.current} />
      ) : null}
      <Input
        name={name}
        value={formattedNumber}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        helperText={helperText}
        type={type}
        autoComplete="off"
        id={id}
        {...otherProps}
        error={error}
      />
    </div>
  );
}

export default CurrencyTextField;
