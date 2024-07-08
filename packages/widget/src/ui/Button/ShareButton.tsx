import toast from 'react-hot-toast';
import { SimpleTooltip } from '../SimpleTooltip';
import { cn } from '../../utils/ui';
import { ShareIcon } from '../Icon/ShareIcon';

export const ShareButton = ({ shareableLink }: { shareableLink: string }) => {
  return (
    <SimpleTooltip label="Share">
      <button
        onClick={() => {
          try {
            navigator.clipboard.writeText(shareableLink);
            toast.success('Link copied to clipboard');
          } catch (error) {
            toast.error('Failed to copy link to clipboard');
          }
        }}
        className={cn(
          'rounded-full p-2 text-black/80 hover:bg-neutral-100 hover:text-black/100',
          'transition-colors focus:outline-none'
        )}
      >
        <ShareIcon className="h-4 w-4" />
      </button>
    </SimpleTooltip>
  );
};
