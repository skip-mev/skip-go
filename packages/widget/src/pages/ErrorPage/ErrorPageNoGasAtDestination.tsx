import { ErrorPageContent } from "@/pages/ErrorPage/ErrorPageContent";
import { MainButton } from "@/components/MainButton";
import { ICONS } from "@/icons";
import { useTheme } from "styled-components";
import { SwapPageHeader } from "../SwapPage/SwapPageHeader";
import { useSetAtom } from "jotai";
import { errorAtom } from "@/state/errorPage";
import { SmallText } from "@/components/Typography";

export type ErrorPageNoGasAtDestinationProps = {
  link: string;
  onClickBack: () => void;
  onClickContinue: () => void;
};

export const ErrorPageNoGasAtDestination = ({
  link,
  onClickBack,
  onClickContinue,
}: ErrorPageNoGasAtDestinationProps) => {
  const setErrorAtom = useSetAtom(errorAtom);
  const theme = useTheme();

  const handleOnClickBack = () => {
    setErrorAtom(undefined);
    onClickBack?.();
  };

  return (
    <>
      <SwapPageHeader
        leftButton={{
          label: "Back",
          icon: ICONS.thinArrow,
          onClick: handleOnClickBack,
        }}
      />
      <ErrorPageContent
        title="No gas token at destination"
        description={
          <>
            <SmallText color={theme.warning.text} textAlign="center" textWrap="balance">
              Insufficient BABY to transact on Babylon, use the link to BABY below to interact with
              your bridged funds
            </SmallText>
            <SmallText as="a" href={link} target="_blank" color={theme.primary.text.lowContrast}>
              click here
            </SmallText>
          </>
        }
        icon={ICONS.triangleWarning}
        backgroundColor={theme.warning.background}
        textColor={theme.warning.text}
      />
      <MainButton
        label="Continue"
        icon={ICONS.rightArrow}
        onClick={onClickContinue}
        backgroundColor={theme.warning.text}
      />
    </>
  );
};
