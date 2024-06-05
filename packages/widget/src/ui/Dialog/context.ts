import { createContext, RefObject } from "react";

export interface DialogContext {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  container: RefObject<HTMLDivElement>;
}

export const DialogContext = createContext<DialogContext>({
  open: false,
  onOpenChange: () => {},
  container: { current: null },
});
