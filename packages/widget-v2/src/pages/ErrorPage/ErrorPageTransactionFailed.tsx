import { ErrorState } from "@/components/ErrorState";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";

export type ErrorPageTransactionFailedProps = {
  transactionHash: string;
  explorerUrl: string;
  onClickContactSupport: () => void;
  onClickBack: () => void;
};

export const ErrorPageTransactionFailed = ({
  transactionHash,
  explorerUrl,
  onClickContactSupport,
  onClickBack,
}: ErrorPageTransactionFailedProps) => {
  const theme = useTheme();

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: onClickBack,
        }}
      />
      <ErrorState
        title="Transaction failed"
        description={
          <>
            <SmallText color={theme.error.text} textAlign="center">
              This transaction encountered a critical error. <br />
              Please contact our support team below.
            </SmallText>
            <Row
              as={SmallTextButton}
              gap={5}
              onClick={() => window.open(explorerUrl, "_blank")}
              color={theme.primary.text.lowContrast}
            >
              Transaction: <u>{transactionHash}</u>
              <ChainIcon color={theme.primary.text.lowContrast} />
            </Row>
          </>
        }
        icon={ICONS.triangleWarning}
        backgroundColor={theme.error.background}
        textColor={theme.error.text}
      />
      <MainButton
        label="Contact support"
        icon={ICONS.rightArrow}
        onClick={onClickContactSupport}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
