import "styled-components";
import { opacityToHex } from "../utils/colors";

export const defaultBorderRadius: WidgetBorderRadius = {
  main: "25px",
  selectionButton: "10px",
  ghostButton: "30px",
  modalContainer: "20px",
  rowItem: "12px",
};

export const defaultTheme = {
  brandColor: "#ff66ff",
  brandTextColor: undefined,
  borderRadius: defaultBorderRadius,
  primary: {
    background: {
      normal: "#000000",
    },
    text: {
      normal: "#ffffff",
      lowContrast: "#ffffff" + opacityToHex(50),
      ultraLowContrast: "#ffffff" + opacityToHex(30),
    },
    ghostButtonHover: "#000000" + opacityToHex(40),
  },
  secondary: {
    background: {
      normal: "#141414",
      transparent: "#252525" + opacityToHex(70),
      hover: "#4A4A4A",
    },
  },
  success: {
    text: "#6fde00",
  },
  warning: {
    background: "#411f00",
    text: "#ff7a00",
  },
  error: {
    background: "#430000",
    text: "#ff1616",
  },
};

export const lightTheme = {
  brandColor: "#ff66ff",
  brandTextColor: undefined,
  borderRadius: defaultBorderRadius,
  primary: {
    background: {
      normal: "#ffffff",
    },
    text: {
      normal: "#000000",
      lowContrast: "#000000" + opacityToHex(45),
      ultraLowContrast: "#000000" + opacityToHex(25),
    },
    ghostButtonHover: "#ffffff" + opacityToHex(90),
  },
  secondary: {
    background: {
      normal: "#f1f1f1",
      transparent: "#eeeeee" + opacityToHex(90),
      hover: "#e0e0e0",
    },
  },
  success: {
    text: "#6bcf07",
  },
  warning: {
    background: "#ffe2c8",
    text: "#ef7404",
  },
  error: {
    background: "#ffcbcb",
    text: "#ef1e1e",
  },
};

export type PartialTheme = Partial<Theme> | undefined;

export type WidgetBorderRadius = {
  /**
   * Border radius for the main container and buttons, used in main pages container and main used in buttons.
   */
  main?: string | number;
  /**
   * Border radius for the selection button, used in buttons like "Select asset" or "Selector for route preferences and slippage slector button".
   */
  selectionButton?: string | number;
  /**
   * Border radius for the ghost button, used in buttons like "Max button" or "History button" or "Bottom drawer button".
   */
  ghostButton?: string | number;
  /**
   * Border radius for the modal container, used in modals like "Asset selector modal" or "History modal" or "Wallet connector modal".
   */
  modalContainer?: string | number;
  /**
   * Border radius for the row item, used in row items like "History row item" or "Modal row item (Wallet connector or asset selecion)".
   */
  rowItem?: string | number;
};

export type Theme = {
  brandColor: string;
  brandTextColor?: string;
  borderRadius?: WidgetBorderRadius;
  primary: {
    background: {
      normal: string;
    };
    text: {
      normal: string;
      lowContrast: string;
      ultraLowContrast: string;
    };
    ghostButtonHover: string;
  };
  secondary: {
    background: {
      normal: string;
      transparent: string;
      hover: string;
    };
  };
  success: {
    text: string;
  };
  warning: {
    background: string;
    text: string;
  };
  error: {
    background: string;
    text: string;
  };
};

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
