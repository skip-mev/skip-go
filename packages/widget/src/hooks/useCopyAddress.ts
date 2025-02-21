import { copyToClipboard } from "@/utils/misc";
import { useEffect, useState } from "react";

export const useCopyAddress = () => {
  const [isShowingCopyAddressFeedback, setIsShowingCopyAddressFeedback] = useState(false);
  const [copyAddressTimeout, setCopyAddressTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      clearTimeout(copyAddressTimeout);
    };
  }, [copyAddressTimeout]);

  const copyAddress = (address?: string) => {
    if (!address) return;
    copyToClipboard(address);
    setIsShowingCopyAddressFeedback(true);
    const timeout = setTimeout(() => {
      setIsShowingCopyAddressFeedback(false);
    }, 1000);
    setCopyAddressTimeout(timeout);
  };

  return {
    copyAddress,
    isShowingCopyAddressFeedback,
  };
};
