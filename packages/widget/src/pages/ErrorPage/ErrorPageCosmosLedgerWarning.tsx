import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { SmallText } from "@/components/Typography";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { PageHeader } from "../../components/PageHeader";
import { track } from "@amplitude/analytics-browser";

export type ErrorCosmosLedgerWarningProps = {
  onClickBack: () => void;
};

export const ErrorPageCosmosLedgerWarning = ({ onClickBack }: ErrorCosmosLedgerWarningProps) => {
  const theme = useTheme();

  return (
    <>
      <PageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: () => {
            track("error page: cosmos ledger warning - header back button clicked");
            onClickBack();
          },
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
        onClick={() => {
          track("error page: cosmos ledger warning - main back button clicked");
          onClickBack();
        }}
        backgroundColor={theme.error.text}
      />
    </>
  );
};
