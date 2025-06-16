import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { SwapExecutionState } from "./SwapExecutionPage";
import { useTheme } from "styled-components";
import pluralize from "pluralize";
import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { useSetAtom } from "jotai";
import { clearAssetInputAmountsAtom } from "@/state/swapPage";
import { currentPageAtom, Routes } from "@/state/router";
import { errorWarningAtom, ErrorWarningType } from "@/state/errorWarning";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { ClientOperation } from "@/utils/clientType";
import { GoFastSymbol } from "@/components/GoFastSymbol";
import { useIsGoFast } from "@/hooks/useIsGoFast";
import { useCountdown } from "./useCountdown";
import { track } from "@amplitude/analytics-browser";
import { useCallback } from "react";
import { RouteResponse } from "@skip-go/client";

type SwapExecutionButtonProps = {
  swapExecutionState: SwapExecutionState | undefined;
  route: RouteResponse | undefined;
  signaturesRemaining: number;
  lastOperation: ClientOperation;
  connectRequiredChains: (openModal?: boolean) => Promise<void>;
  submitExecuteRouteMutation: () => void;
};

export const SwapExecutionButton: React.FC<SwapExecutionButtonProps> = ({
  swapExecutionState,
  route,
  signaturesRemaining,
  lastOperation,
  connectRequiredChains,
  submitExecuteRouteMutation,
}) => {
  const countdown = useCountdown({
    estimatedRouteDurationSeconds: route?.estimatedRouteDurationSeconds,
    enabled: swapExecutionState === SwapExecutionState.pending,
  });

  const theme = useTheme();
  const setErrorWarning = useSetAtom(errorWarningAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const clearAssetInputAmounts = useSetAtom(clearAssetInputAmountsAtom);
  const isGoFast = useIsGoFast(route);

  const getDestinationAddreessUnsetText = useCallback(() => {
    const destinationChainIdHasSignRequired =
      lastOperation.signRequired && lastOperation.fromChainId === route?.destAssetChainId;

    if (destinationChainIdHasSignRequired && route?.txsRequired === 2) {
      return "Set second signing address";
    }
    return "Set destination address";
  }, [
    lastOperation.fromChainId,
    lastOperation.signRequired,
    route?.destAssetChainId,
    route?.txsRequired,
  ]);

  switch (swapExecutionState) {
    case SwapExecutionState.recoveryAddressUnset:
      return (
        <MainButton
          label="Set intermediary address"
          icon={ICONS.rightArrow}
          onClick={() => {
            track("swap execution page: set recovery address button - clicked");
            connectRequiredChains(true);
          }}
        />
      );
    case SwapExecutionState.destinationAddressUnset:
      return (
        <MainButton
          label={getDestinationAddreessUnsetText()}
          icon={ICONS.rightArrow}
          onClick={() => {
            track("swap execution page: set destination address button - clicked");
            const destinationChainId = route?.destAssetChainId;
            if (!destinationChainId) return;
            NiceModal.show(Modals.SetAddressModal, {
              signRequired:
                lastOperation.signRequired && lastOperation.fromChain === destinationChainId,
              chainId: destinationChainId,
              chainAddressIndex: route.requiredChainAddresses.length - 1,
            });
          }}
        />
      );
    case SwapExecutionState.ready: {
      track("swap execution page: confirm button - clicked", { route });
      const onClickConfirmSwap = () => {
        if (route?.txsRequired && route.txsRequired > 1) {
          track("warning page: additional signing required", { route });
          setErrorWarning({
            errorWarningType: ErrorWarningType.AdditionalSigningRequired,
            onClickContinue: () => submitExecuteRouteMutation(),
            signaturesRequired: route.txsRequired,
          });
          return;
        }
        submitExecuteRouteMutation();
      };
      return <MainButton label="Confirm" icon={ICONS.rightArrow} onClick={onClickConfirmSwap} />;
    }
    case SwapExecutionState.validatingGasBalance:
      return <MainButton label="Validating" icon={ICONS.rightArrow} loading />;
    case SwapExecutionState.waitingForSigning:
      return <MainButton label="Confirming" icon={ICONS.rightArrow} loading />;
    case SwapExecutionState.approving:
      return <MainButton label="Approving allowance" icon={ICONS.rightArrow} loading />;
    case SwapExecutionState.pending:
      return (
        <MainButton
          label="Processing"
          loading
          isGoFast={isGoFast}
          extra={isGoFast && <GoFastSymbol />}
          loadingTimeString={convertSecondsToMinutesOrHours(countdown)}
        />
      );
    case SwapExecutionState.signaturesRemaining:
      return (
        <MainButton
          label={`${signaturesRemaining} ${pluralize(
            "signature",
            signaturesRemaining,
          )} ${signaturesRemaining > 1 ? "are" : "is"} still required`}
          loading
          loadingTimeString={convertSecondsToMinutesOrHours(countdown)}
        />
      );
    case SwapExecutionState.confirmed:
      return (
        <MainButton
          label="Go again"
          icon={ICONS.checkmark}
          backgroundColor={theme.success.text}
          onClick={() => {
            track("swap execution page: go again button - clicked");
            clearAssetInputAmounts();
            setCurrentPage(Routes.SwapPage);
          }}
        />
      );
    case SwapExecutionState.pendingGettingAddresses:
      return <MainButton label="Getting addresses" loading />;

    default:
      return null;
  }
};
