import { GroupedAsset } from "@/modals/AssetAndChainSelectorModal/AssetAndChainSelectorModal";
import { useState } from "react";
import styled from "styled-components";

const MAX_NUMBER_OF_IMAGES_TO_CHECK = 6;

export type GroupedAssetImageType = {
  groupedAsset?: GroupedAsset;
  height?: number;
  width?: number;
  style?: React.CSSProperties;
};

export const GroupedAssetImage = ({
  groupedAsset,
  height,
  width,
  style,
}: GroupedAssetImageType) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!groupedAsset?.assets || groupedAsset.assets.length === 0) {
    return <StyledAssetImage height={height} width={width} src="" alt="No asset" />;
  }

  const allLogoUris = [
    groupedAsset.assets.find((asset) => asset.logoUri?.includes("chain-registry"))?.logoUri,
    ...groupedAsset.assets.map((asset) => asset.logoUri),
  ].filter((uri): uri is string => !!uri);

  const dedupedLogoUris = Array.from(new Set(allLogoUris));

  if (dedupedLogoUris.length === 0) {
    return <StyledAssetImage height={height} width={width} src="" alt="No valid URIs" />;
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (
      currentImageIndex >= dedupedLogoUris.length - 1 ||
      currentImageIndex >= MAX_NUMBER_OF_IMAGES_TO_CHECK
    ) {
      e.currentTarget.onerror = null; // Prevent infinite loops in weird scenarios.
      return;
    }
    setCurrentImageIndex((prev) => prev + 1);
  };

  return (
    <StyledAssetImage
      height={height}
      width={width}
      src={dedupedLogoUris[currentImageIndex]}
      loading="lazy"
      onError={handleError}
      alt={`${groupedAsset.assets[0].recommendedSymbol || ""} logo`}
      style={style}
    />
  );
};

const StyledAssetImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  ${({ theme }) => `background: ${theme.secondary.background.hover};`}
`;
