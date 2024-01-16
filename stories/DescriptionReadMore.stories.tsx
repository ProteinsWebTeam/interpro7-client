import type { Meta, StoryObj } from '@storybook/react';

import DescriptionReadMore from 'components/Description/DescriptionReadMore';

const meta = {
  title: 'Basic UI/Description Read More',
  component: DescriptionReadMore,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DescriptionReadMore>;

export default meta;
type DescriptionReadMoreStory = StoryObj<typeof meta>;
const description = `
InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites. To classify proteins in this way, InterPro uses predictive models, known as signatures, provided by several different databases (referred to as member databases) that make up the InterPro consortium. We combine protein signatures from these member databases into a single searchable resource, capitalising on their individual strengths to produce a powerful integrated database and diagnostic tool.
`.trim();

export const Base: DescriptionReadMoreStory = {
  args: {
    text: description,
    minNumberOfCharToShow: 100,
  },
};
