import { useCroppedImage } from "@/hooks/useCroppedImage";
import { GroupedAsset } from "@/modals/AssetAndChainSelectorModal/AssetAndChainSelectorModal";
import { useState } from "react";
import styled from "styled-components";
import { CircleSkeletonElement } from "./Skeleton";
import { ASSET_IMAGE_OVERRIDES } from "@/constants/assetImageOverrides";

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

  const recommendedSymbol = groupedAsset?.assets[0]?.recommendedSymbol;
  const overrideImage = recommendedSymbol ? ASSET_IMAGE_OVERRIDES[recommendedSymbol] : undefined;

  const allLogoUris = overrideImage
    ? [overrideImage]
    : [
        groupedAsset?.assets.find((asset) => asset.logoUri?.includes("chain-registry"))?.logoUri,
        ...(groupedAsset?.assets.map((asset) => asset.logoUri) ?? []),
      ]
        .filter((uri): uri is string => !!uri)
        .sort((a, b) => {
          // Sort images from wormhole at the end to deprioritize them
          const aHasWormhole = a.toLowerCase().includes("wormhole");
          const bHasWormhole = b.toLowerCase().includes("wormhole");

          if (aHasWormhole && !bHasWormhole) return 1;
          if (!aHasWormhole && bHasWormhole) return -1;
          return 0;
        });

  const dedupedLogoUris = Array.from(new Set(allLogoUris));

  const croppedImage = useCroppedImage(dedupedLogoUris[currentImageIndex]);

  if (!groupedAsset?.assets || groupedAsset.assets.length === 0) {
    return <StyledAssetImage height={height} width={width} src="" alt="No asset" />;
  }

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

  if (croppedImage) {
    return (
      <StyledAssetImage
        height={height}
        width={width}
        src={croppedImage}
        loading="lazy"
        onError={handleError}
        alt={`${groupedAsset.assets[0].recommendedSymbol || ""} logo`}
        style={style}
      />
    );
  }
  return <CircleSkeletonElement height={height ?? 0} width={width ?? 0} />;
};

const StyledAssetImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  ${({ theme }) => `background: ${theme.secondary.background.hover};`}
`;
