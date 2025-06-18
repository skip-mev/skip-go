import { ErrorWarningPageContent } from "@/pages/ErrorWarningPage/ErrorWarningPageContent";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";
import { currentPageAtom, Routes } from "@/state/router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useBroadcastedTxsStatus } from "../../SwapExecutionPage/useBroadcastedTxs";
import { swapExecutionStateAtom } from "@/state/swapExecutionPage";
import { useEffect } from "react";
import { useIsGoFast } from "@/hooks/useIsGoFast";
import { track } from "@amplitude/analytics-browser";
import { errorWarningAtom } from "@/state/errorWarning";
import { PageHeader } from "@/components/PageHeader";

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
  const [errorWarning, setErrorWarning] = useAtom(errorWarningAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { route, transactionDetailsArray } = useAtomValue(swapExecutionStateAtom);
  const isGoFast = useIsGoFast(route);

  const { data } = useBroadcastedTxsStatus({
    txsRequired: route?.txsRequired,
    transactionDetails: transactionDetailsArray,
  });

  useEffect(() => {
    if (errorWarning && data?.isSettled) {
      track("unexpected error page: transaction timeover - transaction settled");
      setErrorWarning(undefined);
    }
  }, [data?.isSettled, errorWarning, setErrorWarning]);

  return (
    <>
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("unexpected error page: transaction timeover - header back button clicked");
            setErrorWarning(undefined);
            onClickBack?.();
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <ErrorWarningPageContent
        title="Sorry, your transaction is taking longer than usual."
        description={
          <>
            <SmallText
              lineHeight="1.5"
              color={theme.warning.text}
              textAlign="center"
              textWrap="balance"
            >
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
