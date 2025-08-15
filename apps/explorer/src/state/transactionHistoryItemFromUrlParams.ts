import { atom } from "@/jotai";

export const transactionHistoryItemFromUrlParamsAtom = atom(() => {
  try {
    let targetUrl;
    if (typeof window !== 'undefined') {
      targetUrl = new URL(window.location.href);
    }

    const base64Data = targetUrl?.searchParams.get("data");
    
    if (!base64Data) {
      console.warn("No 'data' parameter found in URL");
      return null;
    }

    const jsonString = atob(base64Data);

    const decodedData = JSON.parse(jsonString);
    
    return decodedData;

  } catch (error) {
    console.error("Failed to decode URL parameter:", error?.message);
    return null;
  }
});

