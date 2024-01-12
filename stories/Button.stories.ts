import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';

import DropDownButton from '../src/components/SimpleCommonComponents/DropDownButton';
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Basic UI/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
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
    children: 'Button',
  },
};

export const Secondary: ButtonStory = {
  args: {
    primary: false,
    children: 'Button',
  },
};

// export const Large: ButtonStory = {
//   args: {
//     size: 'large',
//     label: 'Button',
//   },
// };

// export const Small: ButtonStory = {
//   args: {
//     size: 'small',
//     label: 'Button',
//   },
// };
