import { DefaultTheme } from "styled-components";
import type { AssetAnnotationVariant } from "@/state/assetAnnotations";

export const getAnnotationColors = (
  theme: DefaultTheme,
  variant: AssetAnnotationVariant = "info",
) => {
  switch (variant) {
    case "warning":
      return { accent: theme.warning.text };
    case "error":
      return { accent: theme.error.text };
    case "info":
    default:
      return { accent: theme.brandColor };
  }
};
