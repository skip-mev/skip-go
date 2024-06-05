import * as RadixDialog from "@radix-ui/react-dialog";
import { ForwardedRef, forwardRef, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {}

export const DialogTrigger = forwardRef(function DialogTrigger(
  { children, ...props }: Props,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <RadixDialog.Trigger
      asChild
      ref={ref}
      {...props}
    >
      {children}
    </RadixDialog.Trigger>
  );
});
