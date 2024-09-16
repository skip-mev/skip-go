import { styled } from "styled-components";
import { Column, Row, Spacer } from "@/components/Layout";
import { SmallText, SmallTextButton, Text } from "@/components/Typography";
import { ChevronIcon } from "@/icons/ChevronIcon";
import { useTheme } from "styled-components";
import { CogIcon } from "@/icons/CogIcon";
import { Button, GhostButton } from "@/components/Button";
import { BigNumber } from "bignumber.js";
import {
  formatNumberWithCommas,
  formatNumberWithoutCommas,
} from "@/utils/number";
import { useGetAssetDetails } from "@/hooks/useGetAssetDetails";
import { TinyTriangleIcon } from "@/icons/TinyTriangleIcon";
import { useMemo, useState } from "react";

export type AssetChainInputProps = {
  value?: string;
  onChangeValue?: (value: string) => void;
  handleChangeAsset?: () => void;
  handleChangeChain?: () => void;
  selectedAssetDenom?: string;
  priceChangePercentage?: number;
  isWaitingToUpdateInputValue?: boolean;
};

export const AssetChainInput = ({
  value,
  onChangeValue,
  selectedAssetDenom,
  handleChangeAsset,
  handleChangeChain,
  priceChangePercentage,
  isWaitingToUpdateInputValue,
}: AssetChainInputProps) => {
  const theme = useTheme();
  const [showPriceChangePercentage, setShowPriceChangePercentage] =
    useState(false);
  const assetDetails = useGetAssetDetails({
    assetDenom: selectedAssetDenom,
    amount: value,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChangeValue) return;
    let latest = e.target.value;

    if (latest.match(/^[.,]/)) latest = `0.${latest}`; // Handle first character being a period or comma
    latest = latest.replace(/^[0]{2,}/, "0"); // Remove leading zeros
    latest = latest.replace(/[^\d.,]/g, ""); // Remove non-numeric and non-decimal characters
    latest = latest.replace(/[.]{2,}/g, "."); // Remove multiple decimals
    latest = latest.replace(/[,]{2,}/g, ","); // Remove multiple commas
    onChangeValue?.(formatNumberWithoutCommas(latest));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!onChangeValue) return;

    let value: BigNumber;

    switch (event.key) {
      case "Escape":
        if (
          event.currentTarget.selectionStart ===
          event.currentTarget.selectionEnd
        ) {
          event.currentTarget.select();
        }
        return;

      case "ArrowUp":
        event.preventDefault();
        value = new BigNumber(
          formatNumberWithoutCommas(event.currentTarget.value) || "0"
        );

        if (event.shiftKey) {
          value = value.plus(10);
        } else if (event.altKey || event.ctrlKey || event.metaKey) {
          value = value.plus(0.1);
        } else {
          value = value.plus(1);
        }

        if (value.isNegative()) {
          value = new BigNumber(0);
        }

        onChangeValue(value.toString());
        break;

      case "ArrowDown":
        event.preventDefault();
        value = new BigNumber(
          formatNumberWithoutCommas(event.currentTarget.value) || "0"
        );

        if (event.shiftKey) {
          value = value.minus(10);
        } else if (event.altKey || event.ctrlKey || event.metaKey) {
          value = value.minus(0.1);
        } else {
          value = value.minus(1);
        }

        if (value.isNegative()) {
          value = new BigNumber(0);
        }

        onChangeValue(value.toString());
        break;

      default:
        return;
    }
  };

  const priceChangeColor = useMemo(() => {
    if (!priceChangePercentage) {
      return theme.primary.text.normal;
    }
    if (priceChangePercentage > 0) {
      return theme.success.text;
    }
    return theme.error.text;
  }, [
    priceChangePercentage,
    theme.error.text,
    theme.primary.text.normal,
    theme.success.text,
  ]);

  return (
    <StyledAssetChainInputWrapper
      justify="space-between"
      padding={20}
      borderRadius={25}
    >
      <Row justify="space-between">
        <StyledInput
          type="text"
          value={formatNumberWithCommas(value || "")}
          placeholder="0"
          inputMode="numeric"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          isWaitingToUpdateInputValue={isWaitingToUpdateInputValue}
        />
        <Button onClick={handleChangeAsset} gap={5}>
          {assetDetails?.assetImage && assetDetails.symbol ? (
            <StyledAssetLabel align="center" justify="center" gap={7}>
              <img src={assetDetails.assetImage} width={23} />
              <Text>{assetDetails.symbol}</Text>
            </StyledAssetLabel>
          ) : (
            <StyledSelectTokenLabel>
              <Text mainButtonColor={theme.brandColor}>Select token</Text>
            </StyledSelectTokenLabel>
          )}

          <ChevronIcon
            color={theme.primary.background.normal}
            backgroundColor={theme.primary.text.normal}
          />
        </Button>
      </Row>
      <Row justify="space-between" align="center">
        {priceChangePercentage ? (
          <Row align="center" gap={6}>
            <SmallTextButton
              onMouseEnter={() => setShowPriceChangePercentage(true)}
              onMouseLeave={() => setShowPriceChangePercentage(false)}
            >
              {assetDetails.formattedUsdAmount ?? 0}
            </SmallTextButton>
            <TinyTriangleIcon
              color={priceChangeColor}
              direction={(priceChangePercentage ?? 0) > 0 ? "up" : "down"}
              style={{ scale: showPriceChangePercentage ? "1" : "0.7" }}
            />
            {showPriceChangePercentage && (
              <SmallText color={priceChangeColor}>
                {priceChangePercentage}%
              </SmallText>
            )}
          </Row>
        ) : (
          <SmallText>{assetDetails.formattedUsdAmount ?? 0}</SmallText>
        )}
        {assetDetails?.chainName ? (
          <GhostButton
            onClick={handleChangeChain}
            align="center"
            secondary
            gap={4}
          >
            <SmallText>on {assetDetails?.chainName}</SmallText>
            <CogIcon color={theme.primary.text.normal} />
          </GhostButton>
        ) : (
          <Spacer />
        )}
      </Row>
    </StyledAssetChainInputWrapper>
  );
};

const StyledAssetChainInputWrapper = styled(Column)`
  height: 110px;
  width: 480px;
  background-color: ${(props) => props.theme.primary.background.normal};
`;

const StyledInput = styled.input <{ isWaitingToUpdateInputValue?: boolean }>`
  all: unset;
  font-size: 38px;
  font-weight: 300;
  width: 100%;
  color: ${(props) => props.theme.primary.text.normal};
  background-color: ${(props) => props.theme.primary.background.normal};

  ${(props) => props.isWaitingToUpdateInputValue && "animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite;"}
  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

export const StyledAssetLabel = styled(Row).attrs({
  padding: 8,
})`
  height: 40px;
  border-radius: 10px;
  white-space: nowrap;
  color: ${(props) => props.theme.primary.text.normal};
  background-color: ${(props) => props.theme.secondary.background.normal};
`;

const StyledSelectTokenLabel = styled(StyledAssetLabel)`
  background-color: ${(props) => props.theme.brandColor};
`;
