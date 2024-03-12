import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import InfoBanner from 'components/Help/InfoBanner';

import Provider from '../../Provider';
import configureStore from '../../configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/Home Cards/InfoBanner',
  component: InfoBanner,
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
} satisfies Meta<typeof InfoBanner>;

export default meta;
type InfoBannerCardStory = StoryObj<typeof meta>;

export const Base: InfoBannerCardStory = {
  args: {
    topic: 'InterProScan',
  },
};
