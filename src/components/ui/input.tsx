import * as React from 'react';
import { ReactNode } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { cn } from '@/lib/utils';
import Typography from '@/components/common/Typography';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegister<any>;
  error?: boolean;
  helperText?: ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, register, name, error, helperText, ...props }, ref) => {
    const registerAttr = register ? register(name ?? '') : {};

    return (
      <>
        <input
          name={name}
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            { 'border-destructive': error },
            className,
          )}
          ref={ref}
          {...props}
          {...registerAttr}
        />
        {helperText ? (
          <Typography
            variant="muted"
            className={cn({ 'text-destructive': error })}
          >
            {helperText}
          </Typography>
        ) : null}
      </>
    );
  },
);
Input.displayName = 'Input';

export { Input };
