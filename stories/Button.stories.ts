import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

const meta = {
  title: 'Basic UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type ButtonStory = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: ButtonStory = {
  args: {
    primary: true,
    icon: 'icon-coffee',
    children: 'Button',
  },
};

export const Secondary: ButtonStory = {
  args: {
    primary: false,
    children: 'Button',
  },
};

export const Large: ButtonStory = {
  args: {
    size: 'large',
    children: 'Button',
  },
};

export const Small: ButtonStory = {
  args: {
    size: 'small',
    children: 'Button',
  },
};
export const JustIcon: ButtonStory = {
  args: {
    icon: 'icon-coffee',
  },
};
