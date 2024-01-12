import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Basic UI/DropDownButton',
  component: DropDownButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof DropDownButton>;

export default meta;
type DropDownButtonStory = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Base: DropDownButtonStory = {
  args: {
    label: 'YEBO',
    children: <b>yebo</b>,
  },
};

// export const Secondary: ButtonStory = {
//   args: {
//     primary: false,
//     children: 'Button',
//   },
// };

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
