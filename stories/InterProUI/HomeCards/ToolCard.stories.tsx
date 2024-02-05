import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { ToolCard, content } from 'components/home/Tools';

import Provider from '../../Provider';
import configureStore from '../../configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/Home Cards/Tool Card',
  component: ToolCard,
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
} satisfies Meta<typeof ToolCard>;

export default meta;
type ToolCardCardStory = StoryObj<typeof meta>;

export const Base: ToolCardCardStory = {
  args: {
    ...content[0],
  },
};
