import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";
import { PageHeader } from "../../components/PageHeader";
import { errorAtom } from "@/state/errorPage";
import { currentPageAtom, Routes } from "@/state/router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useBroadcastedTxsStatus } from "../SwapExecutionPage/useBroadcastedTxs";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useEffect } from "react";
import { useIsGoFast } from "@/hooks/useIsGoFast";
import { track } from "@amplitude/analytics-browser";

export type ErrorPageTimeoutProps = {
  txHash: string;
  explorerLink?: string;
  onClickBack: () => void;
};

export const ErrorPageTimeout = ({ txHash, explorerLink, onClickBack }: ErrorPageTimeoutProps) => {
  const theme = useTheme();
  const [error, setError] = useAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { route, transactionDetailsArray, transactionsSigned } =
    useAtomValue(swapExecutionStateAtom);
  const isGoFast = useIsGoFast(route);

  const allTxsSigned =
    route?.txsRequired !== undefined &&
    transactionsSigned === route.txsRequired;

  const { data } = useBroadcastedTxsStatus({
    txsRequired: route?.txsRequired,
    txs: transactionDetailsArray,
    allTxsSigned,
  });

  useEffect(() => {
    if (error && data?.isSettled) {
      track("error page: transaction timeover - transaction settled");
      setError(undefined);
    }
  }, [data?.isSettled, error, setError]);

  return (
    <>
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("error page: transaction timeover - header back button clicked");
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
              onClick={() => {
                track("error page: transaction timeover - view on explorer clicked");
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
