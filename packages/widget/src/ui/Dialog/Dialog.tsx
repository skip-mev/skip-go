import * as RadixDialog from '@radix-ui/react-dialog';
import { PropsWithChildren, useRef } from 'react';

import { DialogContext } from './context';

interface Props extends PropsWithChildren {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Dialog({ children, open, onOpenChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <DialogContext.Provider value={{ open, onOpenChange, container: ref }}>
      <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
        {children}
        <div ref={ref} />
      </RadixDialog.Root>
    </DialogContext.Provider>
  );
}
