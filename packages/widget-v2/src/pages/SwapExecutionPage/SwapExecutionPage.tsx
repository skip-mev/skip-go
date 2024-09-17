import { Column, Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { useMemo, useState } from "react";
import { ICONS } from "@/icons";
import { ManualAddressModal } from "@/modals/ManualAddressModal/ManualAddressModal";
import styled, { useTheme } from "styled-components";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { destinationWalletAtom } from "@/state/swapPage";
import { SwapExecutionPageRouteSimple } from "./SwapExecutionPageRouteSimple";
import { SwapExecutionPageRouteDetailed } from "./SwapExecutionPageRouteDetailed";

import { withBoundProps } from "@/utils/misc";
import { txState } from "./SwapExecutionPageRouteDetailedRow";
import { SmallText } from "@/components/Typography";
import { SignatureIcon } from "@/icons/SignatureIcon";
import pluralize from "pluralize";
import { useModal } from "@/components/Modal";
import { currentPageAtom, Routes } from "@/state/router";
import { ClientOperation, getClientOperations } from "@/utils/clientType";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";

enum SwapExecutionState {
  destinationAddressUnset,
  unconfirmed,
  broadcasted,
  confirmed,
}

const SIGNATURES_REQUIRED = 2;
const TX_DELAY_MS = 5_000;

export const SwapExecutionPage = () => {
  const theme = useTheme();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { route } = useAtomValue(swapExecutionStateAtom);

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    return getClientOperations(route.operations);
  }, [route?.operations]);

  const [_destinationWallet] = useAtom(destinationWalletAtom);
  const [swapExecutionState, _setSwapExecutionState] = useState(
    SwapExecutionState.unconfirmed
  );

  const [simpleRoute, setSimpleRoute] = useState(true);
  const modal = useModal(ManualAddressModal);

  const [txStateMap, _setTxStateMap] = useState<Record<number, txState>>({
    0: "pending",
    1: "pending",
    2: "pending",
  });

  const renderMainButton = useMemo(() => {
    switch (swapExecutionState) {
      case SwapExecutionState.destinationAddressUnset:
        return (
          <MainButton
            label="Set destination address"
            icon={ICONS.rightArrow}
            onClick={() => modal.show()}
          />
        );
      case SwapExecutionState.unconfirmed:
        return (
          <MainButton
            label="Confirm swap"
            icon={ICONS.rightArrow}
          />
        );
      case SwapExecutionState.broadcasted:
        return (
          <MainButton
            label="Swap in progress"
            loading
            loadingTimeString={`${(clientOperations.length * TX_DELAY_MS) / 1000
              } secs.`}
          />
        );
      case SwapExecutionState.confirmed:
        return (
          <MainButton
            label="Swap Complete"
            icon={ICONS.checkmark}
            backgroundColor={theme.success.text}
          />
        );
    }
  }, [clientOperations.length, modal, swapExecutionState, theme.success.text]);

  const SwapExecutionPageRoute = useMemo(() => {
    if (simpleRoute) {
      return withBoundProps(SwapExecutionPageRouteSimple, {
        onClickEditDestinationWallet: () => {
          modal.show();
        },
      });
    }
    return SwapExecutionPageRouteDetailed;
  }, [modal, simpleRoute]);

  return (
    <Column gap={5}>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => setCurrentPage(Routes.SwapPage)
        }}
        rightButton={{
          label: simpleRoute ? "Details" : "Hide details",
          icon: simpleRoute ? ICONS.hamburger : ICONS.horizontalLine,
          onClick: () => setSimpleRoute(!simpleRoute),
        }}
      />
      <SwapExecutionPageRoute
        txStateMap={txStateMap}
        operations={clientOperations}
      />
      {renderMainButton}
      <SwapPageFooter
        rightContent={
          SIGNATURES_REQUIRED && (
            <Row align="center" gap={8}>
              <SignatureIcon
                backgroundColor={theme.warning.text}
              />
              <StyledSignatureRequired>
                {SIGNATURES_REQUIRED}{" "}
                {pluralize("signature", SIGNATURES_REQUIRED)} still required
              </StyledSignatureRequired>
            </Row>
          )
        }
      />
    </Column>
  );
};

const StyledSignatureRequired = styled(SmallText)`
  color: ${({ theme }) => theme.warning.text};
`;
