import { ErrorState } from "@/components/ErrorState";
import { Row } from "@/components/Layout";
import { MainButton } from "@/components/MainButton";
import { SmallText, SmallTextButton } from "@/components/Typography";
import { ICONS } from "@/icons";
import { ChainIcon } from "@/icons/ChainIcon";
import { useTheme } from "styled-components";

export type ErrorPageAuthFailedProps = {
  explorerUrl: string;
  revertedOperation?: Operation;
  onClickContinueTransaction: () => void;
};

export const ErrorPageAuthFailed = ({
  explorerUrl,
  onClickContinueTransaction,
}: ErrorPageAuthFailedProps) => {
  const theme = useTheme();

  return (
    <>
      <ErrorState
        title="Action Required"
        description={
          <>
            <SmallText color={theme.warning.text} textAlign="center">
              This transaction reverted while trying to execute.
              <br />
              You can continue executing this transaction now.
            </SmallText>
            <SmallText
              color={theme.primary.text.lowContrast}
              textAlign="center"
            >
              Current asset location: 1 ATOM on Osmosis (osmosis1209...18fa)
            </SmallText>
            <Row gap={25} justify="center">
              <Row
                gap={5}
                align="center"
                as={SmallTextButton}
                onClick={() => window.open(explorerUrl, "_blank")}
                color={theme.primary.text.lowContrast}
              >
                <ChainIcon color={theme.primary.text.lowContrast} />
                View on mintscan
              </Row>
            </Row>
          </>
        }
        icon={ICONS.warning}
        backgroundColor={theme.warning.background}
        textColor={theme.warning.text}
      />
      <MainButton
        label="Continue transaction"
        backgroundColor={theme.warning.text}
        leftIcon={ICONS.rightArrow}
        onClick={onClickContinueTransaction}
      />
    </>
  );
};
