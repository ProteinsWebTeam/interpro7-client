import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { BlogEntry } from 'components/home/BlogEntries';

import Provider from '../../Provider';
import configureStore from '../../configureStore';

const store = configureStore();

const meta = {
  title: 'InterPro UI/Home Cards/BlogEntry Card',
  component: BlogEntry,
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
} satisfies Meta<typeof BlogEntry>;

export default meta;
type BlogEntryCardStory = StoryObj<typeof meta>;

export const Base: BlogEntryCardStory = {
  args: {
    category: 'interpro',
    excerpt: 'About InterPro with a lot of more text to test',
    title: 'Protein Families classification',
    url: 'https://proteinswebteam.github.io/interpro-blog/2017/10/03/Homologous-superfamily/',
    image_category: 'biology',
  },
};
