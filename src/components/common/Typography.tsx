import { ReactNode } from 'react';
import clsx from 'clsx';

interface ITypographyProps {
  children: ReactNode;
  className: string;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'muted';
}

function Typography(props: Partial<ITypographyProps>) {
  const { children, className, variant = 'small' } = props;
  const styles = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    p: 'leading-7 [&:not(:first-child)]:mt-6',
    small: 'text-sm font-medium leading-none',
    muted: 'text-sm text-muted-foreground',
  };
  return <p className={clsx(styles[variant], className)}>{children}</p>;
}

export default Typography;
