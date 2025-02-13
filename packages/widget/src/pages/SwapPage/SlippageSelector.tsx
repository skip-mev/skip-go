import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { slippageAtom } from "@/state/swapPage";
import { SLIPPAGE_OPTIONS } from "@/constants/widget";
import { Column, Row, Spacer } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import { QuestionMarkIcon } from "@/icons/QuestionMarkIcon";
import styled, { css } from "styled-components";

const SlippageSelector: React.FC = () => {
  const [showMaxSlippageTooltip, setShowMaxSlippageTooltip] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [customSlippageInput, setCustomSlippageInput] = useState("");
  const [slippage, setSlippage] = useAtom(slippageAtom);

  const isCustomSlippage = !!(slippage && !SLIPPAGE_OPTIONS.includes(slippage));

  useEffect(() => {
    if (isCustomSlippage) {
      setCustomSlippageInput(slippage?.toString());
    }
  }, [slippage, isCustomSlippage]);

  return (
    <Container>
      <SwapDetailText align="center">
        Max Slippage
        <Spacer width={5} />
        <QuestionMarkIcon
          onMouseEnter={() => setShowMaxSlippageTooltip(true)}
          onMouseLeave={() => setShowMaxSlippageTooltip(false)}
        />
        {showMaxSlippageTooltip && (
          <Tooltip>
            If price changes unfavorably during the transaction by more than this amount, the
            transaction will revert.
          </Tooltip>
        )}
      </SwapDetailText>
      <StyledSlippageOptionsContainer gap={5}>
        {SLIPPAGE_OPTIONS.map((option) => (
          <StyledSettingsOptionLabel
            key={option}
            selected={option === slippage && !isInputFocused}
            onClick={() => setSlippage(option)}
          >
            {option}%
          </StyledSettingsOptionLabel>
        ))}
        <CustomSlippageContainer>
          {isCustomSlippage || isInputFocused ? (
            <>
              <CustomSlippageInput
                type="number"
                value={customSlippageInput}
                selected={!isInputFocused}
                onChange={(e) => setCustomSlippageInput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => {
                  const value = parseFloat(customSlippageInput);
                  if (!isNaN(value) && value >= 0 && value <= 100) {
                    setSlippage(value);
                  }
                  setIsInputFocused(false);
                }}
                autoFocus
              />
              <CustomSlippageInputRightIcon selected={!isInputFocused}>
                %
              </CustomSlippageInputRightIcon>
            </>
          ) : (
            <StyledSettingsOptionLabel
              selected={isCustomSlippage && !isInputFocused}
              onClick={() => setIsInputFocused(true)}
            >
              Custom
            </StyledSettingsOptionLabel>
          )}
        </CustomSlippageContainer>
      </StyledSlippageOptionsContainer>
    </Container>
  );
};

const Container = styled(Column)`
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
`;

const StyledSlippageOptionsContainer = styled(Row)`
  width: 100%;
`;

const CustomSlippageContainer = styled.div`
  position: relative;
  width: 60px;
  width: 100%;
`;

const SwapDetailText = styled(Row).attrs({
  as: SmallText,
  normalTextColor: true,
})`
  position: relative;
  letter-spacing: 0.26px;
`;

const Tooltip = styled(SmallText).attrs({
  normalTextColor: true,
})`
  position: absolute;
  padding: 13px;
  border-radius: 13px;
  border: 1px solid ${({ theme }) => theme.primary.text.ultraLowContrast};
  background: ${({ theme }) => theme.secondary.background.normal};
  top: -30px;
  left: 110px;
  width: 250px;
  z-index: 1;
`;

export const StyledSettingsOptionLabel = styled(SmallText)<{
  selected?: boolean;
}>`
  white-space: nowrap;

  background: ${({ theme }) => theme.secondary.background.transparent};
  padding: 7px 15px;
  border-radius: 15px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  color: ${({ selected, theme }) => (selected ? theme.brandTextColor : theme.primary.text.normal)};
  &:hover {
    box-shadow: inset 0px 0px 0px 1px ${({ theme }) => theme.brandColor};
    opacity: 1;
    cursor: pointer;
  }
  ${({ selected, theme }) =>
    selected &&
    css`
      & {
        background: ${theme.brandColor};
        opacity: 1;
      }
    `}
`;

const CustomSlippageInput = styled(SmallText).attrs({
  as: "input",
})<{ selected?: boolean }>`
  outline: none;
  background: ${({ theme }) => theme.primary.background.normal};
  border: 1px solid ${({ theme }) => theme.primary.text.normal};
  border-radius: 15px;
  color: ${({ theme }) => theme.primary.text.normal};
  width: 100%;
  height: 100%;
  padding: 2px 5px;
  padding-right: 20px;
  box-sizing: border-box;
  text-align: center;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }

  ${({ selected, theme }) =>
    selected &&
    css`
      color: ${theme.brandTextColor};
      background: ${theme.brandColor};
      border: none;
    `}
`;

const CustomSlippageInputRightIcon = styled(SmallText)<{ selected?: boolean }>`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  ${({ selected, theme }) =>
    selected &&
    css`
      color: ${theme.brandTextColor};
    `}
`;

export default SlippageSelector;
