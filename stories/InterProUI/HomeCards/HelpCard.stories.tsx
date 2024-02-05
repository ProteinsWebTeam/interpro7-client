import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import HelpBanner from 'components/Help/HelpBanner';

import Provider from '../../Provider';
import configureStore from '../../configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/Home Cards/HelpBanner',
  component: HelpBanner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof HelpBanner>;

export default meta;
type HelpBannerCardStory = StoryObj<typeof meta>;

export const Base: HelpBannerCardStory = {
  args: {
    topic: 'InterProScan',
  },
};
