import { ErrorWarningPageContent } from "@/pages/ErrorWarningPage/ErrorWarningPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText } from "@/components/Typography";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { track } from "@amplitude/analytics-browser";
import { PageHeader } from "@/components/PageHeader";

export type WarningCosmosLedgerProps = {
  onClickBack: () => void;
};

export const WarningPageCosmosLedger = ({ onClickBack }: WarningCosmosLedgerProps) => {
  const theme = useTheme();

  return (
    <>
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("warning page: cosmos ledger - header back button clicked");
            onClickBack();
          },
        }}
      />
      <ErrorWarningPageContent
        title={"Warning: Ledger not supported"}
        description={
          <>
            <SmallText lineHeight="1.5" color={theme.error.text} textAlign="center" textWrap="balance">
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
