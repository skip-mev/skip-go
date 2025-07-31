import { convertToPxValue } from "@/utils/style";
import React, { useState } from "react";
import styled from "styled-components";

const SwitchWrapper = styled.div<{ checked: boolean }>`
  width: 42px;
  height: 24px;
  border-radius: ${({ theme }) => convertToPxValue(theme.borderRadius?.selectionButton)};
  background-color: ${({ checked, theme }) =>
    checked ? theme.brandColor : theme.secondary.background.transparent};
  display: flex;
  align-items: center;
  padding: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  user-select: none;
`;

const SwitchThumb = styled.div<{ checked: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => convertToPxValue(theme.borderRadius?.selectionButton)};
  background-color: ${({ checked, theme }) =>
    checked ? theme.secondary.background.normal : theme.primary.text.ultraLowContrast};
  transition: transform 0.2s ease;
  transform: translateX(${({ checked }) => (checked ? "16px" : "0")});
`;

type SwitchProps = {
  checked?: boolean;
  onChange?: (val: boolean) => void;
};

export const Switch = ({ checked = false, onChange }: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const toggle = () => {
    const newVal = !isChecked;
    setIsChecked(newVal);
    onChange?.(newVal);
  };

  return (
    <SwitchWrapper checked={isChecked} onClick={toggle}>
      <SwitchThumb checked={isChecked} />
    </SwitchWrapper>
  );
};
