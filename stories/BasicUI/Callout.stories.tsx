import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Callout from 'components/SimpleCommonComponents/Callout';

const meta = {
  title: 'Basic UI/Callout',
  component: Callout,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Callout>;

export default meta;
type CalloutStory = StoryObj<typeof meta>;

export const Base: CalloutStory = {
  args: {
    type: 'info',
    children: 'A simple message',
    icon: '',
    alt: false,
  },
};
