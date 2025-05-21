import { BlockingPageContent } from "@/pages/BlockingPage/BlockingPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText } from "@/components/Typography";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../../SwapPage/SwapPageHeader";
import { track } from "@amplitude/analytics-browser";

export type WarningCosmosLedgerProps = {
  onClickBack: () => void;
};

export const WarningPageCosmosLedger = ({ onClickBack }: WarningCosmosLedgerProps) => {
  const theme = useTheme();

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("warning page: cosmos ledger - header back button clicked");
            onClickBack();
          },
        }}
      />
      <BlockingPageContent
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
        onClick={() => {
          track("warning page: cosmos ledger - main back button clicked");
          onClickBack();
        }}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
