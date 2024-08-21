import { errorAtom } from '@/state/errorPage';
import { useResetAtom } from 'jotai/utils';

export const ErrorPage = ({
  resetErrorBoundary,
}: {
  error?: Error;
  componentStack?: string;
  resetErrorBoundary?: () => void;
}) => {
  const resetError = useResetAtom(errorAtom);

  const handleReset = () => {
    resetError();
    resetErrorBoundary?.();
  };

  return (
    <div>
      error page
      <button onClick={handleReset}>reset</button>
    </div>
  );
};
