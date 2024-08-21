import { errorAtom } from '@/state/errorPage';
import { useResetAtom } from 'jotai/utils';

export const ErrorPage = () => {
  const resetError = useResetAtom(errorAtom);

  return (
    <div>
      error page
      <button onClick={() => resetError()}>reset</button>
    </div>
  );
};
