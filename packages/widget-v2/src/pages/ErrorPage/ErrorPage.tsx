import { errorAtom } from '@/state/errorPage';
import NiceModal from '@ebay/nice-modal-react';
import { useResetAtom } from 'jotai/utils';

export const ErrorPage = ({
  error,
  componentStack,
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
