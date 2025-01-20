import { GroupedAsset } from "@/modals/AssetAndChainSelectorModal/AssetAndChainSelectorModal";
import { useState } from "react";
import styled from "styled-components";

const MAX_NUMBER_OF_IMAGES_TO_CHECK = 6;

export type GroupedAssetImageType = {
  groupedAsset?: GroupedAsset;
  height?: number;
  width?: number;
};

export const GroupedAssetImage = ({ groupedAsset, height, width }: GroupedAssetImageType) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!groupedAsset?.assets) return <img height={height} width={width} />;
  const allLogoURIs = [
    groupedAsset.assets.find((asset) => asset.logoURI?.includes("raw.githubusercontent"))?.logoURI,
    ...groupedAsset.assets.map((asset) => asset.logoURI),
  ].filter((uri): uri is string => !!uri);

  const dedupedLogoURIs = Array.from(new Set(allLogoURIs));

  return (
    <StyledAssetImage
      height={height}
      width={width}
      src={dedupedLogoURIs[0]}
      loading="lazy"
      onError={(e) => {
        if (
          currentImageIndex === dedupedLogoURIs.length - 1 ||
          currentImageIndex === MAX_NUMBER_OF_IMAGES_TO_CHECK
        ) {
          e.currentTarget.onerror = null;
          return;
        }
        const nextIndex = currentImageIndex + 1;
        const img = e.currentTarget;
        img.src = dedupedLogoURIs[nextIndex];

        setCurrentImageIndex(nextIndex);
      }}
      alt={`${groupedAsset.assets[0].recommendedSymbol} logo`}
    />
  );
};

const StyledAssetImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  ${({ theme }) => `background: ${theme.secondary.background.hover};`};
`;
