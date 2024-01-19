import type { Meta, StoryObj } from '@storybook/react';

import ToggleSwitch from 'components/ToggleSwitch';

const meta = {
  title: 'Basic UI/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type ToggleSwitchStory = StoryObj<typeof meta>;

export const Base: ToggleSwitchStory = {
  args: {
    id: 'storybook-switch-id',
    switchCond: false,
    name: 'order',
    size: 'small',
    label: 'Should I: ',
    onValue: 'Stay',
    offValue: 'Go',
  },
};
