import {
  CheckCircleIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';
import {
  ComponentProps,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../utils/ui';

interface ContextType {
  type: 'error' | 'warning' | 'info' | 'success';
  isOpen: boolean;
  toggle: () => void;
}

const iconMap = {
  error: ExclamationTriangleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  success: CheckCircleIcon,
};

const Context = createContext<ContextType>({
  type: 'info',
  isOpen: false,
  toggle: () => {},
});

export const Root = ({
  className,
  type = 'info',
  initialOpen = false,
  ...props
}: ComponentProps<'div'> & {
  type?: ContextType['type'];
  initialOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(() => initialOpen);
  const toggle = () => setIsOpen((state) => !state);
  return (
    <Context.Provider value={{ type, isOpen, toggle }}>
      <div
        className={cn(
          'rounded-md',
          {
            'bg-red-50 text-red-400': type === 'error',
            'bg-yellow-50 text-yellow-600': type === 'warning',
            'bg-blue-50 text-blue-500': type === 'info',
            'bg-green-50 text-green-400': type === 'success',
          },
          className
        )}
        {...props}
      />
    </Context.Provider>
  );
};

export const Trigger = ({
  className,
  children,
  onClick,
  ...props
}: ComponentProps<'button'>) => {
  const { type, isOpen, toggle } = useContext(Context);
  const Icon = useMemo(() => iconMap[type], [type]);
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2 p-3',
        'text-left text-xs font-medium uppercase',
        isOpen && 'pb-0',
        className
      )}
      onClick={(event) => [toggle(), onClick?.(event)]}
      {...props}
    >
      <Icon className="h-5 w-5" />
      <span className="flex-1">{children}</span>
      <ChevronRightIcon className={cn('h-5 w-5', { 'rotate-90': isOpen })} />
    </button>
  );
};

export const Content = ({ className, ...props }: ComponentProps<'div'>) => {
  const { isOpen } = useContext(Context);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      ref.current?.scrollIntoView({ behavior: 'instant' });
    }
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div
      className={cn('space-y-1 p-4 text-sm', className)}
      ref={ref}
      {...props}
    />
  );
};
