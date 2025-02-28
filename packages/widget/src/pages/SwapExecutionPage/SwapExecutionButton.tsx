// SwapExecutionButton.tsx
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { SwapExecutionState } from "./SwapExecutionPage";
import { useTheme } from "styled-components";
import pluralize from "pluralize";
import { convertSecondsToMinutesOrHours } from "@/utils/number";
import { useSetAtom } from "jotai";
import { clearAssetInputAmountsAtom } from "@/state/swapPage";
import { currentPageAtom, Routes } from "@/state/router";
import { errorAtom, ErrorType } from "@/state/errorPage";
import NiceModal from "@ebay/nice-modal-react";
import { Modals } from "@/modals/registerModals";
import { RouteResponse } from "@skip-go/client";
import { GoFastSymbol } from "@/components/GoFastSymbol";
import { useIsGoFast } from "@/hooks/useIsGoFast";
import { useCountdown } from "./useCountdown";

type SwapExecutionButtonProps = {
  swapExecutionState: SwapExecutionState | undefined;
  route: RouteResponse | undefined;
  signaturesRemaining: number;
  connectRequiredChains: (openModal?: boolean) => Promise<void>;
  submitExecuteRouteMutation: () => void;
  abortSignal?: AbortSignal;
};

export const SwapExecutionButton: React.FC<SwapExecutionButtonProps> = ({
  swapExecutionState,
  route,
  signaturesRemaining,
  connectRequiredChains,
  submitExecuteRouteMutation,
  abortSignal,
}) => {
  const countdown = useCountdown({
    estimatedRouteDurationSeconds: route?.estimatedRouteDurationSeconds,
    swapExecutionState,
  });

  const theme = useTheme();
  const setError = useSetAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const clearAssetInputAmounts = useSetAtom(clearAssetInputAmountsAtom);
  const isGoFast = useIsGoFast(route);

  switch (swapExecutionState) {
    case SwapExecutionState.recoveryAddressUnset:
      return (
        <MainButton
          label="Set recovery address"
          icon={ICONS.rightArrow}
          onClick={() => {
            connectRequiredChains(true);
          }}
        />
      );
    case SwapExecutionState.destinationAddressUnset:
      return (
        <MainButton
          label="Set destination address"
          icon={ICONS.rightArrow}
          onClick={() => {
            const destinationChainID = route?.destAssetChainID;
            if (!destinationChainID) return;
            NiceModal.show(Modals.SetAddressModal, {
              chainId: destinationChainID,
              chainAddressIndex: route.requiredChainAddresses.length - 1,
              abortSignal: abortSignal,
            });
          }}
        />
      );
    case SwapExecutionState.ready: {
      const onClickConfirmSwap = () => {
        if (route?.txsRequired && route.txsRequired > 1) {
          setError({
            errorType: ErrorType.AdditionalSigningRequired,
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
