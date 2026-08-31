import { styled, useTheme } from "styled-components";
import type { AssetAnnotationVariant } from "@/state/assetAnnotations";
import { getAnnotationColors } from "@/utils/assetAnnotationColors";

export const AssetAnnotationBadge = ({
  label,
  variant,
  outlined,
}: {
  label: string;
  variant?: AssetAnnotationVariant;
  outlined?: boolean;
}) => {
  const theme = useTheme();
  const { accent, filledBackground, filledText } = getAnnotationColors(theme, variant);

  return (
    <StyledBadge
      outlined={outlined}
      accent={accent}
      filledBackground={filledBackground}
      filledText={filledText}
    >
      {label}
    </StyledBadge>
  );
};

const StyledBadge = styled.span<{
  outlined?: boolean;
  accent: string;
  filledBackground: string;
  filledText?: string;
}>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  line-height: 1.4;
  white-space: nowrap;
  ${({ outlined, accent, filledBackground, filledText }) =>
    outlined
      ? `
        color: ${accent};
        background: transparent;
        border: 1px solid ${accent};
      `
      : `
        color: ${filledText};
        background: ${filledBackground};
      `}
`;
