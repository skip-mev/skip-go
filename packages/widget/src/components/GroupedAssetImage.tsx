import { GroupedAsset } from "@/modals/AssetAndChainSelectorModal/AssetAndChainSelectorModal";
import styled from "styled-components";

export type GroupedAssetImageType = {
  groupedAsset?: GroupedAsset;
  height?: number;
  width?: number;
};

export const GroupedAssetImage = ({ groupedAsset, height, width }: GroupedAssetImageType) => {
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
        const img = e.currentTarget;
        const currentIndex = logoURIs.indexOf(img.src);
        const nextIndex = currentIndex + 1;

        if (nextIndex < logoURIs.length) {
          img.src = logoURIs[nextIndex];
        }
      }}
      alt={`${groupedAsset.assets[0].recommendedSymbol} logo`}
    />
  );
};

const StyledAssetImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
`;
