import { ComponentProps } from 'react';
import { cn } from '../../utils/ui';

export const Root = ({ className, ...props }: ComponentProps<'dl'>) => {
  return (
    <dl className={cn('divide-y text-start text-sm', className)} {...props} />
  );
};

export const Row = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={cn('grid grid-cols-3 p-2', className)} {...props} />;
};

export const Dt = ({ className, ...props }: ComponentProps<'dt'>) => {
  return (
    <dt className={cn('col-span-1 flex items-center', className)} {...props} />
  );
};

export const Dd = ({ className, ...props }: ComponentProps<'dd'>) => {
  return <dd className={cn('col-span-2', className)} {...props} />;
};
