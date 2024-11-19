import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { errorAtom } from "@/state/errorPage";
import { currentPageAtom, Routes } from "@/state/router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useBroadcastedTxsStatus } from "../SwapExecutionPage/useBroadcastedTxs";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useEffect } from "react";

export type ErrorPageTimeoutProps = {
  txHash: string
  explorerLink?: string;
  onClickBack: () => void;
};

export const ErrorPageTimeout = ({
  txHash,
  explorerLink,
  onClickBack,
}: ErrorPageTimeoutProps) => {
  const theme = useTheme();
  const [error, setError] = useAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const {
    route,
    transactionDetailsArray,
  } = useAtomValue(swapExecutionStateAtom);

  const { data } = useBroadcastedTxsStatus({
    txsRequired: route?.txsRequired,
    txs: transactionDetailsArray,
  });

  useEffect(() => {
    if (error && data?.isSettled) {
      setError(undefined);
    }
  }, [data?.isSettled, error, setError]);

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            setError(undefined);
            onClickBack?.();
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <ErrorPageContent
        title="Sorry, your transaction is taking longer than usual."
        description={
          <>
            <SmallText color={theme.warning.text} textAlign="center" textWrap="balance">
              Your funds are secure.
              <br />
              You can close this window safely while you wait.
              <br />
              Check the history page for status updates.
            </SmallText>
            <Row
              gap={5}
              align="center"
              as={SmallTextButton}
              onClick={() => explorerLink && window.open(explorerLink, "_blank")}
              color={theme.primary.text.lowContrast}
            >
              <ChainIcon color={theme.primary.text.lowContrast} />
              {explorerLink ? "View on explorer" : `Tx hash: ${txHash}`}
            </Row>
          </>
        }
        icon={ICONS.warning}
        backgroundColor={theme.warning.background}
        textColor={theme.warning.text}
      />
      <MainButton label="Swap in progress..." loading />
    </>
  );
};
