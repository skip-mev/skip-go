import { useState } from "react";

const DEEPLINK_CHOICE = "WALLETCONNECT_DEEPLINK_CHOICE";
const RECENT_WALLET_DATA = "WCM_RECENT_WALLET_DATA";

export const useStoreAndRestoreWalletConnectLocalStorage = () => {
  const [walletConnectDeeplinkChoice, setWalletConnectDeeplinkChoice] = useState<string>();
  const [wcmRecentWalletData, setWcmRecentWalletData] = useState<string>();

  const storeWalletConnectLocalStorageValues = () => {
    const walletConnectDeeplinkChoice = window.localStorage.getItem(DEEPLINK_CHOICE);
    const wcmRecentWalletData = window.localStorage.getItem(RECENT_WALLET_DATA);

    if (walletConnectDeeplinkChoice) {
      setWalletConnectDeeplinkChoice(walletConnectDeeplinkChoice);
    }
    if (wcmRecentWalletData) {
      setWcmRecentWalletData(wcmRecentWalletData);
    }
  };

  const restoreWalletConnectLocalStorageValues = () => {
    if (walletConnectDeeplinkChoice) {
      window.localStorage.setItem(DEEPLINK_CHOICE, walletConnectDeeplinkChoice);
    }
    if (wcmRecentWalletData) {
      window.localStorage.setItem(RECENT_WALLET_DATA, wcmRecentWalletData);
    }
  };

  return { storeWalletConnectLocalStorageValues, restoreWalletConnectLocalStorageValues };
};
