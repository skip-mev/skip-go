import { styled, useTheme } from "styled-components";
import type { AssetAnnotationVariant } from "@/state/assetAnnotations";
import { getAnnotationColors } from "@/utils/assetAnnotationColors";

export const AssetAnnotationBadge = ({
  label,
  variant,
}: {
  label: string;
  variant?: AssetAnnotationVariant;
}) => {
  const theme = useTheme();
  const { accent } = getAnnotationColors(theme, variant);

  return <StyledBadge accent={accent}>{label}</StyledBadge>;
};

const StyledBadge = styled.span<{ accent: string }>`
  padding: 2px 7px;
  border-radius: 8px;
  font-size: 11px;
  line-height: 1.4;
  white-space: nowrap;
  color: ${({ accent }) => accent};
  background: transparent;
  border: 1px solid ${({ accent }) => `${accent}66`};
`;
