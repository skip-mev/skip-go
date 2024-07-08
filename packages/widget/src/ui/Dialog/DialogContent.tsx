import * as Dialog from '@radix-ui/react-dialog';
import { DialogContentProps } from '@radix-ui/react-dialog';
import { PropsWithChildren, useContext } from 'react';

import { DialogContext } from './context';
import { cn } from '../../utils/ui';

interface Props extends PropsWithChildren {
  onInteractOutside?: DialogContentProps['onInteractOutside'];
}

export function DialogContent({ children, onInteractOutside }: Props) {
  const { open, container } = useContext(DialogContext);

  if (!open) return null;

  return (
    <Dialog.Portal>
      <div className="skip-go-widget">
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0 font-diatype" />
        <Dialog.Content
          className={cn(
            'data-[state=open]:animate-contentShow fixed top-[50%] left-[50%]',
            'w-[90vw] max-w-[450px] max-h-[820px] h-[90vh] rounded-xl',
            'translate-x-[-50%] translate-y-[-50%] bg-white shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]'
          )}
          onInteractOutside={onInteractOutside}
        >
          {children}
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  );
}
