import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { useDisclosureKey } from '../store/disclosures';
import { cn } from '../utils/ui';
import { StyledBrandDiv } from './StyledComponents/Theme';

interface Props {
  onGoBack: () => void;
  message?: string;
  title?: string;
}

export const PriceImpactWarning = ({
  onGoBack,
  message = '',
  title = '',
}: Props) => {
  const [isOpen, control] = useDisclosureKey('priceImpactDialog');

  if (!isOpen || title === '') return null;

  return (
    <div className="absolute inset-0 flex flex-col overflow-y-auto rounded-3xl bg-white p-6 scrollbar-hide">
      <div className="flex-grow pt-8">
        <div className="flex justify-center py-16 text-red-400">
          <ExclamationTriangleIcon className="h-24 w-24" />
        </div>
        <h3 className="mb-2 text-center text-lg font-bold text-red-500">
          {title}
        </h3>
        <p className="px-4 text-center text-lg text-neutral-500">
          {message} Do you want to continue?
        </p>
      </div>
      <div className="flex items-end gap-2">
        <button
          className="w-full rounded-lg border border-neutral-400 py-4 font-semibold text-neutral-500 transition-colors"
          onClick={() => control.close()}
        >
          Continue
        </button>
        <StyledBrandDiv
          as="button"
          className={cn(
            'w-full rounded-lg border border-transparent py-4 font-semibold text-white transition-colors',
            `hover:opacity-90`
          )}
          onClick={() => {
            control.close();
            onGoBack();
          }}
        >
          Go Back
        </StyledBrandDiv>
      </div>
    </div>
  );
};
