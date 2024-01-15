import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Description from 'components/Description';
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Basic UI/Description',
  component: Description,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof Description>;

export default meta;
type DescriptionStory = StoryObj<typeof meta>;

const description = `
InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites. To classify proteins in this way, InterPro uses predictive models, known as signatures, provided by several different databases (referred to as member databases) that make up the InterPro consortium. We combine protein signatures from these member databases into a single searchable resource, capitalising on their individual strengths to produce a powerful integrated database and diagnostic tool.
`.trim();

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Base: DescriptionStory = {
  args: {
    textBlocks: [description],
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
