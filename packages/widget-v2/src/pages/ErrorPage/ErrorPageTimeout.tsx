import { ErrorState } from "@/components/ErrorState";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { errorAtom } from "@/state/errorPage";
import { currentPageAtom, Routes } from "@/state/router";
import { useSetAtom } from "jotai";

export type ErrorPageTimeoutProps = {
  explorerLink: string;
  onClickBack: () => void;
};

export const ErrorPageTimeout = ({
  explorerLink,
  onClickBack,
}: ErrorPageTimeoutProps) => {
  const theme = useTheme();
  const setErrorAtom = useSetAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            setErrorAtom(undefined);
            if (onClickBack) {
              onClickBack();
            }
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <ErrorState
        title="Sorry, your transaction is taking longer than usual."
        description={
          <>
            <SmallText color={theme.warning.text} textAlign="center">
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
              onClick={() => window.open(explorerLink, "_blank")}
              color={theme.primary.text.lowContrast}
            >
              <ChainIcon color={theme.primary.text.lowContrast} />
              View on mintscan
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
