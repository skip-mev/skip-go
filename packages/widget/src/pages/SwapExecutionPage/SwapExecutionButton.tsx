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
import { ClientOperation } from "@/utils/clientType";
import { GoFastSymbol } from "@/components/GoFastSymbol";
import { useIsGoFast } from "@/hooks/useIsGoFast";

interface SwapExecutionButtonProps {
  swapExecutionState: SwapExecutionState | undefined;
  route: RouteResponse | undefined;
  signaturesRemaining: number;
  lastOperation: ClientOperation;
  connectRequiredChains: (openModal?: boolean) => Promise<void>;
  submitExecuteRouteMutation: () => void;
}

export const SwapExecutionButton: React.FC<SwapExecutionButtonProps> = ({
  swapExecutionState,
  route,
  signaturesRemaining,
  lastOperation,
  connectRequiredChains,
  submitExecuteRouteMutation,
}) => {
  const theme = useTheme();
  const setError = useSetAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const clearAssetInputAmounts = useSetAtom(clearAssetInputAmountsAtom);
  const isGoFast = useIsGoFast(route)

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
              signRequired: lastOperation.signRequired,
              chainId: destinationChainID,
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
      return (
        <MainButton
          label="Confirm swap"
          icon={ICONS.rightArrow}
          onClick={onClickConfirmSwap}
        />
      );
    }
    case SwapExecutionState.validatingGasBalance:
      return (
        <MainButton
          label="Validating gas and balance"
          icon={ICONS.rightArrow}
          loading
        />
      );
    case SwapExecutionState.waitingForSigning:
      return (
        <MainButton label="Confirm swap" icon={ICONS.rightArrow} loading />
      );
    case SwapExecutionState.approving:
      return (
        <MainButton label="Approving allowance" icon={ICONS.rightArrow} loading />
      );
    case SwapExecutionState.pending:
      return (
        <MainButton
          label="Swap in progress"
          loading
          isGoFast
          extra={isGoFast && <GoFastSymbol />}
          loadingTimeString={convertSecondsToMinutesOrHours(
            route?.estimatedRouteDurationSeconds
          )}
        />
      );
    case SwapExecutionState.signaturesRemaining:
      return (
        <MainButton
          label={`${signaturesRemaining} ${pluralize(
            "signature",
            signaturesRemaining
          )} ${signaturesRemaining > 1 ? "are" : "is"} still required`}
          loading
          loadingTimeString={convertSecondsToMinutesOrHours(
            route?.estimatedRouteDurationSeconds
          )}
        />
      );
    case SwapExecutionState.confirmed:
      return (
        <MainButton
          label="Swap again"
          icon={ICONS.checkmark}
          backgroundColor={theme.success.text}
          onClick={() => {
            clearAssetInputAmounts();
            setCurrentPage(Routes.SwapPage);
          }}
        />
      );
    default:
      return null;
  }
};
