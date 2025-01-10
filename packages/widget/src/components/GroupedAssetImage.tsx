import { GroupedAsset } from "@/modals/AssetAndChainSelectorModal/AssetAndChainSelectorModal";
import { useState } from "react";
import styled from "styled-components";

const NUMBER_OF_IMAGES_TO_CHECK = 6;

export type GroupedAssetImageType = {
  groupedAsset?: GroupedAsset;
  height?: number;
  width?: number;
};

export const GroupedAssetImage = ({ groupedAsset, height, width }: GroupedAssetImageType) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!groupedAsset?.assets) return <img />;
  const logoURIs = [
    groupedAsset.assets.find((asset) => asset.logoURI?.includes("raw.githubusercontent"))?.logoURI,
    ...groupedAsset.assets.map((asset) => asset.logoURI),
  ].filter((uri): uri is string => !!uri);

  return (
    <StyledAssetImage
      height={height}
      width={width}
      src={logoURIs[0]}
      onError={(e) => {
        if (currentImageIndex === NUMBER_OF_IMAGES_TO_CHECK) {
          e.currentTarget.onerror = null;
          return;
        }
        const nextIndex = currentImageIndex + 1;
        const img = e.currentTarget;

        if (currentImageIndex < 5) {
          img.src = logoURIs[nextIndex];
        }

        setCurrentImageIndex(nextIndex);
      }}
      alt={`${groupedAsset.assets[0].recommendedSymbol} logo`}
    />
  );
};

const StyledAssetImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
`;
