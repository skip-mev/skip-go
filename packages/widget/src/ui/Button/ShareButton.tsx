import toast from 'react-hot-toast';
import { SimpleTooltip } from '../SimpleTooltip';
import { cn } from '../../utils/ui';
import { styled } from 'styled-components';
import { ShareIcon } from '../Icon/ShareIcon';

export const ShareButton = ({ shareableLink }: { shareableLink: string }) => {
  return (
    <SimpleTooltip label="Share">
      <ThemedButton
        onClick={() => {
          try {
            navigator.clipboard.writeText(shareableLink);
            toast.success('Link copied to clipboard');
          } catch (error) {
            toast.error('Failed to copy link to clipboard');
          }
        }}
        className={cn(
          'rounded-full p-2 hover:bg-neutral-100',
          'transition-colors focus:outline-none'
        )}
      >
        <ShareIcon className="h-4 w-4" />
      </ThemedButton>
    </SimpleTooltip>
  );
};

export const ThemedButton = styled.button`
  color: ${(props) => props.theme.primary.textColor};
  fill: ${(props) => props.theme.primary.textColor};
  &:hover {
    background-color: rgba(245, 245, 245, 0.5);
  }
`;
