import type { Meta, StoryObj } from '@storybook/react';

import { Button } from 'components/SimpleCommonComponents/Button';

const meta = {
  title: 'Basic UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    size: {
      // options: ['medium', 'small'],
      control: { type: 'radio' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type ButtonStory = StoryObj<typeof meta>;

export const Primary: ButtonStory = {
  args: {
    type: 'primary',
    icon: 'icon-coffee',
    children: 'Button',
    size: 'medium',
  },
};

export const Secondary: ButtonStory = {
  args: {
    type: 'secondary',
    children: 'Button',
  },
};
export const Tertiary: ButtonStory = {
  args: {
    type: 'tertiary',
    children: 'Button',
  },
};
export const Hollow: ButtonStory = {
  args: {
    type: 'hollow',
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
    size: 'medium',
  },
};
