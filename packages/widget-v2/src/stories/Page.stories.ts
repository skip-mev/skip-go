import type { Meta, StoryObj } from '@storybook/react';

import { Page } from './Page';

const meta = {
  title: 'Example/Page',
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Page>;

type Story = StoryObj<typeof meta>;

export const WidgetLightTheme: Story = {};

export const WidgetDarkTheme: Story = {
  args: {
    theme: {
      backgroundColor: '#191A1C',
      textColor: '#E6EAE9',
      borderColor: '#363B3F',
      brandColor: '#FF4FFF',
      highlightColor: '#1F2022',
    },
  },
};

// More on interaction testing: https://storybook.js.org/docs/writing-tests/interaction-testing

// Example of logged in Story with interaction testing:

// export const LoggedIn: Story = {
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     const loginButton = canvas.getByRole('button', { name: /Log in/i });
//     await expect(loginButton).toBeInTheDocument();
//     await userEvent.click(loginButton);
//     await expect(loginButton).not.toBeInTheDocument();

//     const logoutButton = canvas.getByRole('button', { name: /Log out/i });
//     await expect(logoutButton).toBeInTheDocument();
//   },
// };

export default meta;
