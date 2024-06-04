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

const scrollStore = create<{ value: number[] }>(() => ({ value: [] }));
function persistScroll() {
  scrollStore.setState((prev) => ({
    value: prev.value.concat(window.scrollY),
  }));
}
function restoreScroll() {
  let value: number | undefined;
  scrollStore.setState((prev) => {
    value = prev.value.pop();
    return prev;
  });
  window.scrollTo({
    top: value,
    behavior: "smooth",
  });
}
function scrollTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

export const disclosure = {
  open: (key: DisclosureKey, { closeAll = false } = {}) => {
    persistScroll();
    disclosureStore.setState({
      ...(closeAll ? defaultValues : {}),
      [key]: true,
    });
    if (key.toLowerCase().endsWith("dialog")) {
      scrollTop();
    }
  },
  openJson: (json: NonNullable<DisclosureStore["json"]>) => {
    disclosureStore.setState({ json });
    persistScroll();
    scrollTop();
  },
  close: (key: DisclosureKey) => {
    disclosureStore.setState({ [key]: false });
    restoreScroll();
  },
  closeJson: () => {
    disclosureStore.setState({ json: undefined });
    restoreScroll();
  },
  toggle: (key: DisclosureKey) => {
    let latest: boolean | undefined;
    disclosureStore.setState((prev) => {
      latest = !prev[key];
      if (latest) persistScroll();
      return { [key]: latest };
    });
    if (typeof latest === "boolean" && !latest) {
      restoreScroll();
    }
  },
  set: (key: DisclosureKey, value: boolean) => {
    disclosureStore.setState({ [key]: value });
  },
  closeAll: () => {
    disclosureStore.setState(defaultValues);
    restoreScroll();
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
