import { styled } from "styled-components";
import { Column, Row, Spacer } from "@/components/Layout";
import { SmallText, Text } from "@/components/Typography";
import { ChevronIcon } from "@/icons/ChevronIcon";
import { useTheme } from "styled-components";
import { CogIcon } from "@/icons/CogIcon";
import { Button, GhostButton } from "@/components/Button";
import { useAtom } from "jotai";
import { skipAssetsAtom, skipChainsAtom } from "@/state/skipClient";
import { useUsdValue } from "@/utils/useUsdValue";
import { formatUSD } from "@/utils/intl";
import { BigNumber } from "bignumber.js";
import { formatNumberWithCommas, formatNumberWithoutCommas } from "@/utils/number";

export type AssetChainInputProps = {
  value?: string;
  onChangeValue?: (value: string) => void;
  handleChangeAsset?: () => void;
  handleChangeChain?: () => void;
  selectedAssetDenom?: string;
};

export const AssetChainInput = ({
  value,
  onChangeValue,
  selectedAssetDenom,
  handleChangeAsset,
  handleChangeChain,
}: AssetChainInputProps) => {
  const theme = useTheme();
  const [{ data: assets }] = useAtom(skipAssetsAtom);
  const [{ data: chains }] = useAtom(skipChainsAtom)

  const selectedAsset = assets?.find(
    (asset) => asset.denom === selectedAssetDenom
  );

  const selectedChain = chains?.find(
    (chain) => chain.chainID === selectedAsset?.chainID
  );

  const usdValue = useUsdValue({ ...selectedAsset, value });

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
          onChange={(e) => {
            if (!onChangeValue) return;
            let latest = e.target.value;

            if (latest.match(/^[.,]/)) latest = `0.${latest}`; // Handle first character being a period or comma
            latest = latest.replace(/^[0]{2,}/, "0"); // Remove leading zeros
            latest = latest.replace(/[^\d.,]/g, ""); // Remove non-numeric and non-decimal characters
            latest = latest.replace(/[.]{2,}/g, "."); // Remove multiple decimals
            latest = latest.replace(/[,]{2,}/g, ","); // Remove multiple commas
            onChangeValue?.(formatNumberWithoutCommas(latest))
          }} onKeyDown={(event) => {
            if (!onChangeValue) return;

            if (event.key === "Escape") {
              if (
                event.currentTarget.selectionStart ===
                event.currentTarget.selectionEnd
              ) {
                event.currentTarget.select();
              }
              return;
            }

            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
              let value = new BigNumber(
                formatNumberWithoutCommas(event.currentTarget.value) || "0"
              );
              if (event.key === "ArrowUp") {
                event.preventDefault();
                if (event.shiftKey) {
                  value = value.plus(10);
                } else if (event.altKey || event.ctrlKey || event.metaKey) {
                  value = value.plus(0.1);
                } else {
                  value = value.plus(1);
                }
              }
              if (event.key === "ArrowDown") {
                event.preventDefault();
                if (event.shiftKey) {
                  value = value.minus(10);
                } else if (event.altKey || event.ctrlKey || event.metaKey) {
                  value = value.minus(0.1);
                } else {
                  value = value.minus(1);
                }
              }
              if (value.isNegative()) {
                value = new BigNumber(0);
              }
              onChangeValue(value.toString());
            }
          }
          }
        />
        <Button onClick={handleChangeAsset} gap={5}>
          {selectedAsset ? (
            <StyledAssetLabel align="center" justify="center" gap={7}>
              <img src={selectedAsset?.logoURI} width={23} />
              <Text>{selectedAsset?.recommendedSymbol}</Text>
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
      <Row justify="space-between">
        <SmallText>{formatUSD(usdValue?.data ?? 0)}</SmallText>
        {selectedAsset ? (
          <GhostButton
            onClick={handleChangeChain}
            align="center"
            secondary
            gap={4}
          >
            <SmallText>on {selectedChain?.prettyName}</SmallText>
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

const StyledInput = styled.input`
  all: unset;
  font-size: 38px;
  font-weight: 300;
  width: 100%;
  color: ${(props) => props.theme.primary.text.normal};
  background-color: ${(props) => props.theme.primary.background.normal};
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
