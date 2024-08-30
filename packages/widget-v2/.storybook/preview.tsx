import { Preview } from "@storybook/react";
import React from "react";
import { ShadowDomAndProviders } from "../src/widget/ShadowDomAndProviders";

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{ margin: "3em" }}>
        <ShadowDomAndProviders>
          <Story />
        </ShadowDomAndProviders>
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      default: "gray",
      values: [
        {
          name: "gray",
          value: "gray",
        },
        {
          name: "white",
          value: "white",
        },
        {
          name: "black",
          value: "black",
        },
      ],
    },
  },
};

export default preview;
