import { useEffect, useMemo } from "react";
import { trackWallet, useTrackWallet } from "../store/track-wallet";
import { Logger, WalletManager } from "@cosmos-kit/core"
import { assets, chains } from "../chains";
import { wallets } from "../lib/cosmos-kit";
import { useManager, useWallet } from "@cosmos-kit/react";

const getKeplr = () => {
  if (typeof window.keplr !== "undefined") {
    const subscription: (reconnect: () => void) => () => void = (reconnect) => {
      const listener = () => {
        reconnect();
      };
      window.addEventListener("keplr_keystorechange", listener);
      return () => {
        window.removeEventListener("keplr_keystorechange", listener);
      };
    };

    return subscription;
  }
};

export const getLeap = () => {
  if (typeof window.leap !== "undefined") {
    const subscription: (reconnect: () => void) => () => void = (reconnect) => {
      const listener = () => {
        reconnect();
      };
      window.addEventListener("leap_keystorechange", listener);
      return () => {
        window.removeEventListener("leap_keystorechange", listener);
      };
    };
    return subscription;
  }
};

const getVectis = () => {
  if (typeof window.vectis !== "undefined") {
    const subscription: (reconnect: () => void) => () => void = (reconnect) => {
      const listener = () => {
        reconnect();
      };
      window.addEventListener("vectis_accountChanged", listener);
      return () => {
        window.removeEventListener("vectis_accountChanged", listener);
      };
    };
    return subscription;
  }
}

const getOkx = () => {
  if (typeof window.okxwallet?.keplr !== "undefined") {
    const okxWallet = window.okxwallet.keplr;
    const subscription: (reconnect: () => void) => () => void = (reconnect) => {
      const listener = () => {
        reconnect();
      };
      window.okxwallet?.on("accountsChanged", listener);
      return () => {
        window.okxwallet?.removeListener("accountsChanged", listener);
      };
    };
    return subscription;
  }
}

const getCosmostation = () => {
  if (typeof window.cosmostation?.providers.keplr !== "undefined") {
    const subscription: (reconnect: () => void) => () => void = (reconnect) => {
      const listener = () => {
        reconnect();
      };
      window.addEventListener("cosmostation_keystorechange", listener);
      return () => {
        window.removeEventListener("cosmostation_keystorechange", listener);
      };
    };
    return subscription;
  }
}

const getStation = () => {
  if (typeof window.station !== "undefined") {
    const subscription: (reconnect: () => void) => () => void = (reconnect) => {
      const listener = () => {
        reconnect();
      };
      window.addEventListener("station_wallet_change", listener);
      return () => {
        window.removeEventListener("station_wallet_change", listener);
      };
    };
    return subscription;
  }
}

export const useWalletSubscriptions = (reconnect: () => void) => {
  const trackedWallet = useTrackWallet("cosmos");
  const a = useWallet()
  console.log("aa",)
  const getSelectedWalletSubscription = useMemo(() => {
    if (!trackedWallet) return
    if (trackedWallet.walletName.includes("keplr")) {
      return getKeplr();
    }
    if (trackedWallet.walletName.includes("leap")) {
      return getLeap();
    }
    if (trackedWallet.walletName.includes("vectis")) {
      return getVectis();
    }
    if (trackedWallet.walletName.includes("okx")) {
      return getOkx();
    }
    if (trackedWallet.walletName.includes("cosmostation")) {
      return getCosmostation();
    }
    if (trackedWallet.walletName === "station-extension") {
      return getStation();
    }
  }, [trackedWallet, getKeplr, getLeap, getVectis, getOkx, getCosmostation, getStation]);
  useEffect(() => {
    if (getSelectedWalletSubscription) {
      return getSelectedWalletSubscription(() => {
        reconnect();
      });
    }
  }, [getSelectedWalletSubscription]);

}
