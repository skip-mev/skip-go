import { track } from "@amplitude/analytics-browser";
import { useEffect } from "react";

export function usePreventPageUnload(shouldWarn: boolean) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldWarn) {
        track("Prevent user leaving the page before all txs are signed");
        e.preventDefault();
        e.returnValue =
          "Please complete the required transaction signatures to complete this trade. Leaving this page before signing both may cause your trade to fail."; // This triggers the dialog in most browsers
        return "Please complete the required transaction signatures to complete this trade. Leaving this page before signing both may cause your trade to fail."; // This is for older browsers that still use this return value
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldWarn]);
}
