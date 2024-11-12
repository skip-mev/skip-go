import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { slippageAtom } from "@/state/swapPage";
import { SLIPPAGE_OPTIONS } from "@/constants/widget";
import { Row, Spacer } from "@/components/Layout";
import { SmallText } from "@/components/Typography";
import { QuestionMarkIcon } from "@/icons/QuestionMarkIcon";
import styled, { css } from "styled-components";
import { getBrandButtonTextColor } from "@/utils/colors";

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
            If price changes unfavorably during the transaction by more than
            this amount, the transaction will revert.
          </Tooltip>
        )}
      </SwapDetailText>
      <StyledSlippageOptionsContainer gap={5}>
        {SLIPPAGE_OPTIONS.map((option) => (
          <StyledSlippageOptionLabel
            key={option}
            monospace
            selected={option === slippage && !isInputFocused}
            onClick={() => setSlippage(option)}
          >
            {option}%
          </StyledSlippageOptionLabel>
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
            <StyledSlippageOptionLabel
              monospace
              selected={isCustomSlippage && !isInputFocused}
              onClick={() => setIsInputFocused(true)}
            >
              Custom
            </StyledSlippageOptionLabel>
          )}
        </CustomSlippageContainer>
      </StyledSlippageOptionsContainer>
    </Container>
  );
};

const Container = styled(Row)`
  justify-content: space-between;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const StyledSlippageOptionsContainer = styled(Row)`
  @media (max-width: 767px) {
    width: 100%;
  }
`;

const CustomSlippageContainer = styled.div`
  position: relative;
  width: 60px;
  @media (max-width: 767px) {
    width: 100%;
  }
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
  background-color: ${({ theme }) => theme.secondary.background.normal};
  top: -30px;
  left: 110px;
  width: 250px;
  z-index: 1;
`;

const StyledSlippageOptionLabel = styled(SmallText) <{ selected?: boolean }>`
  border-radius: 7px;
  padding: 4px 7px;
  white-space: nowrap;

  @media (max-width: 767px) {
    background-color: ${({ theme }) => theme.secondary.background.transparent};
    padding: 7px 15px;
    border-radius: 15px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  color: ${({ selected, theme }) =>
    selected
      ? getBrandButtonTextColor(theme.brandColor)
      : theme.primary.text.normal};
  &:hover {
    box-shadow: inset 0px 0px 0px 1px ${({ theme }) => theme.brandColor};
    opacity: 1;
    cursor: pointer;
  }
  ${({ selected, theme }) =>
    selected &&
    css`
      & {
        background-color: ${theme.brandColor};
        opacity: 1;
      }
    `}
`;

const CustomSlippageInput = styled(SmallText).attrs({
  as: "input",
}) <{ selected?: boolean }>`
  outline: none;
  background-color: ${({ theme }) => theme.primary.background.normal};
  border: 1px solid ${({ theme }) => theme.primary.text.normal};
  border-radius: 7px;
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

  &[type='number'] {
    -moz-appearance: textfield;
  }

  ${({ selected, theme }) =>
    selected &&
    css`
      color: ${getBrandButtonTextColor(theme.brandColor)};
      background-color: ${theme.brandColor};
      border: none;
    `}

  @media (max-width: 767px) {
    border-radius: 15px;
  }
`;

const CustomSlippageInputRightIcon = styled(SmallText) <{ selected?: boolean }>`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  ${({ selected, theme }) =>
    selected &&
    css`
      color: ${getBrandButtonTextColor(theme.brandColor)};
    `}
`;

export default SlippageSelector;
