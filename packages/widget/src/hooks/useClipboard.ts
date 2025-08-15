import { copyToClipboard } from "@/utils/misc";
import { useEffect, useState } from "react";

export const useClipboard = () => {
  const [isCopied, setIsShowingCopied] = useState(false);
  const [copyAddressTimeout, setCopyAddressTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      clearTimeout(copyAddressTimeout);
    };
  }, [copyAddressTimeout]);

  const saveToClipboard = (text?: string) => {
    if (!text) return;
    copyToClipboard(text);
    setIsShowingCopied(true);
    const timeout = setTimeout(() => {
      setIsShowingCopied(false);
    }, 1000);
    setCopyAddressTimeout(timeout);
  };

  return {
    saveToClipboard,
    isCopied,
  };
};
