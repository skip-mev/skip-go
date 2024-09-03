import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const defaultValues = {
  confirmSwapDialog: false,
  historyDialog: false,
  priceImpactDialog: false,
  settingsDialog: false,
  destinationDialog: false,
  embedDialog: false,
  // TODO: port dialogs to new system
  // assetSelect: false,
  // chainSelect: false,
};

export type DisclosureStore = typeof defaultValues & {
  json?: { title?: string; data: unknown };
};
export type DisclosureKey = keyof typeof defaultValues;

const disclosureStore = create(
  persist((): DisclosureStore => defaultValues, {
    name: "DisclosuresState",
    version: 1,
    partialize: (state) => ({
      historyDialog: state.historyDialog,
    }),
    skipHydration: true,
    storage: createJSONStorage(() => window.sessionStorage),
  }),
);

export const disclosure = {
  open: (key: DisclosureKey, { closeAll = false } = {}) => {
    disclosureStore.setState({
      ...(closeAll ? defaultValues : {}),
      [key]: true,
    });
  },
  openJson: (json: NonNullable<DisclosureStore["json"]>) => {
    disclosureStore.setState({ json });
  },
  close: (key: DisclosureKey) => {
    disclosureStore.setState({ [key]: false });
  },
  closeJson: () => {
    disclosureStore.setState({ json: undefined });
  },
  toggle: (key: DisclosureKey) => {
    let latest: boolean | undefined;
    disclosureStore.setState((prev) => {
      latest = !prev[key];
      return { [key]: latest };
    });
    if (typeof latest === "boolean" && !latest) {
    }
  },
  set: (key: DisclosureKey, value: boolean) => {
    disclosureStore.setState({ [key]: value });
  },
  closeAll: () => {
    disclosureStore.setState(defaultValues);
  },
  rehydrate: () => disclosureStore.persist.rehydrate(),
};

export function useDisclosureKey(key: DisclosureKey) {
  const state = disclosureStore((state) => state[key]);
  const actions = {
    open: ({ closeAll = false } = {}) => disclosure.open(key, { closeAll }),
    close: () => disclosure.close(key),
    toggle: () => disclosure.toggle(key),
    set: (value: boolean) => disclosure.set(key, value),
  };
  return [state, actions] as const;
}

export function useJsonDisclosure() {
  const state = disclosureStore((state) => state.json);
  const actions = {
    open: (json: NonNullable<DisclosureStore["json"]>) => {
      disclosureStore.setState({ json });
    },
    close: () => {
      disclosureStore.setState({ json: undefined });
    },
  };
  return [state, actions] as const;
}

export function useAnyDisclosureOpen() {
  return disclosureStore((state) => Object.values(state).some(Boolean));
}
