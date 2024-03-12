import React from 'react';
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <>
        <link
          rel="stylesheet"
          href="https://assets.emblstatic.net/vf/v2.5.10/css/styles.css"
        />

        <Story />
      </>
    ),
  ],
};

export default preview;
