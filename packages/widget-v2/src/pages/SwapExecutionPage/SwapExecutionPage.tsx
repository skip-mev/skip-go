import { Column, Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SwapPageFooter } from "@/pages/SwapPage/SwapPageFooter";
import { SwapPageHeader } from "@/pages/SwapPage/SwapPageHeader";
import { useEffect, useMemo, useState } from "react";
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
import { skipRouteAtom } from "@/state/skipClient";
import { ClientOperation, getClientOperations } from "@/utils/clientType";

enum SwapExecutionState {
  destinationAddressUnset,
  unconfirmed,
  broadcasted,
  confirmed,
}

const SIGNATURES_REQUIRED = 2;
const TX_DELAY_MS = 5_000; // 5 seconds

export const SwapExecutionPage = () => {
  const theme = useTheme();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { data: route, dataUpdatedAt } = useAtomValue(skipRouteAtom);

  const clientOperations = useMemo(() => {
    if (!route?.operations) return [] as ClientOperation[];
    const data = getClientOperations(route.operations);
    console.log(data);
    return data;
  }, [route?.operations]);

  const [destinationWallet] = useAtom(destinationWalletAtom);
  const [swapExecutionState, setSwapExecutionState] = useState(
    destinationWallet
      ? SwapExecutionState.unconfirmed
      : SwapExecutionState.destinationAddressUnset
  );

  useEffect(() => {
    if (destinationWallet) {
      setSwapExecutionState(SwapExecutionState.unconfirmed);
    }
  }, [destinationWallet]);
  const [simpleRoute, setSimpleRoute] = useState(true);
  const modal = useModal(ManualAddressModal);

  const [txStateMap, setTxStateMap] = useState<Record<number, txState>>({
    0: "pending",
    1: "pending",
    2: "pending",
  });

  const tempBeginSwap = () => {
    // for testing/demo
    setSwapExecutionState(SwapExecutionState.broadcasted);
    setTxStateMap({
      0: "broadcasted",
      1: "pending",
      2: "pending",
    });
    setTimeout(() => {
      setTxStateMap({
        0: "confirmed",
        1: "broadcasted",
        2: "pending",
      });
      setTimeout(() => {
        setTxStateMap({
          0: "confirmed",
          1: "confirmed",
          2: "broadcasted",
        });
        setTimeout(() => {
          setTxStateMap({
            0: "confirmed",
            1: "confirmed",
            2: "confirmed",
          });
          setSwapExecutionState(SwapExecutionState.confirmed);
        }, TX_DELAY_MS);
      }, TX_DELAY_MS);
    }, TX_DELAY_MS);
  };

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
            onClick={() => {
              tempBeginSwap();
            }}
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
        key={dataUpdatedAt}
        txStateMap={txStateMap}
        operations={clientOperations}
      />
      {renderMainButton}
      <SwapPageFooter
        rightContent={
          SIGNATURES_REQUIRED && (
            <Row align="center">
              <SignatureIcon
                backgroundColor={theme.warning.text}
                width={20}
                height={20}
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
