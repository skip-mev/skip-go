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
import { useResetAtom } from "jotai/utils";

export type ErrorPageTimeoutProps = {
  explorerLink: string;
  onClickBack: () => void;
};

export const ErrorPageTimeout = ({
  explorerLink,
  onClickBack,
}: ErrorPageTimeoutProps) => {
  const theme = useTheme();
  const resetError = useResetAtom(errorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            resetError();
            if (onClickBack) {
              onClickBack();
            }
            setCurrentPage(Routes.SwapPage);
          },
        }}
      />
      <ErrorState
        title="This transaction is taking longer than usual."
        description={
          <>
            <SmallText color={theme.warning.text} textAlign="center">
              Unstable network conditions mean this transaction may take up
              <br />
              to 48 hours to complete. Your funds are secure in the meantime.
              <br />
              This window can be closed safely while you wait.
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
