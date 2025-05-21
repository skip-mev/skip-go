import { BlockingPageContent } from "@/pages/BlockingPage/BlockingPageContent";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../../SwapPage/SwapPageHeader";
import { blockingPageAtom } from "@/state/blockingPage";
import { currentPageAtom, Routes } from "@/state/router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useBroadcastedTxsStatus } from "../../SwapExecutionPage/useBroadcastedTxs";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useEffect } from "react";
import { useIsGoFast } from "@/hooks/useIsGoFast";
import { track } from "@amplitude/analytics-browser";

export type UnexpectedErrorPageTimeoutProps = {
  txHash: string;
  explorerLink?: string;
  onClickBack: () => void;
};

export const UnexpectedErrorPageTimeout = ({
  txHash,
  explorerLink,
  onClickBack,
}: UnexpectedErrorPageTimeoutProps) => {
  const theme = useTheme();
  const [blockingPage, setBlockingPage] = useAtom(blockingPageAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { route, transactionDetailsArray } = useAtomValue(swapExecutionStateAtom);
  const isGoFast = useIsGoFast(route);

  const { data } = useBroadcastedTxsStatus({
    txsRequired: route?.txsRequired,
    txs: transactionDetailsArray,
  });

  useEffect(() => {
    if (blockingPage && data?.isSettled) {
      track("unexpected error page: transaction timeover - transaction settled");
      setBlockingPage(undefined);
    }
  }, [data?.isSettled, blockingPage, setBlockingPage]);

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("unexpected error page: transaction timeover - header back button clicked");
            setBlockingPage(undefined);
            onClickBack?.();
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <BlockingPageContent
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
              onClick={() => {
                track("unexpected error page: transaction timeover - view on explorer clicked");
                window.open(explorerLink, "_blank");
              }}
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
      <MainButton isGoFast={isGoFast} label="Processing" loading />
    </>
  );
};
