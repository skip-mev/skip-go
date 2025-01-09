import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText } from "@/components/Typography";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";

export type ErrorCosmosLedgerWarningProps = {
  onClickBack: () => void;
};

export const ErrorPageCosmosLedgerWarning = ({ onClickBack }: ErrorCosmosLedgerWarningProps) => {
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
      <ErrorPageContent
        title={"Warning: Ledger not supported"}
        description={
          <>
            <SmallText color={theme.error.text} textAlign="center" textWrap="balance">
              Ledger isn't currently supported on Ethermint chains (such as Injective, Dymension,
              EVMOS, and similar networks).
            </SmallText>
          </>
        }
        icon={ICONS.triangleWarning}
        backgroundColor={theme.error.background}
        textColor={theme.error.text}
      />
      <MainButton
        label="Back"
        icon={ICONS.leftArrow}
        onClick={onClickBack}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
