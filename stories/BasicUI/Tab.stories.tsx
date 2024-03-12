import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Tabs from 'components/Tabs';

const meta = {
  title: 'Basic UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type TabsStory = StoryObj<typeof meta>;

export const Base: TabsStory = {
  args: {
    children: [
      <div title="Search by sequence">ASWEYRIOEHFKLD</div>,
      <div title="Search by text">Hello there!</div>,
      <div title="Search by Domain Architecture">IDA</div>,
    ],
    onTabSelected: undefined,
  },
};
